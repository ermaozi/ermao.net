<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLang } from 'vuepress/client'
import { getEngagementStatus, removeLike, submitLike } from '../like-api.js'
import { canonicalizeStatsPath } from '../stats-path.js'

const props = defineProps({
  path: {
    type: String,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const count = ref(null)
const likedToday = ref(false)
const loading = ref(true)
const submitting = ref(false)
const errorText = ref('')
const buttonRef = ref(null)
const heartBursts = ref([])
const celebrating = ref(false)
const lang = useLang()
const isEnglish = computed(() => lang.value?.startsWith('en'))
const statsPath = computed(() => canonicalizeStatsPath(props.path))
const t = (zh, en) => isEnglish.value ? en : zh

let mounted = false
let requestVersion = 0
let dayRefreshTimer = null
let burstId = 0
const animationTimers = new Set()
const heartColors = ['#ff4f73', '#ff6b8b', '#f43f5e', '#fb7185', '#ff8fab']

const formattedCount = computed(() => {
  if (count.value === null) return '—'
  return new Intl.NumberFormat(lang.value || 'zh-CN', { notation: 'compact', maximumFractionDigits: 1 })
    .format(Number(count.value) || 0)
})

const buttonTitle = computed(() => {
  if (errorText.value) return errorText.value
  if (likedToday.value) return t('取消点赞', 'Remove like')
  return t('喜欢这篇文章', 'Like this article')
})

const scheduleNextDayRefresh = () => {
  if (dayRefreshTimer) window.clearTimeout(dayRefreshTimer)

  const now = Date.now()
  const shanghaiNow = new Date(now + 8 * 60 * 60 * 1000)
  const nextShanghaiMidnight = Date.UTC(
    shanghaiNow.getUTCFullYear(),
    shanghaiNow.getUTCMonth(),
    shanghaiNow.getUTCDate() + 1
  ) - 8 * 60 * 60 * 1000

  dayRefreshTimer = window.setTimeout(() => loadStatus(true), nextShanghaiMidnight - now + 1500)
}

const applyStatus = (data) => {
  count.value = Number(data?.count || 0)
  likedToday.value = Boolean(data?.likedToday)
  if (mounted) scheduleNextDayRefresh()
}

const loadStatus = async (force = false) => {
  if (!mounted || !statsPath.value) return

  const path = statsPath.value
  const version = ++requestVersion
  loading.value = true
  errorText.value = ''
  try {
    const data = await getEngagementStatus(path, force)
    if (mounted && version === requestVersion && statsPath.value === path) applyStatus(data)
  } catch {
    if (mounted && version === requestVersion) {
      errorText.value = t('点赞数据暂时无法加载', 'Like data is temporarily unavailable')
    }
  } finally {
    if (mounted && version === requestVersion) loading.value = false
  }
}

const getAnimationOrigin = (event) => {
  if (event && Number.isFinite(event.clientX) && Number.isFinite(event.clientY) && (event.clientX || event.clientY)) {
    return { x: event.clientX, y: event.clientY }
  }

  const rect = buttonRef.value?.getBoundingClientRect()
  return rect
    ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    : null
}

const scheduleAnimationCleanup = (callback, delay) => {
  const timer = window.setTimeout(() => {
    animationTimers.delete(timer)
    callback()
  }, delay)
  animationTimers.add(timer)
}

const launchHeartBurst = (origin) => {
  if (!origin || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const id = ++burstId
  const particles = Array.from({ length: 9 }, (_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / 9 + (Math.random() - 0.5) * 0.32
    const distance = 34 + Math.random() * 38
    return {
      id: `${id}-${index}`,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotate: -32 + Math.random() * 64,
      scale: 0.78 + Math.random() * 0.5,
      size: 10 + Math.random() * 7,
      delay: index * 14,
      color: heartColors[index % heartColors.length]
    }
  })

  heartBursts.value.push({ id, ...origin, particles })
  celebrating.value = true
  scheduleAnimationCleanup(() => {
    heartBursts.value = heartBursts.value.filter(burst => burst.id !== id)
  }, 1050)
  scheduleAnimationCleanup(() => {
    celebrating.value = false
  }, 560)
}

const mutateLike = async (removing, event) => {
  if (submitting.value || loading.value || !statsPath.value) return

  const path = statsPath.value
  const animationOrigin = removing ? null : getAnimationOrigin(event)
  const previousStatus = {
    count: Number(count.value || 0),
    likedToday: likedToday.value
  }
  const optimisticStatus = {
    count: Math.max(0, previousStatus.count + (removing ? -1 : 1)),
    likedToday: !removing
  }

  submitting.value = true
  errorText.value = ''
  applyStatus(optimisticStatus)
  if (!removing) launchHeartBurst(animationOrigin)

  try {
    await nextTick()
    await new Promise(resolve => window.requestAnimationFrame(resolve))
    const data = removing
      ? await removeLike(path)
      : await submitLike(path)
    if (mounted && statsPath.value === path) applyStatus(data)
  } catch (error) {
    if (mounted && statsPath.value === path) {
      applyStatus(previousStatus)
      errorText.value = error?.message || (removing
        ? t('取消点赞失败，请稍后重试', 'Could not remove the like. Try again later.')
        : t('点赞失败，请稍后重试', 'Could not submit the like. Try again later.'))
    }
  } finally {
    submitting.value = false
  }
}

const toggleLike = (event) => mutateLike(likedToday.value, event)

const likeFromArticleDoubleClick = (event) => {
  if (props.compact || likedToday.value || loading.value || submitting.value) return
  if (!(event.target instanceof Element)) return

  const articleBody = event.target.closest('.vp-doc')
  if (!articleBody || articleBody.classList.contains('excerpt')) return
  if (event.target.closest('a, button, input, textarea, select, label, summary, pre, code, [contenteditable="true"]')) {
    return
  }

  mutateLike(false, event)
}

const syncLike = (event) => {
  if (canonicalizeStatsPath(event.detail?.path) === statsPath.value) applyStatus(event.detail)
}

onMounted(() => {
  mounted = true
  window.addEventListener('ermao:like-updated', syncLike)
  if (!props.compact) document.addEventListener('dblclick', likeFromArticleDoubleClick)
  loadStatus()
})

watch(statsPath, () => {
  if (mounted) loadStatus()
})

onBeforeUnmount(() => {
  mounted = false
  requestVersion++
  if (dayRefreshTimer) window.clearTimeout(dayRefreshTimer)
  animationTimers.forEach(timer => window.clearTimeout(timer))
  animationTimers.clear()
  window.removeEventListener('ermao:like-updated', syncLike)
  if (!props.compact) document.removeEventListener('dblclick', likeFromArticleDoubleClick)
})
</script>

<template>
  <span
    class="article-like"
    :class="{ compact, liked: likedToday, loading, error: errorText, celebrating }"
  >
    <button
      ref="buttonRef"
      type="button"
      class="like-button"
      :disabled="loading || submitting"
      :aria-label="isEnglish
        ? `${likedToday ? 'Remove like' : 'Like'}, ${count ?? 0} likes`
        : `${likedToday ? '取消点赞' : '点赞'}，当前 ${count ?? 0} 个赞`"
      :aria-pressed="likedToday"
      :title="buttonTitle"
      @click.stop="toggleLike"
    >
      <svg
        class="like-icon"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path d="M12 21s-7.25-4.35-9.45-8.32C.75 9.44 2.08 5.5 5.7 4.61c2.14-.53 4.18.31 5.3 1.89 1.12-1.58 3.16-2.42 5.3-1.89 3.62.89 4.95 4.83 3.15 8.07C17.25 16.65 12 21 12 21Z" />
      </svg>
      <span class="like-count" aria-live="polite">{{ formattedCount }}</span>
    </button>
    <span v-if="errorText && !compact" class="like-error" role="status">{{ errorText }}</span>
  </span>

  <ClientOnly>
    <Teleport to="body">
      <span
        v-for="burst in heartBursts"
        :key="burst.id"
        class="like-heart-burst"
        :style="{ left: `${burst.x}px`, top: `${burst.y}px` }"
        aria-hidden="true"
      >
        <span class="burst-center">♥</span>
        <span
          v-for="particle in burst.particles"
          :key="particle.id"
          class="burst-particle"
          :style="{
            '--heart-x': `${particle.x}px`,
            '--heart-y': `${particle.y}px`,
            '--heart-rotation': `${particle.rotate}deg`,
            '--heart-scale': String(particle.scale),
            '--heart-size': `${particle.size}px`,
            '--heart-delay': `${particle.delay}ms`,
            color: particle.color
          }"
        >
          ♥
        </span>
      </span>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.article-like {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 72px;
  color: var(--vp-c-text-2);
  vertical-align: middle;
}

.article-like.compact {
  min-width: 50px;
}

.like-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 28px;
  padding: 3px 9px;
  color: var(--vp-c-text-2);
  font: inherit;
  line-height: 1;
  background: transparent;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.18s ease, transform 0.18s ease;
}

.compact .like-button {
  min-height: 24px;
  padding: 2px 7px;
}

.like-button:hover:not(:disabled) {
  color: #df4964;
  transform: translateY(-1px);
}

.like-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.like-button:disabled {
  cursor: default;
}

.like-icon {
  flex: 0 0 auto;
  fill: transparent;
  stroke: currentColor;
  stroke-linejoin: round;
  stroke-width: 1.8;
  transition: fill 0.18s ease, transform 0.18s ease;
}

.liked .like-button {
  color: #df4964;
}

.liked .like-icon {
  fill: currentColor;
  transform: scale(1.04);
}

.celebrating .like-icon {
  animation: liked-heart-pop 0.56s cubic-bezier(0.2, 0.9, 0.32, 1.45);
}

.like-heart-burst {
  position: fixed;
  z-index: 2147483000;
  width: 0;
  height: 0;
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

.burst-center,
.burst-particle {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  color: #ff4f73;
  filter: drop-shadow(0 2px 3px rgb(223 73 100 / 24%));
  transform: translate(-50%, -50%);
  transform-origin: center;
  will-change: transform, opacity;
}

.burst-center {
  font-size: 18px;
  animation: heart-burst-center 0.64s cubic-bezier(0.2, 0.82, 0.3, 1) both;
}

.burst-particle {
  font-size: var(--heart-size);
  opacity: 0;
  animation: heart-burst-particle 0.86s cubic-bezier(0.16, 0.76, 0.3, 1) var(--heart-delay) both;
}

@keyframes liked-heart-pop {
  0% {
    transform: scale(1);
  }
  38% {
    transform: scale(1.55) rotate(-8deg);
  }
  68% {
    transform: scale(0.92) rotate(4deg);
  }
  100% {
    transform: scale(1.04) rotate(0);
  }
}

@keyframes heart-burst-center {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2);
  }
  28% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.35);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(2);
  }
}

@keyframes heart-burst-particle {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2) rotate(0);
  }
  18% {
    opacity: 1;
  }
  66% {
    opacity: 0.94;
  }
  100% {
    opacity: 0;
    transform:
      translate(
        calc(-50% + var(--heart-x)),
        calc(-50% + var(--heart-y))
      )
      scale(var(--heart-scale))
      rotate(var(--heart-rotation));
  }
}

.loading .like-button {
  opacity: 0.62;
}

.like-count {
  min-width: 1.2em;
  text-align: center;
}

.like-error {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip-path: inset(50%);
}

@media (prefers-reduced-motion: reduce) {
  .like-button,
  .like-icon {
    transition: none;
  }

  .celebrating .like-icon {
    animation: none;
  }

  .like-heart-burst {
    display: none;
  }
}
</style>
