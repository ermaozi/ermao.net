<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConnectionSelector from './ConnectionSelector.vue'
import ConnectionTroubleshooter from './ConnectionTroubleshooter.vue'
const route = useRoute()
const router = useRouter()
type Tool = 'selector' | 'help'
const active = ref<Tool | null>(null)
const dialog = ref<HTMLDialogElement>()
const closeButton = ref<HTMLButtonElement>()
let opener: HTMLElement | null = null
let scrollY = 0
let overflow = ''
let ownedEntry = false
let previousHash = ''
let closing = false
let suppressPointerUntil = 0
function preventClickThrough(event: MouseEvent) {
  if (event.detail > 0 && performance.now() < suppressPointerUntil) { event.preventDefault(); event.stopImmediatePropagation() }
}
const toolHash = (tool: Tool) => tool === 'selector' ? '#connection-selector' : '#connection-troubleshooter'
const fromHash = (hash: string): Tool | null => hash === '#connection-selector' ? 'selector' : hash === '#connection-troubleshooter' ? 'help' : null
async function show(tool: Tool) {
  if (!active.value) {
    suppressPointerUntil = performance.now() + 350
    scrollY = window.scrollY
    overflow = document.body.style.overflow
    opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
  }
  active.value = tool
  await nextTick()
  if (!dialog.value?.open) dialog.value?.showModal()
  closeButton.value?.focus({ preventScroll: true })
}
function hide(restore = true) {
  suppressPointerUntil = performance.now() + 350
  dialog.value?.close()
  active.value = null
  document.body.style.overflow = overflow
  if (restore) {
    opener?.focus({ preventScroll: true })
    const y = scrollY
    requestAnimationFrame(() => { window.scrollTo(0, y); requestAnimationFrame(() => window.scrollTo(0, y)) })
  }
  closing = false
}
async function open(tool: Tool) {
  if (closing) return
  if (active.value === tool) return
  const switching = Boolean(active.value)
  if (!switching) { previousHash = route.hash; ownedEntry = true }
  await show(tool)
  if (switching) await router.replace({ path: route.path, query: route.query, hash: toolHash(tool) })
  else await router.push({ path: route.path, query: route.query, hash: toolHash(tool) })
}
function close() {
  if (!active.value || closing) return
  closing = true
  if (ownedEntry) { ownedEntry = false; router.back() }
  else void router.replace({ path: route.path, query: route.query, hash: previousHash }).then(() => { if (active.value) hide() })
}
function trapTab(event: KeyboardEvent) {
  const items = Array.from(dialog.value?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], select:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex="0"]') ?? []).filter(el => el.getClientRects().length > 0)
  const first = items[0], last = items[items.length - 1]
  if (!first || !last) { event.preventDefault(); return }
  if (event.shiftKey && (document.activeElement === first || !dialog.value?.contains(document.activeElement))) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && (document.activeElement === last || !dialog.value?.contains(document.activeElement))) { event.preventDefault(); first.focus() }
}
function backdrop(event: MouseEvent) {
  if (event.target !== dialog.value) return
  const box = dialog.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close()
}
watch(() => route.hash, hash => {
  const tool = fromHash(hash)
  if (tool) void show(tool)
  else if (active.value) { ownedEntry = false; hide() }
})
onMounted(() => { document.addEventListener('click', preventClickThrough, true); const tool = fromHash(route.hash); if (tool) void show(tool) })
onBeforeUnmount(() => { document.removeEventListener('click', preventClickThrough, true); if (active.value) hide(false) })
</script>

<template>
  <div class="connection-tools" data-tool-surface="vpn">
    <span>需要帮忙？</span>
    <button type="button" aria-haspopup="dialog" data-tool-event="selector_click" @click="open('selector')">筛选与对比套餐</button>
    <button type="button" aria-haspopup="dialog" data-tool-event="troubleshooter_click" @click="open('help')">连接排错</button>
    <noscript><a href="/airport/">机场目录</a> · <a href="/connection-help/">排错说明</a></noscript>
  </div>
  <ClientOnly>
  <Teleport to="body">
    <dialog ref="dialog" class="connection-dialog" aria-labelledby="connection-dialog-title" @cancel.prevent="close" @click="backdrop" @keydown.tab="trapTab">
      <header class="dialog-heading">
        <h2 id="connection-dialog-title">{{ active === 'selector' ? '筛选与对比套餐' : '连接排错' }}</h2>
        <button ref="closeButton" type="button" aria-label="关闭工具" @click="close">关闭</button>
      </header>
      <nav class="dialog-switch" aria-label="切换工具">
        <button type="button" :aria-pressed="active === 'selector'" @click="open('selector')">套餐筛选</button>
        <button type="button" :aria-pressed="active === 'help'" @click="open('help')">连接排错</button>
      </nav>
      <div v-if="active" :key="active" class="dialog-content">
        <ConnectionSelector v-if="active === 'selector'" />
        <ConnectionTroubleshooter v-else />
        <p class="dialog-note">关闭或切换工具会重置本次选项。<a v-if="active === 'help'" href="/connection-help/">打开独立排错页</a></p>
      </div>
    </dialog>
  </Teleport>
  </ClientOnly>
</template>

<style scoped>
.connection-tools { display:flex; gap:8px 12px; flex-wrap:wrap; align-items:center; margin:16px 0; font-size:14px; }
.connection-tools button,.connection-dialog button { min-height:44px; border:1px solid var(--vp-c-divider,#cbd2d7); border-radius:8px; background:var(--vp-c-bg,#fff); color:var(--vp-c-text-1,#253443); padding:8px 12px; font:inherit; cursor:pointer; }
.connection-tools button { color:var(--vp-c-brand-1,#267294); }
.connection-dialog { position:fixed; inset:0; box-sizing:border-box; margin:auto; width:min(1040px,calc(100vw - 24px)); max-width:none; height:min(860px,calc(100dvh - 24px)); max-height:calc(100dvh - 24px); padding:0; border:1px solid var(--vp-c-divider,#cbd2d7); border-radius:14px; background:var(--vp-c-bg,#fff); color:var(--vp-c-text-1,#253443); overflow:hidden; }
.connection-dialog[open] { display:flex; flex-direction:column; }
.connection-dialog::backdrop { background:rgb(0 0 0 / .55); }
.dialog-heading { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 16px; }
.dialog-heading h2 { margin:0; font-size:20px; }
.dialog-switch { display:flex; gap:8px; padding:0 16px 12px; border-bottom:1px solid var(--vp-c-divider,#cbd2d7); }
.dialog-switch button[aria-pressed="true"] { border-color:var(--vp-c-brand-1); background:var(--vp-c-brand-soft,#edf6fa); }
.dialog-content { overflow-y:auto; overscroll-behavior:contain; padding:0 16px 16px; min-height:0; flex:1; }
.dialog-note { font-size:14px; }
.connection-dialog :focus-visible,.connection-tools :focus-visible { outline:3px solid var(--vp-c-brand-1,#267294); outline-offset:2px; }
@media(max-width:480px) { .dialog-content { padding:0 10px 12px; } .connection-tools > span { flex-basis:100%; } }
</style>
