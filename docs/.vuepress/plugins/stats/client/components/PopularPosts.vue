<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
// @ts-ignore
import { pageMap } from '@stats/page-map'
// @ts-ignore
import { useLang, usePageData } from '@vuepress/client'
import { canonicalizeStatsPath, localizeStatsPath } from '../stats-path.js'

const popularPosts = ref([])
const likedPosts = ref([])
const activeTab = ref('popular')
const popularLoading = ref(false)
const likesLoading = ref(false)
const canShow = ref(false)
const targetSelector = ref('.vp-posts-aside')
const popularHasLoaded = ref(false)
const likesHasLoaded = ref(false)
const router = useRouter()
const page = usePageData()
const lang = useLang()
const isEnglish = computed(() => lang.value?.startsWith('en'))
const pageMapKeys = Object.keys(pageMap)

const shouldShow = computed(() => {
    const path = canonicalizeStatsPath(page.value.path)
    return !page.value.path.includes('/404') && path !== '/stats/'
})

let pollingTimer = null
let likesRefreshPending = false

const resolveWorkerUrl = () => {
    // @ts-ignore
    let workerUrl = __STATS_WORKER_URL__
    if (typeof workerUrl === 'string' && workerUrl.startsWith('"') && workerUrl.endsWith('"')) {
        workerUrl = workerUrl.slice(1, -1)
    }
    return workerUrl
}

const fetchPopularPosts = async (force = false) => {
    const workerUrl = resolveWorkerUrl()
    if (!workerUrl || (!force && popularHasLoaded.value) || popularLoading.value) return

    popularLoading.value = true

    try {
        const cacheBuster = force ? `?refresh=${Date.now()}` : ''
        const res = await fetch(`${workerUrl}/popular${cacheBuster}`)
        if (res.ok) {
            const data = await res.json()
            popularPosts.value = Array.isArray(data) ? data : []
            popularHasLoaded.value = true
        }
    } catch (e) {
        popularPosts.value = []
    } finally {
        popularLoading.value = false
    }
}

const fetchLikedPosts = async (force = false) => {
    const workerUrl = resolveWorkerUrl()
    if (!workerUrl || (!force && likesHasLoaded.value) || likesLoading.value) return

    likesLoading.value = true

    try {
        const cacheBuster = force ? `&refresh=${Date.now()}` : ''
        const res = await fetch(`${workerUrl}/api/likes/top?limit=6${cacheBuster}`, {
            cache: 'no-store'
        })
        if (res.ok) {
            const data = await res.json()
            likedPosts.value = Array.isArray(data) ? data : []
            likesHasLoaded.value = true
        }
    } catch (e) {
        likedPosts.value = []
    } finally {
        likesLoading.value = false
        if (likesRefreshPending) {
            likesRefreshPending = false
            likesHasLoaded.value = false
            fetchLikedPosts(true)
        }
    }
}

const fetchActivePosts = () => {
    if (activeTab.value === 'likes') return fetchLikedPosts()
    return fetchPopularPosts()
}

const selectTab = (tab) => {
    activeTab.value = tab
    fetchActivePosts()
}

const checkDomAndShow = async () => {
    if (typeof document === 'undefined') return
    if (pollingTimer) {
        clearTimeout(pollingTimer)
        pollingTimer = null
    }
    
    canShow.value = false
    if (!shouldShow.value) return

    // Wait for route transition/animation to likely finish
    await new Promise(resolve => setTimeout(resolve, 300))
    await nextTick()
    
    // Determine potential targets
    // .vp-posts-aside -> Blog Home / List pages
    // .vp-doc-aside -> Article pages
    const selectors = ['.vp-posts-aside', '.vp-doc-aside']
    
    // Poll for the sidebar element
    let attempts = 0
    const check = () => {
        // Try to find ANY valid target
        // If transition is happening, we might see multiple.
        // We prefer the one that looks "active" or "new".
        // But simple querySelector returns the first match.
        
        let found = false
        for (const sel of selectors) {
             const els = document.querySelectorAll(sel)
             if (els.length > 0) {
                 // Pick the last one usually implies the one being mounted on top/after
                 targetSelector.value = sel
                 canShow.value = true
                 fetchActivePosts()
                 found = true
                 break
             }
        }
        
        if (found) return

        if (attempts < 50) { // Try for ~5 seconds
            attempts++
            pollingTimer = setTimeout(check, 100)
        }
    }
    check()
}

watch(() => page.value.path, checkDomAndShow, { immediate: true })

const refreshAfterLike = () => {
    likesHasLoaded.value = false
    if (activeTab.value !== 'likes') return
    if (likesLoading.value) {
        likesRefreshPending = true
        return
    }
    fetchLikedPosts(true)
}

onMounted(() => {
    window.addEventListener('ermao:like-updated', refreshAfterLike)
})

onUnmounted(() => {
    if (pollingTimer) {
        clearTimeout(pollingTimer)
        pollingTimer = null
    }
    window.removeEventListener('ermao:like-updated', refreshAfterLike)
})

// Filter out 404, home, stats page itself if they appear
const activePosts = computed(() =>
    activeTab.value === 'likes' ? likedPosts.value : popularPosts.value
)

const loading = computed(() =>
    activeTab.value === 'likes' ? likesLoading.value : popularLoading.value
)

const filteredPosts = computed(() => {
    const limit = activeTab.value === 'likes' ? 6 : 10
    const postsByPath = new Map()

    for (const post of activePosts.value) {
        const canonicalPath = canonicalizeStatsPath(post.path)
        if (!canonicalPath) continue

        const count = Number(post.count) || 0
        const existing = postsByPath.get(canonicalPath)
        if (!existing || count > existing.count) {
            postsByPath.set(canonicalPath, { ...post, path: canonicalPath, count })
        }
    }

    return Array.from(postsByPath.values()).filter(p => {
        const path = p.path.replace(/\/$/, '')

        // Exclude root and special paths
        if (p.path === '/' || p.path === '/index.html') return false;
        if (path.includes('/404')) return false;
        if (path === '/stats') return false;
        if (path.startsWith('/tags/')) return false;
        if (path.startsWith('/archives/')) return false;
        if (path.startsWith('/blog/tags/')) return false;
        if (path.startsWith('/blog/archives/')) return false;
        if (path.startsWith('/blog/categories/')) return false;
        if (path === '/friends' || path === '/friends.html') return false;
        if (path === '/blog' || path === '/blog.html') return false;
        // Exclude pagination pages
        if (p.path.includes('/page/')) return false;
        
        return true;
    }).sort((a, b) => b.count - a.count).slice(0, limit).map(post => ({
        ...post,
        path: localizeStatsPath(post.path, isEnglish.value)
    }))
})

const getTitle = (post) => {
    const path = post.path.replace(/\/$/, '')
    const mapKey = pageMapKeys.find(k =>
        k === post.path ||
        k === path ||
        k === post.path + '.html' ||
        k.replace(/\/$/, '') === path ||
        k.replace(/\.html$/, '') === path
    )
    return mapKey ? pageMap[mapKey] : post.path
}

const navigate = (path) => {
    router.push(path)
}
</script>

<template>
  <ClientOnly>
    <Teleport :to="targetSelector" v-if="canShow">
      <div class="popular-posts-widget" :class="{'in-doc': targetSelector === '.vp-doc-aside'}">
        <div class="widget-header">
          <div class="widget-tabs" role="tablist" :aria-label="isEnglish ? 'Article rankings' : '文章排行'">
            <button
              type="button"
              class="widget-tab"
              :class="{ active: activeTab === 'popular' }"
              role="tab"
              :aria-selected="activeTab === 'popular'"
              @click="selectTab('popular')"
            >
              {{ isEnglish ? 'Popular' : '热门文章' }}
            </button>
            <button
              type="button"
              class="widget-tab"
              :class="{ active: activeTab === 'likes' }"
              role="tab"
              :aria-selected="activeTab === 'likes'"
              @click="selectTab('likes')"
            >
              {{ isEnglish ? 'Most liked' : '点赞排行' }}
            </button>
          </div>
        </div>
        
        <div v-if="loading" style="text-align: center; padding: 20px; color: #999;">
           {{ isEnglish ? 'Loading...' : '加载中...' }}
        </div>

        <div v-else-if="filteredPosts.length === 0" style="text-align: center; padding: 20px; color: #999;">
           {{ isEnglish
             ? (activeTab === 'likes' ? 'No like data' : 'No popular-post data')
             : (activeTab === 'likes' ? '暂无点赞数据' : '暂无热门数据') }}
        </div>

        <ul v-else class="post-list">
          <li v-for="(post, index) in filteredPosts" :key="post.path" @click="navigate(post.path)">
            <span class="post-rank" :class="{'top-3': index < 3}">{{ index + 1 }}</span>
            <span class="post-title" :title="getTitle(post)">{{ getTitle(post) }}</span>
            <span
              class="post-count"
              :class="{ likes: activeTab === 'likes' }"
              :aria-label="isEnglish
                ? (activeTab === 'likes' ? `${post.count} likes` : `${post.count} views`)
                : (activeTab === 'likes' ? `${post.count} 个赞` : `${post.count} 次浏览`)"
            >
              {{ activeTab === 'likes' ? `♥ ${post.count}` : post.count }}
            </span>
          </li>
        </ul>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.popular-posts-widget {
  width: 100%;
  background-color: transparent;
  border: none;
  padding: 4px 0;
  font-size: 13px;
  margin-top: 20px;
}

.popular-posts-widget.in-doc {
    margin-top: 32px; /* bit more space below TOC */
    padding-top: 20px;
    border-top: 1px solid var(--vp-c-divider);
}

.popular-posts-widget.in-doc .widget-header {
    border-bottom: none;
    margin-bottom: 4px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider, #eaecef);
}

.widget-tabs {
  display: flex;
  gap: 4px;
  width: 100%;
}

.widget-tab {
  padding: 5px 10px;
  color: var(--vp-c-text-2);
  font: inherit;
  font-weight: 600;
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.18s ease, background-color 0.18s ease;
}

.widget-tab:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.widget-tab.active {
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 11%, transparent);
}

.widget-tab:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.post-list li {
  display: flex;
  align-items: center;
  padding: 6px 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.post-list li:hover {
  background-color: var(--vp-c-bg-soft, #f8f8f8);
}

.post-rank {
    width: 20px;
    text-align: center;
    margin-right: 8px;
    font-weight: bold;
    color: var(--vp-c-text-2, #666);
}

.post-rank.top-3 {
    color: #f60;
}

.post-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
}

.post-count {
  font-size: 12px;
  color: var(--vp-c-text-2, #999);
  min-width: 30px;
  text-align: right;
}

.post-count.likes {
  color: #df4964;
}

/* @media (max-width: 960px) {
    .popular-posts-widget {
        display: none; 
    }
} */
</style>
