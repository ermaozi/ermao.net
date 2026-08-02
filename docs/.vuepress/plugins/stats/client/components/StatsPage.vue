<template>
  <section class="stats-dashboard" :aria-label="pick('网站访问数据', 'Site traffic data')">
    <div class="overview-card">
      <section class="total-panel" aria-labelledby="stats-total-title">
        <span class="eyebrow">PRIVATE INSIGHTS</span>
        <h2 id="stats-total-title">{{ pick('当前访问量', 'Current visits') }}</h2>

        <div class="total-orbit" :class="{ 'is-loading': loading }" aria-live="polite">
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <circle class="orbit-track" cx="100" cy="100" r="82" />
            <circle class="orbit-progress" cx="100" cy="100" r="82" />
            <circle class="orbit-inner" cx="100" cy="100" r="67" />
          </svg>
          <div class="total-value">
            <strong>{{ formattedTotal }}</strong>
            <span>{{ pick('次访问', 'visits') }}</span>
          </div>
        </div>

        <div
          v-if="hasComparison"
          class="period-comparison"
          :class="`is-${comparisonSummary.tone}`"
          aria-live="polite"
        >
          <span aria-hidden="true">{{ comparisonSummary.icon }}</span>
          <div>
            <strong>{{ comparisonSummary.label }}</strong>
            <small>{{ pick('上周期', 'Previous period') }} {{ formattedPreviousTotal }} {{ pick('次访问', 'visits') }}</small>
          </div>
        </div>

        <span class="status-chip">
          <i aria-hidden="true" />
          {{ currentRangeLabel }}
        </span>
        <p>{{ pick('仅向授权账号展示站内访问趋势，不呈现可识别个人身份的信息。', 'Traffic trends are available only to authorized accounts and do not display personally identifiable information.') }}</p>
      </section>

      <section class="insights-panel" aria-labelledby="stats-insights-title">
        <div class="panel-heading">
          <div>
            <span class="eyebrow">DATA PULSE</span>
            <h2 id="stats-insights-title">{{ pick('数据概览', 'Overview') }}</h2>
          </div>
          <button
            type="button"
            class="icon-button"
            :disabled="loading"
            :aria-label="pick('刷新统计数据', 'Refresh statistics')"
            :title="pick('刷新统计数据', 'Refresh statistics')"
            @click="refreshCurrent"
          >
            <span :class="{ spinning: loading }" aria-hidden="true">↻</span>
          </button>
        </div>

        <div class="insight-grid">
          <article v-for="item in summaryItems" :key="item.label" class="insight-card">
            <span class="insight-icon" aria-hidden="true">{{ item.icon }}</span>
            <div>
              <span>{{ item.label }}</span>
              <strong :title="item.value">{{ item.value }}</strong>
              <small>{{ item.meta }}</small>
            </div>
          </article>
        </div>

        <div class="update-line">
          <span :class="serviceState.className">
            <i aria-hidden="true" />
            {{ serviceState.label }}
          </span>
          <time v-if="lastUpdated" :datetime="lastUpdated.toISOString()">
            {{ pick('更新于', 'Updated at') }} {{ lastUpdatedLabel }}
          </time>
          <span v-else>{{ pick('等待首次同步', 'Waiting for the first sync') }}</span>
        </div>
      </section>
    </div>

    <section class="filter-card" aria-labelledby="stats-filter-title">
      <div class="filter-heading">
        <div>
          <span class="eyebrow">TIME RANGE</span>
          <h2 id="stats-filter-title">{{ pick('选择统计范围', 'Select a time range') }}</h2>
        </div>
        <span class="range-badge">{{ currentRangeLabel }}</span>
      </div>

      <div class="filter-controls">
        <div class="period-switch" :aria-label="pick('快捷时间范围', 'Quick time ranges')">
          <button
            v-for="period in periods"
            :key="period.value"
            type="button"
            :class="{ active: currentPeriod === period.value }"
            :aria-pressed="currentPeriod === period.value"
            :disabled="loading"
            @click="fetchStats(period.value)"
          >
            {{ period.label }}
          </button>
        </div>

        <form class="date-picker-group" @submit.prevent="fetchCustom">
          <label>
            <span>{{ pick('开始日期', 'Start date') }}</span>
            <input v-model="startDate" type="date" :max="maxDate" />
          </label>
          <span class="date-separator" aria-hidden="true">→</span>
          <label>
            <span>{{ pick('结束日期', 'End date') }}</span>
            <input v-model="endDate" type="date" :max="maxDate" />
          </label>
          <button
            type="submit"
            class="query-button"
            :disabled="loading || !startDate || !endDate"
          >
            {{ pick('查询', 'Apply') }}
          </button>
        </form>
      </div>
    </section>

    <div v-if="error && hasLoaded" class="inline-notice" role="alert">
      <span aria-hidden="true">!</span>
      <p>{{ error }}</p>
      <button type="button" @click="refreshCurrent">{{ pick('重新加载', 'Reload') }}</button>
    </div>

    <section v-if="loading && !hasLoaded" class="loading-state" aria-live="polite">
      <div class="loading-heading">
        <span class="loading-mark" aria-hidden="true" />
        <div>
          <strong>{{ pick('正在汇总访问数据', 'Aggregating traffic data') }}</strong>
          <span>{{ pick('连接统计服务并生成图表…', 'Connecting to the statistics service and generating charts…') }}</span>
        </div>
      </div>
      <div class="skeleton-grid">
        <div v-for="index in 5" :key="index" class="skeleton-card">
          <span />
          <i />
        </div>
      </div>
    </section>

    <section v-else-if="error && !hasLoaded" class="error-state" role="alert">
      <span class="error-icon" aria-hidden="true">!</span>
      <div>
        <span class="eyebrow">CONNECTION ERROR</span>
        <h2>{{ pick('统计服务暂时不可用', 'Statistics service temporarily unavailable') }}</h2>
        <p>{{ error }}</p>
      </div>
      <button type="button" class="secondary-button" @click="refreshCurrent">{{ pick('重新请求', 'Try again') }}</button>
    </section>

    <div v-else class="stats-content" :class="{ 'is-refreshing': loading }">
      <section class="chart-card trend-card" aria-labelledby="trend-title">
        <div class="chart-heading">
          <div>
            <span class="eyebrow">TRAFFIC TREND</span>
            <h2 id="trend-title">{{ pick('访问趋势', 'Traffic trend') }}</h2>
            <p>{{ trendDescription }}</p>
          </div>
          <span class="chart-badge">{{ trendPointCount }} {{ pick('个数据点', 'data points') }}</span>
        </div>
        <div class="chart-container line-chart-height">
          <Line :data="lineChartData" :options="lineOptions" />
        </div>
      </section>

      <div class="chart-grid">
        <section class="chart-card" aria-labelledby="pages-title">
          <div class="chart-heading compact">
            <div>
              <span class="eyebrow">POPULAR CONTENT</span>
              <h2 id="pages-title">{{ pick('热门页面', 'Popular pages') }}</h2>
              <p>{{ pick('点击柱状条可打开对应内容。', 'Select a bar to open the corresponding page.') }}</p>
            </div>
            <span class="chart-index">01</span>
          </div>
          <div v-if="hasPages" class="chart-container bar-chart-height">
            <Bar :data="pagesChartData" :options="barOptions" />
          </div>
          <div v-else class="empty-chart">{{ pick('当前范围暂无页面访问记录', 'No page visits in this range') }}</div>
        </section>

        <section class="chart-card" aria-labelledby="refs-title">
          <div class="chart-heading compact">
            <div>
              <span class="eyebrow">DISCOVERY CHANNELS</span>
              <h2 id="refs-title">{{ pick('访客来源', 'Referrers') }}</h2>
              <p>{{ pick('了解读者从搜索或其他站点进入的路径。', 'See how readers arrive from search and other sites.') }}</p>
            </div>
            <span class="chart-index">02</span>
          </div>
          <div v-if="hasRefs" class="chart-container bar-chart-height">
            <Bar :data="refsChartData" :options="refsBarOptions" />
          </div>
          <div v-else class="empty-chart">{{ pick('当前范围暂无来源记录', 'No referrer records in this range') }}</div>
        </section>
      </div>

      <div class="chart-grid compact-grid">
        <section class="chart-card" aria-labelledby="country-title">
          <div class="chart-heading compact">
            <div>
              <span class="eyebrow">GLOBAL REACH</span>
              <h2 id="country-title">{{ pick('国家与地区', 'Countries and regions') }}</h2>
              <p>{{ pick('按公开的国家或地区代码汇总。', 'Aggregated by public country or region code.') }}</p>
            </div>
            <span class="chart-index">03</span>
          </div>
          <div v-if="hasCountries" class="chart-container pie-container">
            <Doughnut :data="countryChartData" :options="pieOptions" />
          </div>
          <div v-else class="empty-chart">{{ pick('当前范围暂无地区记录', 'No region records in this range') }}</div>
        </section>

        <section class="chart-card" aria-labelledby="ua-title">
          <div class="chart-heading compact">
            <div>
              <span class="eyebrow">CLIENT MIX</span>
              <h2 id="ua-title">{{ pick('浏览器终端', 'Browser clients') }}</h2>
              <p>{{ pick('展示聚合后的浏览器类型分布。', 'Aggregated distribution of browser types.') }}</p>
            </div>
            <span class="chart-index">04</span>
          </div>
          <div v-if="hasUserAgents" class="chart-container pie-container">
            <Doughnut :data="uaChartData" :options="pieOptions" />
          </div>
          <div v-else class="empty-chart">{{ pick('当前范围暂无终端记录', 'No browser records in this range') }}</div>
        </section>
      </div>

      <aside class="privacy-note">
        <span class="privacy-icon" aria-hidden="true">⌁</span>
        <div>
          <strong>{{ pick('关于这些数据', 'About this data') }}</strong>
          <p>{{ pick('页面仅展示聚合后的访问次数、内容路径、来源域名、国家或地区及浏览器类型，不展示单个访客的 IP、设备标识或访问轨迹。', 'This page shows only aggregated visit counts, content paths, referrer domains, countries or regions, and browser types. It does not display an individual visitor’s IP address, device identifier, or browsing trail.') }}</p>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLang } from 'vuepress/client'
import { useRouter } from 'vue-router'
// @ts-ignore
import { pageMap } from '@stats/page-map'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Bar, Doughnut, Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels,
)

const reportUrl = '/stats/api'

const emptyStats = () => ({
  total: 0,
  pages: [],
  countries: [],
  uas: [],
  timeSeries: [],
  refs: [],
  previousPeriod: null,
})

const stats = ref(emptyStats())
const loading = ref(false)
const error = ref('')
const hasLoaded = ref(false)
const lastUpdated = ref(null)
const currentPeriod = ref('24h')
const startDate = ref('')
const endDate = ref('')
const isCustomMode = ref(false)
const router = useRouter()
const lang = useLang()
const routeMap = ref(new Map())
const isEnglish = computed(() => String(lang.value || '').toLowerCase().startsWith('en'))
const pick = (zh, en) => isEnglish.value ? en : zh

let activeRequest = null
let themeObserver = null

const periods = computed(() => [
  { label: pick('24 小时', '24 hours'), value: '24h' },
  { label: pick('7 天', '7 days'), value: '7d' },
  { label: pick('30 天', '30 days'), value: '30d' },
  { label: pick('1 年', '1 year'), value: '1y' },
])
const COMPARABLE_PERIODS = new Set(['24h', '7d', '30d'])

const chartTheme = ref({
  text: '#64748b',
  muted: '#94a3b8',
  grid: 'rgba(148, 163, 184, 0.18)',
  surface: '#ffffff',
  tooltip: '#172033',
})

const chartPalette = [
  '#2f7f98',
  '#2f9b87',
  '#6676c8',
  '#b47731',
  '#b75871',
  '#3f8bbd',
  '#708b3d',
  '#9a68b5',
  '#3d948e',
  '#8a755d',
]

const maxDate = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const safeCount = value => {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

const getCurrentLang = () => lang.value || 'zh-CN'

const formatCount = value =>
  new Intl.NumberFormat(getCurrentLang(), { maximumFractionDigits: 0 }).format(safeCount(value))

const getPageTitle = path => {
  if (!path) return pick('未知页面', 'Unknown page')
  const displayTitle = (title, fallback) =>
    isEnglish.value && /[\u3400-\u9fff]/u.test(String(title || ''))
      ? fallback
      : title

  if (pageMap?.[path]) return displayTitle(pageMap[path], path)

  let decoded = path
  try {
    decoded = decodeURI(path)
  }
  catch {
    decoded = path
  }

  if (pageMap?.[decoded]) return displayTitle(pageMap[decoded], decoded)

  const cleanPath = decoded.replace(/(\.html|\/)$/, '')
  if (pageMap?.[cleanPath]) return displayTitle(pageMap[cleanPath], decoded)
  if (pageMap?.[`${cleanPath}.html`]) return displayTitle(pageMap[`${cleanPath}.html`], decoded)
  if (pageMap?.[`${cleanPath}/`]) return displayTitle(pageMap[`${cleanPath}/`], decoded)
  if (routeMap.value.has(path)) return displayTitle(routeMap.value.get(path), decoded)

  return decoded || path
}

const getCountryName = code => {
  if (!code || code === 'Unknown' || code === 'XX') return pick('未知地区', 'Unknown region')

  try {
    const regionNames = new Intl.DisplayNames([getCurrentLang()], { type: 'region' })
    return regionNames.of(code) || code
  }
  catch {
    return code
  }
}

const getRefLabel = value => {
  if (!value) return pick('直接访问', 'Direct')

  try {
    const url = new URL(value)
    return url.hostname.replace(/^www\./, '') || value
  }
  catch {
    return value === 'Unknown' ? pick('未知来源', 'Unknown referrer') : value
  }
}

const shorten = (value, maxLength) =>
  value.length > maxLength ? `${value.slice(0, Math.max(1, maxLength - 1))}…` : value

const buildRouteMap = () => {
  for (const route of router.getRoutes()) {
    if (route.meta?.title) {
      routeMap.value.set(route.path, route.meta.title)
    }
  }
}

const formattedTotal = computed(() => formatCount(stats.value.total))
const hasComparison = computed(() => Boolean(
  stats.value.previousPeriod
    && COMPARABLE_PERIODS.has(currentPeriod.value)
    && !isCustomMode.value,
))
const formattedPreviousTotal = computed(() =>
  formatCount(stats.value.previousPeriod?.total),
)

const comparisonSummary = computed(() => {
  const current = safeCount(stats.value.total)
  const previous = safeCount(stats.value.previousPeriod?.total)
  const change = current - previous

  if (previous === 0) {
    return current === 0
      ? { icon: '→', label: pick('与上周期持平', 'No change from previous period'), tone: 'neutral' }
      : { icon: '↗', label: pick('上周期暂无访问', 'No visits in previous period'), tone: 'positive' }
  }

  const percentage = Math.abs(change * 100 / previous)
  const formatted = new Intl.NumberFormat(getCurrentLang(), {
    maximumFractionDigits: percentage >= 100 ? 0 : 1,
  }).format(percentage)

  if (change > 0) {
    return { icon: '↑', label: pick(`较上周期增长 ${formatted}%`, `${formatted}% higher than previous period`), tone: 'positive' }
  }
  if (change < 0) {
    return { icon: '↓', label: pick(`较上周期下降 ${formatted}%`, `${formatted}% lower than previous period`), tone: 'negative' }
  }
  return { icon: '→', label: pick('与上周期持平', 'No change from previous period'), tone: 'neutral' }
})

const trendDescription = computed(() =>
  hasComparison.value
    ? pick('实线为本周期，虚线为紧邻的上一周期，时间点按相同位置对齐。', 'The solid line is the current period; the dashed line is the immediately preceding period aligned by relative time.')
    : pick('观察当前时间范围内的访问波动与内容热度变化。', 'Observe traffic changes and content activity across the selected range.'),
)

const currentRangeLabel = computed(() => {
  if (isCustomMode.value && startDate.value && endDate.value) {
    return `${startDate.value} ${pick('至', 'to')} ${endDate.value}`
  }

  return periods.value.find(period => period.value === currentPeriod.value)?.label || pick('自定义范围', 'Custom range')
})

const serviceState = computed(() => {
  if (error.value) return { label: pick('服务连接异常', 'Service connection error'), className: 'is-error' }
  if (loading.value) return { label: pick('正在同步数据', 'Syncing data'), className: 'is-loading' }
  if (hasLoaded.value) return { label: pick('数据服务在线', 'Data service online'), className: 'is-ready' }
  return { label: pick('等待连接服务', 'Waiting for data service'), className: 'is-idle' }
})

const lastUpdatedLabel = computed(() => {
  if (!lastUpdated.value) return ''

  return new Intl.DateTimeFormat(getCurrentLang(), {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(lastUpdated.value)
})

const summaryItems = computed(() => {
  const topPage = stats.value.pages?.[0]
  const topCountry = stats.value.countries?.[0]
  const topUa = stats.value.uas?.[0]
  const topRef = stats.value.refs?.[0]

  return [
    {
      icon: '↗',
      label: pick('热门内容', 'Popular content'),
      value: topPage ? getPageTitle(topPage.path) : pick('暂无数据', 'No data'),
      meta: topPage ? `${formatCount(topPage.count)} ${pick('次访问', 'visits')}` : pick('等待访问记录', 'Waiting for visits'),
    },
    {
      icon: '◎',
      label: pick('主要地区', 'Top region'),
      value: topCountry ? getCountryName(topCountry.country) : pick('暂无数据', 'No data'),
      meta: topCountry ? `${formatCount(topCountry.count)} ${pick('次访问', 'visits')}` : pick('等待地区记录', 'Waiting for region data'),
    },
    {
      icon: '⌘',
      label: pick('主要终端', 'Top browser'),
      value: topUa?.ua_group || pick('暂无数据', 'No data'),
      meta: topUa ? `${formatCount(topUa.count)} ${pick('次访问', 'visits')}` : pick('等待终端记录', 'Waiting for browser data'),
    },
    {
      icon: '⌁',
      label: pick('主要来源', 'Top referrer'),
      value: topRef ? getRefLabel(topRef.ref) : pick('暂无数据', 'No data'),
      meta: topRef ? `${formatCount(topRef.count)} ${pick('次访问', 'visits')}` : pick('等待来源记录', 'Waiting for referrer data'),
    },
  ]
})

const hasPages = computed(() => Boolean(stats.value.pages?.length))
const hasRefs = computed(() => Boolean(stats.value.refs?.length))
const hasCountries = computed(() => Boolean(stats.value.countries?.length))
const hasUserAgents = computed(() => Boolean(stats.value.uas?.length))
const trendPointCount = computed(() => lineChartData.value.labels.length)

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

const getSeriesResolution = range => {
  const difference = safeCount(range?.end) - safeCount(range?.start)
  if (difference <= 2 * DAY_MS) return 'hour'
  if (difference > 180 * DAY_MS) return 'month'
  return 'day'
}

const floorBucket = (timestamp, resolution) => {
  const date = new Date(timestamp)
  if (resolution === 'hour') return Math.floor(timestamp / HOUR_MS) * HOUR_MS
  if (resolution === 'month') {
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)
  }
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

const nextBucket = (timestamp, resolution) => {
  if (resolution === 'hour') return timestamp + HOUR_MS
  if (resolution === 'day') return timestamp + DAY_MS
  const date = new Date(timestamp)
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1)
}

const getBucketKey = (timestamp, resolution) => {
  const iso = new Date(timestamp).toISOString()
  if (resolution === 'hour') return `${iso.slice(0, 13).replace('T', ' ')}:00`
  if (resolution === 'month') return iso.slice(0, 7)
  return iso.slice(0, 10)
}

const getBucketLabel = (timestamp, resolution, includeWeekday = false) => {
  const date = new Date(timestamp)
  if (resolution === 'hour') {
    return `${String(date.getHours()).padStart(2, '0')}:00`
  }
  if (resolution === 'month') {
    return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`
  }
  const dateLabel = `${date.getUTCMonth() + 1}-${date.getUTCDate()}`
  if (!includeWeekday) return dateLabel

  const weekday = new Intl.DateTimeFormat(getCurrentLang(), {
    weekday: 'short',
    timeZone: 'UTC',
  }).format(date)
  return `${dateLabel} ${weekday}`
}

const buildSeriesBuckets = (range, rawData, resolution, includeWeekday = false) => {
  const start = Number(range?.start)
  const end = Number(range?.end)
  const dataMap = new Map(
    (rawData || []).map(item => [item.label, safeCount(item.count)]),
  )

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return (rawData || []).map(item => ({
      key: item.label,
      displayLabel: item.label,
      value: safeCount(item.count),
    }))
  }

  const buckets = []
  const first = floorBucket(start, resolution)
  const last = floorBucket(Math.max(start, end - 1), resolution)
  for (let cursor = first; cursor <= last; cursor = nextBucket(cursor, resolution)) {
    const key = getBucketKey(cursor, resolution)
    buckets.push({
      key,
      displayLabel: getBucketLabel(cursor, resolution, includeWeekday),
      value: dataMap.get(key) || 0,
    })
  }
  return buckets
}

const lineChartData = computed(() => {
  const resolution = getSeriesResolution(stats.value.range)
  const includeWeekday = !isCustomMode.value
    && (currentPeriod.value === '7d' || currentPeriod.value === '30d')
  const currentBuckets = buildSeriesBuckets(
    stats.value.range,
    stats.value.timeSeries,
    resolution,
    includeWeekday,
  )
  const datasets = [
    {
      label: hasComparison.value ? pick('本周期', 'Current period') : pick('访问次数', 'Visits'),
      data: currentBuckets.map(bucket => bucket.value),
      borderColor: '#2f7f98',
      backgroundColor: 'rgba(47, 127, 152, 0.14)',
      pointBackgroundColor: '#2f9b87',
      pointBorderColor: chartTheme.value.surface,
      pointBorderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 5,
      borderWidth: 3,
      fill: true,
      tension: 0.36,
    },
  ]

  if (hasComparison.value) {
    const previous = stats.value.previousPeriod
    const previousBuckets = buildSeriesBuckets(
      previous.range,
      previous.timeSeries,
      resolution,
      includeWeekday,
    )
    datasets.push({
      label: pick('上周期', 'Previous period'),
      data: currentBuckets.map((_bucket, index) => previousBuckets[index]?.value || 0),
      borderColor: chartTheme.value.muted,
      backgroundColor: 'transparent',
      pointBackgroundColor: chartTheme.value.muted,
      pointBorderColor: chartTheme.value.surface,
      pointBorderWidth: 1,
      pointRadius: 0,
      pointHoverRadius: 4,
      borderWidth: 2,
      borderDash: [7, 5],
      fill: false,
      tension: 0.3,
    })
  }

  return {
    labels: currentBuckets.map(bucket => bucket.displayLabel),
    datasets,
  }
})

const pagesChartData = computed(() => {
  const pages = (stats.value.pages || []).slice(0, 12)
  return {
    labels: pages.map(page => shorten(getPageTitle(page.path), 18)),
    datasets: [
      {
        label: pick('访问次数', 'Visits'),
        data: pages.map(page => safeCount(page.count)),
        backgroundColor: 'rgba(47, 127, 152, 0.86)',
        hoverBackgroundColor: '#2f9b87',
        borderRadius: 7,
        borderSkipped: false,
        maxBarThickness: 24,
      },
    ],
  }
})

const refsChartData = computed(() => {
  const refs = (stats.value.refs || []).slice(0, 12)
  return {
    labels: refs.map(ref => shorten(getRefLabel(ref.ref), 24)),
    datasets: [
      {
        label: pick('访问次数', 'Visits'),
        data: refs.map(ref => safeCount(ref.count)),
        backgroundColor: 'rgba(102, 118, 200, 0.82)',
        hoverBackgroundColor: '#2f9b87',
        borderRadius: 7,
        borderSkipped: false,
        maxBarThickness: 24,
      },
    ],
  }
})

const countryChartData = computed(() => {
  const countries = (stats.value.countries || []).slice(0, 10)
  return {
    labels: countries.map(country => getCountryName(country.country)),
    datasets: [
      {
        data: countries.map(country => safeCount(country.count)),
        backgroundColor: chartPalette,
        borderColor: chartTheme.value.surface,
        borderWidth: 3,
        borderRadius: 4,
        hoverOffset: 8,
      },
    ],
  }
})

const uaChartData = computed(() => {
  const userAgents = (stats.value.uas || []).slice(0, 10)
  return {
    labels: userAgents.map(item => item.ua_group || pick('未知终端', 'Unknown browser')),
    datasets: [
      {
        data: userAgents.map(item => safeCount(item.count)),
        backgroundColor: [...chartPalette].reverse(),
        borderColor: chartTheme.value.surface,
        borderWidth: 3,
        borderRadius: 4,
        hoverOffset: 8,
      },
    ],
  }
})

const tooltipOptions = () => ({
  backgroundColor: chartTheme.value.tooltip,
  titleColor: '#ffffff',
  bodyColor: '#ffffff',
  borderColor: 'rgba(255, 255, 255, 0.14)',
  borderWidth: 1,
  padding: 11,
  cornerRadius: 9,
  displayColors: false,
  callbacks: {
    label: context => ` ${formatCount(context.raw)} ${pick('次访问', 'visits')}`,
  },
})

const lineOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  animation: {
    duration: 650,
    easing: 'easeOutQuart',
  },
  plugins: {
    legend: {
      display: hasComparison.value,
      position: 'top',
      align: 'end',
      labels: {
        color: chartTheme.value.text,
        usePointStyle: true,
        pointStyle: 'line',
        boxWidth: 24,
        boxHeight: 7,
        padding: 16,
        font: { size: 11, weight: '700' },
      },
    },
    datalabels: { display: false },
    tooltip: tooltipOptions(),
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: chartTheme.value.text,
        precision: 0,
        padding: 10,
      },
      border: { display: false },
      grid: {
        color: chartTheme.value.grid,
        drawTicks: false,
      },
    },
    x: {
      ticks: {
        color: chartTheme.value.text,
        maxRotation: 0,
        autoSkipPadding: 20,
        padding: 10,
      },
      border: { display: false },
      grid: { display: false },
    },
  },
}))

const setChartCursor = (event, elements) => {
  const target = event?.native?.target
  if (target?.style) target.style.cursor = elements?.length ? 'pointer' : 'default'
}

const createBarOptions = (itemsGetter, openItem) => computed(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  onHover: setChartCursor,
  onClick: (_event, elements) => {
    if (!elements?.length) return
    const item = itemsGetter()[elements[0].index]
    if (item) openItem(item)
  },
  layout: {
    padding: { right: 40 },
  },
  plugins: {
    legend: { display: false },
    tooltip: tooltipOptions(),
    datalabels: {
      display: context => context.chart.width > 430,
      anchor: 'end',
      align: 'end',
      clamp: true,
      color: chartTheme.value.text,
      font: { size: 11, weight: '700' },
      formatter: value => formatCount(value),
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        color: chartTheme.value.text,
        precision: 0,
      },
      border: { display: false },
      grid: {
        color: chartTheme.value.grid,
        drawTicks: false,
      },
    },
    y: {
      ticks: {
        color: chartTheme.value.text,
        font: { size: 11, weight: '600' },
      },
      border: { display: false },
      grid: { display: false },
    },
  },
}))

const barOptions = createBarOptions(
  () => (stats.value.pages || []).slice(0, 12),
  page => {
    if (page.path && typeof window !== 'undefined') window.open(page.path, '_blank', 'noopener')
  },
)

const refsBarOptions = createBarOptions(
  () => (stats.value.refs || []).slice(0, 12),
  ref => {
    if (ref.ref?.startsWith('http') && typeof window !== 'undefined') {
      window.open(ref.ref, '_blank', 'noopener,noreferrer')
    }
  },
)

const pieOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  animation: {
    animateRotate: true,
    duration: 700,
  },
  plugins: {
    tooltip: tooltipOptions(),
    legend: {
      position: 'bottom',
      labels: {
        color: chartTheme.value.text,
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 7,
        boxHeight: 7,
        padding: 14,
        font: { size: 11, weight: '600' },
      },
    },
    datalabels: {
      display: context => context.chart.width > 340,
      color: '#ffffff',
      textAlign: 'center',
      font: { size: 10, weight: '800' },
      formatter: (value, context) => {
        const values = context.chart.data.datasets[0].data
        const total = values.reduce((sum, item) => sum + safeCount(item), 0)
        if (!total) return ''
        const percentage = value * 100 / total
        return percentage >= 7 ? `${percentage.toFixed(0)}%` : ''
      },
    },
  },
}))

const normalizeStats = data => ({
  ...emptyStats(),
  ...data,
  total: safeCount(data?.total),
  pages: Array.isArray(data?.pages) ? data.pages : [],
  countries: Array.isArray(data?.countries) ? data.countries : [],
  uas: Array.isArray(data?.uas) ? data.uas : [],
  timeSeries: Array.isArray(data?.timeSeries) ? data.timeSeries : [],
  refs: Array.isArray(data?.refs) ? data.refs : [],
  previousPeriod: data?.previousPeriod
    ? {
        ...data.previousPeriod,
        total: safeCount(data.previousPeriod.total),
        timeSeries: Array.isArray(data.previousPeriod.timeSeries)
          ? data.previousPeriod.timeSeries
          : [],
      }
    : null,
})

const requestStats = async url => {
  activeRequest?.abort()
  const controller = new AbortController()
  activeRequest = controller
  loading.value = true
  error.value = ''

  const timeout = window.setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      throw new Error(pick('统计服务返回了无法识别的数据格式', 'The statistics service returned an unrecognized data format'))
    }
    if (!response.ok) {
      throw new Error(pick(`统计服务返回 HTTP ${response.status}`, `The statistics service returned HTTP ${response.status}`))
    }

    const data = await response.json()
    stats.value = normalizeStats(data)
    hasLoaded.value = true
    const generatedAt = Number(data?.meta?.generatedAt)
    lastUpdated.value = new Date(Number.isFinite(generatedAt) ? generatedAt : Date.now())
  }
  catch (reason) {
    if (reason?.name === 'AbortError' && activeRequest !== controller) return

    error.value = reason?.name === 'AbortError'
      ? pick('请求等待时间过长，请稍后重试。', 'The request timed out. Please try again.')
      : reason?.message || pick('无法连接统计服务，请稍后重试。', 'Could not connect to the statistics service. Please try again.')
  }
  finally {
    window.clearTimeout(timeout)
    if (activeRequest === controller) {
      activeRequest = null
      loading.value = false
    }
  }
}

const fetchStats = async period => {
  currentPeriod.value = period
  isCustomMode.value = false
  startDate.value = ''
  endDate.value = ''
  await requestStats(`${reportUrl}?period=${encodeURIComponent(period)}`)
}

const fetchCustom = async () => {
  if (!startDate.value || !endDate.value) return

  const start = new Date(`${startDate.value}T00:00:00`).getTime()
  const exclusiveEndDate = new Date(`${endDate.value}T00:00:00`)
  exclusiveEndDate.setDate(exclusiveEndDate.getDate() + 1)
  const end = exclusiveEndDate.getTime()

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    error.value = pick('请选择有效的开始与结束日期。', 'Select valid start and end dates.')
    return
  }
  if (start > end) {
    error.value = pick('开始日期不能晚于结束日期。', 'The start date cannot be later than the end date.')
    return
  }

  currentPeriod.value = ''
  isCustomMode.value = true
  await requestStats(`${reportUrl}?start=${start}&end=${end}`)
}

const refreshCurrent = () => {
  if (isCustomMode.value && startDate.value && endDate.value) {
    fetchCustom()
  }
  else {
    fetchStats(currentPeriod.value || '24h')
  }
}

const readThemeValue = (styles, name, fallback) =>
  styles.getPropertyValue(name).trim() || fallback

const syncChartTheme = () => {
  const rootStyles = getComputedStyle(document.documentElement)
  const isDark = document.documentElement.dataset.theme === 'dark'
    || document.documentElement.classList.contains('dark')

  chartTheme.value = {
    text: readThemeValue(rootStyles, '--vp-c-text-2', isDark ? '#b6c2cf' : '#64748b'),
    muted: readThemeValue(rootStyles, '--vp-c-text-3', isDark ? '#7f8b99' : '#94a3b8'),
    grid: isDark ? 'rgba(148, 163, 184, 0.13)' : 'rgba(100, 116, 139, 0.14)',
    surface: readThemeValue(rootStyles, '--vp-c-bg', isDark ? '#16181d' : '#ffffff'),
    tooltip: isDark ? '#0d1118' : '#172033',
  }
}

onMounted(() => {
  buildRouteMap()
  syncChartTheme()
  themeObserver = new MutationObserver(syncChartTheme)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme'],
  })
  fetchStats('24h')
})

onBeforeUnmount(() => {
  activeRequest?.abort()
  themeObserver?.disconnect()
})
</script>

<style scoped>
.stats-dashboard {
  --stats-brand: #2f7f98;
  --stats-accent: #2f9b87;
  --stats-purple: #6676c8;
  --stats-warning: #b47731;
  margin: 1.75rem auto 3rem;
  color: var(--vp-c-text-1);
}

.stats-dashboard *,
.stats-dashboard *::before,
.stats-dashboard *::after {
  box-sizing: border-box;
}

.overview-card {
  display: grid;
  overflow: hidden;
  grid-template-columns: minmax(300px, 0.82fr) minmax(440px, 1.25fr);
  border: 1px solid var(--vp-c-border);
  border-radius: 18px;
  background: var(--vp-c-bg);
  box-shadow: 0 22px 60px color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
}

.total-panel,
.insights-panel {
  min-width: 0;
  padding: 30px;
}

.total-panel {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border-right: 1px solid var(--vp-c-divider);
  background:
    radial-gradient(circle at 50% 24%, color-mix(in srgb, var(--vp-c-brand-soft) 72%, transparent), transparent 46%),
    radial-gradient(circle at 8% 92%, color-mix(in srgb, var(--stats-accent) 12%, transparent), transparent 34%),
    var(--vp-c-bg);
  text-align: center;
}

.eyebrow {
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.09em;
  line-height: 1.4;
  text-transform: uppercase;
}

.total-panel h2,
.insights-panel h2,
.filter-card h2,
.chart-card h2,
.error-state h2 {
  margin: 3px 0 0;
  border: 0;
  color: var(--vp-c-text-1);
  font-size: 20px;
  line-height: 1.35;
}

.total-orbit {
  position: relative;
  width: 196px;
  height: 196px;
  margin: 21px auto 16px;
}

.total-orbit svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.orbit-track,
.orbit-progress,
.orbit-inner {
  fill: none;
}

.orbit-track {
  stroke: var(--vp-c-bg-alt);
  stroke-width: 8;
}

.orbit-progress {
  stroke: var(--stats-brand);
  stroke-dasharray: 385 132;
  stroke-linecap: round;
  stroke-width: 9;
  animation: orbit-drift 12s linear infinite;
  transform-origin: center;
}

.orbit-inner {
  stroke: color-mix(in srgb, var(--stats-accent) 22%, var(--vp-c-divider));
  stroke-dasharray: 2 9;
  stroke-linecap: round;
  stroke-width: 2;
}

.total-orbit.is-loading .orbit-progress {
  animation-duration: 1.2s;
}

.total-value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.total-value strong {
  max-width: 160px;
  overflow: hidden;
  font-size: clamp(34px, 4vw, 44px);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
  line-height: 1;
  text-overflow: ellipsis;
}

.total-value span {
  margin-top: 7px;
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.period-comparison {
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: 9px;
  margin: -2px auto 13px;
  padding: 8px 11px;
  border: 1px solid color-mix(in srgb, currentColor 22%, var(--vp-c-border));
  border-radius: 11px;
  color: var(--stats-accent);
  background: color-mix(in srgb, currentColor 7%, var(--vp-c-bg));
  text-align: left;
}

.period-comparison > span {
  display: grid;
  width: 25px;
  height: 25px;
  flex: none;
  place-items: center;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 12%, var(--vp-c-bg));
  font-size: 14px;
  font-weight: 900;
}

.period-comparison div {
  display: grid;
  min-width: 0;
  gap: 1px;
}

.period-comparison strong,
.period-comparison small {
  overflow: hidden;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.period-comparison strong {
  font-size: 11.5px;
}

.period-comparison small {
  color: var(--vp-c-text-3);
  font-size: 10px;
}

.period-comparison.is-negative {
  color: #b75871;
}

.period-comparison.is-neutral {
  color: var(--vp-c-text-2);
}

.status-chip,
.range-badge,
.chart-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--stats-accent) 24%, var(--vp-c-border));
  border-radius: 999px;
  color: var(--stats-accent);
  background: color-mix(in srgb, var(--stats-accent) 9%, var(--vp-c-bg));
  font-size: 11px;
  font-weight: 800;
}

.status-chip {
  gap: 7px;
  max-width: 100%;
  padding: 6px 11px;
}

.status-chip i,
.update-line i {
  display: inline-block;
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
  background: var(--stats-accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--stats-accent) 15%, transparent);
}

.total-panel > p {
  max-width: 330px;
  margin: 14px auto 0;
  color: var(--vp-c-text-2);
  font-size: 12.5px;
  line-height: 1.7;
}

.panel-heading,
.filter-heading,
.chart-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.icon-button {
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  flex: none;
  border: 1px solid var(--vp-c-border);
  border-radius: 9px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  font: inherit;
  font-size: 20px;
  cursor: pointer;
}

.icon-button:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.icon-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.icon-button .spinning {
  animation: spin 0.9s linear infinite;
}

.insight-grid {
  display: grid;
  margin-top: 23px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
}

.insight-card {
  display: grid;
  min-width: 0;
  grid-template-columns: 40px minmax(0, 1fr);
  gap: 11px;
  padding: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.insight-card:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 35%, var(--vp-c-border));
  transform: translateY(-2px);
}

.insight-icon {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 11px;
  color: var(--stats-brand);
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--stats-brand) 16%, var(--vp-c-bg)), var(--vp-c-bg));
  font-size: 18px;
  font-weight: 800;
}

.insight-card:nth-child(2) .insight-icon {
  color: var(--stats-accent);
  background: linear-gradient(145deg, color-mix(in srgb, var(--stats-accent) 16%, var(--vp-c-bg)), var(--vp-c-bg));
}

.insight-card:nth-child(3) .insight-icon {
  color: var(--stats-purple);
  background: linear-gradient(145deg, color-mix(in srgb, var(--stats-purple) 16%, var(--vp-c-bg)), var(--vp-c-bg));
}

.insight-card:nth-child(4) .insight-icon {
  color: var(--stats-warning);
  background: linear-gradient(145deg, color-mix(in srgb, var(--stats-warning) 16%, var(--vp-c-bg)), var(--vp-c-bg));
}

.insight-card div {
  min-width: 0;
}

.insight-card div > span,
.insight-card small {
  display: block;
  color: var(--vp-c-text-3);
  font-size: 10.5px;
  line-height: 1.4;
}

.insight-card strong {
  display: block;
  overflow: hidden;
  margin: 3px 0;
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.update-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 15px;
  padding-top: 14px;
  border-top: 1px dashed var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-size: 10.5px;
}

.update-line > span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--stats-accent);
  font-weight: 750;
}

.update-line > span:first-child.is-error {
  color: var(--stats-warning);
}

.update-line > span:first-child.is-error i {
  background: var(--stats-warning);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--stats-warning) 15%, transparent);
}

.update-line > span:first-child.is-loading i {
  animation: pulse 1.1s ease-in-out infinite;
}

.filter-card,
.chart-card,
.loading-state,
.error-state {
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  background: var(--vp-c-bg);
  box-shadow: 0 14px 38px color-mix(in srgb, var(--vp-c-brand-1) 7%, transparent);
}

.filter-card {
  margin-top: 22px;
  padding: 20px 22px;
  background:
    linear-gradient(120deg, color-mix(in srgb, var(--vp-c-brand-soft) 28%, transparent), transparent 35%),
    var(--vp-c-bg);
}

.range-badge,
.chart-badge {
  padding: 5px 10px;
}

.filter-controls {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-top: 17px;
}

.period-switch {
  display: inline-grid;
  flex: none;
  padding: 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 11px;
  background: var(--vp-c-bg-soft);
  grid-template-columns: repeat(4, minmax(64px, 1fr));
}

.period-switch button,
.query-button,
.inline-notice button,
.secondary-button {
  border: 0;
  font: inherit;
  cursor: pointer;
}

.period-switch button {
  min-height: 35px;
  padding: 7px 11px;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  background: transparent;
  font-size: 12px;
  font-weight: 750;
  transition: color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.period-switch button:hover:not(:disabled) {
  color: var(--vp-c-brand-1);
}

.period-switch button.active {
  color: #fff;
  background: var(--vp-c-brand-1);
  box-shadow: 0 6px 15px color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent);
}

.period-switch button:disabled,
.query-button:disabled {
  cursor: wait;
  opacity: 0.62;
}

.date-picker-group {
  display: flex;
  min-width: 0;
  align-items: flex-end;
  gap: 8px;
}

.date-picker-group label {
  display: grid;
  min-width: 0;
  gap: 5px;
}

.date-picker-group label > span {
  color: var(--vp-c-text-3);
  font-size: 10px;
  font-weight: 700;
}

.date-picker-group input {
  width: 142px;
  min-height: 38px;
  padding: 7px 9px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  outline: 0;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  color-scheme: light dark;
  font: inherit;
  font-size: 11.5px;
}

.date-picker-group input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}

.date-separator {
  padding-bottom: 9px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.query-button,
.secondary-button {
  min-height: 38px;
  padding: 8px 15px;
  border-radius: 8px;
  color: #fff;
  background: var(--vp-c-brand-1);
  box-shadow: 0 7px 16px color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
  font-size: 12px;
  font-weight: 800;
}

.query-button:hover:not(:disabled),
.secondary-button:hover {
  background: var(--vp-c-brand-2);
}

.inline-notice {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--stats-warning) 28%, var(--vp-c-border));
  border-radius: 11px;
  background: color-mix(in srgb, var(--stats-warning) 8%, var(--vp-c-bg));
}

.inline-notice > span {
  display: grid;
  width: 26px;
  height: 26px;
  flex: none;
  place-items: center;
  border-radius: 50%;
  color: var(--stats-warning);
  background: color-mix(in srgb, var(--stats-warning) 15%, var(--vp-c-bg));
  font-weight: 900;
}

.inline-notice p {
  flex: 1;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.inline-notice button {
  padding: 5px 9px;
  border-radius: 6px;
  color: var(--stats-warning);
  background: transparent;
  font-size: 11px;
  font-weight: 800;
}

.loading-state,
.error-state {
  margin-top: 22px;
  padding: 28px;
}

.loading-heading {
  display: flex;
  align-items: center;
  gap: 13px;
}

.loading-heading div {
  display: grid;
  gap: 2px;
}

.loading-heading strong {
  font-size: 14px;
}

.loading-heading span:last-child {
  color: var(--vp-c-text-3);
  font-size: 11px;
}

.loading-mark {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

.skeleton-grid {
  display: grid;
  margin-top: 23px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.skeleton-card {
  min-height: 220px;
  padding: 18px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.skeleton-card:first-child {
  min-height: 340px;
  grid-column: 1 / -1;
}

.skeleton-card span,
.skeleton-card i {
  display: block;
  border-radius: 7px;
  background: linear-gradient(90deg, var(--vp-c-bg-alt), var(--vp-c-divider), var(--vp-c-bg-alt));
  background-size: 220% 100%;
  animation: skeleton-wave 1.4s linear infinite;
}

.skeleton-card span {
  width: 34%;
  height: 18px;
}

.skeleton-card i {
  height: 65%;
  margin-top: 24px;
}

.error-state {
  display: flex;
  min-height: 250px;
  align-items: center;
  justify-content: center;
  gap: 22px;
  text-align: left;
}

.error-icon {
  display: grid;
  width: 50px;
  height: 50px;
  flex: none;
  place-items: center;
  border-radius: 50%;
  color: var(--stats-warning);
  background: color-mix(in srgb, var(--stats-warning) 13%, var(--vp-c-bg));
  font-size: 23px;
  font-weight: 900;
}

.error-state p {
  max-width: 480px;
  margin: 9px 0 0;
  color: var(--vp-c-text-2);
  font-size: 12.5px;
}

.stats-content {
  position: relative;
  transition: opacity 0.2s ease;
}

.stats-content.is-refreshing {
  opacity: 0.58;
  pointer-events: none;
}

.chart-card {
  min-width: 0;
  padding: 23px;
}

.trend-card {
  margin-top: 22px;
  background:
    radial-gradient(circle at 92% 0%, color-mix(in srgb, var(--stats-brand) 9%, transparent), transparent 29%),
    var(--vp-c-bg);
}

.chart-grid {
  display: grid;
  margin-top: 18px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.chart-heading p {
  margin: 7px 0 0;
  color: var(--vp-c-text-3);
  font-size: 11.5px;
  line-height: 1.55;
}

.chart-heading.compact {
  min-height: 67px;
}

.chart-index {
  color: color-mix(in srgb, var(--vp-c-brand-1) 32%, var(--vp-c-text-3));
  font-family: var(--vp-font-family-mono);
  font-size: 27px;
  font-weight: 800;
  line-height: 1;
}

.chart-container {
  position: relative;
  width: 100%;
  margin-top: 18px;
}

.line-chart-height {
  height: 340px;
}

.bar-chart-height {
  height: 440px;
}

.pie-container {
  height: 390px;
}

.empty-chart {
  display: grid;
  min-height: 260px;
  place-items: center;
  margin-top: 18px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  font-size: 12px;
}

.privacy-note {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-top: 20px;
  padding: 17px 19px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 13px;
  background: color-mix(in srgb, var(--vp-c-brand-soft) 38%, var(--vp-c-bg));
}

.privacy-icon {
  display: grid;
  width: 34px;
  height: 34px;
  flex: none;
  place-items: center;
  border-radius: 9px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  font-size: 17px;
  font-weight: 800;
}

.privacy-note strong {
  display: block;
  font-size: 12.5px;
}

.privacy-note p {
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
  font-size: 11.5px;
  line-height: 1.65;
}

button:focus-visible,
input:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

@keyframes orbit-drift {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  50% {
    opacity: 0.35;
    transform: scale(0.72);
  }
}

@keyframes skeleton-wave {
  to {
    background-position: -220% 0;
  }
}

@media (max-width: 960px) {
  .overview-card {
    grid-template-columns: minmax(270px, 0.75fr) minmax(370px, 1.25fr);
  }

  .total-panel,
  .insights-panel {
    padding: 24px;
  }

  .filter-controls {
    align-items: stretch;
    flex-direction: column;
  }

  .period-switch {
    width: 100%;
  }

  .date-picker-group {
    width: 100%;
  }

  .date-picker-group label {
    flex: 1;
  }

  .date-picker-group input {
    width: 100%;
  }
}

@media (max-width: 760px) {
  .overview-card,
  .chart-grid {
    grid-template-columns: 1fr;
  }

  .total-panel {
    border-right: 0;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .line-chart-height {
    height: 300px;
  }

  .bar-chart-height {
    height: 410px;
  }

  .pie-container {
    height: 370px;
  }
}

@media (max-width: 520px) {
  .stats-dashboard {
    margin-top: 1.25rem;
  }

  .overview-card,
  .filter-card,
  .chart-card,
  .loading-state,
  .error-state {
    border-radius: 14px;
  }

  .total-panel,
  .insights-panel,
  .chart-card,
  .loading-state,
  .error-state {
    padding: 19px;
  }

  .total-orbit {
    width: 178px;
    height: 178px;
  }

  .insight-grid {
    grid-template-columns: 1fr;
  }

  .filter-card {
    padding: 17px;
  }

  .filter-heading {
    align-items: center;
  }

  .range-badge {
    max-width: 145px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .period-switch {
    grid-template-columns: repeat(2, 1fr);
  }

  .date-picker-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .date-separator {
    display: none;
  }

  .query-button {
    grid-column: 1 / -1;
  }

  .chart-heading {
    gap: 12px;
  }

  .chart-badge,
  .chart-index {
    display: none;
  }

  .line-chart-height {
    height: 270px;
  }

  .bar-chart-height {
    height: 390px;
  }

  .pie-container {
    height: 350px;
  }

  .update-line {
    align-items: flex-start;
    flex-direction: column;
    gap: 7px;
  }

  .skeleton-grid {
    grid-template-columns: 1fr;
  }

  .skeleton-card:first-child {
    min-height: 280px;
  }

  .skeleton-card:first-child,
  .skeleton-card {
    grid-column: auto;
  }

  .error-state {
    align-items: center;
    flex-direction: column;
    text-align: center;
  }

  .inline-notice {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .inline-notice button {
    margin-left: 38px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit-progress,
  .icon-button .spinning,
  .loading-mark,
  .update-line > span:first-child.is-loading i,
  .skeleton-card span,
  .skeleton-card i {
    animation: none;
  }

  .insight-card {
    transition: none;
  }
}
</style>
