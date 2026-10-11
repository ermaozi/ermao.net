<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLang } from 'vuepress/client'
import routes from '../data/comment-routes.json'
import { pathnameTerm, readRegistry, selectComment, SOURCE } from '../utils/comment-migration.mjs'

const props = defineProps<{ identifier: string; darkmode?: boolean }>()
const lang = useLang()
const english = computed(() => lang.value.startsWith('en'))
const host = ref<HTMLElement>()
const selected = ref<{ repo: string; repoId: string; categoryId: string; mapping: string; term: string } | null>(null)
const busy = ref(false)
const failed = ref(false)
const loaded = ref(false)
const refreshKey = ref(0)
let active = false
let observer: IntersectionObserver | undefined
let controller: AbortController | undefined
let revision = 0
const term = ref('')
const fallback = computed(() => {
  const entry = (routes as Record<string, { source: number }>)[term.value]
  return entry ? `https://github.com/${SOURCE.repo}/discussions/${entry.source}` : 'https://github.com/ermaozi/ermao-comments/discussions'
})
async function load(retry = false) {
  if (!active) return
  const version = ++revision
  controller?.abort()
  const request = new AbortController()
  controller = request
  const timeout = setTimeout(() => request.abort(), 20000)
  busy.value = true
  failed.value = false
  term.value = pathnameTerm(window.location.pathname)
  try {
    const signal = request.signal
    const targets = await readRegistry(signal)
    const entry = (routes as Record<string, { source: number; anchor: number | null }>)[term.value]
    const result = selectComment(term.value, entry, targets)
    if (version !== revision) return
    await import('giscus')
    if (version !== revision) return
    if (retry) refreshKey.value++
    selected.value = result
    loaded.value = true
  } catch {
    if (version === revision) failed.value = true
  } finally {
    clearTimeout(timeout)
    if (version === revision) busy.value = false
  }
}
function onMessage(event: MessageEvent) {
  if (event.origin !== 'https://giscus.app' || !event.data?.giscus?.error) return
  // Keep any existing iframe/draft in place; let the visitor explicitly retry.
  failed.value = true
}
watch(() => props.identifier, () => {
  revision++
  controller?.abort()
  selected.value = null
  loaded.value = false
  void load()
})
onMounted(() => {
  window.addEventListener('message', onMessage)
  observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      active = true
      observer?.disconnect()
      void load()
    }
  }, { rootMargin: '300px' })
  if (host.value) observer.observe(host.value)
})
onUnmounted(() => {
  revision++
  controller?.abort()
  observer?.disconnect()
  window.removeEventListener('message', onMessage)
})
</script>

<template>
  <div id="comment" ref="host" class="giscus-wrapper input-top" style="min-height: 48px">
    <p v-if="busy" role="status">{{ english ? 'Loading comments…' : '正在加载评论…' }}</p>
    <p v-if="failed" role="status">
      {{ english ? 'Comments are temporarily unavailable.' : '评论暂时未能加载。' }}
      <button type="button" :disabled="busy" @click="load(true)">{{ english ? 'Reload comments' : '重新加载评论' }}</button>
      · <a :href="fallback" target="_blank" rel="noopener noreferrer">{{ english ? 'View on GitHub' : '前往 GitHub 查看' }}</a>
    </p>
    <giscus-widget v-if="loaded && selected" :key="refreshKey"
      :repo="selected.repo" :repoId="selected.repoId"
      category="Announcements" :categoryId="selected.categoryId"
      :mapping="selected.mapping" :term="selected.term" strict="1"
      :lang="english ? 'en' : 'zh-CN'" :theme="darkmode ? 'dark' : 'light'"
      inputPosition="top" reactionsEnabled="1" loading="lazy" emitMetadata="0"
    />
  </div>
</template>
