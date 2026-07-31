<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { isFullyCovered, type NoteRect } from './ad-board-geometry.js'

type NoteColor =
  | 'butter'
  | 'mint'
  | 'blush'
  | 'sky'
  | 'lilac'
  | 'sand'
  | 'sage'
  | 'mauve'
  | 'slate'
  | 'apricot'

interface BoardNote {
  id: string
  content: string
  likes: number
  x: number
  y: number
  layer: number
  color: NoteColor
  likedByMe: boolean
  hasLinks: boolean
  links: BoardLink[]
  createdAt: string
}

interface BoardLink {
  text: string
  url: string
  warningUrl: string
}

interface ContentPart {
  key: string
  text: string
  warningUrl?: string
}

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  execute: (widgetId: string) => void
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const MAX_CHARACTERS = 100
const MAX_NOTES = 50
const API_BASE = '/api/board'
const TURNSTILE_SITE_KEY = '0x4AAAAAAECzwExhxUpo2U43'
const TURNSTILE_SCRIPT_ID = 'ad-board-turnstile-script'
const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const TURNSTILE_ACTION = 'ad_board_post'
const seedNotes: BoardNote[] = []

const cloneSeedNotes = () => seedNotes.map(note => ({ ...note }))

const board = ref<HTMLElement | null>(null)
const turnstileContainer = ref<HTMLElement | null>(null)
const draft = ref('')
const notes = ref<BoardNote[]>(cloneSeedNotes())
const topZ = ref(seedNotes.length)
const placementStep = ref(0)
const raisedNoteId = ref<string | null>(null)
const hoveredNoteId = ref<string | null>(null)
const pendingLikeIds = ref<string[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const loadFailed = ref(false)
const announcement = ref('正在读取广告板。')
const visibleMessage = ref('')
let pendingContent = ''
let turnstileWidgetId: string | null = null
let turnstileInitialization: Promise<void> | null = null
let raiseTimer: ReturnType<typeof setTimeout> | undefined

const characterCount = computed(() => Array.from(draft.value).length)
const canPublish = computed(() => (
  draft.value.trim().length > 0
  && characterCount.value <= MAX_CHARACTERS
  && !isSubmitting.value
  && !isLoading.value
  && !loadFailed.value
))
const brightnessByNoteId = computed(() => new Map(
  [...notes.value]
    .sort((a, b) => b.layer - a.layer)
    .map((note, depth) => [note.id, 1 - Math.min(0.2, depth * 0.012)]),
))

const noteStyle = (note: BoardNote) => ({
  '--note-x': `${note.x}%`,
  '--note-y': `${note.y}%`,
  '--note-brightness': brightnessByNoteId.value.get(note.id) ?? 1,
  zIndex: hoveredNoteId.value === note.id ? topZ.value + 1 : note.layer,
})

const previewNoteOnTop = (id: string) => {
  hoveredNoteId.value = id
}

const restoreNoteLayer = (id: string) => {
  if (hoveredNoteId.value === id) hoveredNoteId.value = null
}

const clampDraft = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const nextValue = Array.from(target.value).slice(0, MAX_CHARACTERS).join('')
  draft.value = nextValue
  if (target.value !== nextValue) target.value = nextValue
}

const randomPosition = () => {
  const progress = Math.min(1, placementStep.value / 16)
  placementStep.value += 1

  if (!board.value) {
    const angle = Math.random() * Math.PI * 2
    const radius = 0.42 + Math.sqrt(Math.random()) * 0.58
    return {
      x: 39 + Math.cos(angle) * radius * (20 + progress * 25),
      y: 35 + Math.sin(angle) * radius * (18 + progress * 23),
    }
  }

  const boardBounds = board.value.getBoundingClientRect()
  const sampleNote = board.value.querySelector<HTMLElement>('[data-note-id]')
  const sampleBounds = sampleNote?.getBoundingClientRect()
  const noteWidth = sampleBounds?.width ?? Math.min(228, Math.max(184, window.innerWidth * 0.22))
  const noteHeight = sampleBounds?.height ?? 220
  const availableWidth = Math.max(0, boardBounds.width - noteWidth)
  const availableHeight = Math.max(0, boardBounds.height - noteHeight)
  const boardDiagonal = Math.hypot(boardBounds.width, boardBounds.height) || 1
  const existingRects = [...board.value.querySelectorAll<HTMLElement>('[data-note-id]')].map((element) => {
    const bounds = element.getBoundingClientRect()
    return {
      left: bounds.left - boardBounds.left,
      right: bounds.right - boardBounds.left,
      top: bounds.top - boardBounds.top,
      bottom: bounds.bottom - boardBounds.top,
    }
  })

  if (existingRects.length === 0) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 0.1
    return {
      x: ((availableWidth * (0.5 + Math.cos(angle) * radius)) / boardBounds.width) * 100,
      y: ((availableHeight * (0.5 + Math.sin(angle) * radius)) / boardBounds.height) * 100,
    }
  }

  const spread = 0.72 + progress * 0.28
  let bestCandidate = { left: availableWidth / 2, top: availableHeight / 2, score: -Infinity }

  for (let index = 0; index < 72; index += 1) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.sqrt(Math.random()) * spread
    const left = Math.min(availableWidth, Math.max(0,
      availableWidth * (0.5 + Math.cos(angle) * radius * 0.5),
    ))
    const top = Math.min(availableHeight, Math.max(0,
      availableHeight * (0.5 + Math.sin(angle) * radius * 0.5),
    ))
    const right = left + noteWidth
    const bottom = top + noteHeight
    let overlapArea = 0
    let nearestGap = Infinity

    for (const existing of existingRects) {
      const overlapWidth = Math.max(0, Math.min(right, existing.right) - Math.max(left, existing.left))
      const overlapHeight = Math.max(0, Math.min(bottom, existing.bottom) - Math.max(top, existing.top))
      overlapArea += overlapWidth * overlapHeight

      const gapX = Math.max(existing.left - right, left - existing.right, 0)
      const gapY = Math.max(existing.top - bottom, top - existing.bottom, 0)
      nearestGap = Math.min(nearestGap, Math.hypot(gapX, gapY))
    }

    const overlapRatio = overlapArea / (noteWidth * noteHeight)
    const gapScore = nearestGap / boardDiagonal
    const score = gapScore * 100 - overlapRatio * 1000 + Math.random() * 0.05

    if (score > bestCandidate.score) bestCandidate = { left, top, score }
  }

  return {
    x: (bestCandidate.left / boardBounds.width) * 100,
    y: (bestCandidate.top / boardBounds.height) * 100,
  }
}

const pruneFullyCoveredNotes = () => {
  if (!board.value || notes.value.length < 2) return 0

  const rects = new Map<string, NoteRect>()
  board.value.querySelectorAll<HTMLElement>('[data-note-id]').forEach((element) => {
    const bounds = element.getBoundingClientRect()
    rects.set(String(element.dataset.noteId), {
      left: bounds.left,
      right: bounds.right,
      top: bounds.top,
      bottom: bounds.bottom,
    })
  })

  const coveredIds = new Set<string>()

  for (const note of notes.value) {
    const target = rects.get(note.id)
    if (!target) continue

    const overlays = notes.value
      .filter(candidate => candidate.layer > note.layer)
      .map(candidate => rects.get(candidate.id))
      .filter((rect): rect is NoteRect => rect !== undefined)

    if (isFullyCovered(target, overlays)) coveredIds.add(note.id)
  }

  if (coveredIds.size > 0) {
    notes.value = notes.value.filter(note => !coveredIds.has(note.id))
  }

  return coveredIds.size
}

const pruneOverflowNotes = () => {
  const excess = notes.value.length - MAX_NOTES
  if (excess <= 0) return 0

  const bottomNoteIds = new Set(
    [...notes.value]
      .sort((a, b) => a.layer - b.layer)
      .slice(0, excess)
      .map(note => note.id),
  )
  notes.value = notes.value.filter(note => !bottomNoteIds.has(note.id))
  return bottomNoteIds.size
}

const readApiResponse = async <T,>(response: Response): Promise<T> => {
  let payload: any

  try {
    payload = await response.json()
  } catch {
    throw new Error('服务器返回了无法识别的响应。')
  }

  if (!response.ok || payload?.ok !== true) {
    throw new Error(payload?.error?.message || '请求失败，请稍后重试。')
  }

  return payload.data as T
}

const applyNotes = (nextNotes: BoardNote[]) => {
  notes.value = nextNotes
  topZ.value = nextNotes.reduce((maximum, note) => Math.max(maximum, note.layer), 0)
}

const fetchNotes = async (announceError = true) => {
  try {
    const response = await fetch(`${API_BASE}/notes`, {
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
    })
    const data = await readApiResponse<{ notes: BoardNote[] }>(response)
    applyNotes(data.notes)
    loadFailed.value = false
  } catch (error) {
    loadFailed.value = true
    if (announceError) {
      visibleMessage.value = error instanceof Error ? error.message : '广告板读取失败，请稍后刷新。'
      announcement.value = visibleMessage.value
    }
  } finally {
    isLoading.value = false
  }
}

const resetTurnstile = () => {
  if (turnstileWidgetId && window.turnstile) {
    window.turnstile.reset(turnstileWidgetId)
  }
}

const submitNote = async (turnstileToken: string) => {
  const content = pendingContent
  if (!content) {
    isSubmitting.value = false
    resetTurnstile()
    return
  }

  visibleMessage.value = '正在发表便签……'
  announcement.value = visibleMessage.value

  try {
    const response = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({ content, turnstileToken }),
    })
    const data = await readApiResponse<{
      note: BoardNote
      cleanup: { covered: number; overflow: number }
    }>(response)

    draft.value = ''
    raisedNoteId.value = data.note.id
    applyNotes([
      ...notes.value.filter(note => note.id !== data.note.id),
      data.note,
    ])
    await fetchNotes(false)
    const removed = data.cleanup.covered + data.cleanup.overflow
    visibleMessage.value = removed > 0
      ? `便签已发表，并清理了 ${removed} 张旧便签。`
      : '便签已发表。'
    announcement.value = visibleMessage.value
  } catch (error) {
    visibleMessage.value = error instanceof Error ? error.message : '发表失败，请稍后重试。'
    announcement.value = visibleMessage.value
  } finally {
    pendingContent = ''
    isSubmitting.value = false
    resetTurnstile()
  }
}

const loadTurnstileScript = () => new Promise<TurnstileApi>((resolve, reject) => {
  if (window.turnstile) {
    resolve(window.turnstile)
    return
  }

  let script = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null
  const handleLoad = () => {
    if (window.turnstile) resolve(window.turnstile)
    else reject(new Error('人机验证组件加载失败。'))
  }
  const handleError = () => reject(new Error('人机验证组件加载失败，请检查网络后重试。'))

  const shouldAppend = !script
  if (!script) {
    script = document.createElement('script')
    script.id = TURNSTILE_SCRIPT_ID
    script.src = TURNSTILE_SCRIPT_URL
    script.async = true
    script.defer = true
  }

  script.addEventListener('load', handleLoad, { once: true })
  script.addEventListener('error', handleError, { once: true })
  if (shouldAppend) document.head.appendChild(script)
})

const initializeTurnstile = () => {
  if (turnstileWidgetId && window.turnstile) return Promise.resolve()
  if (turnstileInitialization) return turnstileInitialization

  turnstileInitialization = (async () => {
    const turnstile = await loadTurnstileScript()
    if (!turnstileContainer.value) throw new Error('人机验证容器尚未准备好。')

    turnstileWidgetId = turnstile.render(turnstileContainer.value, {
      sitekey: TURNSTILE_SITE_KEY,
      action: TURNSTILE_ACTION,
      execution: 'execute',
      appearance: 'interaction-only',
      theme: 'auto',
      language: 'zh-CN',
      size: 'flexible',
      callback: (token: string) => void submitNote(token),
      'expired-callback': () => {
        pendingContent = ''
        isSubmitting.value = false
        visibleMessage.value = '人机验证已过期，请重新发表。'
        announcement.value = visibleMessage.value
        resetTurnstile()
      },
      'error-callback': () => {
        pendingContent = ''
        isSubmitting.value = false
        visibleMessage.value = '人机验证失败，请稍后重试。'
        announcement.value = visibleMessage.value
        return true
      },
    })
  })().catch((error) => {
    turnstileInitialization = null
    throw error
  })

  return turnstileInitialization
}

const publishNote = async () => {
  const content = draft.value.trim()
  if (!content || Array.from(content).length > MAX_CHARACTERS || isSubmitting.value) return

  isSubmitting.value = true
  pendingContent = content
  visibleMessage.value = '正在进行人机验证……'
  announcement.value = visibleMessage.value

  try {
    await initializeTurnstile()
    if (!turnstileWidgetId || !window.turnstile) throw new Error('人机验证组件尚未准备好。')
    window.turnstile.execute(turnstileWidgetId)
  } catch (error) {
    pendingContent = ''
    isSubmitting.value = false
    visibleMessage.value = error instanceof Error ? error.message : '人机验证组件加载失败。'
    announcement.value = visibleMessage.value
  }
}

const likeNote = async (id: string) => {
  const note = notes.value.find(candidate => candidate.id === id)
  if (!note || note.likedByMe || pendingLikeIds.value.includes(id)) return

  pendingLikeIds.value = [...pendingLikeIds.value, id]

  try {
    const response = await fetch(`${API_BASE}/notes/${encodeURIComponent(id)}/like`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
    })
    const data = await readApiResponse<{ note: BoardNote }>(response)
    raisedNoteId.value = id
    applyNotes(notes.value.map(candidate => candidate.id === id ? data.note : candidate))
    await fetchNotes(false)

    if (raiseTimer) clearTimeout(raiseTimer)
    raiseTimer = setTimeout(() => {
      raisedNoteId.value = null
    }, 520)

    visibleMessage.value = '点赞成功，这张便签已经置顶。'
    announcement.value = visibleMessage.value
  } catch (error) {
    visibleMessage.value = error instanceof Error ? error.message : '点赞失败，请稍后重试。'
    announcement.value = visibleMessage.value
  } finally {
    pendingLikeIds.value = pendingLikeIds.value.filter(noteId => noteId !== id)
  }
}

const contentParts = (note: BoardNote): ContentPart[] => {
  if (!note.hasLinks || note.links.length === 0) {
    return [{ key: `${note.id}-text`, text: note.content }]
  }

  const parts: ContentPart[] = []
  let cursor = 0

  note.links.forEach((link, index) => {
    const linkIndex = note.content.indexOf(link.text, cursor)
    if (linkIndex < 0) return
    if (linkIndex > cursor) {
      parts.push({
        key: `${note.id}-text-${index}`,
        text: note.content.slice(cursor, linkIndex),
      })
    }
    parts.push({
      key: `${note.id}-link-${index}`,
      text: link.text,
      warningUrl: link.warningUrl,
    })
    cursor = linkIndex + link.text.length
  })

  if (cursor < note.content.length) {
    parts.push({ key: `${note.id}-text-end`, text: note.content.slice(cursor) })
  }

  return parts
}

onMounted(() => {
  void fetchNotes()
  void initializeTurnstile().catch((error) => {
    visibleMessage.value = error instanceof Error ? error.message : '人机验证组件加载失败。'
    announcement.value = visibleMessage.value
  })
})

onBeforeUnmount(() => {
  if (raiseTimer) clearTimeout(raiseTimer)
  if (turnstileWidgetId && window.turnstile) window.turnstile.remove(turnstileWidgetId)
})
</script>

<template>
  <section class="ad-board-demo" aria-label="广告板">


    <div class="board-frame">
      <div
        ref="board"
        class="board-canvas"
        :class="{ 'is-empty': notes.length === 0 }"
        aria-label="便签广告板"
      >
        <TransitionGroup name="note">
          <article
            v-for="note in notes"
            :key="note.id"
            class="note-position"
            :class="{
              'is-raised': raisedNoteId === note.id,
              'is-hovered': hoveredNoteId === note.id,
            }"
            :style="noteStyle(note)"
            :data-note-id="note.id"
            :aria-label="`便签 ${note.id}，${note.likes} 次点赞`"
            @mouseenter="previewNoteOnTop(note.id)"
            @mouseleave="restoreNoteLayer(note.id)"
            @focusin="previewNoteOnTop(note.id)"
            @focusout="restoreNoteLayer(note.id)"
          >
            <div class="sticky-note" :data-color="note.color">
              <span class="note-tape" aria-hidden="true" />
              <span class="note-number">NO. {{ String(note.layer).padStart(2, '0') }}</span>
              <p>
                <template v-for="part in contentParts(note)" :key="part.key">
                  <a
                    v-if="part.warningUrl"
                    :href="part.warningUrl"
                    target="_blank"
                    rel="noopener noreferrer nofollow ugc"
                    title="打开前查看外部链接风险提示"
                    @click.stop
                  >{{ part.text }}</a>
                  <template v-else>{{ part.text }}</template>
                </template>
              </p>
              <footer>
                <span>匿名访客</span>
                <button
                  type="button"
                  :aria-label="`点赞便签 ${note.id}，当前 ${note.likes} 次`"
                  :class="{ 'is-liked': note.likedByMe }"
                  :disabled="note.likedByMe || pendingLikeIds.includes(note.id)"
                  :title="note.likedByMe ? '已经点赞，不能取消' : '点赞并置顶'"
                  @click="likeNote(note.id)"
                >
                  <span aria-hidden="true">♥</span>
                  {{ note.likes }}
                </button>
              </footer>
            </div>
          </article>
        </TransitionGroup>

        <div v-if="notes.length === 0" class="empty-board">
          <span aria-hidden="true">{{ isLoading ? '…' : loadFailed ? '!' : '＋' }}</span>
          <strong>{{ isLoading ? '正在读取广告板' : loadFailed ? '广告板读取失败' : '板子还是空的' }}</strong>
          <p>{{ loadFailed ? '请检查 Worker 路由和 D1 绑定后重试。' : '来贴下第一张便签，它会出现在中心附近。' }}</p>
          <button v-if="loadFailed" type="button" class="retry-button" @click="fetchNotes()">重新读取</button>
        </div>
      </div>
    </div>



    <form class="composer-form" :aria-busy="isSubmitting" @submit.prevent="publishNote">
      <textarea
        id="ad-board-content"
        :value="draft"
        rows="2"
        placeholder="写点什么吧，最多 100 字……"
        aria-label="便签内容，最多 100 字"
        @input="clampDraft"
      />
      <div ref="turnstileContainer" class="turnstile-slot" aria-label="Cloudflare 人机验证" />
      <button class="publish-button" type="submit" :disabled="!canPublish">
        {{ isSubmitting ? '验证中…' : '发表' }}
      </button>
    </form>

    <p v-if="visibleMessage" class="composer-message" role="status">{{ visibleMessage }}</p>
    <p class="sr-announcement" aria-live="polite">{{ announcement }}</p>
  </section>
</template>

<style scoped>
.ad-board-demo {
  --accent: var(--vp-c-brand-1);
  --note-w: clamp(184px, 22vw, 228px);
  --note-h: 220px;
  margin: 2rem 0 1rem;
  color: var(--vp-c-text-2);
}

.board-toolbar,
.board-footer,
.board-title,
.board-stats,
.rule-list,
.demo-actions {
  display: flex;
  align-items: center;
}

.board-toolbar,
.board-footer {
  justify-content: space-between;
  gap: 16px;
}

.status-light {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #61aa70;
  box-shadow: 0 0 0 4px rgb(97 170 112 / 13%);
}

.composer-form {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: stretch;
  gap: 10px;
  margin: 18px 0 0;
}

.turnstile-slot {
  position: absolute;
  z-index: 6;
  right: 0;
  bottom: calc(100% + 10px);
  width: min(300px, 100%);
}

.composer-message {
  min-height: 1.5em;
  margin: 7px 4px 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.5;
}

.composer-form textarea {
  box-sizing: border-box;
  display: block;
  width: auto;
  min-height: 66px;
  flex: 1 1 auto;
  resize: none;
  padding: 10px 13px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  outline: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 14px;
  line-height: 1.55;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.composer-form textarea:focus {
  border-color: color-mix(in srgb, var(--accent) 62%, var(--vp-c-divider));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 9%, transparent);
}

.composer-form textarea::placeholder {
  color: var(--vp-c-text-3);
}

.publish-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-width: 82px;
  min-height: 66px;
  flex: 0 0 auto;
  padding: 0 16px;
  border: 0;
  border-radius: 11px;
  background: var(--accent);
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 750;
  box-shadow: 0 7px 18px color-mix(in srgb, var(--accent) 24%, transparent);
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}

.publish-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--vp-c-brand-2);
  box-shadow: 0 10px 22px color-mix(in srgb, var(--accent) 29%, transparent);
}

.publish-button:disabled {
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.45;
}

.board-toolbar {
  margin: 24px 5px 13px;
}

.board-title {
  gap: 12px;
}

.board-title > div {
  display: grid;
  gap: 1px;
}

.board-title strong {
  color: var(--vp-c-text-1);
  font-size: 15px;
}

.board-title span:not(.status-light) {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.board-stats {
  gap: 8px;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.board-stats span {
  padding: 5px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.board-stats strong {
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}

.board-frame {
  position: relative;
}

.board-canvas {
  position: relative;
  min-height: 690px;
  overflow: hidden;
  isolation: isolate;
}

.note-position {
  position: absolute;
  width: var(--note-w);
  height: var(--note-h);
  left: clamp(10px, var(--note-x), calc(100% - var(--note-w) - 10px));
  top: clamp(10px, var(--note-y), calc(100% - var(--note-h) - 10px));
  margin: 0;
}

.sticky-note {
  position: relative;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: 27px 19px 14px;
  border: 1px solid rgb(89 73 51 / 10%);
  background: #e8e4da;
  color: #3d3a30;
  filter: brightness(var(--note-brightness, 1));
  box-shadow:
    0 12px 20px rgb(67 42 27 / 19%),
    0 2px 4px rgb(67 42 27 / 17%);
  transition: filter 0.2s ease, box-shadow 0.2s ease;
}

.sticky-note::after {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, rgb(255 255 255 / 0%) 49%, rgb(93 72 40 / 12%) 50%);
  content: '';
}

.sticky-note[data-color='mint'] { background: #dbe3dc; }
.sticky-note[data-color='blush'] { background: #e7d9d7; }
.sticky-note[data-color='sky'] { background: #d8e2e5; }
.sticky-note[data-color='lilac'] { background: #dfdae5; }
.sticky-note[data-color='sand'] { background: #e6dfd2; }
.sticky-note[data-color='sage'] { background: #d5dfd2; }
.sticky-note[data-color='mauve'] { background: #e3d6de; }
.sticky-note[data-color='slate'] { background: #d4dde3; }
.sticky-note[data-color='apricot'] { background: #e8dbd2; }

.note-tape {
  position: absolute;
  top: -7px;
  left: 50%;
  width: 58px;
  height: 19px;
  transform: translateX(-50%) rotate(-1.5deg);
  background: rgb(255 255 255 / 66%);
  box-shadow: 0 1px 2px rgb(80 60 45 / 10%);
}

.note-number {
  color: rgb(59 57 48 / 48%);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.sticky-note p {
  display: -webkit-box;
  flex: 1;
  margin: 10px 0 6px;
  overflow: hidden;
  color: inherit;
  font-size: 13px;
  font-weight: 650;
  line-height: 1.52;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 8;
}

.sticky-note p a {
  color: color-mix(in srgb, var(--accent) 78%, #24313a);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.sticky-note footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 9px;
  border-top: 1px solid rgb(60 56 45 / 12%);
  color: rgb(59 57 48 / 58%);
  font-size: 10px;
}

.sticky-note footer button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 42px;
  min-height: 27px;
  justify-content: center;
  padding: 3px 8px;
  border: 1px solid rgb(88 68 55 / 14%);
  border-radius: 999px;
  background: rgb(255 255 255 / 39%);
  color: #a84c42;
  font: inherit;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.16s ease, background 0.16s ease;
}

.sticky-note footer button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: rgb(255 255 255 / 69%);
}

.sticky-note footer button:disabled {
  cursor: default;
  opacity: 0.65;
}

.sticky-note footer button.is-liked {
  background: rgb(255 255 255 / 62%);
  color: #844b46;
}

.note-position.is-hovered .sticky-note {
  filter: brightness(1.035);
  box-shadow:
    0 18px 30px rgb(50 31 20 / 28%),
    0 3px 7px rgb(50 31 20 / 20%);
}

.note-position.is-raised .sticky-note {
  animation: note-raised 0.5s ease;
}

.empty-board {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  display: flex;
  width: min(82%, 360px);
  transform: translate(-50%, -50%);
  flex-direction: column;
  align-items: center;
  color: var(--vp-c-text-2);
  text-align: center;
}

.empty-board > span {
  display: grid;
  width: 46px;
  height: 46px;
  margin-bottom: 13px;
  place-items: center;
  border: 1px dashed var(--vp-c-text-3);
  border-radius: 50%;
  font-size: 27px;
}

.empty-board strong {
  font-size: 18px;
}

.empty-board p {
  margin: 5px 0 0;
  font-size: 13px;
}

.retry-button {
  margin-top: 12px;
  padding: 7px 11px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-brand-1);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}

.board-footer {
  margin-top: 14px;
}

.rule-list {
  flex-wrap: wrap;
  gap: 7px 14px;
  color: var(--vp-c-text-2);
  font-size: 11px;
}

.rule-list span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.rule-dot {
  width: 7px;
  height: 7px;
  border-radius: 2px;
}

.rule-dot.is-coral { background: var(--vp-c-brand-1); }
.rule-dot.is-yellow { background: #e9bb54; }
.rule-dot.is-blue { background: #69a9c3; }
.rule-dot.is-green { background: #6ca777; }
.rule-dot.is-gray { background: var(--vp-c-text-3); }

.demo-actions {
  flex: 0 0 auto;
  gap: 7px;
}

.demo-actions button {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.demo-actions button:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.demo-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.sr-announcement {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.note-enter-active,
.note-leave-active {
  transition: opacity 0.24s ease;
}

.note-enter-from,
.note-leave-to {
  opacity: 0;
}

@keyframes note-raised {
  0%, 100% { transform: translateY(0); filter: brightness(1); }
  45% { transform: translateY(-9px); filter: brightness(1.05); }
}

@media (max-width: 719px) {
  .ad-board-demo {
    --note-w: 184px;
    --note-h: 220px;
    margin-top: 1.4rem;
  }

  .composer-form textarea {
    min-height: 62px;
    font-size: 13px;
  }

  .publish-button {
    min-width: 72px;
    min-height: 62px;
    padding-inline: 12px;
  }

  .turnstile-slot {
    right: auto;
    left: 0;
  }

  .board-toolbar,
  .board-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .board-stats {
    align-self: stretch;
  }

  .board-stats span {
    flex: 1;
    text-align: center;
  }

  .board-canvas {
    min-height: 640px;
  }

  .sticky-note {
    padding-inline: 16px;
  }

  .sticky-note p {
    font-size: 12px;
    -webkit-line-clamp: 9;
  }

  .demo-actions {
    width: 100%;
  }

  .demo-actions button {
    flex: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .publish-button,
  .sticky-note,
  .sticky-note footer button,
  .note-enter-active,
  .note-leave-active {
    animation: none !important;
    transition: none !important;
  }
}

:global(html[data-theme='dark']) .composer-form textarea {
  border-color: #3a3f42;
  background: transparent;
  color: var(--vp-c-text-2);
}

:global(html[data-theme='dark']) .sticky-note {
  background: #d8d3c5;
}

:global(html[data-theme='dark']) .sticky-note[data-color='mint'] { background: #c8d1c9; }
:global(html[data-theme='dark']) .sticky-note[data-color='blush'] { background: #d7c7c4; }
:global(html[data-theme='dark']) .sticky-note[data-color='sky'] { background: #c5cfd2; }
:global(html[data-theme='dark']) .sticky-note[data-color='lilac'] { background: #cec8d3; }
:global(html[data-theme='dark']) .sticky-note[data-color='sand'] { background: #d3cabc; }
:global(html[data-theme='dark']) .sticky-note[data-color='sage'] { background: #c4cfc1; }
:global(html[data-theme='dark']) .sticky-note[data-color='mauve'] { background: #d1c4cc; }
:global(html[data-theme='dark']) .sticky-note[data-color='slate'] { background: #c3cdd3; }
:global(html[data-theme='dark']) .sticky-note[data-color='apricot'] { background: #d6c7bd; }

:global(html[data-theme='dark']) .note-tape {
  background: rgb(239 237 230 / 62%);
}

</style>
