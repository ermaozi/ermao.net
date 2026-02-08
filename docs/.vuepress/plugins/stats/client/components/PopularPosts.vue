<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// @ts-ignore
import { pageMap } from '@stats/page-map'
// @ts-ignore
import { usePageData } from '@vuepress/client'

const popularPosts = ref([])
const loading = ref(true)
const canShow = ref(false)
const targetSelector = ref('.vp-posts-aside')
const router = useRouter()
const route = useRoute()
const page = usePageData()

const shouldShow = computed(() => {
    // Show on almost everywhere except 404
    return !page.value.path.includes('/404')
})

let pollingTimer = null

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

// Filter out 404, home, stats page itself if they appear
const filteredPosts = computed(() => {
    return popularPosts.value.filter(p => {
        const path = p.path.replace(/\/$/, '')
        
        // Exclude root and special paths
        if (p.path === '/' || p.path === '/index.html') return false;
        if (path.includes('/404')) return false;
        if (path === '/stats') return false;
        if (path.startsWith('/tags/')) return false;
        if (path.startsWith('/archives/')) return false;
        if (path.startsWith('/blog/categories/')) return false;
        if (path === '/friends' || path === '/friends.html') return false;
        if (path === '/blog' || path === '/blog.html') return false;
        // Exclude pagination pages
        if (p.path.includes('/page/')) return false;
        
        // Try to find title
        const mapKey = Object.keys(pageMap).find(k => 
            k === p.path || 
            k === path || 
            k === p.path + '.html' ||
            k.replace(/\/$/, '') === path ||
            k.replace(/\.html$/, '') === path
        )
        
        if (mapKey) {
           p._title = pageMap[mapKey]
        }
        
        return true;
    }).slice(0, 10) // Top 10
})

const getTitle = (post) => {
    return post._title || post.path
}

onMounted(async () => {
    // @ts-ignore
    let workerUrl = __STATS_WORKER_URL__
    if (typeof workerUrl === 'string' && workerUrl.startsWith('"') && workerUrl.endsWith('"')) {
        workerUrl = workerUrl.slice(1, -1)
    }
    console.log('[PopularPosts] Worker URL:', workerUrl)
    if (!workerUrl) return;

    try {
        const res = await fetch(`${workerUrl}/popular`);
        if (res.ok) {
            const data = await res.json();
            console.log('[PopularPosts] Data received:', data)
            popularPosts.value = data
        } else {
             console.error('[PopularPosts] Failed to load. Status:', res.status);
        }
    } catch (e) {
        console.error('[PopularPosts] Error:', e)
    } finally {
        loading.value = false
    }
})

const navigate = (path) => {
    router.push(path)
}
</script>

<template>
  <ClientOnly>
    <Teleport :to="targetSelector" v-if="canShow">
      <div class="popular-posts-widget" :class="{'in-doc': targetSelector === '.vp-doc-aside'}">
        <div class="widget-header">
          <span class="widget-title">热门文章</span>
        </div>
        
        <div v-if="loading" style="text-align: center; padding: 20px; color: #999;">
           加载中...
        </div>

        <div v-else-if="filteredPosts.length === 0" style="text-align: center; padding: 20px; color: #999;">
           暂无热门数据
        </div>

        <ul v-else class="post-list">
          <li v-for="(post, index) in filteredPosts" :key="post.path" @click="navigate(post.path)">
            <span class="post-rank" :class="{'top-3': index < 3}">{{ index + 1 }}</span>
            <span class="post-title" :title="getTitle(post)">{{ getTitle(post) }}</span>
            <span class="post-count">{{ post.count }}</span>
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

.widget-title {
  margin-left: 12px;
  font-weight: 600;
  font-size: 14px;
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

/* @media (max-width: 960px) {
    .popular-posts-widget {
        display: none; 
    }
} */
</style>
