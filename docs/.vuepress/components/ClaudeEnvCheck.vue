<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type Verdict = 'pass' | 'warn' | 'fail' | 'info'
type ScanLevel = 'low' | 'medium' | 'high'
type NetworkStatus = 'loading' | 'ready' | 'error'

interface SignalMeta {
  id: string
  icon: string
  title: string
  weightLabel: string
  description: string
  sameAsClaude?: boolean
}

interface SignalResult {
  id: string
  raw: string
  contribution: number
  verdict: Verdict
  advice: string[]
}

interface ScanResult {
  score: number
  level: ScanLevel
  signals: SignalResult[]
}

interface NetworkInfo {
  ip: string | null
  countryCode: string | null
  region: string | null
  regionCode: string | null
  city: string | null
  timezone: string | null
  latitude: number | null
  longitude: number | null
  postalCode: string | null
  asn: number | null
  asOrganization: string | null
  fraudScore: number | null
  ipType: string
  connectionType: string | null
  isResidential: boolean | null
  isDatacenter: boolean | null
  isSuspectedDatacenter: boolean | null
  isProxy: boolean | null
  isVpn: boolean | null
  isTor: boolean | null
  isMobile: boolean | null
  riskStatus: 'ready' | 'not-configured' | 'unavailable'
  riskMessage?: string
}

interface UserAgentDataLike {
  brands?: Array<{ brand: string; version?: string }>
  platform?: string
}

const NETWORK_API_URL = '/api/claude-env-check'
const SCORE_CIRCUMFERENCE = 2 * Math.PI * 52

const simplifiedChineseFonts = [
  'Microsoft YaHei',
  'Microsoft JhengHei',
  'PingFang SC',
  'Hiragino Sans GB',
  'STHeiti',
  'STSong',
  'SimSun',
  'SimHei',
  'Noto Sans CJK SC',
  'Source Han Sans SC',
  'WenQuanYi Micro Hei',
]

const traditionalChineseFonts = [
  'PingFang TC',
  'Heiti TC',
  'Hiragino Sans CNS',
  'Noto Sans CJK TC',
  'Source Han Sans TC',
  'MingLiU',
  'PMingLiU',
]

const vendorFonts = [
  'MiSans',
  'HarmonyOS Sans',
  'OPPO Sans',
  'vivo Sans',
  'Honor Sans',
  'Alibaba PuHuiTi',
  'WPS Fangzheng',
  'FZLanTingHeiS',
]

const domesticBrowserPatterns: Array<[string, string]> = [
  ['micromessenger', '微信内置浏览器'],
  ['qqbrowser', 'QQ 浏览器'],
  ['mqqbrowser', 'QQ 内置浏览器'],
  ['quark', '夸克浏览器'],
  ['ucbrowser', 'UC 浏览器'],
  ['ucweb', 'UC 浏览器'],
  ['baiduboxapp', '百度 App'],
  ['baidubrowser', '百度浏览器'],
  ['miuibrowser', '小米浏览器'],
  ['mibrowser', '小米浏览器'],
  ['huaweibrowser', '华为浏览器'],
  ['heytapbrowser', 'OPPO 浏览器'],
  ['oppobrowser', 'OPPO 浏览器'],
  ['vivobrowser', 'vivo 浏览器'],
  ['360se', '360 浏览器'],
  ['360ee', '360 浏览器'],
  ['qihoobrowser', '360 浏览器'],
  ['sogoumobilebrowser', '搜狗浏览器'],
  ['2345browser', '2345 浏览器'],
]

const domesticDevicePatterns: Array<[string, string]> = [
  ['harmonyos', 'HarmonyOS'],
  ['huawei', 'Huawei'],
  ['honor', 'Honor'],
  ['xiaomi', 'Xiaomi'],
  ['redmi', 'Redmi'],
  ['oppo', 'OPPO'],
  ['vivo', 'vivo'],
  ['realme', 'realme'],
  ['oneplus', 'OnePlus'],
  ['miui', 'MIUI'],
]

const signalMeta: SignalMeta[] = [
  {
    id: 'timezone',
    icon: '◷',
    title: '系统时区',
    weightLabel: '权重 26',
    sameAsClaude: true,
    description: '读取浏览器继承的系统时区，并与中国大陆、港澳台及其他亚洲时区进行比对。',
  },
  {
    id: 'language',
    icon: '文',
    title: '浏览器语言',
    weightLabel: '权重 20',
    description: '检查 navigator.languages；中文位于首选语言时会产生更明显的区域特征。',
  },
  {
    id: 'languageVariant',
    icon: '译',
    title: '语言文字特征',
    weightLabel: '权重 12',
    description: '识别 zh-CN、zh-Hans、zh-Hant、zh-HK 等中文语言变体。',
  },
  {
    id: 'chineseFonts',
    icon: '字',
    title: '字体地区特征',
    weightLabel: '权重 16',
    description: '通过 Canvas 文本宽度差异探测常见简繁体中文字体。',
  },
  {
    id: 'vendorFonts',
    icon: 'Aa',
    title: '厂商字体异常',
    weightLabel: '权重 10',
    description: '检测 MiSans、HarmonyOS Sans、OPPO Sans、vivo Sans 等厂商字体。',
  },
  {
    id: 'domesticBrowser',
    icon: '◎',
    title: '浏览器地区特征',
    weightLabel: '权重 8',
    description: '检查 UA 与 UA-CH 品牌中是否包含常见国内浏览器或内置浏览器标识。',
  },
  {
    id: 'domesticDevice',
    icon: '▣',
    title: '设备地区特征',
    weightLabel: '权重 6',
    description: '识别 HarmonyOS、Huawei、Honor、Xiaomi、OPPO、vivo 等设备线索。',
  },
  {
    id: 'intlLocale',
    icon: '⌘',
    title: 'Intl 区域设置',
    weightLabel: '权重 6',
    description: '读取浏览器用于日期和数字格式化的 locale。',
  },
  {
    id: 'timezoneOffset',
    icon: '±',
    title: '时区偏移',
    weightLabel: '权重 8',
    description: '检查当前时间相对 UTC 的偏移，UTC+8 会增加区域一致性信号。',
  },
  {
    id: 'emojiStyle',
    icon: '☺',
    title: 'Emoji 风格推测',
    weightLabel: '弱信号',
    description: '根据浏览器 UA 推测操作系统的 Emoji 渲染体系，只作为低权重辅助信息。',
  },
  {
    id: 'browser',
    icon: '⌁',
    title: '浏览器/应用环境',
    weightLabel: '信息项',
    description: '展示浏览器与操作系统，不直接计入环境风险分。',
  },
  {
    id: 'device',
    icon: '◇',
    title: '设备/系统线索',
    weightLabel: '信息项',
    description: '展示设备类型与系统线索，不直接计入环境风险分。',
  },
]

const faqItems = [
  {
    question: '这个风险分是 Claude 的官方判定吗？',
    answer: '不是。它是根据浏览器可见的时区、语言、字体和设备线索建立的启发式分数，只适合用于发现环境中明显不一致的项目。',
  },
  {
    question: '为什么网页检测结果可能和 Claude Code 不一样？',
    answer: '网页运行在浏览器沙箱内，无法读取主机名、系统级配置或 Claude 客户端内部状态。它只能检测浏览器公开的部分信号。',
  },
  {
    question: '修改浏览器语言后为什么仍然有中文字体？',
    answer: '字体通常由操作系统安装，修改浏览器语言不会删除系统字体。字体命中也很常见，不建议为了一个单项分数破坏日常系统环境。',
  },
  {
    question: '检测数据会发送到服务器吗？',
    answer: '时区、语言、字体、浏览器与设备信号只在本地计算。网络检测会把当前出口 IP 交给本站 Cloudflare Worker；配置 IP 风险服务后，Worker 还会把该 IP 发送给风控数据提供方。',
  },
]

const scanState = ref<'idle' | 'scanning' | 'done'>('idle')
const scanResult = ref<ScanResult | null>(null)
const displayedScore = ref(0)
const openSignalId = ref<string | null>(null)
const openFaqIndex = ref<number | null>(null)
const networkStatus = ref<NetworkStatus>('loading')
const networkInfo = ref<NetworkInfo | null>(null)
const networkError = ref('')

let scanTicker: ReturnType<typeof setInterval> | undefined
let scoreAnimationFrame: number | undefined
let networkController: AbortController | undefined

const signalResults = computed<Record<string, SignalResult>>(() =>
  Object.fromEntries((scanResult.value?.signals ?? []).map(item => [item.id, item])),
)

const currentScore = computed(() =>
  scanState.value === 'idle' ? 0 : displayedScore.value,
)

const scoreOffset = computed(() =>
  SCORE_CIRCUMFERENCE * (1 - currentScore.value / 100),
)

const scoreStatus = computed(() => {
  if (scanState.value === 'scanning') {
    return { label: '正在检测', className: 'is-scanning' }
  }
  if (!scanResult.value) {
    return { label: '等待检测', className: 'is-idle' }
  }
  if (scanResult.value.level === 'low') {
    return { label: '低风险环境', className: 'is-safe' }
  }
  if (scanResult.value.level === 'medium') {
    return { label: '中等风险环境', className: 'is-warning' }
  }
  return { label: '高风险环境', className: 'is-danger' }
})

const networkLocation = computed(() => {
  const info = networkInfo.value
  if (!info) return '—'

  const parts = [
    countryName(info.countryCode),
    info.region,
    info.city,
  ].filter(Boolean)

  return parts.join(' · ') || '—'
})

const networkLocalTime = computed(() => {
  const timezone = networkInfo.value?.timezone
  if (!timezone) return '—'

  try {
    return new Intl.DateTimeFormat('zh-CN', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date())
  }
  catch {
    return '—'
  }
})

const networkRisk = computed(() => {
  const score = networkInfo.value?.fraudScore

  if (typeof score !== 'number') {
    if (networkInfo.value?.riskStatus === 'not-configured') {
      return { score: null, label: '待接入风险库', className: 'is-unknown' }
    }
    return { score: null, label: '风险数据不可用', className: 'is-unknown' }
  }
  if (score < 40) {
    return { score, label: '较低', className: 'is-safe' }
  }
  if (score <= 70) {
    return { score, label: '一般', className: 'is-warning' }
  }
  return { score, label: '较高', className: 'is-danger' }
})

const proxyLike = computed(() => {
  const info = networkInfo.value
  if (!info) return null
  if (info.isProxy === null && info.isVpn === null && info.isTor === null) return null
  return Boolean(info.isProxy || info.isVpn || info.isTor)
})

function clamp(value: number) {
  return Math.max(0, Math.min(1, value))
}

function makeSignal(
  id: string,
  raw: string,
  risk: number,
  weight: number,
  advice: string[],
  forcedVerdict?: Verdict,
): SignalResult {
  const normalizedRisk = clamp(risk)
  return {
    id,
    raw,
    contribution: Math.round(normalizedRisk * weight),
    verdict: forcedVerdict ?? (normalizedRisk >= 0.7 ? 'fail' : normalizedRisk > 0 ? 'warn' : 'pass'),
    advice,
  }
}

function findPattern(value: string, patterns: Array<[string, string]>) {
  const normalizedValue = value.toLowerCase()
  return patterns.find(([pattern]) => normalizedValue.includes(pattern.toLowerCase()))?.[1] ?? ''
}

function detectFonts(fonts: string[]) {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) return []

    const sample = '中文字体检测 ABCabc012'
    const genericFamilies = ['monospace', 'sans-serif', 'serif']

    return fonts.filter(fontName =>
      genericFamilies.some((genericFamily) => {
        context.font = `72px ${genericFamily}`
        const baselineWidth = context.measureText(sample).width
        context.font = `72px "${fontName}", ${genericFamily}`
        return Math.abs(context.measureText(sample).width - baselineWidth) > 0.5
      }),
    )
  }
  catch {
    return []
  }
}

function detectBrowser(userAgent: string) {
  if (/Edg\//.test(userAgent)) return 'Microsoft Edge'
  if (/OPR\//.test(userAgent)) return 'Opera'
  if (/YaBrowser/i.test(userAgent)) return 'Yandex Browser'
  if (/MicroMessenger/i.test(userAgent)) return '微信内置浏览器'
  if (/Firefox\//.test(userAgent)) return 'Firefox'
  if (/Chrome\//.test(userAgent) && !/Chromium/.test(userAgent)) return 'Chrome'
  if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) return 'Safari'
  return '未知浏览器'
}

function detectOperatingSystem(userAgent: string, platform: string) {
  const source = `${userAgent} ${platform}`
  if (/harmonyos/i.test(source)) return 'HarmonyOS'
  if (/android/i.test(source)) return 'Android'
  if (/iphone|ipad|ios/i.test(source)) return 'iOS'
  if (/mac os|macintosh|macintel/i.test(source)) return 'macOS'
  if (/windows nt|win32|win64/i.test(source)) return 'Windows'
  if (/linux/i.test(source)) return 'Linux'
  return platform || '未知系统'
}

function detectDevice(userAgent: string, platform: string) {
  const operatingSystem = detectOperatingSystem(userAgent, platform)
  const source = `${userAgent} ${platform}`

  if (/iphone/i.test(source)) return `iPhone / ${operatingSystem}`
  if (/ipad/i.test(source)) return `iPad / ${operatingSystem}`
  if (/android/i.test(source)) return `Android 设备 / ${operatingSystem}`
  if (/macintosh|mac os|macintel/i.test(source)) return `Mac / ${operatingSystem}`
  if (/windows/i.test(source)) return `Windows PC / ${operatingSystem}`
  if (/linux/i.test(source)) return `Linux 设备 / ${operatingSystem}`
  return operatingSystem
}

function collectSignals(): ScanResult {
  const nav = navigator as Navigator & { userAgentData?: UserAgentDataLike }
  const userAgent = nav.userAgent || ''
  const brands = nav.userAgentData?.brands?.map(item => item.brand).join(' / ') ?? ''
  const platform = nav.userAgentData?.platform || nav.platform || ''
  const languages = nav.languages?.length
    ? [...nav.languages]
    : [nav.language].filter(Boolean)
  const primaryLanguage = nav.language || languages[0] || 'Unknown'
  const languageList = languages.join(', ') || primaryLanguage
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown'
  const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale || 'Unknown'
  const timezoneOffset = -new Date().getTimezoneOffset() / 60
  const browserSource = `${userAgent.toLowerCase()} ${brands.toLowerCase()}`
  const deviceSource = `${userAgent.toLowerCase()} ${platform.toLowerCase()}`
  const results: SignalResult[] = []

  const mainlandTimezones = [
    'Asia/Shanghai',
    'Asia/Urumqi',
    'Asia/Chongqing',
    'Asia/Harbin',
    'Asia/Kashgar',
  ]
  const nearbyChineseTimezones = ['Asia/Hong_Kong', 'Asia/Macau', 'Asia/Taipei']
  const timezoneRisk = mainlandTimezones.includes(timezone)
    ? 1
    : nearbyChineseTimezones.includes(timezone)
      ? 0.6
      : timezone.toLowerCase().includes('asia')
        ? 0.35
        : 0

  results.push(makeSignal(
    'timezone',
    timezone,
    timezoneRisk,
    26,
    timezoneRisk >= 0.7
      ? ['检测到中国大陆或相近时区。若账号地区与此不一致，请优先检查系统时区和常用网络出口是否匹配。']
      : timezoneRisk > 0
        ? ['检测到亚洲时区。亚洲时区本身并不等于异常，但应与账号资料和长期网络地区保持一致。']
        : ['当前系统时区未命中中文地区特征，无需单独处理。'],
  ))

  const normalizedLanguages = languageList.toLowerCase()
  const primaryChinese = /^zh/i.test(primaryLanguage)
  const containsChinese = /(^|[, ]+)zh(?:-|,|$)|-cn\b/i.test(normalizedLanguages)

  results.push(makeSignal(
    'language',
    `首选: ${primaryLanguage}｜完整: [${languageList}]`,
    primaryChinese ? 1 : containsChinese ? 0.5 : 0,
    20,
    primaryChinese
      ? ['浏览器首选语言是中文。如需降低区域差异，可将账号常用语言移至首位。']
      : containsChinese
        ? ['语言列表中包含中文。只要首选语言和实际使用习惯一致，通常不需要强行删除。']
        : ['浏览器首选语言未命中中文地区特征。'],
  ))

  const languageVariant = languages.some(language => /zh-(tw|hk|mo)|zh-hant/i.test(language))
    ? '繁体中文'
    : languages.some(language => /zh-cn|zh-sg|zh-hans|^zh$/i.test(language))
      ? '简体中文'
      : ''

  results.push(makeSignal(
    'languageVariant',
    languageVariant || '未检测到关键中文语言变体',
    languageVariant ? 1 : 0,
    12,
    languageVariant
      ? [`检测到${languageVariant}语言变体。请确认它是否符合账号资料与日常使用环境。`]
      : ['未检测到关键中文语言变体。'],
  ))

  const detectedSimplifiedFonts = detectFonts(simplifiedChineseFonts)
  const detectedTraditionalFonts = detectFonts(traditionalChineseFonts)
  const chineseFontRisk = detectedSimplifiedFonts.length
    ? Math.min(1, 0.75 + detectedSimplifiedFonts.length * 0.08)
    : detectedTraditionalFonts.length
      ? 0.5
      : 0

  results.push(makeSignal(
    'chineseFonts',
    detectedSimplifiedFonts.length
      ? `简体字体: ${detectedSimplifiedFonts.join(' / ')}`
      : detectedTraditionalFonts.length
        ? `繁体字体: ${detectedTraditionalFonts.join(' / ')}`
        : '未检测到关键中文字体',
    chineseFontRisk,
    16,
    chineseFontRisk > 0
      ? ['检测到中文字体。系统自带字体很常见，这一项应与时区、语言等信号一起判断，不建议仅为降低分数删除系统字体。']
      : ['未检测到列表中的典型中文字体。'],
  ))

  const detectedVendorFonts = detectFonts(vendorFonts)
  const vendorFontRisk = detectedVendorFonts.length >= 2 ? 1 : detectedVendorFonts.length === 1 ? 0.8 : 0

  results.push(makeSignal(
    'vendorFonts',
    detectedVendorFonts.length
      ? `厂商字体: ${detectedVendorFonts.join(' / ')}`
      : '未检测到厂商字体',
    vendorFontRisk,
    10,
    detectedVendorFonts.length
      ? ['检测到国内设备厂商字体。共享工作环境可考虑使用独立浏览器配置，但字体命中本身不是账号异常证据。']
      : ['未检测到明显的国内厂商字体。'],
  ))

  const domesticBrowser = findPattern(browserSource, domesticBrowserPatterns)

  results.push(makeSignal(
    'domesticBrowser',
    domesticBrowser || detectBrowser(userAgent),
    domesticBrowser ? 1 : 0,
    8,
    domesticBrowser
      ? ['检测到国内浏览器或内置 WebView 特征。重要账号更适合使用长期固定、更新及时的主流浏览器配置。']
      : ['未检测到明显的国内浏览器特征。'],
  ))

  const domesticDevice = findPattern(deviceSource, domesticDevicePatterns)
  const domesticDeviceRisk = domesticDevice === 'HarmonyOS' ? 1 : domesticDevice ? 0.7 : 0

  results.push(makeSignal(
    'domesticDevice',
    domesticDevice || '未检测到关键设备厂商特征',
    domesticDeviceRisk,
    6,
    domesticDevice
      ? ['检测到国内设备或系统厂商线索。请结合浏览器、语言和网络出口综合判断。']
      : ['未检测到明显的国内设备厂商特征。'],
  ))

  const localeRisk = /zh-cn|zh-hans|^zh$/i.test(intlLocale)
    ? 1
    : /^zh/i.test(intlLocale)
      ? 0.5
      : 0

  results.push(makeSignal(
    'intlLocale',
    intlLocale,
    localeRisk,
    6,
    localeRisk > 0
      ? ['Intl 区域格式包含中文。只有当它与账号地区明显冲突时，才需要调整系统区域格式。']
      : ['Intl 区域格式未命中中文特征。'],
  ))

  const offsetRisk = timezoneOffset === 8
    ? 1
    : timezoneOffset >= 7 && timezoneOffset <= 9
      ? 0.5
      : 0

  results.push(makeSignal(
    'timezoneOffset',
    `UTC${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`,
    offsetRisk,
    8,
    timezoneOffset === 8
      ? ['当前偏移为 UTC+8。请确认系统时区、IP 时区和账号常用地区是否一致。']
      : offsetRisk > 0
        ? ['检测到东亚或东南亚相近时间偏移，建议结合系统时区名称判断。']
        : ['当前时区偏移未命中 UTC+7 至 UTC+9。'],
  ))

  const emojiStyle = /iphone|ipad|mac os|macintosh/i.test(userAgent)
    ? 'Apple Emoji 风格'
    : /android|harmonyos/i.test(userAgent)
      ? 'Android / 厂商 Emoji 风格'
      : /windows/i.test(userAgent)
        ? 'Windows Emoji 风格'
        : '未知 Emoji 风格'
  const emojiRisk = /android|harmonyos|windows/i.test(userAgent)
    ? 0.4
    : /iphone|ipad|mac os|macintosh/i.test(userAgent)
      ? 0.2
      : 0

  results.push(makeSignal(
    'emojiStyle',
    emojiStyle,
    emojiRisk,
    4,
    ['此项只根据 UA 推测操作系统，并未读取或上传 Emoji 图像，通常无需单独处理。'],
    emojiRisk > 0 ? 'warn' : 'pass',
  ))

  const browser = detectBrowser(userAgent)
  const operatingSystem = detectOperatingSystem(userAgent, platform)

  results.push(makeSignal(
    'browser',
    `${browser} / ${operatingSystem}`,
    0,
    0,
    ['该项仅展示浏览器与系统环境，不直接计入风险分。'],
    'info',
  ))

  results.push(makeSignal(
    'device',
    detectDevice(userAgent, platform),
    0,
    0,
    ['该项仅展示设备线索，不直接计入风险分。'],
    'info',
  ))

  const score = Math.min(100, results.reduce((total, item) => total + item.contribution, 0))
  const level: ScanLevel = score > 60 ? 'high' : score > 30 ? 'medium' : 'low'

  return { score, level, signals: results }
}

function delay(milliseconds: number) {
  return new Promise(resolve => window.setTimeout(resolve, milliseconds))
}

async function runScan() {
  if (scanState.value === 'scanning') return

  scanState.value = 'scanning'
  scanResult.value = null
  displayedScore.value = 0
  openSignalId.value = null

  if (scanTicker) clearInterval(scanTicker)
  scanTicker = window.setInterval(() => {
    displayedScore.value = Math.floor(Math.random() * 58) + 18
  }, 85)

  await delay(900)
  const result = collectSignals()

  if (scanTicker) clearInterval(scanTicker)
  scanTicker = undefined
  scanResult.value = result
  scanState.value = 'done'

  animateScore(result.score)
}

function animateScore(target: number) {
  if (scoreAnimationFrame) cancelAnimationFrame(scoreAnimationFrame)

  const startedAt = performance.now()
  const duration = 650
  displayedScore.value = 0

  const update = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / duration)
    const easedProgress = 1 - (1 - progress) ** 3
    displayedScore.value = Math.round(target * easedProgress)

    if (progress < 1) {
      scoreAnimationFrame = requestAnimationFrame(update)
    }
  }

  scoreAnimationFrame = requestAnimationFrame(update)
}

function countryName(countryCode: string | null) {
  if (!countryCode) return ''

  try {
    return new Intl.DisplayNames(['zh-CN'], { type: 'region' }).of(countryCode) || countryCode
  }
  catch {
    return countryCode
  }
}

function formatAsn(info: NetworkInfo | null) {
  if (!info) return '—'
  const parts = [
    info.asn ? `AS${info.asn}` : '',
    info.asOrganization || '',
  ].filter(Boolean)
  return parts.join(' · ') || '—'
}

function formatCoordinates(info: NetworkInfo | null) {
  if (!info || typeof info.latitude !== 'number' || typeof info.longitude !== 'number') {
    return '—'
  }
  return `${info.latitude.toFixed(3)}, ${info.longitude.toFixed(3)}`
}

async function loadNetwork() {
  networkController?.abort()
  networkController = new AbortController()
  networkStatus.value = 'loading'
  networkError.value = ''

  const timeout = window.setTimeout(() => networkController?.abort(), 8000)

  try {
    const response = await fetch(NETWORK_API_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: networkController.signal,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    networkInfo.value = await response.json() as NetworkInfo
    networkStatus.value = 'ready'
  }
  catch {
    networkInfo.value = null
    networkStatus.value = 'error'
    networkError.value = '网络检测服务暂时不可用，请确认 Worker 已绑定到本站接口路径后重试。'
  }
  finally {
    window.clearTimeout(timeout)
  }
}

function toggleSignal(id: string) {
  openSignalId.value = openSignalId.value === id ? null : id
}

function verdictLabel(verdict: Verdict | undefined) {
  if (verdict === 'fail') return '需关注'
  if (verdict === 'warn') return '提示项'
  if (verdict === 'pass') return '未命中'
  if (verdict === 'info') return '信息项'
  return '待检测'
}

onMounted(() => {
  loadNetwork()
})

onBeforeUnmount(() => {
  if (scanTicker) clearInterval(scanTicker)
  if (scoreAnimationFrame) cancelAnimationFrame(scoreAnimationFrame)
  networkController?.abort()
})
</script>

<template>
  <section class="env-check-tool" aria-label="Claude 环境自检工具">
    <div class="overview-card">
      <section class="score-panel" aria-labelledby="environment-score-title">
        <span class="eyebrow">浏览器环境</span>
        <h2 id="environment-score-title">本地环境风险</h2>

        <div class="score-ring" :class="scoreStatus.className">
          <svg viewBox="0 0 128 128" aria-hidden="true">
            <circle class="score-track" cx="64" cy="64" r="52" />
            <circle
              class="score-progress"
              cx="64"
              cy="64"
              r="52"
              :stroke-dasharray="SCORE_CIRCUMFERENCE"
              :stroke-dashoffset="scoreOffset"
            />
          </svg>
          <div class="score-value" aria-live="polite">
            <strong>{{ currentScore }}</strong>
            <span>/ 100</span>
          </div>
        </div>

        <span class="status-chip" :class="scoreStatus.className">
          {{ scoreStatus.label }}
        </span>

        <p>综合时区、语言、字体、区域格式和设备线索，结果只在当前浏览器中计算。</p>

        <button
          type="button"
          class="primary-button"
          :disabled="scanState === 'scanning'"
          @click="runScan"
        >
          <span aria-hidden="true">{{ scanState === 'scanning' ? '◌' : '✓' }}</span>
          {{ scanState === 'scanning' ? '正在检测' : scanResult ? '重新检测' : '开始检测' }}
        </button>
      </section>

      <section class="network-panel" aria-labelledby="network-panel-title">
        <div class="panel-heading">
          <div>
            <span class="eyebrow">Cloudflare Worker</span>
            <h2 id="network-panel-title">当前网络出口</h2>
          </div>
          <button
            type="button"
            class="icon-button"
            :disabled="networkStatus === 'loading'"
            aria-label="重新检测网络"
            title="重新检测网络"
            @click="loadNetwork"
          >
            ↻
          </button>
        </div>

        <div v-if="networkStatus === 'loading'" class="network-loading" aria-live="polite">
          <div v-for="index in 7" :key="index" class="skeleton-row">
            <span />
            <span />
          </div>
          <div class="skeleton-block" />
        </div>

        <div v-else-if="networkStatus === 'error'" class="network-error" role="alert">
          <span aria-hidden="true">!</span>
          <p>{{ networkError }}</p>
          <button type="button" class="secondary-button" @click="loadNetwork">重新请求</button>
        </div>

        <template v-else>
          <dl class="network-details">
            <div>
              <dt>位置</dt>
              <dd>{{ networkLocation }}</dd>
            </div>
            <div>
              <dt>IP 地址</dt>
              <dd class="is-mono">{{ networkInfo?.ip || '—' }}</dd>
            </div>
            <div>
              <dt>网络组织</dt>
              <dd>{{ formatAsn(networkInfo) }}</dd>
            </div>
            <div>
              <dt>IP 时区</dt>
              <dd class="is-mono">{{ networkInfo?.timezone || '—' }}</dd>
            </div>
            <div>
              <dt>当地时间</dt>
              <dd class="is-mono">{{ networkLocalTime }}</dd>
            </div>
            <div>
              <dt>邮编</dt>
              <dd class="is-mono">{{ networkInfo?.postalCode || '—' }}</dd>
            </div>
            <div>
              <dt>坐标</dt>
              <dd class="is-mono">{{ formatCoordinates(networkInfo) }}</dd>
            </div>
          </dl>

          <div class="network-risk-card">
            <div class="ip-type-row">
              <span class="risk-card-label">IP 类型</span>
              <div class="ip-type-chips">
                <span
                  :class="{
                    active: networkInfo?.isResidential === true,
                    unknown: networkInfo?.isResidential === null,
                  }"
                >住宅</span>
                <span
                  :class="{
                    active: networkInfo?.isDatacenter === true || networkInfo?.isSuspectedDatacenter === true,
                    warning: networkInfo?.isSuspectedDatacenter === true && networkInfo?.isDatacenter !== true,
                    unknown: networkInfo?.isDatacenter === null && networkInfo?.isSuspectedDatacenter === null,
                  }"
                >机房</span>
                <span
                  :class="{
                    active: proxyLike === true,
                    danger: proxyLike === true,
                    unknown: proxyLike === null,
                  }"
                >代理</span>
              </div>
            </div>

            <div class="risk-score-row">
              <span class="risk-card-label">IP 风险</span>
              <div class="risk-number" :class="networkRisk.className">
                <strong>{{ networkRisk.score ?? '—' }}</strong>
                <span>{{ networkRisk.score === null ? '' : '/ 100' }}</span>
                <em>{{ networkRisk.label }}</em>
              </div>
            </div>

            <div
              class="risk-meter"
              :class="networkRisk.className"
              role="meter"
              aria-label="IP 风险分"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-valuenow="networkRisk.score ?? undefined"
            >
              <span :style="{ width: `${networkRisk.score ?? 0}%` }" />
            </div>

            <p v-if="networkInfo?.riskStatus !== 'ready'" class="risk-note">
              {{
                networkInfo?.riskStatus === 'not-configured'
                  ? 'Worker 已返回 Cloudflare 地理信息；设置 IPQS_API_KEY 后可显示 VPN、代理和风险分。'
                  : networkInfo?.riskMessage || '第三方风险数据暂时不可用，地理信息仍可参考。'
              }}
            </p>
          </div>
        </template>
      </section>
    </div>

    <section class="signals-section" aria-labelledby="signals-title">
      <div class="section-heading">
        <div>
          <span class="eyebrow">本地检测</span>
          <h2 id="signals-title">检测项目与建议</h2>
        </div>
        <p>展开项目可查看本机采集值、分数贡献和对应建议。</p>
      </div>

      <div class="signal-list">
        <article
          v-for="item in signalMeta"
          :key="item.id"
          class="signal-card"
          :class="signalResults[item.id]?.verdict ? `is-${signalResults[item.id].verdict}` : 'is-pending'"
        >
          <button
            type="button"
            class="signal-summary"
            :aria-expanded="openSignalId === item.id"
            @click="toggleSignal(item.id)"
          >
            <span class="signal-icon" aria-hidden="true">{{ item.icon }}</span>
            <span class="signal-copy">
              <span class="signal-title-row">
                <strong>{{ item.title }}</strong>
                <span class="weight-chip">{{ item.weightLabel }}</span>
                <span v-if="item.sameAsClaude" class="same-signal-chip">同类系统信号</span>
                <span
                  class="verdict-chip"
                  :class="signalResults[item.id]?.verdict ? `is-${signalResults[item.id].verdict}` : 'is-pending'"
                >
                  {{ verdictLabel(signalResults[item.id]?.verdict) }}
                </span>
              </span>
              <span class="signal-description">{{ item.description }}</span>
              <span v-if="signalResults[item.id]" class="signal-raw">
                当前值：<b>{{ signalResults[item.id].raw }}</b>
                <em v-if="signalResults[item.id].contribution > 0">
                  +{{ signalResults[item.id].contribution }}
                </em>
              </span>
            </span>
            <span class="expand-icon" aria-hidden="true">{{ openSignalId === item.id ? '−' : '+' }}</span>
          </button>

          <div v-if="openSignalId === item.id" class="signal-advice">
            <template v-if="signalResults[item.id]">
              <strong>{{ signalResults[item.id].verdict === 'fail' ? '优先检查' : signalResults[item.id].verdict === 'warn' ? '辅助判断' : '检测说明' }}</strong>
              <ul>
                <li v-for="advice in signalResults[item.id].advice" :key="advice">{{ advice }}</li>
              </ul>
            </template>
            <p v-else>完成一次本地检测后，这里会显示当前值和对应建议。</p>
          </div>
        </article>
      </div>
    </section>

    <section class="principle-section" aria-labelledby="principle-title">
      <div>
        <span class="eyebrow">检测边界</span>
        <h2 id="principle-title">浏览器能看到什么</h2>
        <p>网页可以读取浏览器继承的时区、语言、区域格式、UA 和部分字体特征，但无法读取 Claude Code 能访问的全部系统信息，也无法得知 Anthropic 的真实判定规则。</p>
      </div>
      <div>
        <span class="eyebrow">评分方法</span>
        <h2>为什么只能作为参考</h2>
        <p>本页把多个弱信号组合为 0–100 分。字体和 UA 检测可能受隐私浏览器、兼容模式及系统更新影响，因此分数用于定位冲突项，不用于预测账号结果。</p>
      </div>
    </section>

    <section class="faq-section" aria-labelledby="faq-title">
      <div class="section-heading">
        <div>
          <span class="eyebrow">常见问题</span>
          <h2 id="faq-title">检测前需要知道</h2>
        </div>
      </div>

      <div class="faq-list">
        <article v-for="(item, index) in faqItems" :key="item.question">
          <button
            type="button"
            :aria-expanded="openFaqIndex === index"
            @click="openFaqIndex = openFaqIndex === index ? null : index"
          >
            <strong>{{ item.question }}</strong>
            <span aria-hidden="true">{{ openFaqIndex === index ? '−' : '+' }}</span>
          </button>
          <p v-if="openFaqIndex === index">{{ item.answer }}</p>
        </article>
      </div>
    </section>

    <aside class="privacy-note">
      <strong>隐私说明</strong>
      <p>本地指纹结果不会提交给本站接口。网络卡片会请求 Cloudflare Worker 获取出口 IP 和网络信息；若 Worker 配置了第三方 IP 风险服务，出口 IP 会被发送给该服务。本站前端不会获得或暴露服务端 API 密钥。</p>
    </aside>
  </section>
</template>

<style scoped>
.env-check-tool {
  --env-safe: #27856d;
  --env-warning: #bd7416;
  --env-danger: #c84d55;
  --env-muted: var(--vp-c-text-2);
  margin: 1.75rem 0 2.5rem;
  color: var(--vp-c-text-1);
}

.overview-card {
  display: grid;
  overflow: hidden;
  grid-template-columns: minmax(280px, 0.9fr) minmax(360px, 1.15fr);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  background: var(--vp-c-bg);
  box-shadow: 0 18px 50px color-mix(in srgb, var(--vp-c-brand-1) 9%, transparent);
}

.score-panel,
.network-panel {
  min-width: 0;
  padding: 28px;
}

.score-panel {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border-right: 1px solid var(--vp-c-divider);
  background:
    radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--vp-c-brand-soft) 64%, transparent), transparent 52%),
    var(--vp-c-bg);
  text-align: center;
}

.score-panel h2,
.network-panel h2,
.section-heading h2,
.principle-section h2 {
  margin: 3px 0 0;
  border: 0;
  color: var(--vp-c-text-1);
  font-size: 20px;
  line-height: 1.35;
}

.eyebrow {
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1.4;
  text-transform: uppercase;
}

.score-ring {
  position: relative;
  width: 168px;
  height: 168px;
  margin: 22px auto 16px;
}

.score-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.score-track,
.score-progress {
  fill: none;
  stroke-width: 10;
}

.score-track {
  stroke: var(--vp-c-bg-alt);
}

.score-progress {
  stroke: var(--vp-c-brand-1);
  stroke-linecap: round;
  transition: stroke 0.25s ease, stroke-dashoffset 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

.score-ring.is-safe .score-progress {
  stroke: var(--env-safe);
}

.score-ring.is-warning .score-progress,
.score-ring.is-scanning .score-progress {
  stroke: var(--env-warning);
}

.score-ring.is-danger .score-progress {
  stroke: var(--env-danger);
}

.score-value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  place-self: center;
}

.score-value strong {
  font-size: 43px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.score-value span {
  margin-left: 4px;
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.status-chip,
.verdict-chip,
.weight-chip,
.same-signal-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-weight: 750;
  white-space: nowrap;
}

.status-chip {
  padding: 5px 11px;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  font-size: 12px;
}

.status-chip.is-safe {
  border-color: color-mix(in srgb, var(--env-safe) 28%, var(--vp-c-border));
  color: var(--env-safe);
  background: color-mix(in srgb, var(--env-safe) 10%, var(--vp-c-bg));
}

.status-chip.is-warning,
.status-chip.is-scanning {
  border-color: color-mix(in srgb, var(--env-warning) 28%, var(--vp-c-border));
  color: var(--env-warning);
  background: color-mix(in srgb, var(--env-warning) 10%, var(--vp-c-bg));
}

.status-chip.is-danger {
  border-color: color-mix(in srgb, var(--env-danger) 28%, var(--vp-c-border));
  color: var(--env-danger);
  background: color-mix(in srgb, var(--env-danger) 10%, var(--vp-c-bg));
}

.score-panel > p {
  max-width: 330px;
  margin: 14px auto 20px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.7;
}

.primary-button,
.secondary-button,
.icon-button,
.signal-summary,
.faq-list button {
  border: 0;
  font: inherit;
  cursor: pointer;
}

.primary-button {
  display: inline-flex;
  width: min(100%, 320px);
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 9px;
  color: #fff;
  background: var(--vp-c-brand-1);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent);
  font-size: 14px;
  font-weight: 750;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.primary-button:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.primary-button:disabled,
.icon-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.panel-heading,
.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.icon-button {
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  font-size: 19px;
  line-height: 1;
}

.icon-button:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.network-details {
  margin: 22px 0 0;
}

.network-details > div {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 14px;
  padding: 7px 0;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.network-details dt,
.network-details dd {
  min-width: 0;
  margin: 0;
  font-size: 12.5px;
  line-height: 1.55;
}

.network-details dt {
  color: var(--vp-c-text-3);
}

.network-details dd {
  overflow: hidden;
  color: var(--vp-c-text-1);
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.is-mono {
  font-family: var(--vp-font-family-mono);
  font-variant-numeric: tabular-nums;
}

.network-risk-card {
  margin-top: 16px;
  padding: 15px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.ip-type-row,
.risk-score-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.risk-score-row {
  margin-top: 13px;
}

.risk-card-label {
  flex: none;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 700;
}

.ip-type-chips {
  display: grid;
  width: min(100%, 245px);
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.ip-type-chips span {
  padding: 5px 6px;
  border: 1px solid transparent;
  border-radius: 7px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg);
  font-size: 11px;
  font-weight: 700;
  text-align: center;
}

.ip-type-chips span.active {
  border-color: color-mix(in srgb, var(--env-safe) 25%, var(--vp-c-border));
  color: var(--env-safe);
  background: color-mix(in srgb, var(--env-safe) 10%, var(--vp-c-bg));
}

.ip-type-chips span.warning {
  border-color: color-mix(in srgb, var(--env-warning) 25%, var(--vp-c-border));
  color: var(--env-warning);
  background: color-mix(in srgb, var(--env-warning) 10%, var(--vp-c-bg));
}

.ip-type-chips span.danger {
  border-color: color-mix(in srgb, var(--env-danger) 25%, var(--vp-c-border));
  color: var(--env-danger);
  background: color-mix(in srgb, var(--env-danger) 10%, var(--vp-c-bg));
}

.ip-type-chips span.unknown::after {
  content: ' ?';
}

.risk-number {
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: var(--vp-c-text-2);
}

.risk-number strong {
  font-size: 24px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.risk-number span {
  color: var(--vp-c-text-3);
  font-size: 10px;
}

.risk-number em {
  margin-left: 4px;
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--vp-c-bg);
  font-size: 10px;
  font-style: normal;
  font-weight: 800;
}

.risk-number.is-safe {
  color: var(--env-safe);
}

.risk-number.is-warning {
  color: var(--env-warning);
}

.risk-number.is-danger {
  color: var(--env-danger);
}

.risk-meter {
  overflow: hidden;
  height: 8px;
  margin-top: 10px;
  border-radius: 999px;
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--env-safe) 17%, var(--vp-c-bg)),
      color-mix(in srgb, var(--env-warning) 17%, var(--vp-c-bg)),
      color-mix(in srgb, var(--env-danger) 17%, var(--vp-c-bg))
    );
}

.risk-meter > span {
  display: block;
  width: 0;
  height: 100%;
  border-radius: inherit;
  background: var(--vp-c-text-3);
  transition: width 0.6s ease;
}

.risk-meter.is-safe > span {
  background: var(--env-safe);
}

.risk-meter.is-warning > span {
  background: var(--env-warning);
}

.risk-meter.is-danger > span {
  background: var(--env-danger);
}

.risk-note {
  margin: 10px 0 0;
  color: var(--vp-c-text-3);
  font-size: 11px;
  line-height: 1.55;
}

.network-loading {
  margin-top: 22px;
}

.skeleton-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 8px 0;
}

.skeleton-row span,
.skeleton-block {
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    var(--vp-c-bg-soft),
    var(--vp-c-bg-alt),
    var(--vp-c-bg-soft)
  );
  background-size: 220% 100%;
  animation: skeleton-wave 1.4s linear infinite;
}

.skeleton-row span:first-child {
  width: 74px;
  height: 13px;
}

.skeleton-row span:last-child {
  width: 45%;
  height: 13px;
}

.skeleton-block {
  height: 116px;
  margin-top: 16px;
}

.network-error {
  display: flex;
  min-height: 305px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.network-error > span {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  color: var(--env-warning);
  background: color-mix(in srgb, var(--env-warning) 12%, var(--vp-c-bg));
  font-size: 22px;
  font-weight: 800;
}

.network-error p {
  max-width: 360px;
  margin: 14px auto;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.secondary-button {
  padding: 7px 13px;
  border: 1px solid var(--vp-c-border);
  border-radius: 7px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  font-size: 12px;
  font-weight: 700;
}

.secondary-button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.signals-section,
.principle-section,
.faq-section {
  margin-top: 42px;
}

.section-heading > p {
  max-width: 440px;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.65;
  text-align: right;
}

.signal-list,
.faq-list {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.signal-card {
  overflow: hidden;
  border: 1px solid var(--vp-c-border);
  border-radius: 11px;
  background: var(--vp-c-bg);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.signal-card:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 48%, var(--vp-c-border));
}

.signal-card.is-fail {
  border-color: color-mix(in srgb, var(--env-danger) 35%, var(--vp-c-border));
}

.signal-card.is-warn {
  border-color: color-mix(in srgb, var(--env-warning) 35%, var(--vp-c-border));
}

.signal-card.is-pass {
  border-color: color-mix(in srgb, var(--env-safe) 28%, var(--vp-c-border));
}

.signal-summary {
  display: grid;
  width: 100%;
  grid-template-columns: 44px minmax(0, 1fr) 24px;
  align-items: center;
  gap: 14px;
  padding: 15px 16px;
  color: inherit;
  background: transparent;
  text-align: left;
}

.signal-icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  font-size: 14px;
  font-weight: 850;
}

.signal-card.is-fail .signal-icon {
  color: var(--env-danger);
  background: color-mix(in srgb, var(--env-danger) 9%, var(--vp-c-bg));
}

.signal-card.is-warn .signal-icon {
  color: var(--env-warning);
  background: color-mix(in srgb, var(--env-warning) 9%, var(--vp-c-bg));
}

.signal-card.is-pass .signal-icon {
  color: var(--env-safe);
  background: color-mix(in srgb, var(--env-safe) 8%, var(--vp-c-bg));
}

.signal-copy {
  display: block;
  min-width: 0;
}

.signal-title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.signal-title-row > strong {
  margin-right: 2px;
  font-size: 15px;
}

.weight-chip,
.same-signal-chip,
.verdict-chip {
  padding: 2px 7px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  font-size: 10px;
}

.same-signal-chip {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 24%, var(--vp-c-border));
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-bg));
}

.verdict-chip {
  margin-left: auto;
}

.verdict-chip.is-fail {
  border-color: transparent;
  color: var(--env-danger);
  background: color-mix(in srgb, var(--env-danger) 10%, var(--vp-c-bg));
}

.verdict-chip.is-warn {
  border-color: transparent;
  color: var(--env-warning);
  background: color-mix(in srgb, var(--env-warning) 10%, var(--vp-c-bg));
}

.verdict-chip.is-pass {
  border-color: transparent;
  color: var(--env-safe);
  background: color-mix(in srgb, var(--env-safe) 9%, var(--vp-c-bg));
}

.signal-description {
  display: block;
  margin-top: 5px;
  color: var(--vp-c-text-2);
  font-size: 12.5px;
  line-height: 1.6;
}

.signal-raw {
  display: block;
  overflow: hidden;
  margin-top: 7px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 10.5px;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.signal-raw b {
  color: var(--vp-c-text-1);
  font-weight: 700;
}

.signal-raw em {
  margin-left: 7px;
  color: var(--env-danger);
  font-style: normal;
  font-weight: 800;
}

.expand-icon {
  color: var(--vp-c-text-3);
  font-size: 21px;
  font-weight: 400;
  text-align: center;
}

.signal-advice {
  padding: 14px 18px 16px 74px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.signal-advice > strong {
  color: var(--vp-c-text-1);
  font-size: 12px;
}

.signal-advice ul,
.signal-advice p {
  margin: 7px 0 0;
  padding: 0;
  color: var(--vp-c-text-2);
  font-size: 12.5px;
  line-height: 1.65;
}

.signal-advice li {
  margin: 0 0 0 1.1rem;
}

.principle-section {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.principle-section > div {
  padding: 20px;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.principle-section p {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.7;
}

.faq-list article {
  overflow: hidden;
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.faq-list button {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 17px;
  color: var(--vp-c-text-1);
  background: transparent;
  text-align: left;
}

.faq-list button strong {
  font-size: 13.5px;
}

.faq-list button span {
  color: var(--vp-c-brand-1);
  font-size: 20px;
}

.faq-list article > p {
  margin: 0;
  padding: 13px 17px 16px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  font-size: 13px;
  line-height: 1.7;
}

.privacy-note {
  margin-top: 28px;
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 24%, var(--vp-c-border));
  border-radius: 11px;
  background: color-mix(in srgb, var(--vp-c-brand-soft) 42%, var(--vp-c-bg));
}

.privacy-note strong {
  font-size: 13px;
}

.privacy-note p {
  margin: 5px 0 0;
  color: var(--vp-c-text-2);
  font-size: 12.5px;
  line-height: 1.7;
}

@keyframes skeleton-wave {
  to {
    background-position: -220% 0;
  }
}

@media (max-width: 860px) {
  .overview-card {
    grid-template-columns: 1fr;
  }

  .score-panel {
    border-right: 0;
    border-bottom: 1px solid var(--vp-c-divider);
  }
}

@media (max-width: 719px) {
  .env-check-tool {
    margin-top: 1.25rem;
  }

  .overview-card {
    border-radius: 12px;
  }

  .score-panel,
  .network-panel {
    padding: 21px 17px;
  }

  .score-ring {
    width: 148px;
    height: 148px;
    margin-top: 18px;
  }

  .score-value strong {
    font-size: 38px;
  }

  .network-details > div {
    grid-template-columns: 76px minmax(0, 1fr);
    gap: 10px;
  }

  .ip-type-row,
  .risk-score-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .ip-type-chips {
    width: 100%;
  }

  .section-heading {
    flex-direction: column;
    gap: 8px;
  }

  .section-heading > p {
    max-width: none;
    text-align: left;
  }

  .signal-summary {
    grid-template-columns: 38px minmax(0, 1fr) 20px;
    gap: 10px;
    padding: 13px 12px;
  }

  .signal-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    font-size: 12px;
  }

  .verdict-chip {
    margin-left: 0;
  }

  .signal-raw {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .signal-advice {
    padding: 13px 14px 15px;
  }

  .principle-section {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .score-progress,
  .primary-button,
  .signal-card,
  .risk-meter > span {
    transition: none;
  }

  .skeleton-row span,
  .skeleton-block {
    animation: none;
  }
}
</style>
