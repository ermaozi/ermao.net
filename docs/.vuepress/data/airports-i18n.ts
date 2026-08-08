import type { AirportPlan, AirportRecord, AirportSource } from './airports'

const HAN_RE = /[\u3400-\u9fff]/u
const HAN_GLOBAL_RE = /[\u3400-\u9fff]/gu

const englishNames: Record<string, string> = {
  网际快车: 'Wangji Express',
  阿达西: 'Adaxi',
  大哥云: 'Dage Cloud',
  冲上云霄: 'Chongshang Yunxiao',
  隐形人: 'Invisible',
  跨界云: 'Kuajie Cloud',
  灵猫网络: 'Civet Network',
  秒秒云: 'Miaomiao Cloud',
  锦云: 'Jinyun',
  暮光加速: 'Twilight',
  智联网络: 'Zhilian Network',
  无忧链接: 'Wuyou Link',
  云图高速: 'Yuntu Airport',
  可信云: 'Kexin Cloud',
  梯子云: 'LadderCloud',
  影子云: 'Yingzi Cloud',
  山水云: 'Shanshui Cloud',
  龙猫云: 'Longmao Cloud',
  迅达: 'Xunda',
  星岛梦: 'Xingdao Meng',
  唯兔云: 'Weitu Cloud',
  灵动云: 'Lingdong Cloud',
  极连云: 'Jilian Cloud',
  闪狐云: 'Shanhu Cloud',
  光年梯: 'Guangnian Ti',
  梦想云: 'Dream Cloud',
  灯塔cloud: 'Lighthouse Cloud',
  百变小樱: 'Baibian Xiaoying',
  白羊星: 'Aries Star',
  sogo云: 'Sogo Cloud',
  光速云: 'Guangsu Cloud',
  全球云: 'Global Cloud',
  纵云梯: 'Zongyun Ti',
  加速啦: 'Jiasu.la',
  '99吧': '99Bar',
  老头vpn: 'Laotou VPN',
  寰宇云: 'Huanyu Cloud',
  掌中世界: 'Zhangzhong Shijie',
  瞬云: 'Shunyun',
  二猫云: 'Ermao Cloud',
  一翻云: 'Yifan Cloud',
  速界: 'Sujie',
  快狸: 'Kuaili',
  边缘节点: 'Edge Node',
  好鸭云: 'Nice Duck Cloud',
  随便云: 'SuiBian Cloud',
  青云梯: 'Qingyun Ti',
  浪网: 'WaveNet',
  传送门: 'Portal',
  '梯子云（LadderCloud）': 'LadderCloud',
}

const englishTags: Record<string, string> = {
  不限时: 'One-time traffic',
  不限时流量包: 'One-time traffic',
  一次性套餐: 'One-time traffic',
  一次性订阅: 'One-time traffic',
  流量包: 'Traffic packs',
  大流量: 'High traffic',
  高流量: 'High traffic',
  低价: 'Budget',
  低门槛: 'Low entry cost',
  备用: 'Backup option',
  新站: 'New provider',
  四年运营: 'Four-year claim',
  海外团队: 'Overseas team',
  自有机房: 'Own data centers',
  自研客户端: 'Custom client',
  自研入口: 'Custom client',
  通用订阅: 'Universal subscription',
  万能订阅: 'Universal subscription',
  多设备: 'Multiple devices',
  不限设备: 'No advertised device limit',
  原生IP: 'Residential-style IP',
  原生: 'Residential-style IP',
  专线: 'Dedicated-line claim',
  三网: 'Three-carrier entry',
  全专线: 'Dedicated-line claim',
  周期套餐: 'Recurring plans',
  多档套餐: 'Multiple tiers',
  分层套餐: 'Multiple tiers',
  月付: 'Monthly plans',
  流量梯度: 'Traffic tiers',
  轻中度: 'Light to moderate use',
  小流量: 'Small traffic plans',
  免费试用: 'Trial claim',
  每日签到: 'Daily check-in',
  一倍流量: '1x traffic',
  '1 倍流量': '1x traffic',
  低倍率: 'Low multiplier',
  晚高峰: 'Evening peak',
  流媒体: 'Streaming',
  节点多: 'Many nodes',
  进阶: 'Advanced use',
  重度: 'Heavy use',
  新手: 'Beginner-oriented',
  自动恢复: 'Automatic recovery',
  住宅IP: 'Residential IP',
  '住宅 IP': 'Residential IP',
}

const phraseReplacements: Array<[string, string]> = [
  ['Netflix/Disney保证', 'Netflix and Disney access advertised'],
  ['Netflix、Disney保证', 'Netflix and Disney access advertised'],
  ['Netflix、Disney+', 'Netflix and Disney+'],
  ['不限时间，用完为止', 'no stated expiry; usable until depleted'],
  ['不限时不过期', 'no stated expiry'],
  ['流量用完前不会过期', 'usable until traffic is depleted'],
  ['每月流量', 'monthly traffic'],
  ['每日流量', 'daily traffic'],
  ['同时在线', 'simultaneous devices'],
  ['带宽保证', 'bandwidth'],
  ['峰值带宽', 'peak bandwidth'],
  ['节点数量', 'nodes'],
  ['全球节点', 'global nodes'],
  ['不限设备', 'no advertised device limit'],
  ['限制设备', 'device limit'],
  ['小团体使用', 'small-group use'],
  ['个人使用', 'personal use'],
  ['家庭使用', 'household use'],
  ['企业/团队', 'business or team use'],
  ['企业／团队', 'business or team use'],
  ['长期备用', 'long-term backup'],
  ['主力轻度使用', 'light primary use'],
  ['日常使用', 'regular use'],
  ['轻度使用', 'light use'],
  ['中度用户', 'moderate use'],
  ['重度用户', 'heavy use'],
  ['高频用户', 'frequent use'],
  ['新手用户', 'beginners'],
  ['流媒体解锁', 'streaming access advertised'],
  ['全面解锁', 'broad access advertised'],
  ['基础解锁', 'basic access advertised'],
  ['专线服务', 'dedicated-line claim'],
  ['优先路由', 'priority routing claim'],
  ['超值优惠', 'discounted offer'],
  ['晚高峰不限速', 'no evening speed reduction advertised'],
  ['高峰满速', 'full peak-hour speed advertised'],
  ['全节点', 'all nodes'],
  ['独立公网IP', 'dedicated public IP'],
  ['独立带宽', 'dedicated bandwidth'],
  ['独立IP', 'dedicated IP'],
  ['原生IP', 'residential-style IP'],
  ['专属节点', 'dedicated node'],
  ['通用订阅', 'universal subscription'],
  ['自研客户端', 'custom client'],
  ['一次性订阅', 'one-time subscription'],
  ['一次性套餐', 'one-time plan'],
  ['不限时套餐', 'one-time plan'],
  ['不限时流量包', 'one-time traffic pack'],
  ['流量包', 'traffic pack'],
  ['周期订阅', 'recurring subscription'],
  ['年付体验包', 'annual trial plan'],
  ['年付轻量版', 'annual light plan'],
  ['基础体验版', 'Basic trial'],
  ['日常影音版', 'Everyday streaming'],
  ['入门流量包', 'Entry traffic pack'],
  ['优选套餐', 'Preferred plan'],
  ['至尊套餐', 'Premium plan'],
  ['包月套餐', 'Monthly plan'],
  ['包年套餐', 'Annual plan'],
  ['基础套餐', 'Basic plan'],
  ['进阶套餐', 'Advanced plan'],
  ['专业套餐', 'Professional plan'],
  ['极限套餐', 'Ultra plan'],
  ['轻量套餐', 'Lite plan'],
  ['标准套餐', 'Standard plan'],
  ['高级套餐', 'Premium plan'],
  ['企业套餐', 'Enterprise plan'],
  ['团队套餐', 'Team plan'],
  ['旗舰版', 'Flagship'],
  ['进阶版', 'Advanced'],
  ['专业版', 'Professional'],
  ['至尊版', 'Premium'],
  ['极速版', 'Speed'],
  ['超速版', 'Super Speed'],
  ['光速版', 'Light Speed'],
  ['跃迁版', 'Transition'],
  ['入门版', 'Entry'],
  ['定制线路', 'Custom line'],
  ['定制套餐', 'Custom plan'],
  ['永久不限时', 'One-time'],
  ['小流量包', 'Small traffic pack'],
  ['标准流量包', 'Standard traffic pack'],
  ['精英流量包', 'Elite traffic pack'],
  ['轻量版', 'Lite'],
  ['标准版', 'Standard'],
  ['高级版', 'Premium'],
  ['月付', 'monthly'],
  ['季付', 'quarterly'],
  ['季度', 'quarter'],
  ['半年付', 'six-month'],
  ['半年', 'six months'],
  ['年付', 'annual'],
  ['两年付', 'two-year'],
  ['两年', 'two years'],
  ['三年付', 'three-year'],
  ['三年', 'three years'],
  ['一次性', 'one-time'],
  ['每月', 'per month'],
  ['每天', 'per day'],
  ['每日', 'per day'],
  ['不限时', 'no stated expiry'],
  ['永久', 'no stated expiry'],
  ['用完为止', 'until depleted'],
  ['共', 'total '],
  ['适合', 'for '],
  ['说明', 'notes'],
  ['特点', 'features'],
  ['特色服务', 'services'],
  ['推荐', 'recommended'],
  ['套餐', 'plan'],
  ['流量', 'traffic'],
  ['设备', 'devices'],
  ['节点', 'nodes'],
  ['速率', 'speed'],
  ['带宽', 'bandwidth'],
  ['保证', 'advertised'],
  ['支持', 'supports'],
  ['提供', 'offers'],
  ['最高', 'up to'],
  ['轻度', 'light'],
  ['中度', 'moderate'],
  ['重度', 'heavy'],
  ['用户', 'users'],
  ['使用', 'use'],
  ['个人', 'personal'],
  ['家庭', 'household'],
  ['团队', 'team'],
  ['企业', 'business'],
]

const replacePhrases = (value: string) => {
  let result = value
  for (const [source, target] of phraseReplacements)
    result = result.split(source).join(target)
  return result
}

const cleanLocalizedText = (value: string) =>
  value
    .replace(HAN_GLOBAL_RE, '')
    .replace(/[（）]/g, match => match === '（' ? ' (' : ')')
    .replace(/[，、]/g, ', ')
    .replace(/；/g, '; ')
    .replace(/：/g, ': ')
    .replace(/。/g, '. ')
    .replace(/\s+([,;:.])/g, '$1')
    .replace(/([,;:])(?=\S)/g, '$1 ')
    .replace(/\s+/g, ' ')
    .replace(/^[\s,;:./-]+|[\s,;:/-]+$/g, '')
    .trim()

const genericEnglish = (value: string | undefined, fallback: string) => {
  if (!value) return fallback
  const translated = cleanLocalizedText(replacePhrases(value))
  return translated && !HAN_RE.test(translated) ? translated : fallback
}

export const localizeAirportName = (value: string) =>
  englishNames[value] ?? genericEnglish(value, 'Proxy service')

export const localizeAirportPrice = (value: string) => {
  const translated = replacePhrases(value)
    .replace(/(\d+(?:\.\d+)?)\s*元/g, 'CNY $1')
    .replace(/\/\s*月/g, '/month')
    .replace(/\/\s*年/g, '/year')
    .replace(/\/\s*季/g, '/quarter')
    .replace(/\/\s*30\s*天/g, '/30 days')
    .replace(/(\d+)\s*天/g, '$1 days')
    .replace(/\bG\b/gi, 'GB')

  return cleanLocalizedText(translated) || 'See current checkout page'
}

const localizeTraffic = (value: string | undefined) => {
  if (!value) return undefined
  return genericEnglish(
    value
      .replace(/\bG\b/gi, 'GB')
      .replace(/(\d+)\s*天/g, '$1 days'),
    'See current traffic terms',
  )
}

const localizePlanName = (value: string | undefined, index: number) =>
  genericEnglish(value, `Plan ${index + 1}`)

const localizePlanDetail = (value: string | undefined) =>
  value ? genericEnglish(value, 'See the current plan terms') : undefined

export const localizeAirportPlan = (plan: AirportPlan, index: number): AirportPlan => {
  const name = localizePlanName(plan.name || plan.text, index)
  const priceText = plan.priceText ? localizeAirportPrice(plan.priceText) : undefined
  const traffic = localizeTraffic(plan.traffic)
  const billingCycle = localizePlanDetail(plan.billingCycle)
  const type = localizePlanDetail(plan.type)
  const audience = localizePlanDetail(plan.audience)
  const features = plan.features?.map(localizePlanDetail).filter((item): item is string => Boolean(item))

  return {
    ...plan,
    name,
    priceText,
    traffic,
    billingCycle,
    type,
    audience,
    features,
    text: [name, priceText, traffic].filter(Boolean).join(', '),
  }
}

const localizeTags = (tags: string[] | undefined) =>
  (tags ?? [])
    .map(tag => englishTags[tag] ?? genericEnglish(tag, ''))
    .filter(Boolean)

const englishDescription = (item: AirportSource | AirportRecord) => {
  const name = localizeAirportName(item.name)
  const minimum = localizeAirportPrice(item.minPlanText)
  const subscription = item.universalSubscription === true
    ? 'A universal subscription is listed.'
    : item.universalSubscription === false
      ? 'A universal subscription is not listed as supported.'
      : 'Universal-subscription support is unconfirmed.'
  const oneTime = item.hasOneTimePackage === true
    ? 'A one-time traffic option is listed.'
    : item.hasOneTimePackage === false
      ? 'No one-time traffic option is listed.'
      : 'One-time traffic availability is unconfirmed.'

  return `${name} lists plans from ${minimum}. ${subscription} ${oneTime} Read the full review and verify the current checkout terms before purchase.`
}

export const localizeAirportSource = (item: AirportSource): AirportSource => ({
  ...item,
  name: localizeAirportName(item.name),
  description: englishDescription(item),
  minPlanText: localizeAirportPrice(item.minPlanText),
  rankChangeLabel: item.rankChangeLabel === '新上' ? 'New' : item.rankChangeLabel,
  imageAlt: `${localizeAirportName(item.name)} review screenshot`,
  tags: localizeTags(item.tags),
})

export const localizeAirportRecord = (item: AirportRecord): AirportRecord => ({
  ...item,
  name: localizeAirportName(item.name),
  description: englishDescription(item),
  minPlanText: localizeAirportPrice(item.minPlanText),
  rankChangeLabel: item.rankChangeLabel === '新上' ? 'New' : item.rankChangeLabel,
  plans: item.plans.map(localizeAirportPlan),
})
