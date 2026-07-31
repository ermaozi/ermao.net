<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLang } from 'vuepress/client'

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
const lang = useLang()
const isEnglish = computed(() => String(lang.value || '').toLowerCase().startsWith('en'))
const pick = <T>(zh: T, en: T): T => isEnglish.value ? en : zh

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

const domesticBrowserPatterns = computed<Array<[string, string]>>(() => [
  ['micromessenger', pick('微信内置浏览器', 'WeChat in-app browser')],
  ['qqbrowser', pick('QQ 浏览器', 'QQ Browser')],
  ['mqqbrowser', pick('QQ 内置浏览器', 'QQ in-app browser')],
  ['quark', pick('夸克浏览器', 'Quark Browser')],
  ['ucbrowser', pick('UC 浏览器', 'UC Browser')],
  ['ucweb', pick('UC 浏览器', 'UC Browser')],
  ['baiduboxapp', pick('百度 App', 'Baidu app')],
  ['baidubrowser', pick('百度浏览器', 'Baidu Browser')],
  ['miuibrowser', pick('小米浏览器', 'Xiaomi Browser')],
  ['mibrowser', pick('小米浏览器', 'Xiaomi Browser')],
  ['huaweibrowser', pick('华为浏览器', 'Huawei Browser')],
  ['heytapbrowser', 'OPPO Browser'],
  ['oppobrowser', 'OPPO Browser'],
  ['vivobrowser', 'vivo Browser'],
  ['360se', '360 Browser'],
  ['360ee', '360 Browser'],
  ['qihoobrowser', '360 Browser'],
  ['sogoumobilebrowser', pick('搜狗浏览器', 'Sogou Browser')],
  ['2345browser', '2345 Browser'],
])

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

const signalMeta = computed<SignalMeta[]>(() => [
  {
    id: 'timezone',
    icon: '◷',
    title: pick('系统时区', 'System time zone'),
    weightLabel: pick('权重 26', 'Weight 26'),
    sameAsClaude: true,
    description: pick('读取浏览器继承的系统时区，并与中国大陆、港澳台及其他亚洲时区进行比对。', 'Reads the system time zone exposed to the browser and compares it with mainland China, Hong Kong, Macao, Taiwan, and other Asian zones.'),
  },
  {
    id: 'language',
    icon: 'Aa',
    title: pick('浏览器语言', 'Browser languages'),
    weightLabel: pick('权重 20', 'Weight 20'),
    description: pick('检查 navigator.languages；中文位于首选语言时会产生更明显的区域特征。', 'Checks navigator.languages; Chinese as the preferred language creates a stronger regional signal.'),
  },
  {
    id: 'languageVariant',
    icon: 'A↔',
    title: pick('语言文字特征', 'Language variant'),
    weightLabel: pick('权重 12', 'Weight 12'),
    description: pick('识别 zh-CN、zh-Hans、zh-Hant、zh-HK 等中文语言变体。', 'Identifies Chinese language variants such as zh-CN, zh-Hans, zh-Hant, and zh-HK.'),
  },
  {
    id: 'chineseFonts',
    icon: 'F',
    title: pick('字体地区特征', 'Regional font signals'),
    weightLabel: pick('权重 16', 'Weight 16'),
    description: pick('通过 Canvas 文本宽度差异探测常见简繁体中文字体。', 'Uses Canvas text-width differences to probe for common Simplified and Traditional Chinese fonts.'),
  },
  {
    id: 'vendorFonts',
    icon: 'Aa',
    title: pick('厂商字体异常', 'Vendor-font signals'),
    weightLabel: pick('权重 10', 'Weight 10'),
    description: pick('检测 MiSans、HarmonyOS Sans、OPPO Sans、vivo Sans 等厂商字体。', 'Checks for vendor fonts including MiSans, HarmonyOS Sans, OPPO Sans, and vivo Sans.'),
  },
  {
    id: 'domesticBrowser',
    icon: '◎',
    title: pick('浏览器地区特征', 'Regional browser signals'),
    weightLabel: pick('权重 8', 'Weight 8'),
    description: pick('检查 UA 与 UA-CH 品牌中是否包含常见国内浏览器或内置浏览器标识。', 'Checks the user agent and UA-CH brands for common mainland Chinese browsers and embedded webviews.'),
  },
  {
    id: 'domesticDevice',
    icon: '▣',
    title: pick('设备地区特征', 'Regional device signals'),
    weightLabel: pick('权重 6', 'Weight 6'),
    description: pick('识别 HarmonyOS、Huawei、Honor、Xiaomi、OPPO、vivo 等设备线索。', 'Identifies device signals such as HarmonyOS, Huawei, Honor, Xiaomi, OPPO, and vivo.'),
  },
  {
    id: 'intlLocale',
    icon: '⌘',
    title: pick('Intl 区域设置', 'Intl locale'),
    weightLabel: pick('权重 6', 'Weight 6'),
    description: pick('读取浏览器用于日期和数字格式化的 locale。', 'Reads the locale used by the browser for date and number formatting.'),
  },
  {
    id: 'timezoneOffset',
    icon: '±',
    title: pick('时区偏移', 'Time-zone offset'),
    weightLabel: pick('权重 8', 'Weight 8'),
    description: pick('检查当前时间相对 UTC 的偏移，UTC+8 会增加区域一致性信号。', 'Checks the current UTC offset; UTC+8 increases the regional consistency signal.'),
  },
  {
    id: 'emojiStyle',
    icon: '☺',
    title: pick('Emoji 风格推测', 'Inferred emoji style'),
    weightLabel: pick('弱信号', 'Weak signal'),
    description: pick('根据浏览器 UA 推测操作系统的 Emoji 渲染体系，只作为低权重辅助信息。', 'Infers an operating-system emoji family from the user agent and uses it only as a low-weight hint.'),
  },
  {
    id: 'browser',
    icon: '⌁',
    title: pick('浏览器/应用环境', 'Browser and app environment'),
    weightLabel: pick('信息项', 'Information'),
    description: pick('展示浏览器与操作系统，不直接计入环境风险分。', 'Displays the browser and operating system without adding to the environment score.'),
  },
  {
    id: 'device',
    icon: '◇',
    title: pick('设备/系统线索', 'Device and system clues'),
    weightLabel: pick('信息项', 'Information'),
    description: pick('展示设备类型与系统线索，不直接计入环境风险分。', 'Displays device and system clues without adding to the environment score.'),
  },
])

const faqItems = computed(() => [
  {
    question: pick('这个风险分是 Claude 的官方判定吗？', 'Is this an official Claude risk score?'),
    answer: pick('不是。它是根据浏览器可见的时区、语言、字体和设备线索建立的启发式分数，只适合用于发现环境中明显不一致的项目。', 'No. It is a heuristic built from time-zone, language, font, and device signals visible to the browser. It is useful only for finding obvious inconsistencies.'),
  },
  {
    question: pick('为什么网页检测结果可能和 Claude Code 不一样？', 'Why can the web result differ from Claude Code?'),
    answer: pick('网页运行在浏览器沙箱内，无法读取主机名、系统级配置或 Claude 客户端内部状态。它只能检测浏览器公开的部分信号。', 'A webpage runs in a browser sandbox and cannot read the hostname, system-wide configuration, or internal Claude client state. It can inspect only a subset of browser-exposed signals.'),
  },
  {
    question: pick('修改浏览器语言后为什么仍然有中文字体？', 'Why are Chinese fonts still detected after changing the browser language?'),
    answer: pick('字体通常由操作系统安装，修改浏览器语言不会删除系统字体。字体命中也很常见，不建议为了一个单项分数破坏日常系统环境。', 'Fonts are normally installed by the operating system, so changing a browser language does not remove them. Font matches are common; do not damage a normal system environment merely to change one score item.'),
  },
  {
    question: pick('检测数据会发送到服务器吗？', 'Is scan data sent to a server?'),
    answer: pick('时区、语言、字体、浏览器与设备信号只在本地计算。网络检测会把当前出口 IP 交给本站 Cloudflare Worker；配置 IP 风险服务后，Worker 还会把该 IP 发送给风控数据提供方。', 'Time-zone, language, font, browser, and device signals are computed locally. The network check sends the current egress IP to this site’s Cloudflare Worker. If an IP-risk service is configured, the Worker also sends that IP to the risk-data provider.'),
  },
])

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
    return { label: pick('正在检测', 'Scanning'), className: 'is-scanning' }
  }
  if (!scanResult.value) {
    return { label: pick('等待检测', 'Not scanned'), className: 'is-idle' }
  }
  if (scanResult.value.level === 'low') {
    return { label: pick('低风险环境', 'Low-risk environment'), className: 'is-safe' }
  }
  if (scanResult.value.level === 'medium') {
    return { label: pick('中等风险环境', 'Medium-risk environment'), className: 'is-warning' }
  }
  return { label: pick('高风险环境', 'High-risk environment'), className: 'is-danger' }
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
    return new Intl.DateTimeFormat(lang.value || 'zh-CN', {
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
      return { score: null, label: pick('待接入风险库', 'Risk provider not configured'), className: 'is-unknown' }
    }
    return { score: null, label: pick('风险数据不可用', 'Risk data unavailable'), className: 'is-unknown' }
  }
  if (score < 40) {
    return { score, label: pick('较低', 'Lower'), className: 'is-safe' }
  }
  if (score <= 70) {
    return { score, label: pick('一般', 'Moderate'), className: 'is-warning' }
  }
  return { score, label: pick('较高', 'Higher'), className: 'is-danger' }
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
  if (/MicroMessenger/i.test(userAgent)) return pick('微信内置浏览器', 'WeChat in-app browser')
  if (/Firefox\//.test(userAgent)) return 'Firefox'
  if (/Chrome\//.test(userAgent) && !/Chromium/.test(userAgent)) return 'Chrome'
  if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) return 'Safari'
  return pick('未知浏览器', 'Unknown browser')
}

function detectOperatingSystem(userAgent: string, platform: string) {
  const source = `${userAgent} ${platform}`
  if (/harmonyos/i.test(source)) return 'HarmonyOS'
  if (/android/i.test(source)) return 'Android'
  if (/iphone|ipad|ios/i.test(source)) return 'iOS'
  if (/mac os|macintosh|macintel/i.test(source)) return 'macOS'
  if (/windows nt|win32|win64/i.test(source)) return 'Windows'
  if (/linux/i.test(source)) return 'Linux'
  return platform || pick('未知系统', 'Unknown system')
}

function detectDevice(userAgent: string, platform: string) {
  const operatingSystem = detectOperatingSystem(userAgent, platform)
  const source = `${userAgent} ${platform}`

  if (/iphone/i.test(source)) return `iPhone / ${operatingSystem}`
  if (/ipad/i.test(source)) return `iPad / ${operatingSystem}`
  if (/android/i.test(source)) return `${pick('Android 设备', 'Android device')} / ${operatingSystem}`
  if (/macintosh|mac os|macintel/i.test(source)) return `Mac / ${operatingSystem}`
  if (/windows/i.test(source)) return `Windows PC / ${operatingSystem}`
  if (/linux/i.test(source)) return `${pick('Linux 设备', 'Linux device')} / ${operatingSystem}`
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
      ? [pick('检测到中国大陆或相近时区。若账号地区与此不一致，请优先检查系统时区和常用网络出口是否匹配。', 'A mainland China or nearby time zone was detected. If it conflicts with the account region, first check whether the system time zone and usual network egress are consistent.')]
      : timezoneRisk > 0
        ? [pick('检测到亚洲时区。亚洲时区本身并不等于异常，但应与账号资料和长期网络地区保持一致。', 'An Asian time zone was detected. That is not inherently abnormal, but it should be consistent with the account profile and long-term network region.')]
        : [pick('当前系统时区未命中中文地区特征，无需单独处理。', 'The system time zone did not match the listed Chinese-region signals; no separate action is indicated.')],
  ))

  const normalizedLanguages = languageList.toLowerCase()
  const primaryChinese = /^zh/i.test(primaryLanguage)
  const containsChinese = /(^|[, ]+)zh(?:-|,|$)|-cn\b/i.test(normalizedLanguages)

  results.push(makeSignal(
    'language',
    `${pick('首选', 'Preferred')}: ${primaryLanguage} | ${pick('完整', 'All')}: [${languageList}]`,
    primaryChinese ? 1 : containsChinese ? 0.5 : 0,
    20,
    primaryChinese
      ? [pick('浏览器首选语言是中文。如需降低区域差异，可将账号常用语言移至首位。', 'The browser’s preferred language is Chinese. If that conflicts with normal account use, place the usual account language first.')]
      : containsChinese
        ? [pick('语言列表中包含中文。只要首选语言和实际使用习惯一致，通常不需要强行删除。', 'Chinese appears in the language list. It normally does not need to be removed when the preferred language matches actual use.')]
        : [pick('浏览器首选语言未命中中文地区特征。', 'The preferred browser language did not match the listed Chinese-language signals.')],
  ))

  const languageVariant = languages.some(language => /zh-(tw|hk|mo)|zh-hant/i.test(language))
    ? pick('繁体中文', 'Traditional Chinese')
    : languages.some(language => /zh-cn|zh-sg|zh-hans|^zh$/i.test(language))
      ? pick('简体中文', 'Simplified Chinese')
      : ''

  results.push(makeSignal(
    'languageVariant',
    languageVariant || pick('未检测到关键中文语言变体', 'No listed Chinese language variant detected'),
    languageVariant ? 1 : 0,
    12,
    languageVariant
      ? [pick(`检测到${languageVariant}语言变体。请确认它是否符合账号资料与日常使用环境。`, `${languageVariant} was detected. Confirm that it matches the account profile and normal environment.`)]
      : [pick('未检测到关键中文语言变体。', 'No listed Chinese language variant was detected.')],
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
      ? `${pick('简体字体', 'Simplified Chinese fonts')}: ${detectedSimplifiedFonts.join(' / ')}`
      : detectedTraditionalFonts.length
        ? `${pick('繁体字体', 'Traditional Chinese fonts')}: ${detectedTraditionalFonts.join(' / ')}`
        : pick('未检测到关键中文字体', 'No listed Chinese fonts detected'),
    chineseFontRisk,
    16,
    chineseFontRisk > 0
      ? [pick('检测到中文字体。系统自带字体很常见，这一项应与时区、语言等信号一起判断，不建议仅为降低分数删除系统字体。', 'Chinese fonts were detected. Bundled system fonts are common; interpret this with the time-zone and language signals, and do not remove system fonts merely to lower the score.')]
      : [pick('未检测到列表中的典型中文字体。', 'None of the listed Chinese fonts was detected.')],
  ))

  const detectedVendorFonts = detectFonts(vendorFonts)
  const vendorFontRisk = detectedVendorFonts.length >= 2 ? 1 : detectedVendorFonts.length === 1 ? 0.8 : 0

  results.push(makeSignal(
    'vendorFonts',
    detectedVendorFonts.length
      ? `${pick('厂商字体', 'Vendor fonts')}: ${detectedVendorFonts.join(' / ')}`
      : pick('未检测到厂商字体', 'No listed vendor font detected'),
    vendorFontRisk,
    10,
    detectedVendorFonts.length
      ? [pick('检测到国内设备厂商字体。共享工作环境可考虑使用独立浏览器配置，但字体命中本身不是账号异常证据。', 'A mainland Chinese device-vendor font was detected. A separate browser profile can isolate a shared work environment, but a font match is not evidence of an account problem.')]
      : [pick('未检测到明显的国内厂商字体。', 'No listed mainland Chinese vendor font was detected.')],
  ))

  const domesticBrowser = findPattern(browserSource, domesticBrowserPatterns.value)

  results.push(makeSignal(
    'domesticBrowser',
    domesticBrowser || detectBrowser(userAgent),
    domesticBrowser ? 1 : 0,
    8,
    domesticBrowser
      ? [pick('检测到国内浏览器或内置 WebView 特征。重要账号更适合使用长期固定、更新及时的主流浏览器配置。', 'A mainland Chinese browser or embedded WebView signal was detected. Important accounts are better served by a stable, regularly updated browser profile.')]
      : [pick('未检测到明显的国内浏览器特征。', 'No listed mainland Chinese browser signal was detected.')],
  ))

  const domesticDevice = findPattern(deviceSource, domesticDevicePatterns)
  const domesticDeviceRisk = domesticDevice === 'HarmonyOS' ? 1 : domesticDevice ? 0.7 : 0

  results.push(makeSignal(
    'domesticDevice',
    domesticDevice || pick('未检测到关键设备厂商特征', 'No listed device-vendor signal detected'),
    domesticDeviceRisk,
    6,
    domesticDevice
      ? [pick('检测到国内设备或系统厂商线索。请结合浏览器、语言和网络出口综合判断。', 'A mainland Chinese device or operating-system vendor signal was detected. Interpret it together with browser, language, and network egress data.')]
      : [pick('未检测到明显的国内设备厂商特征。', 'No listed mainland Chinese device-vendor signal was detected.')],
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
      ? [pick('Intl 区域格式包含中文。只有当它与账号地区明显冲突时，才需要调整系统区域格式。', 'The Intl locale contains a Chinese variant. Adjust the system locale only when it clearly conflicts with the account region.')]
      : [pick('Intl 区域格式未命中中文特征。', 'The Intl locale did not match a listed Chinese variant.')],
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
      ? [pick('当前偏移为 UTC+8。请确认系统时区、IP 时区和账号常用地区是否一致。', 'The current offset is UTC+8. Check whether the system time zone, IP time zone, and normal account region are consistent.')]
      : offsetRisk > 0
        ? [pick('检测到东亚或东南亚相近时间偏移，建议结合系统时区名称判断。', 'A nearby East or Southeast Asian UTC offset was detected; interpret it together with the named system time zone.')]
        : [pick('当前时区偏移未命中 UTC+7 至 UTC+9。', 'The current offset is outside UTC+7 through UTC+9.')],
  ))

  const emojiStyle = /iphone|ipad|mac os|macintosh/i.test(userAgent)
    ? pick('Apple Emoji 风格', 'Apple emoji style')
    : /android|harmonyos/i.test(userAgent)
      ? pick('Android / 厂商 Emoji 风格', 'Android / vendor emoji style')
      : /windows/i.test(userAgent)
        ? pick('Windows Emoji 风格', 'Windows emoji style')
        : pick('未知 Emoji 风格', 'Unknown emoji style')
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
    [pick('此项只根据 UA 推测操作系统，并未读取或上传 Emoji 图像，通常无需单独处理。', 'This item infers the operating system only from the user agent. It does not read or upload emoji images and normally needs no separate action.')],
    emojiRisk > 0 ? 'warn' : 'pass',
  ))

  const browser = detectBrowser(userAgent)
  const operatingSystem = detectOperatingSystem(userAgent, platform)

  results.push(makeSignal(
    'browser',
    `${browser} / ${operatingSystem}`,
    0,
    0,
    [pick('该项仅展示浏览器与系统环境，不直接计入风险分。', 'This item displays the browser and operating system and does not contribute to the score.')],
    'info',
  ))

  results.push(makeSignal(
    'device',
    detectDevice(userAgent, platform),
    0,
    0,
    [pick('该项仅展示设备线索，不直接计入风险分。', 'This item displays device clues and does not contribute to the score.')],
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
    return new Intl.DisplayNames([lang.value || 'zh-CN'], { type: 'region' }).of(countryCode) || countryCode
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
    networkError.value = pick(
      '网络检测服务暂时不可用，请确认 Worker 已绑定到本站接口路径后重试。',
      'The network-check service is temporarily unavailable. Confirm that the Worker is bound to this site’s API route and try again.',
    )
  }
  finally {
    window.clearTimeout(timeout)
  }
}

function toggleSignal(id: string) {
  openSignalId.value = openSignalId.value === id ? null : id
}

function verdictLabel(verdict: Verdict | undefined) {
  if (verdict === 'fail') return pick('需关注', 'Review')
  if (verdict === 'warn') return pick('提示项', 'Advisory')
  if (verdict === 'pass') return pick('未命中', 'Not detected')
  if (verdict === 'info') return pick('信息项', 'Information')
  return pick('待检测', 'Not scanned')
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
  <section class="env-check-tool" :aria-label="pick('Claude 环境自检工具', 'Claude environment self-check')">
    <div class="overview-card">
      <section class="score-panel" aria-labelledby="environment-score-title">
        <span class="eyebrow">{{ pick('浏览器环境', 'Browser environment') }}</span>
        <h2 id="environment-score-title">{{ pick('本地环境风险', 'Local environment risk') }}</h2>

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

        <p>{{ pick('综合时区、语言、字体、区域格式和设备线索，结果只在当前浏览器中计算。', 'Combines time-zone, language, font, locale, and device clues. The result is computed only in this browser.') }}</p>

        <button
          type="button"
          class="primary-button"
          :disabled="scanState === 'scanning'"
          @click="runScan"
        >
          <span aria-hidden="true">{{ scanState === 'scanning' ? '◌' : '✓' }}</span>
          {{ scanState === 'scanning' ? pick('正在检测', 'Scanning') : scanResult ? pick('重新检测', 'Scan again') : pick('开始检测', 'Start scan') }}
        </button>
      </section>

      <section class="network-panel" aria-labelledby="network-panel-title">
        <div class="panel-heading">
          <div>
            <span class="eyebrow">Cloudflare Worker</span>
            <h2 id="network-panel-title">{{ pick('当前网络出口', 'Current network egress') }}</h2>
          </div>
          <button
            type="button"
            class="icon-button"
            :disabled="networkStatus === 'loading'"
            :aria-label="pick('重新检测网络', 'Check network again')"
            :title="pick('重新检测网络', 'Check network again')"
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
          <button type="button" class="secondary-button" @click="loadNetwork">{{ pick('重新请求', 'Try again') }}</button>
        </div>

        <template v-else>
          <dl class="network-details">
            <div>
              <dt>{{ pick('位置', 'Location') }}</dt>
              <dd>{{ networkLocation }}</dd>
            </div>
            <div>
              <dt>{{ pick('IP 地址', 'IP address') }}</dt>
              <dd class="is-mono">{{ networkInfo?.ip || '—' }}</dd>
            </div>
            <div>
              <dt>{{ pick('网络组织', 'Network organization') }}</dt>
              <dd>{{ formatAsn(networkInfo) }}</dd>
            </div>
            <div>
              <dt>{{ pick('IP 时区', 'IP time zone') }}</dt>
              <dd class="is-mono">{{ networkInfo?.timezone || '—' }}</dd>
            </div>
            <div>
              <dt>{{ pick('当地时间', 'Local time') }}</dt>
              <dd class="is-mono">{{ networkLocalTime }}</dd>
            </div>
            <div>
              <dt>{{ pick('邮编', 'Postal code') }}</dt>
              <dd class="is-mono">{{ networkInfo?.postalCode || '—' }}</dd>
            </div>
            <div>
              <dt>{{ pick('坐标', 'Coordinates') }}</dt>
              <dd class="is-mono">{{ formatCoordinates(networkInfo) }}</dd>
            </div>
          </dl>

          <div class="network-risk-card">
            <div class="ip-type-row">
              <span class="risk-card-label">{{ pick('IP 类型', 'IP type') }}</span>
              <div class="ip-type-chips">
                <span
                  :class="{
                    active: networkInfo?.isResidential === true,
                    unknown: networkInfo?.isResidential === null,
                  }"
                >{{ pick('住宅', 'Residential') }}</span>
                <span
                  :class="{
                    active: networkInfo?.isDatacenter === true || networkInfo?.isSuspectedDatacenter === true,
                    warning: networkInfo?.isSuspectedDatacenter === true && networkInfo?.isDatacenter !== true,
                    unknown: networkInfo?.isDatacenter === null && networkInfo?.isSuspectedDatacenter === null,
                  }"
                >{{ pick('机房', 'Datacenter') }}</span>
                <span
                  :class="{
                    active: proxyLike === true,
                    danger: proxyLike === true,
                    unknown: proxyLike === null,
                  }"
                >{{ pick('代理', 'Proxy') }}</span>
              </div>
            </div>

            <div class="risk-score-row">
              <span class="risk-card-label">{{ pick('IP 风险', 'IP risk') }}</span>
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
              :aria-label="pick('IP 风险分', 'IP risk score')"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-valuenow="networkRisk.score ?? undefined"
            >
              <span :style="{ width: `${networkRisk.score ?? 0}%` }" />
            </div>

            <p v-if="networkInfo?.riskStatus !== 'ready'" class="risk-note">
              {{
                networkInfo?.riskStatus === 'not-configured'
                  ? pick('Worker 已返回 Cloudflare 地理信息；设置 IPQS_API_KEY 后可显示 VPN、代理和风险分。', 'The Worker returned Cloudflare geolocation. Configure IPQS_API_KEY to add VPN, proxy, and risk-score data.')
                  : (isEnglish ? 'Third-party risk data is temporarily unavailable; the geolocation data may still be useful.' : networkInfo?.riskMessage || '第三方风险数据暂时不可用，地理信息仍可参考。')
              }}
            </p>
          </div>
        </template>
      </section>
    </div>

    <section class="signals-section" aria-labelledby="signals-title">
      <div class="section-heading">
        <div>
          <span class="eyebrow">{{ pick('本地检测', 'Local scan') }}</span>
          <h2 id="signals-title">{{ pick('检测项目与建议', 'Signals and guidance') }}</h2>
        </div>
        <p>{{ pick('展开项目可查看本机采集值、分数贡献和对应建议。', 'Expand an item to see its local value, score contribution, and guidance.') }}</p>
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
                <span v-if="item.sameAsClaude" class="same-signal-chip">{{ pick('同类系统信号', 'Related system signal') }}</span>
                <span
                  class="verdict-chip"
                  :class="signalResults[item.id]?.verdict ? `is-${signalResults[item.id].verdict}` : 'is-pending'"
                >
                  {{ verdictLabel(signalResults[item.id]?.verdict) }}
                </span>
              </span>
              <span class="signal-description">{{ item.description }}</span>
              <span v-if="signalResults[item.id]" class="signal-raw">
                {{ pick('当前值', 'Current value') }}: <b>{{ signalResults[item.id].raw }}</b>
                <em v-if="signalResults[item.id].contribution > 0">
                  +{{ signalResults[item.id].contribution }}
                </em>
              </span>
            </span>
            <span class="expand-icon" aria-hidden="true">{{ openSignalId === item.id ? '−' : '+' }}</span>
          </button>

          <div v-if="openSignalId === item.id" class="signal-advice">
            <template v-if="signalResults[item.id]">
              <strong>{{ signalResults[item.id].verdict === 'fail' ? pick('优先检查', 'Review first') : signalResults[item.id].verdict === 'warn' ? pick('辅助判断', 'Supporting signal') : pick('检测说明', 'Scan note') }}</strong>
              <ul>
                <li v-for="advice in signalResults[item.id].advice" :key="advice">{{ advice }}</li>
              </ul>
            </template>
            <p v-else>{{ pick('完成一次本地检测后，这里会显示当前值和对应建议。', 'Run the local scan to display the current value and related guidance.') }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="principle-section" aria-labelledby="principle-title">
      <div>
        <span class="eyebrow">{{ pick('检测边界', 'Detection limits') }}</span>
        <h2 id="principle-title">{{ pick('浏览器能看到什么', 'What the browser can see') }}</h2>
        <p>{{ pick('网页可以读取浏览器继承的时区、语言、区域格式、UA 和部分字体特征，但无法读取 Claude Code 能访问的全部系统信息，也无法得知 Anthropic 的真实判定规则。', 'A webpage can read the browser’s inherited time zone, languages, locale, user agent, and some font signals. It cannot read all system information available to Claude Code or know Anthropic’s actual decision rules.') }}</p>
      </div>
      <div>
        <span class="eyebrow">{{ pick('评分方法', 'Scoring method') }}</span>
        <h2>{{ pick('为什么只能作为参考', 'Why the score is only a reference') }}</h2>
        <p>{{ pick('本页把多个弱信号组合为 0–100 分。字体和 UA 检测可能受隐私浏览器、兼容模式及系统更新影响，因此分数用于定位冲突项，不用于预测账号结果。', 'This page combines several weak signals into a 0–100 score. Font and user-agent detection can be affected by privacy browsers, compatibility modes, and system updates, so the score locates inconsistencies; it does not predict an account outcome.') }}</p>
      </div>
    </section>

    <section class="faq-section" aria-labelledby="faq-title">
      <div class="section-heading">
        <div>
          <span class="eyebrow">{{ pick('常见问题', 'FAQ') }}</span>
          <h2 id="faq-title">{{ pick('检测前需要知道', 'What to know before scanning') }}</h2>
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
      <strong>{{ pick('隐私说明', 'Privacy') }}</strong>
      <p>{{ pick('本地指纹结果不会提交给本站接口。网络卡片会请求 Cloudflare Worker 获取出口 IP 和网络信息；若 Worker 配置了第三方 IP 风险服务，出口 IP 会被发送给该服务。本站前端不会获得或暴露服务端 API 密钥。', 'Local fingerprint results are not submitted to this site’s API. The network card requests egress-IP and network data from a Cloudflare Worker. If the Worker is configured with a third-party IP-risk service, the egress IP is sent to that provider. The frontend neither receives nor exposes the server-side API key.') }}</p>
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
