export type AirportBoolean = boolean | 'unknown'

export interface AirportPlan {
  name?: string
  price?: number
  priceText?: string
  currency?: 'CNY' | 'USD'
  traffic?: string
  period?: string
  billingCycle?: string
  type?: string
  features?: string[]
  audience?: string
  purchaseHref?: string
  recommended?: boolean
  text: string
  oneTime?: boolean
}

export interface AirportRecord {
  id: string
  name: string
  rank?: number
  officialHref: string
  description: string
  universalSubscription: AirportBoolean
  telegramHref?: string
  hasOneTimePackage: AirportBoolean
  minPlanText: string
  plans: AirportPlan[]
  reviewHref?: string
  rankChangeLabel?: string
}

export interface AirportRiskItem {
  name: string
  status: string
  description: string
  href: string
}

export interface AirportGuideItem {
  title: string
  description: string
}

export type AirportSource = Omit<AirportRecord, 'plans'> & {
  image?: string
  tags?: string[]
  imageAlt?: string
}


// airport:sync-plans:start
// 此区块由 pnpm airport:sync-plans 生成，请勿手工编辑。
// 事实源优先级：2026 详情页 > 2025 详情页 > 主站总表。
// xsus: docs/blog/机场推荐/2026/机场推荐xsus.md — 月付套餐 / 不限时流量包（流量不过期）
// 网际快车: docs/blog/机场推荐/2026/机场推荐网际快车.md — 🧾 核心套餐表
// cocoduck: docs/blog/机场推荐/2026/机场推荐cocoduck.md — 💳 CocoDuck机场套餐价格
// u1s1: docs/blog/机场推荐/2026/机场推荐u1s1.md — 💳 套餐选择建议
// 大哥云: docs/blog/机场推荐/2026/机场推荐大哥云.md — 💳 大哥云套餐价格
// invisible: docs/blog/机场推荐/2026/机场推荐隐形人.md — 周期套餐 / 一次性不限时流量包
// kuajiecloud: docs/blog/机场推荐/2026/机场推荐跨界云.md — 周期套餐
// civetnet: docs/blog/机场推荐/2026/机场推荐灵猫网络.md — 周期套餐
// miaomiaoyun: docs/blog/机场推荐/2026/机场推荐秒秒云.md — 周期套餐 / 一次性不限时流量包
// 锦云: docs/blog/机场推荐/2026/机场推荐锦云.md — 周期套餐 / 一次性不限时流量包
// twilight: docs/blog/机场推荐/2026/机场推荐暮光加速.md — 周期套餐 / 一次性不限时流量包 / 年付轻量版 / 流量重置包与定制节点
// 智联网络: docs/blog/机场推荐/2026/机场推荐智联网络.md — 周期套餐
// firefly: docs/blog/机场推荐/2026/机场推荐Firefly.md — 周期套餐 / 一次性不限时流量包
// 无忧链接: docs/blog/机场推荐/2026/机场推荐无忧链接.md — 周期套餐 / 一次性不限时流量包
// 可信云: docs/blog/机场推荐/2026/机场推荐可信云.md — 周期套餐
// 梯子云: docs/blog/机场推荐/2026/机场推荐梯子云.md — 周期套餐 / 一次性不限时流量包
// uuone: docs/blog/机场推荐/2026/机场推荐uuone.md — 💳 uuone 价格套餐与最新优惠码
// 山水云: docs/blog/机场推荐/2026/机场推荐山水云.md — 价格表
// 星岛梦: docs/blog/机场推荐/2026/机场推荐星岛梦.md — 💳 星岛梦机场套餐价格
// 唯兔云: docs/blog/机场推荐/2026/机场推荐唯兔云.md — 💳 唯兔云套餐价格表
// 灵动云: docs/blog/机场推荐/2026/机场推荐灵动云.md — 周期套餐 / 一次性不限时流量包
// superbiu: docs/blog/机场推荐/2026/机场推荐superbiu.md — 📦 按量一次性流量包（有效期内不限时）
// 极连云: docs/blog/机场推荐/2026/机场推荐极连云.md — 💳 极连云套餐价格与优惠码
// runway: docs/blog/机场推荐/2026/机场推荐runway.md — 🔁 定期套餐 / 📦 一次性流量包
// 光年梯: docs/blog/机场推荐/2026/机场推荐光年梯.md — 💳 光年梯机场套餐价格
// 梦想云: docs/blog/机场推荐/2026/机场推荐梦想云.md — 套餐与价格
// 灯塔cloud: docs/blog/机场推荐/2025/机场推荐灯塔cloud.md — 灯塔cloud机场简介
// cyberguard: docs/blog/机场推荐/2025/机场推荐CyberGuard.md — CyberGuard机场价格
// sogo云: docs/blog/机场推荐/2026/机场推荐sogo云.md — 周期订阅 / 一次性订阅（限量不限时）
// 光速云: docs/blog/机场推荐/2026/机场推荐光速云.md — 💳 光速云套餐价格
// 全球云: docs/blog/机场推荐/2026/机场推荐全球云.md — 全球云周期套餐 / 一次性不限时流量包
// 寰宇云: docs/blog/机场推荐/2026/机场推荐寰宇云.md — 套餐与价格
// 二猫云: docs/blog/机场推荐/2026/机场推荐二猫云.md — 套餐与价格
// 快狸: docs/blog/机场推荐/2026/机场推荐快狸.md — 套餐选择建议
// 边缘节点: docs/blog/机场推荐/2026/机场推荐边缘节点.md — 套餐选择建议
// 随便云: docs/blog/机场推荐/2026/机场推荐随便云.md — 💳 随便云(SuiBian) 价格套餐
// ccyz: docs/blog/机场推荐/2026/机场推荐ccyz.md — 💳 CCYZ 机场套餐价格
// 浪网: docs/blog/机场推荐/2026/机场推荐浪网.md — 月付与年付套餐 / 浪网不限时流量包
// 传送门: docs/blog/机场推荐/2026/机场推荐传送门.md — A. 主套餐（含无限流量 / 一次性流量包 / 定制专线） / B. ANYCAST 套餐（主流国家高速节点）
const generatedAirportPlanCatalog: Record<string, AirportPlan[]> = {
  "xsus": [
    {
      "name": "P-Small 基础套餐",
      "priceText": "¥10.00/月",
      "traffic": "168GB",
      "type": "周期订阅",
      "features": [
        "带宽保证：500Mbps",
        "说明：个人使用，不限设备，Netflix/Disney保证"
      ],
      "purchaseHref": "https://xsus.cloud/register?code=xJFcT1Dw",
      "text": "P-Small 基础套餐，¥10.00/月，168GB"
    },
    {
      "name": "P-Plus 进阶套餐",
      "priceText": "¥20.00/月",
      "traffic": "336GB",
      "type": "周期订阅",
      "features": [
        "带宽保证：1Gbps",
        "说明：个人使用，不限设备，Netflix/Disney保证"
      ],
      "purchaseHref": "https://xsus.cloud/register?code=xJFcT1Dw",
      "text": "P-Plus 进阶套餐，¥20.00/月，336GB"
    },
    {
      "name": "P-Max 专业套餐",
      "priceText": "¥24.00/月",
      "traffic": "420GB",
      "type": "周期订阅",
      "features": [
        "带宽保证：1Gbps",
        "说明：个人/小团体，不限设备，Netflix/Disney保证"
      ],
      "purchaseHref": "https://xsus.cloud/register?code=xJFcT1Dw",
      "text": "P-Max 专业套餐，¥24.00/月，420GB"
    },
    {
      "name": "P-Ultra 极限套餐",
      "priceText": "¥58.00/月",
      "traffic": "1024GB",
      "type": "周期订阅",
      "features": [
        "带宽保证：5Gbps突发",
        "说明：小团体使用，Netflix/Disney保证"
      ],
      "purchaseHref": "https://xsus.cloud/register?code=xJFcT1Dw",
      "text": "P-Ultra 极限套餐，¥58.00/月，1024GB"
    },
    {
      "name": "188G 流量包",
      "priceText": "¥65.00",
      "traffic": "188GB",
      "type": "周期订阅",
      "features": [
        "特点：不限时间，用完为止"
      ],
      "purchaseHref": "https://xsus.cloud/register?code=xJFcT1Dw",
      "text": "188G 流量包，¥65.00，188GB"
    },
    {
      "name": "240G 流量包",
      "priceText": "¥82.00",
      "traffic": "240GB",
      "type": "周期订阅",
      "features": [
        "特点：不限时间，用完为止"
      ],
      "purchaseHref": "https://xsus.cloud/register?code=xJFcT1Dw",
      "text": "240G 流量包，¥82.00，240GB"
    },
    {
      "name": "400G 流量包",
      "priceText": "¥122.00",
      "traffic": "400GB",
      "type": "周期订阅",
      "features": [
        "特点：不限时间，用完为止"
      ],
      "purchaseHref": "https://xsus.cloud/register?code=xJFcT1Dw",
      "text": "400G 流量包，¥122.00，400GB"
    },
    {
      "name": "1024G 流量包",
      "priceText": "¥260.00",
      "traffic": "1024GB",
      "type": "周期订阅",
      "features": [
        "特点：不限时间，用完为止"
      ],
      "purchaseHref": "https://xsus.cloud/register?code=xJFcT1Dw",
      "text": "1024G 流量包，¥260.00，1024GB"
    }
  ],
  "网际快车": [
    {
      "name": "入门流量包",
      "priceText": "¥6.8",
      "traffic": "20GB，不限时不过期",
      "type": "周期订阅",
      "audience": "节点本地测试、极轻度备用",
      "purchaseHref": "https://ermao.快车.com?c=USNCXQ",
      "text": "入门流量包，¥6.8，20GB，不限时不过期"
    },
    {
      "name": "优选套餐",
      "priceText": "¥29",
      "traffic": "200GB，不限时不过期",
      "type": "周期订阅",
      "audience": "长期备用、主力轻度使用",
      "purchaseHref": "https://ermao.快车.com?c=USNCXQ",
      "text": "优选套餐，¥29，200GB，不限时不过期"
    },
    {
      "name": "至尊套餐",
      "priceText": "¥198",
      "traffic": "1980GB，不限时不过期",
      "type": "周期订阅",
      "audience": "多设备家庭、大流量囤货",
      "purchaseHref": "https://ermao.快车.com?c=USNCXQ",
      "text": "至尊套餐，¥198，1980GB，不限时不过期"
    },
    {
      "name": "包月套餐",
      "priceText": "¥24",
      "traffic": "每日60GB，共1800GB",
      "type": "周期订阅",
      "audience": "高频视频流媒体、中重度 AI 用户",
      "purchaseHref": "https://ermao.快车.com?c=USNCXQ",
      "text": "包月套餐，¥24，每日60GB，共1800GB"
    },
    {
      "name": "包年套餐",
      "priceText": "¥186",
      "traffic": "每日60GB，共21900GB",
      "type": "周期订阅",
      "audience": "长期重度高频用户",
      "purchaseHref": "https://ermao.快车.com?c=USNCXQ",
      "text": "包年套餐，¥186，每日60GB，共21900GB"
    }
  ],
  "cocoduck": [
    {
      "name": "鸭宝宝",
      "priceText": "¥15/月",
      "traffic": "150GB/月",
      "type": "周期订阅",
      "audience": "超轻度用户",
      "features": [
        "节点数量：40+全球节点",
        "特色服务：基础解锁"
      ],
      "purchaseHref": "https://www.cocoduck.site/auth/register?code=25c8b515df",
      "text": "鸭宝宝，¥15/月，150GB/月"
    },
    {
      "name": "可达鸭",
      "priceText": "¥28/月",
      "traffic": "400GB/月",
      "type": "周期订阅",
      "audience": "日常使用",
      "features": [
        "节点数量：40+全球节点",
        "特色服务：全面解锁"
      ],
      "purchaseHref": "https://www.cocoduck.site/auth/register?code=25c8b515df",
      "text": "可达鸭，¥28/月，400GB/月"
    },
    {
      "name": "哥达鸭",
      "priceText": "¥41/月",
      "traffic": "700GB/月",
      "type": "周期订阅",
      "audience": "中度用户",
      "features": [
        "节点数量：40+全球节点",
        "特色服务：优先路由"
      ],
      "purchaseHref": "https://www.cocoduck.site/auth/register?code=25c8b515df",
      "text": "哥达鸭，¥41/月，700GB/月"
    },
    {
      "name": "唐老鸭",
      "priceText": "¥53/月",
      "traffic": "1000GB/月",
      "type": "周期订阅",
      "audience": "企业/团队",
      "features": [
        "节点数量：40+全球节点",
        "特色服务：专线服务"
      ],
      "purchaseHref": "https://www.cocoduck.site/auth/register?code=25c8b515df",
      "text": "唐老鸭，¥53/月，1000GB/月"
    },
    {
      "name": "迷你鸭",
      "priceText": "¥77/年",
      "traffic": "77GB/月",
      "type": "周期订阅",
      "audience": "长期用户",
      "features": [
        "节点数量：40+全球节点",
        "特色服务：超值优惠"
      ],
      "purchaseHref": "https://www.cocoduck.site/auth/register?code=25c8b515df",
      "text": "迷你鸭，¥77/年，77GB/月"
    }
  ],
  "大哥云": [
    {
      "name": "单月套餐 A",
      "priceText": "¥19.90",
      "traffic": "100G/月",
      "billingCycle": "按自然月",
      "type": "周期订阅",
      "features": [
        "峰值带宽：500 Mbps",
        "协议：Trojan"
      ],
      "purchaseHref": "https://ermao.dgywzc.com/#/register?code=peAVAa8D",
      "text": "单月套餐 A，¥19.90，100G/月"
    },
    {
      "name": "单月套餐 B",
      "priceText": "¥29.90",
      "traffic": "150G/月",
      "billingCycle": "按自然月",
      "type": "周期订阅",
      "features": [
        "峰值带宽：500 Mbps",
        "协议：Trojan"
      ],
      "purchaseHref": "https://ermao.dgywzc.com/#/register?code=peAVAa8D",
      "text": "单月套餐 B，¥29.90，150G/月"
    },
    {
      "name": "季付套餐 A",
      "priceText": "¥69.00",
      "traffic": "200G/月",
      "billingCycle": "90 天",
      "type": "周期订阅",
      "features": [
        "峰值带宽：1000 Mbps",
        "协议：Trojan"
      ],
      "purchaseHref": "https://ermao.dgywzc.com/#/register?code=peAVAa8D",
      "text": "季付套餐 A，¥69.00，200G/月"
    },
    {
      "name": "VIP1 小流量（年付）",
      "priceText": "¥88.00",
      "traffic": "15G/月",
      "billingCycle": "365 天",
      "type": "周期订阅",
      "features": [
        "峰值带宽：500 Mbps",
        "协议：Trojan"
      ],
      "purchaseHref": "https://ermao.dgywzc.com/#/register?code=peAVAa8D",
      "text": "VIP1 小流量（年付），¥88.00，15G/月"
    },
    {
      "name": "年付套餐 A",
      "priceText": "¥199.00",
      "traffic": "300G/月",
      "billingCycle": "365 天",
      "type": "周期订阅",
      "features": [
        "峰值带宽：1000 Mbps",
        "协议：Trojan"
      ],
      "purchaseHref": "https://ermao.dgywzc.com/#/register?code=peAVAa8D",
      "text": "年付套餐 A，¥199.00，300G/月"
    },
    {
      "name": "年付套餐 B",
      "priceText": "¥299.00",
      "traffic": "500G/月",
      "billingCycle": "365 天",
      "type": "周期订阅",
      "features": [
        "峰值带宽：1000 Mbps",
        "协议：Trojan"
      ],
      "purchaseHref": "https://ermao.dgywzc.com/#/register?code=peAVAa8D",
      "text": "年付套餐 B，¥299.00，500G/月"
    },
    {
      "name": "年付套餐（1000GB）",
      "priceText": "¥699.00",
      "traffic": "1000G/月",
      "billingCycle": "365 天",
      "type": "周期订阅",
      "features": [
        "峰值带宽：1000 Mbps",
        "协议：Trojan"
      ],
      "purchaseHref": "https://ermao.dgywzc.com/#/register?code=peAVAa8D",
      "text": "年付套餐（1000GB），¥699.00，1000G/月"
    }
  ],
  "miaomiaoyun": [
    {
      "name": "秒秒云 · 68G 特惠（年付）",
      "priceText": "¥79/年",
      "traffic": "68GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "用量较低、能接受年付风险",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 68G 特惠（年付），¥79/年，68GB（重置口径未说明）"
    },
    {
      "name": "秒秒云 · 200G 特惠（年付）",
      "priceText": "¥170/年",
      "traffic": "200GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "中低用量、愿意预付一年",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 200G 特惠（年付），¥170/年，200GB（重置口径未说明）"
    },
    {
      "name": "秒秒云 · 128G 探花（月付）",
      "priceText": "¥14/月",
      "traffic": "128GB/月",
      "type": "周期订阅",
      "audience": "首次体验、轻度日常使用",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 128G 探花（月付），¥14/月，128GB/月"
    },
    {
      "name": "秒秒云 · 128G 探花（季付）",
      "priceText": "¥42/季",
      "traffic": "128GB/月",
      "type": "周期订阅",
      "audience": "已完成月付测试、希望减少续费次数",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 128G 探花（季付），¥42/季，128GB/月"
    },
    {
      "name": "秒秒云 · 128G 探花（半年付）",
      "priceText": "¥84/半年",
      "traffic": "128GB/月",
      "type": "周期订阅",
      "audience": "用量稳定、能接受半年预付",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 128G 探花（半年付），¥84/半年，128GB/月"
    },
    {
      "name": "秒秒云 · 128G 探花（年付）",
      "priceText": "¥168/年",
      "traffic": "128GB/月",
      "type": "周期订阅",
      "audience": "轻度长期使用",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 128G 探花（年付），¥168/年，128GB/月"
    },
    {
      "name": "秒秒云 · 128G 探花（两年付）",
      "priceText": "¥336/两年",
      "traffic": "128GB/月",
      "type": "周期订阅",
      "audience": "已长期验证、能承担两年预付风险",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 128G 探花（两年付），¥336/两年，128GB/月"
    },
    {
      "name": "秒秒云 · 256G 榜眼（月付）",
      "priceText": "¥26/月",
      "traffic": "256GB/月",
      "type": "周期订阅",
      "audience": "日常主力使用",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 256G 榜眼（月付），¥26/月，256GB/月"
    },
    {
      "name": "秒秒云 · 256G 榜眼（季付）",
      "priceText": "¥78/季",
      "traffic": "256GB/月",
      "type": "周期订阅",
      "audience": "中等流量、短周期续费",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 256G 榜眼（季付），¥78/季，256GB/月"
    },
    {
      "name": "秒秒云 · 256G 榜眼（半年付）",
      "priceText": "¥156/半年",
      "traffic": "256GB/月",
      "type": "周期订阅",
      "audience": "中等流量、愿意预付半年",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 256G 榜眼（半年付），¥156/半年，256GB/月"
    },
    {
      "name": "秒秒云 · 256G 榜眼（年付）",
      "priceText": "¥312/年",
      "traffic": "256GB/月",
      "type": "周期订阅",
      "audience": "用量稳定、已完成线路验证",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 256G 榜眼（年付），¥312/年，256GB/月"
    },
    {
      "name": "秒秒云 · 256G 榜眼（两年付）",
      "priceText": "¥624/两年",
      "traffic": "256GB/月",
      "type": "周期订阅",
      "audience": "长期使用、能承担两年预付风险",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 256G 榜眼（两年付），¥624/两年，256GB/月"
    },
    {
      "name": "秒秒云 · 512G 状元（月付）",
      "priceText": "¥49/月",
      "traffic": "512GB/月",
      "type": "周期订阅",
      "audience": "中高流量用户",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 512G 状元（月付），¥49/月，512GB/月"
    },
    {
      "name": "秒秒云 · 512G 状元（季付）",
      "priceText": "¥147/季",
      "traffic": "512GB/月",
      "type": "周期订阅",
      "audience": "中高流量、短周期续费",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 512G 状元（季付），¥147/季，512GB/月"
    },
    {
      "name": "秒秒云 · 512G 状元（半年付）",
      "priceText": "¥294/半年",
      "traffic": "512GB/月",
      "type": "周期订阅",
      "audience": "中高流量、能接受半年预付",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 512G 状元（半年付），¥294/半年，512GB/月"
    },
    {
      "name": "秒秒云 · 512G 状元（年付）",
      "priceText": "¥588/年",
      "traffic": "512GB/月",
      "type": "周期订阅",
      "audience": "高频使用、已验证常用节点",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 512G 状元（年付），¥588/年，512GB/月"
    },
    {
      "name": "秒秒云 · 512G 状元（两年付）",
      "priceText": "¥1111/两年",
      "traffic": "512GB/月",
      "type": "周期订阅",
      "audience": "长期高流量、能承担两年预付风险",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 512G 状元（两年付），¥1111/两年，512GB/月"
    },
    {
      "name": "秒秒云 · 1024G 大学士（月付）",
      "priceText": "¥98/月",
      "traffic": "1024GB/月",
      "type": "周期订阅",
      "audience": "重度流量用户",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 1024G 大学士（月付），¥98/月，1024GB/月"
    },
    {
      "name": "秒秒云 · 1024G 大学士（季付）",
      "priceText": "¥294/季",
      "traffic": "1024GB/月",
      "type": "周期订阅",
      "audience": "重度流量、短周期续费",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 1024G 大学士（季付），¥294/季，1024GB/月"
    },
    {
      "name": "秒秒云 · 1024G 大学士（半年付）",
      "priceText": "¥588/半年",
      "traffic": "1024GB/月",
      "type": "周期订阅",
      "audience": "重度流量、能接受半年预付",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 1024G 大学士（半年付），¥588/半年，1024GB/月"
    },
    {
      "name": "秒秒云 · 1024G 大学士（年付）",
      "priceText": "¥1176/年",
      "traffic": "1024GB/月",
      "type": "周期订阅",
      "audience": "长期重度使用",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 1024G 大学士（年付），¥1176/年，1024GB/月"
    },
    {
      "name": "秒秒云 · 1024G 大学士（两年付）",
      "priceText": "¥2352/两年",
      "traffic": "1024GB/月",
      "type": "周期订阅",
      "audience": "已长期验证、能承担较高预付风险",
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 1024G 大学士（两年付），¥2352/两年，1024GB/月"
    },
    {
      "name": "秒秒云 · 不限时 100G 流量包",
      "priceText": "¥99/一次性",
      "traffic": "100GB",
      "type": "不限时流量包",
      "features": [
        "特点：低频备用"
      ],
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 不限时 100G 流量包，¥99/一次性，100GB",
      "oneTime": true
    },
    {
      "name": "秒秒云 · 不限时 300G 流量包",
      "priceText": "¥268/一次性",
      "traffic": "300GB",
      "type": "不限时流量包",
      "features": [
        "特点：需要更多储备流量的备用场景"
      ],
      "purchaseHref": "https://dl2.mmy8.com/#/register?code=jcr5CpCT",
      "text": "秒秒云 · 不限时 300G 流量包，¥268/一次性，300GB",
      "oneTime": true
    }
  ],
  "锦云": [
    {
      "name": "锦云 · 128G 特惠（年付）",
      "priceText": "¥99/年",
      "traffic": "128GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "用量低、可接受年付风险",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 128G 特惠（年付），¥99/年，128GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 64G 特惠（季付）",
      "priceText": "¥18/季",
      "traffic": "64GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "轻度使用、先短周期验证",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 64G 特惠（季付），¥18/季，64GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 64G 特惠（半年付）",
      "priceText": "¥36/半年",
      "traffic": "64GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "用量稳定、愿意预付半年",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 64G 特惠（半年付），¥36/半年，64GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 64G 特惠（年付）",
      "priceText": "¥72/年",
      "traffic": "64GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "低频长期备用",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 64G 特惠（年付），¥72/年，64GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 50G 体验版（月付）",
      "priceText": "¥6/月",
      "traffic": "50GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "首次体验、低频备用",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 50G 体验版（月付），¥6/月，50GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 50G 体验版（季付）",
      "priceText": "¥18/季",
      "traffic": "50GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "已完成月付测试、希望减少续费次数",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 50G 体验版（季付），¥18/季，50GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 50G 体验版（半年付）",
      "priceText": "¥36/半年",
      "traffic": "50GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "用量固定、可接受预付半年",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 50G 体验版（半年付），¥36/半年，50GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 50G 体验版（年付）",
      "priceText": "¥72/年",
      "traffic": "50GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "极低频使用、愿意承担年付风险",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 50G 体验版（年付），¥72/年，50GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 100G 日常版（月付）",
      "priceText": "¥9/月",
      "traffic": "100GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "日常轻量使用",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 100G 日常版（月付），¥9/月，100GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 100G 日常版（季付）",
      "priceText": "¥27/季",
      "traffic": "100GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "使用频率稳定、先短周期验证",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 100G 日常版（季付），¥27/季，100GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 100G 日常版（半年付）",
      "priceText": "¥54/半年",
      "traffic": "100GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "中低流量、可接受预付半年",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 100G 日常版（半年付），¥54/半年，100GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 100G 日常版（年付）",
      "priceText": "¥108/年",
      "traffic": "100GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "低频长期使用",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 100G 日常版（年付），¥108/年，100GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 200G 办公版（月付）",
      "priceText": "¥18/月",
      "traffic": "200GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "中等流量、先按月验证",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 200G 办公版（月付），¥18/月，200GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 200G 办公版（季付）",
      "priceText": "¥54/季",
      "traffic": "200GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "用量稳定、希望降低续费频率",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 200G 办公版（季付），¥54/季，200GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 200G 办公版（半年付）",
      "priceText": "¥108/半年",
      "traffic": "200GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "中等流量、接受半年预付",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 200G 办公版（半年付），¥108/半年，200GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 200G 办公版（年付）",
      "priceText": "¥216/年",
      "traffic": "200GB（重置口径未说明）",
      "type": "周期订阅",
      "audience": "持续使用且能够承担年付风险",
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 200G 办公版（年付），¥216/年，200GB（重置口径未说明）"
    },
    {
      "name": "锦云 · 不限时 100G 流量包",
      "priceText": "¥100/一次性",
      "traffic": "100GB",
      "type": "不限时流量包",
      "features": [
        "特点：低频备用"
      ],
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 不限时 100G 流量包，¥100/一次性，100GB",
      "oneTime": true
    },
    {
      "name": "锦云 · 不限时 500G 流量包",
      "priceText": "¥199/一次性",
      "traffic": "500GB",
      "type": "不限时流量包",
      "features": [
        "特点：需要更高储备流量的备用场景"
      ],
      "purchaseHref": "https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto",
      "text": "锦云 · 不限时 500G 流量包，¥199/一次性，500GB",
      "oneTime": true
    }
  ],
  "twilight": [
    {
      "name": "暮光 · 基础版",
      "priceText": "¥20/月",
      "traffic": "120GB",
      "type": "周期订阅",
      "audience": "初次体验、轻度日常使用",
      "features": [
        "季付：¥57/季",
        "半年付：¥103/半年",
        "年付：¥204/年",
        "两年付：¥384/两年",
        "三年付：¥540/三年"
      ],
      "purchaseHref": "https://ermaozi01.twilightaff.com/#/?code=4lhDLNFL",
      "text": "暮光 · 基础版，¥20/月，120GB"
    },
    {
      "name": "暮光 · 标准版",
      "priceText": "¥40/月",
      "traffic": "300GB",
      "type": "周期订阅",
      "audience": "日常主力、流媒体与 AI 工具",
      "features": [
        "季付：¥114/季",
        "半年付：¥216/半年",
        "年付：¥408/年",
        "两年付：¥768/两年",
        "三年付：¥1080/三年"
      ],
      "purchaseHref": "https://ermaozi01.twilightaff.com/#/?code=4lhDLNFL",
      "text": "暮光 · 标准版，¥40/月，300GB"
    },
    {
      "name": "暮光 · 旗舰版",
      "priceText": "¥100/月",
      "traffic": "700GB",
      "type": "周期订阅",
      "audience": "高频视频与多设备大流量",
      "features": [
        "季付：¥285/季",
        "半年付：¥540/半年",
        "年付：¥1020/年",
        "两年付：¥1920/两年",
        "三年付：¥2700/三年"
      ],
      "purchaseHref": "https://ermaozi01.twilightaff.com/#/?code=4lhDLNFL",
      "text": "暮光 · 旗舰版，¥100/月，700GB"
    },
    {
      "name": "暮光 · 至尊版",
      "priceText": "¥180/月",
      "traffic": "1.5TB",
      "type": "周期订阅",
      "audience": "重度流量用户",
      "features": [
        "季付：¥513/季",
        "半年付：¥972/半年",
        "年付：¥1836/年",
        "两年付：¥3456/两年",
        "三年付：¥4860/三年"
      ],
      "purchaseHref": "https://ermaozi01.twilightaff.com/#/?code=4lhDLNFL",
      "text": "暮光 · 至尊版，¥180/月，1.5TB"
    },
    {
      "name": "暮光 · 不限时轻量包",
      "priceText": "¥219/一次性",
      "traffic": "150GB",
      "type": "不限时流量包",
      "features": [
        "特点：低频备用"
      ],
      "purchaseHref": "https://ermaozi01.twilightaff.com/#/?code=4lhDLNFL",
      "text": "暮光 · 不限时轻量包，¥219/一次性，150GB",
      "oneTime": true
    },
    {
      "name": "暮光 · 不限时标准包",
      "priceText": "¥529/一次性",
      "traffic": "400GB",
      "type": "不限时流量包",
      "features": [
        "特点：长期备用、中等流量"
      ],
      "purchaseHref": "https://ermaozi01.twilightaff.com/#/?code=4lhDLNFL",
      "text": "暮光 · 不限时标准包，¥529/一次性，400GB",
      "oneTime": true
    },
    {
      "name": "暮光 · 不限时大容量包",
      "priceText": "¥959/一次性",
      "traffic": "800GB",
      "type": "不限时流量包",
      "features": [
        "特点：长期大容量备用"
      ],
      "purchaseHref": "https://ermaozi01.twilightaff.com/#/?code=4lhDLNFL",
      "text": "暮光 · 不限时大容量包，¥959/一次性，800GB",
      "oneTime": true
    },
    {
      "name": "暮光 · 年付轻量版",
      "priceText": "¥109/年",
      "traffic": "70GB/年",
      "type": "周期订阅",
      "audience": "低频使用、年付小流量备用",
      "purchaseHref": "https://ermaozi01.twilightaff.com/#/?code=4lhDLNFL",
      "text": "暮光 · 年付轻量版，¥109/年，70GB/年"
    },
    {
      "name": "独享私人定制节点",
      "priceText": "¥600/月",
      "traffic": "定制流量",
      "type": "周期订阅",
      "audience": "需要独享线路、愿意先确认交付规格",
      "purchaseHref": "https://ermaozi01.twilightaff.com/#/?code=4lhDLNFL",
      "text": "独享私人定制节点，¥600/月，定制流量"
    }
  ],
  "智联网络": [
    {
      "name": "标准版（月付）",
      "priceText": "¥5/月",
      "traffic": "500GB/月",
      "type": "周期订阅",
      "audience": "初次体验、日常使用",
      "purchaseHref": "https://a.zlwl.org/auth/register?code=dre2B4",
      "text": "标准版（月付），¥5/月，500GB/月"
    },
    {
      "name": "标准版（季付）",
      "priceText": "¥15/季",
      "traffic": "1500GB/季",
      "type": "周期订阅",
      "audience": "已完成短期测试，希望减少续费次数",
      "purchaseHref": "https://a.zlwl.org/auth/register?code=dre2B4",
      "text": "标准版（季付），¥15/季，1500GB/季"
    },
    {
      "name": "标准版（半年）",
      "priceText": "¥30/半年",
      "traffic": "3000GB/半年",
      "type": "周期订阅",
      "audience": "流量需求稳定的用户",
      "purchaseHref": "https://a.zlwl.org/auth/register?code=dre2B4",
      "text": "标准版（半年），¥30/半年，3000GB/半年"
    },
    {
      "name": "标准版（年付）",
      "priceText": "¥54/年",
      "traffic": "6000GB/年",
      "type": "周期订阅",
      "audience": "能接受长期预付、希望降低总价",
      "purchaseHref": "https://a.zlwl.org/auth/register?code=dre2B4",
      "text": "标准版（年付），¥54/年，6000GB/年"
    },
    {
      "name": "标准版 Plus（月付）",
      "priceText": "¥9.9/月",
      "traffic": "1000GB/月",
      "type": "周期订阅",
      "audience": "需要更高流量，先月付验证",
      "purchaseHref": "https://a.zlwl.org/auth/register?code=dre2B4",
      "text": "标准版 Plus（月付），¥9.9/月，1000GB/月"
    },
    {
      "name": "标准版 Plus（季付）",
      "priceText": "¥27/季",
      "traffic": "3000GB/季",
      "type": "周期订阅",
      "audience": "中高流量、短周期使用",
      "purchaseHref": "https://a.zlwl.org/auth/register?code=dre2B4",
      "text": "标准版 Plus（季付），¥27/季，3000GB/季"
    },
    {
      "name": "标准版 Plus（半年）",
      "priceText": "¥54/半年",
      "traffic": "6000GB/半年",
      "type": "周期订阅",
      "audience": "中高流量且使用周期明确",
      "purchaseHref": "https://a.zlwl.org/auth/register?code=dre2B4",
      "text": "标准版 Plus（半年），¥54/半年，6000GB/半年"
    },
    {
      "name": "标准版 Plus（年付）",
      "priceText": "¥108/年",
      "traffic": "12000GB/年",
      "type": "周期订阅",
      "audience": "高流量长期使用，需承担预付风险",
      "purchaseHref": "https://a.zlwl.org/auth/register?code=dre2B4",
      "text": "标准版 Plus（年付），¥108/年，12000GB/年"
    }
  ],
  "可信云": [
    {
      "name": "轻量月付",
      "priceText": "¥9/月",
      "traffic": "45GB/月",
      "type": "周期订阅",
      "audience": "网页、社交和低频备用",
      "purchaseHref": "https://ermaozi01.kosingaff.com/#/register?code=aG3TCu1y",
      "text": "轻量月付，¥9/月，45GB/月"
    },
    {
      "name": "基础套餐",
      "priceText": "¥25/月",
      "traffic": "150GB/月",
      "type": "周期订阅",
      "audience": "日常浏览、AI 工具和轻度视频",
      "purchaseHref": "https://ermaozi01.kosingaff.com/#/register?code=aG3TCu1y",
      "text": "基础套餐，¥25/月，150GB/月"
    },
    {
      "name": "标准套餐",
      "priceText": "¥50/月",
      "traffic": "300GB/月",
      "type": "周期订阅",
      "audience": "日常视频和远程办公",
      "purchaseHref": "https://ermaozi01.kosingaff.com/#/register?code=aG3TCu1y",
      "text": "标准套餐，¥50/月，300GB/月"
    },
    {
      "name": "专业套餐",
      "priceText": "¥100/月",
      "traffic": "600GB/月",
      "type": "周期订阅",
      "audience": "中重度视频与多设备使用",
      "purchaseHref": "https://ermaozi01.kosingaff.com/#/register?code=aG3TCu1y",
      "text": "专业套餐，¥100/月，600GB/月"
    },
    {
      "name": "旗舰套餐",
      "priceText": "¥200/月",
      "traffic": "1200GB/月",
      "type": "周期订阅",
      "audience": "大流量或多人使用",
      "purchaseHref": "https://ermaozi01.kosingaff.com/#/register?code=aG3TCu1y",
      "text": "旗舰套餐，¥200/月，1200GB/月"
    },
    {
      "name": "年付套餐",
      "priceText": "¥96/年",
      "traffic": "60GB/年",
      "type": "周期订阅",
      "audience": "使用频率较低、希望控制年费",
      "purchaseHref": "https://ermaozi01.kosingaff.com/#/register?code=aG3TCu1y",
      "text": "年付套餐，¥96/年，60GB/年"
    }
  ],
  "梯子云": [
    {
      "name": "初阶网络·基础视界",
      "priceText": "¥25/月；¥71.25/季；¥135/半年；¥255/年；¥480/两年；¥675/三年",
      "traffic": "125GB/月",
      "type": "周期订阅",
      "audience": "轻度日常使用，适合先月付体验",
      "purchaseHref": "https://ermaozi01.ladderaff.com/#/?code=VZVXWbiq",
      "text": "初阶网络·基础视界，¥25/月；¥71.25/季；¥135/半年；¥255/年；¥480/两年；¥675/三年，125GB/月"
    },
    {
      "name": "中阶加速·极清多线",
      "priceText": "¥60/月；¥171/季；¥324/半年；¥612/年；¥1152/两年；¥1620/三年",
      "traffic": "350GB/月",
      "type": "周期订阅",
      "audience": "日常视频、AI 工具与远程办公",
      "purchaseHref": "https://ermaozi01.ladderaff.com/#/?code=VZVXWbiq",
      "text": "中阶加速·极清多线，¥60/月；¥171/季；¥324/半年；¥612/年；¥1152/两年；¥1620/三年，350GB/月"
    },
    {
      "name": "高阶专线·全球智联",
      "priceText": "¥110/月；¥313.50/季；¥594/半年；¥1122/年；¥2112/两年；¥2970/三年",
      "traffic": "750GB/月",
      "type": "周期订阅",
      "audience": "中重度视频与多设备使用",
      "purchaseHref": "https://ermaozi01.ladderaff.com/#/?code=VZVXWbiq",
      "text": "高阶专线·全球智联，¥110/月；¥313.50/季；¥594/半年；¥1122/年；¥2112/两年；¥2970/三年，750GB/月"
    },
    {
      "name": "顶阶商业·全球骨干",
      "priceText": "¥190/月；¥541.50/季；¥1026/半年；¥1938/年；¥3648/两年；¥5130/三年",
      "traffic": "1.6TB/月",
      "type": "周期订阅",
      "audience": "大流量或团队用户",
      "purchaseHref": "https://ermaozi01.ladderaff.com/#/?code=VZVXWbiq",
      "text": "顶阶商业·全球骨干，¥190/月；¥541.50/季；¥1026/半年；¥1938/年；¥3648/两年；¥5130/三年，1.6TB/月"
    },
    {
      "name": "天梯随行·年度保活方案",
      "priceText": "¥89/年",
      "traffic": "60GB/年",
      "type": "周期订阅",
      "audience": "使用频率较低、希望控制年费",
      "purchaseHref": "https://ermaozi01.ladderaff.com/#/?code=VZVXWbiq",
      "text": "天梯随行·年度保活方案，¥89/年，60GB/年"
    },
    {
      "name": "云端独享·私人定制专线",
      "priceText": "¥650/月",
      "traffic": "500GB/月",
      "type": "周期订阅",
      "audience": "有私人定制线路需求的用户",
      "purchaseHref": "https://ermaozi01.ladderaff.com/#/?code=VZVXWbiq",
      "text": "云端独享·私人定制专线，¥650/月，500GB/月"
    },
    {
      "name": "云端买断·永不限时轻量包",
      "priceText": "¥169/一次性",
      "traffic": "120GB",
      "type": "不限时流量包",
      "features": [
        "特点：低频备用"
      ],
      "purchaseHref": "https://ermaozi01.ladderaff.com/#/?code=VZVXWbiq",
      "text": "云端买断·永不限时轻量包，¥169/一次性，120GB",
      "oneTime": true
    },
    {
      "name": "云端买断·永不限时标准包",
      "priceText": "¥449/一次性",
      "traffic": "350GB",
      "type": "不限时流量包",
      "features": [
        "特点：阶段性补充流量"
      ],
      "purchaseHref": "https://ermaozi01.ladderaff.com/#/?code=VZVXWbiq",
      "text": "云端买断·永不限时标准包，¥449/一次性，350GB",
      "oneTime": true
    },
    {
      "name": "云端买断·永不限时精英包",
      "priceText": "¥849/一次性",
      "traffic": "700GB",
      "type": "不限时流量包",
      "features": [
        "特点：较高流量的长期备用"
      ],
      "purchaseHref": "https://ermaozi01.ladderaff.com/#/?code=VZVXWbiq",
      "text": "云端买断·永不限时精英包，¥849/一次性，700GB",
      "oneTime": true
    }
  ],
  "山水云": [
    {
      "name": "64G/轻量套餐🎇",
      "priceText": "¥88.00 / 一年",
      "traffic": "每月 64 GB",
      "type": "周期订阅",
      "features": [
        "类型：月付 / 季度 / 半年 / 一年 / 两年 / 三年 / 一次性",
        "设备：同时在线 4 个设备",
        "备注：库存充足，中转 + 直连节点，支持 GPT、Tiktok 等全流媒体"
      ],
      "text": "64G/轻量套餐🎇，¥88.00 / 一年，每月 64 GB"
    },
    {
      "name": "128G/轻量套餐🎇",
      "priceText": "¥88.00 / 半年",
      "traffic": "每月 128 GB",
      "type": "周期订阅",
      "features": [
        "类型：月付 / 季度 / 半年 / 一年 / 两年 / 三年 / 一次性",
        "设备：同时在线 6 个设备",
        "备注：库存充足，中转 + 直连节点，支持 GPT、Tiktok 等全流媒体"
      ],
      "text": "128G/轻量套餐🎇，¥88.00 / 半年，每月 128 GB"
    },
    {
      "name": "256G/轻量套餐🎇",
      "priceText": "¥75.00 / 季度",
      "traffic": "每月 256 GB",
      "type": "周期订阅",
      "features": [
        "类型：月付 / 季度 / 半年 / 一年 / 两年 / 三年 / 一次性",
        "设备：同时在线 8 个设备",
        "备注：库存充足，中转 + 直连节点，支持 GPT、Tiktok 等全流媒体"
      ],
      "text": "256G/轻量套餐🎇，¥75.00 / 季度，每月 256 GB"
    },
    {
      "name": "100G/月-琴",
      "priceText": "¥14.99 / 月付",
      "traffic": "每月 100 GB",
      "type": "周期订阅",
      "features": [
        "类型：月付",
        "设备：在线 3 个设备",
        "备注：库存充足，中转 + 直连节点，支持 GPT、Tiktok 等全流媒体"
      ],
      "text": "100G/月-琴，¥14.99 / 月付，每月 100 GB"
    },
    {
      "name": "200G/月-棋",
      "priceText": "¥25.00 / 月付",
      "traffic": "每月 200 GB",
      "type": "周期订阅",
      "features": [
        "类型：月付",
        "设备：在线 5 个设备",
        "备注：库存充足，中转 + 直连节点，三年档相对折扣约 1%"
      ],
      "text": "200G/月-棋，¥25.00 / 月付，每月 200 GB"
    },
    {
      "name": "500G/月-书",
      "priceText": "¥50.00 / 月付",
      "traffic": "每月 500 GB",
      "type": "周期订阅",
      "features": [
        "类型：月付",
        "设备：在线 8 个设备",
        "备注：库存充足，中转 + 直连节点，支持 GPT、Tiktok 等全流媒体"
      ],
      "text": "500G/月-书，¥50.00 / 月付，每月 500 GB"
    },
    {
      "name": "999G/月-画",
      "priceText": "¥88.00 / 月付",
      "traffic": "每月 1000 GB",
      "type": "周期订阅",
      "features": [
        "类型：月付",
        "设备：在线 10 个设备",
        "备注：库存充足，中转 + 直连节点，支持 GPT、Tiktok 等全流媒体"
      ],
      "text": "999G/月-画，¥88.00 / 月付，每月 1000 GB"
    },
    {
      "name": "100G/不限时-梅兰",
      "priceText": "¥99.00 / 一次性",
      "traffic": "永久 100 GB",
      "type": "不限时流量包",
      "features": [
        "类型：一次性",
        "设备：在线 5 个设备",
        "备注：库存充足，不限时间，流量用完作废，重复购买不叠加"
      ],
      "text": "100G/不限时-梅兰，¥99.00 / 一次性，永久 100 GB",
      "oneTime": true
    },
    {
      "name": "300G/不限时-竹菊",
      "priceText": "¥222.00 / 一次性",
      "traffic": "永久 300 GB",
      "type": "不限时流量包",
      "features": [
        "类型：一次性",
        "设备：在线 5 个设备",
        "备注：库存充足，不限时间，流量用完作废，重复购买不叠加"
      ],
      "text": "300G/不限时-竹菊，¥222.00 / 一次性，永久 300 GB",
      "oneTime": true
    }
  ],
  "星岛梦": [
    {
      "name": "星岛梦 · 极速版",
      "priceText": "¥16.00/月",
      "traffic": "100GB/月",
      "type": "周期订阅",
      "features": [
        "特点：全IPLC专线，晚高峰不降速"
      ],
      "purchaseHref": "https://ermaov1.xdmvipaff.cc/#/?code=O9Q9H6VY",
      "text": "星岛梦 · 极速版，¥16.00/月，100GB/月"
    },
    {
      "name": "星岛梦 · 进阶版",
      "priceText": "¥32.00/月",
      "traffic": "200GB/月",
      "type": "周期订阅",
      "features": [
        "特点：全IPLC专线，晚高峰不降速"
      ],
      "purchaseHref": "https://ermaov1.xdmvipaff.cc/#/?code=O9Q9H6VY",
      "text": "星岛梦 · 进阶版，¥32.00/月，200GB/月"
    },
    {
      "name": "星岛梦 · 闪光版",
      "priceText": "¥80.00/月",
      "traffic": "500GB/月",
      "type": "周期订阅",
      "features": [
        "特点：全IPLC专线，晚高峰不降速"
      ],
      "purchaseHref": "https://ermaov1.xdmvipaff.cc/#/?code=O9Q9H6VY",
      "text": "星岛梦 · 闪光版，¥80.00/月，500GB/月"
    },
    {
      "name": "星岛梦 · 旗舰版",
      "priceText": "¥160.00/月",
      "traffic": "1.0TB/月",
      "type": "周期订阅",
      "features": [
        "特点：全IPLC专线，晚高峰不降速"
      ],
      "purchaseHref": "https://ermaov1.xdmvipaff.cc/#/?code=O9Q9H6VY",
      "text": "星岛梦 · 旗舰版，¥160.00/月，1.0TB/月"
    },
    {
      "name": "星岛梦 · 永久不限时",
      "priceText": "¥680.00/一次性",
      "traffic": "1.0TB",
      "type": "不限时流量包",
      "features": [
        "特点：无限时长，用完为止"
      ],
      "purchaseHref": "https://ermaov1.xdmvipaff.cc/#/?code=O9Q9H6VY",
      "text": "星岛梦 · 永久不限时，¥680.00/一次性，1.0TB",
      "oneTime": true
    },
    {
      "name": "星岛梦 · 定制套餐",
      "priceText": "¥680.00/月",
      "traffic": "500GB",
      "type": "周期订阅",
      "features": [
        "特点：专属定制节点，独享原生IP"
      ],
      "purchaseHref": "https://ermaov1.xdmvipaff.cc/#/?code=O9Q9H6VY",
      "text": "星岛梦 · 定制套餐，¥680.00/月，500GB"
    }
  ],
  "灵动云": [
    {
      "name": "灵动·拂风",
      "priceText": "¥20/月；¥57/季；¥108/半年；¥204/年；¥384/两年；¥540/三年",
      "traffic": "100GB/月",
      "type": "周期订阅",
      "audience": "轻度日常使用，适合先月付体验",
      "purchaseHref": "https://ermaozi01.lingdongaff.com/#/?code=aJUlcAOo",
      "text": "灵动·拂风，¥20/月；¥57/季；¥108/半年；¥204/年；¥384/两年；¥540/三年，100GB/月"
    },
    {
      "name": "灵动·驭浪",
      "priceText": "¥50/月；¥142.50/季；¥270/半年；¥510/年；¥960/两年；¥1350/三年",
      "traffic": "300GB/月",
      "type": "周期订阅",
      "audience": "日常视频与 AI 工具使用",
      "purchaseHref": "https://ermaozi01.lingdongaff.com/#/?code=aJUlcAOo",
      "text": "灵动·驭浪，¥50/月；¥142.50/季；¥270/半年；¥510/年；¥960/两年；¥1350/三年，300GB/月"
    },
    {
      "name": "灵动·破晓",
      "priceText": "¥100/月；¥285/季；¥540/半年；¥1020/年；¥1920/两年；¥2700/三年",
      "traffic": "700GB/月",
      "type": "周期订阅",
      "audience": "中重度视频与多设备使用",
      "purchaseHref": "https://ermaozi01.lingdongaff.com/#/?code=aJUlcAOo",
      "text": "灵动·破晓，¥100/月；¥285/季；¥540/半年；¥1020/年；¥1920/两年；¥2700/三年，700GB/月"
    },
    {
      "name": "灵动·凌霄",
      "priceText": "¥180/月；¥513/季；¥972/半年；¥1836/年；¥3456/两年；¥4860/三年",
      "traffic": "1.5TB/月",
      "type": "周期订阅",
      "audience": "大流量用户",
      "purchaseHref": "https://ermaozi01.lingdongaff.com/#/?code=aJUlcAOo",
      "text": "灵动·凌霄，¥180/月；¥513/季；¥972/半年；¥1836/年；¥3456/两年；¥4860/三年，1.5TB/月"
    },
    {
      "name": "灵动·穿云",
      "priceText": "¥99/年",
      "traffic": "70GB/年",
      "type": "周期订阅",
      "audience": "使用频率较低、希望控制年费",
      "purchaseHref": "https://ermaozi01.lingdongaff.com/#/?code=aJUlcAOo",
      "text": "灵动·穿云，¥99/年，70GB/年"
    },
    {
      "name": "灵动云·至尊私人定制",
      "priceText": "¥620/月",
      "traffic": "500GB/月",
      "type": "周期订阅",
      "audience": "有定制线路需求的用户，下单前确认具体交付内容",
      "purchaseHref": "https://ermaozi01.lingdongaff.com/#/?code=aJUlcAOo",
      "text": "灵动云·至尊私人定制，¥620/月，500GB/月"
    },
    {
      "name": "灵动·闲云（小流量包）",
      "priceText": "¥199/一次性",
      "traffic": "150GB",
      "type": "不限时流量包",
      "features": [
        "特点：低频备用"
      ],
      "purchaseHref": "https://ermaozi01.lingdongaff.com/#/?code=aJUlcAOo",
      "text": "灵动·闲云（小流量包），¥199/一次性，150GB",
      "oneTime": true
    },
    {
      "name": "灵动·惊云（标准流量包）",
      "priceText": "¥499/一次性",
      "traffic": "400GB",
      "type": "不限时流量包",
      "features": [
        "特点：阶段性补充流量"
      ],
      "purchaseHref": "https://ermaozi01.lingdongaff.com/#/?code=aJUlcAOo",
      "text": "灵动·惊云（标准流量包），¥499/一次性，400GB",
      "oneTime": true
    },
    {
      "name": "灵动·飞云（精英流量包）",
      "priceText": "¥899/一次性",
      "traffic": "800GB",
      "type": "不限时流量包",
      "features": [
        "特点：较高流量的长期备用"
      ],
      "purchaseHref": "https://ermaozi01.lingdongaff.com/#/?code=aJUlcAOo",
      "text": "灵动·飞云（精英流量包），¥899/一次性，800GB",
      "oneTime": true
    }
  ],
  "runway": [
    {
      "name": "经济舱 (Economy)",
      "priceText": "¥9.90",
      "traffic": "100G/月",
      "type": "周期订阅",
      "features": [
        "国家接入：全球 5+ 国家",
        "速率/带宽：限速 200Mbps",
        "主要特点：性价比入门，支持 Netflix/YouTube 解锁"
      ],
      "purchaseHref": "https://www.runwayhz.com/#/register?code=RiIDywqb",
      "text": "经济舱 (Economy)，¥9.90，100G/月"
    },
    {
      "name": "商务舱 (Business)",
      "priceText": "¥19.90",
      "traffic": "200G/月",
      "type": "周期订阅",
      "features": [
        "国家接入：全球 10+ 国家",
        "速率/带宽：限速 400Mbps",
        "主要特点：晚高峰压力下依然流畅，支持 4K/8K 秒加载"
      ],
      "purchaseHref": "https://www.runwayhz.com/#/register?code=RiIDywqb",
      "text": "商务舱 (Business)，¥19.90，200G/月"
    },
    {
      "name": "头等舱 (First Class)",
      "priceText": "¥50.00",
      "traffic": "600G/月",
      "type": "周期订阅",
      "features": [
        "国家接入：全球 10+ 国家",
        "速率/带宽：不限速",
        "主要特点：BGP+IEPL 高速线路，7x24h 专业客服"
      ],
      "purchaseHref": "https://www.runwayhz.com/#/register?code=RiIDywqb",
      "text": "头等舱 (First Class)，¥50.00，600G/月"
    },
    {
      "name": "空中流量包 (Air traffic data package)",
      "priceText": "¥45.00/次",
      "traffic": "150G",
      "type": "周期订阅",
      "features": [
        "说明：不限时流量包；也可手动重置流量（45 CNY/次）"
      ],
      "purchaseHref": "https://www.runwayhz.com/#/register?code=RiIDywqb",
      "text": "空中流量包 (Air traffic data package)，¥45.00/次，150G"
    }
  ],
  "灯塔cloud": [
    {
      "name": "标准版",
      "priceText": "¥70.00/6个月",
      "traffic": "100GB/月",
      "type": "周期订阅",
      "purchaseHref": "https://www.dengta.cloud/#/register?code=n4jB4z5R",
      "text": "标准版，¥70.00/6个月，100GB/月"
    },
    {
      "name": "个人套餐(三个月)",
      "priceText": "¥89.00/三个月",
      "traffic": "600GB/月",
      "type": "周期订阅",
      "purchaseHref": "https://www.dengta.cloud/#/register?code=n4jB4z5R",
      "text": "个人套餐(三个月)，¥89.00/三个月，600GB/月"
    },
    {
      "name": "个人套餐(六个月)",
      "priceText": "¥155.00/六个月",
      "traffic": "600GB/月",
      "type": "周期订阅",
      "purchaseHref": "https://www.dengta.cloud/#/register?code=n4jB4z5R",
      "text": "个人套餐(六个月)，¥155.00/六个月，600GB/月"
    },
    {
      "name": "个人套餐(一年)",
      "priceText": "¥279.00/一年",
      "traffic": "600GB/月",
      "type": "周期订阅",
      "purchaseHref": "https://www.dengta.cloud/#/register?code=n4jB4z5R",
      "text": "个人套餐(一年)，¥279.00/一年，600GB/月"
    }
  ],
  "cyberguard": [
    {
      "name": "轻量套餐",
      "priceText": "¥18.00 /每月",
      "traffic": "100GB/月",
      "type": "周期订阅",
      "features": [
        "备注：月付、半年、一年、三年"
      ],
      "purchaseHref": "https://www.cyberguard.best/#/register?code=yoyUW3R9",
      "text": "轻量套餐，¥18.00 /每月，100GB/月"
    },
    {
      "name": "标准套餐",
      "priceText": "¥28.00 /每月",
      "traffic": "300GB/月",
      "type": "周期订阅",
      "features": [
        "备注：月付、季度、一年、三年"
      ],
      "purchaseHref": "https://www.cyberguard.best/#/register?code=yoyUW3R9",
      "text": "标准套餐，¥28.00 /每月，300GB/月"
    },
    {
      "name": "高速套餐",
      "priceText": "¥50.00 /每月",
      "traffic": "600GB/月",
      "type": "周期订阅",
      "features": [
        "备注：月付、季度、半年、一年、两年"
      ],
      "purchaseHref": "https://www.cyberguard.best/#/register?code=yoyUW3R9",
      "text": "高速套餐，¥50.00 /每月，600GB/月"
    },
    {
      "name": "200G不限时",
      "priceText": "¥79.00 /一次性",
      "traffic": "200GB/不限时",
      "type": "不限时流量包",
      "features": [
        "备注：一次性"
      ],
      "purchaseHref": "https://www.cyberguard.best/#/register?code=yoyUW3R9",
      "text": "200G不限时，¥79.00 /一次性，200GB/不限时",
      "oneTime": true
    },
    {
      "name": "700G不限时",
      "priceText": "¥188.00 /一次性",
      "traffic": "700GB/不限时",
      "type": "不限时流量包",
      "features": [
        "备注：一次性"
      ],
      "purchaseHref": "https://www.cyberguard.best/#/register?code=yoyUW3R9",
      "text": "700G不限时，¥188.00 /一次性，700GB/不限时",
      "oneTime": true
    },
    {
      "name": "企业套餐",
      "priceText": "¥200.00 /每月",
      "traffic": "2TB/月",
      "type": "周期订阅",
      "features": [
        "备注：月付、季度、半年"
      ],
      "purchaseHref": "https://www.cyberguard.best/#/register?code=yoyUW3R9",
      "text": "企业套餐，¥200.00 /每月，2TB/月"
    }
  ],
  "sogo云": [
    {
      "name": "基础版",
      "priceText": "25元/月",
      "traffic": "120GB/月",
      "type": "周期订阅",
      "audience": "轻度用户，主要浏览与社交",
      "features": [
        "速率限制：未标注"
      ],
      "purchaseHref": "https://ermaozi.sogoaff.com/#/login?code=yxneZJKR",
      "text": "基础版，25元/月，120GB/月"
    },
    {
      "name": "优选版",
      "priceText": "50元/月",
      "traffic": "250GB/月",
      "type": "周期订阅",
      "audience": "日常视频与AI工具使用",
      "features": [
        "速率限制：未标注"
      ],
      "purchaseHref": "https://ermaozi.sogoaff.com/#/login?code=yxneZJKR",
      "text": "优选版，50元/月，250GB/月"
    },
    {
      "name": "强化版",
      "priceText": "100元/月",
      "traffic": "500GB/月",
      "type": "周期订阅",
      "audience": "中重度用户，多平台并行",
      "features": [
        "速率限制：未标注"
      ],
      "purchaseHref": "https://ermaozi.sogoaff.com/#/login?code=yxneZJKR",
      "text": "强化版，100元/月，500GB/月"
    },
    {
      "name": "顶配版",
      "priceText": "200元/月",
      "traffic": "1000GB/月",
      "type": "周期订阅",
      "audience": "重度用户，高频流量需求",
      "features": [
        "速率限制：未标注"
      ],
      "purchaseHref": "https://ermaozi.sogoaff.com/#/login?code=yxneZJKR",
      "text": "顶配版，200元/月，1000GB/月"
    },
    {
      "name": "基础",
      "priceText": "100元",
      "traffic": "100GB",
      "type": "周期订阅",
      "audience": "临时备用用户",
      "features": [
        "速率限制：未标注"
      ],
      "purchaseHref": "https://ermaozi.sogoaff.com/#/login?code=yxneZJKR",
      "text": "基础，100元，100GB"
    },
    {
      "name": "优选",
      "priceText": "200元",
      "traffic": "250GB",
      "type": "周期订阅",
      "audience": "偶发出海需求",
      "features": [
        "速率限制：未标注"
      ],
      "purchaseHref": "https://ermaozi.sogoaff.com/#/login?code=yxneZJKR",
      "text": "优选，200元，250GB"
    },
    {
      "name": "强化",
      "priceText": "400元",
      "traffic": "500GB",
      "type": "周期订阅",
      "audience": "阶段性中流量需求",
      "features": [
        "速率限制：未标注"
      ],
      "purchaseHref": "https://ermaozi.sogoaff.com/#/login?code=yxneZJKR",
      "text": "强化，400元，500GB"
    },
    {
      "name": "至尊",
      "priceText": "800元",
      "traffic": "1000GB",
      "type": "周期订阅",
      "audience": "长周期备用需求",
      "features": [
        "速率限制：未标注"
      ],
      "purchaseHref": "https://ermaozi.sogoaff.com/#/login?code=yxneZJKR",
      "text": "至尊，800元，1000GB"
    }
  ],
  "寰宇云": [
    {
      "name": "限定年付小包",
      "priceText": "89元/年",
      "traffic": "60GB/月",
      "type": "周期订阅",
      "audience": "轻度用户、备用线用户",
      "features": [
        "速率或限制：中转 + 直连，适合低频使用"
      ],
      "purchaseHref": "https://vip4.huanyuyunbest.com/#/register?code=W82s7u2a",
      "text": "限定年付小包，89元/年，60GB/月"
    },
    {
      "name": "卫星",
      "priceText": "18元/月（活动后约14元）",
      "traffic": "150GB/月",
      "type": "周期订阅",
      "audience": "轻度到中度日常用户",
      "features": [
        "速率或限制：季付及以上每 30 天重置流量"
      ],
      "purchaseHref": "https://vip4.huanyuyunbest.com/#/register?code=W82s7u2a",
      "text": "卫星，18元/月（活动后约14元），150GB/月"
    },
    {
      "name": "行星",
      "priceText": "34元/月",
      "traffic": "300GB/月",
      "type": "周期订阅",
      "audience": "日常视频与 AI 工具用户",
      "features": [
        "速率或限制：1 年付 8 折，2 年付 7 折，3 年付 6 折"
      ],
      "purchaseHref": "https://vip4.huanyuyunbest.com/#/register?code=W82s7u2a",
      "text": "行星，34元/月，300GB/月"
    },
    {
      "name": "恒星",
      "priceText": "60元/月",
      "traffic": "600GB/月",
      "type": "周期订阅",
      "audience": "高频多设备用户",
      "features": [
        "速率或限制：1 年付 8 折，2 年付 7 折，3 年付 6 折"
      ],
      "purchaseHref": "https://vip4.huanyuyunbest.com/#/register?code=W82s7u2a",
      "text": "恒星，60元/月，600GB/月"
    },
    {
      "name": "巨量不限时",
      "priceText": "168元/一次性",
      "traffic": "1000GB 总量",
      "type": "不限时流量包",
      "audience": "低频长期备用用户",
      "features": [
        "速率或限制：不限时流量包，不按月清零"
      ],
      "purchaseHref": "https://vip4.huanyuyunbest.com/#/register?code=W82s7u2a",
      "text": "巨量不限时，168元/一次性，1000GB 总量",
      "oneTime": true
    },
    {
      "name": "海量不限时",
      "priceText": "398元/一次性",
      "traffic": "3000GB 总量",
      "type": "不限时流量包",
      "audience": "中长期非连续高流量用户",
      "features": [
        "速率或限制：不限时流量包，不按月清零"
      ],
      "purchaseHref": "https://vip4.huanyuyunbest.com/#/register?code=W82s7u2a",
      "text": "海量不限时，398元/一次性，3000GB 总量",
      "oneTime": true
    }
  ],
  "二猫云": [
    {
      "name": "白猫套餐",
      "priceText": "20元/月",
      "traffic": "100GB/月",
      "type": "周期订阅",
      "audience": "轻度用户、备用线用户",
      "features": [
        "速率限制：不限速"
      ],
      "purchaseHref": "https://v01.2maoyunaff.cc/#/register?code=6n2UaV1A",
      "text": "白猫套餐，20元/月，100GB/月"
    },
    {
      "name": "橘猫畅玩版",
      "priceText": "40元/月",
      "traffic": "200GB/月",
      "type": "周期订阅",
      "audience": "日常社交与中度视频用户",
      "features": [
        "速率限制：不限速"
      ],
      "purchaseHref": "https://v01.2maoyunaff.cc/#/register?code=6n2UaV1A",
      "text": "橘猫畅玩版，40元/月，200GB/月"
    },
    {
      "name": "牛奶猫尊享版",
      "priceText": "80元/月",
      "traffic": "400GB/月",
      "type": "周期订阅",
      "audience": "中重度流媒体与AI工具用户",
      "features": [
        "速率限制：不限速"
      ],
      "purchaseHref": "https://v01.2maoyunaff.cc/#/register?code=6n2UaV1A",
      "text": "牛奶猫尊享版，80元/月，400GB/月"
    },
    {
      "name": "黑猫无限版",
      "priceText": "160元/月",
      "traffic": "800GB/月",
      "type": "周期订阅",
      "audience": "高频多设备或团队协作用户",
      "features": [
        "速率限制：不限速"
      ],
      "purchaseHref": "https://v01.2maoyunaff.cc/#/register?code=6n2UaV1A",
      "text": "黑猫无限版，160元/月，800GB/月"
    }
  ],
  "快狸": [
    {
      "name": "森狸年付小套餐",
      "priceText": "120元/年",
      "traffic": "30GB/月",
      "billingCycle": "年付/两年/三年",
      "type": "周期订阅",
      "audience": "预算敏感、轻度备用",
      "text": "森狸年付小套餐，120元/年，30GB/月"
    },
    {
      "name": "月猩月付小套餐",
      "priceText": "15元/月",
      "traffic": "50GB/月",
      "billingCycle": "月付",
      "type": "周期订阅",
      "audience": "轻度日常使用",
      "text": "月猩月付小套餐，15元/月，50GB/月"
    },
    {
      "name": "小狸基础版",
      "priceText": "22元/月",
      "traffic": "100GB/月",
      "billingCycle": "月付/半年/一年",
      "type": "周期订阅",
      "audience": "轻中度用户",
      "text": "小狸基础版，22元/月，100GB/月"
    },
    {
      "name": "灵理标准版",
      "priceText": "35元/月",
      "traffic": "250GB/月",
      "billingCycle": "月付/季度/半年/一年",
      "type": "周期订阅",
      "audience": "日常中度使用",
      "text": "灵理标准版，35元/月，250GB/月"
    },
    {
      "name": "夜理强化版",
      "priceText": "95元/月",
      "traffic": "500GB/月",
      "billingCycle": "月付/季度/半年/一年",
      "type": "周期订阅",
      "audience": "多设备中高频",
      "text": "夜理强化版，95元/月，500GB/月"
    },
    {
      "name": "天狸顶配版",
      "priceText": "180元/月",
      "traffic": "1000GB/月",
      "billingCycle": "月付/季度/半年/一年",
      "type": "周期订阅",
      "audience": "重度流量需求",
      "text": "天狸顶配版，180元/月，1000GB/月"
    }
  ],
  "边缘节点": [
    {
      "name": "年付入门档",
      "priceText": "108元/年",
      "traffic": "45G",
      "type": "周期订阅",
      "features": [
        "更适合谁：预算敏感、轻度备用"
      ],
      "text": "年付入门档，108元/年，45G"
    },
    {
      "name": "标准套餐",
      "priceText": "25元/月",
      "traffic": "120G",
      "type": "周期订阅",
      "features": [
        "更适合谁：日常轻中度"
      ],
      "text": "标准套餐，25元/月，120G"
    },
    {
      "name": "进阶套餐",
      "priceText": "50元/月",
      "traffic": "250G",
      "type": "周期订阅",
      "features": [
        "更适合谁：中度视频和工具访问"
      ],
      "text": "进阶套餐，50元/月，250G"
    },
    {
      "name": "高级套餐",
      "priceText": "100元/月",
      "traffic": "500G",
      "type": "周期订阅",
      "features": [
        "更适合谁：高频多设备"
      ],
      "text": "高级套餐，100元/月，500G"
    },
    {
      "name": "极限套餐",
      "priceText": "200元/月",
      "traffic": "1000G",
      "type": "周期订阅",
      "features": [
        "更适合谁：中重度流量需求"
      ],
      "text": "极限套餐，200元/月，1000G"
    }
  ],
  "随便云": [
    {
      "name": "轻量Lite套餐",
      "priceText": "¥10.00/月",
      "traffic": "68 GB",
      "type": "周期订阅",
      "features": [
        "速率限制：500 Mbps",
        "设备数：3 台",
        "特性：入门首选，高速稳定"
      ],
      "purchaseHref": "https://wcnm.one/register?code=YZxHwCws",
      "text": "轻量Lite套餐，¥10.00/月，68 GB"
    },
    {
      "name": "进阶Pro套餐",
      "priceText": "¥20.00/月",
      "traffic": "168 GB",
      "type": "周期订阅",
      "features": [
        "速率限制：1000 Mbps",
        "设备数：5 台",
        "特性：进阶推荐，千兆速率"
      ],
      "purchaseHref": "https://wcnm.one/register?code=YZxHwCws",
      "text": "进阶Pro套餐，¥20.00/月，168 GB"
    },
    {
      "name": "终极Ultimate",
      "priceText": "¥40.00/月",
      "traffic": "388 GB",
      "type": "周期订阅",
      "features": [
        "速率限制：2000 Mbps",
        "设备数：8 台",
        "特性：大流量，2G超高速"
      ],
      "purchaseHref": "https://wcnm.one/register?code=YZxHwCws",
      "text": "终极Ultimate，¥40.00/月，388 GB"
    },
    {
      "name": "团队Team套餐",
      "priceText": "¥88.00/月",
      "traffic": "1000 GB",
      "type": "周期订阅",
      "features": [
        "速率限制：5000 Mbps",
        "设备数：15 台",
        "特性：团队共享，极致速率"
      ],
      "purchaseHref": "https://wcnm.one/register?code=YZxHwCws",
      "text": "团队Team套餐，¥88.00/月，1000 GB"
    },
    {
      "name": "100G不限时",
      "priceText": "¥28.00/次",
      "traffic": "100 GB",
      "type": "不限时流量包",
      "features": [
        "速率限制：1000 Mbps",
        "设备数：3 台",
        "特性：流量包，永久有效"
      ],
      "purchaseHref": "https://wcnm.one/register?code=YZxHwCws",
      "text": "100G不限时，¥28.00/次，100 GB",
      "oneTime": true
    },
    {
      "name": "288G不限时",
      "priceText": "¥68.00/次",
      "traffic": "288 GB",
      "type": "不限时流量包",
      "features": [
        "速率限制：不限制",
        "设备数：5 台",
        "特性：大包流量，速率无忧"
      ],
      "purchaseHref": "https://wcnm.one/register?code=YZxHwCws",
      "text": "288G不限时，¥68.00/次，288 GB",
      "oneTime": true
    }
  ],
  "ccyz": [
    {
      "name": "Lite 套餐 · 150G",
      "priceText": "¥15 / 月",
      "traffic": "150G/月",
      "type": "周期订阅",
      "audience": "轻度使用、影音追剧",
      "features": [
        "峰值带宽：取决于节点",
        "线路：IEPL 专线"
      ],
      "purchaseHref": "https://xxyun.at/?code=HOWnn58c",
      "text": "Lite 套餐 · 150G，¥15 / 月，150G/月"
    },
    {
      "name": "Pro 套餐 · 280G",
      "priceText": "¥25 / 月",
      "traffic": "280G/月",
      "type": "周期订阅",
      "audience": "日常/多设备用户",
      "features": [
        "峰值带宽：取决于节点",
        "线路：IEPL 专线"
      ],
      "purchaseHref": "https://xxyun.at/?code=HOWnn58c",
      "text": "Pro 套餐 · 280G，¥25 / 月，280G/月"
    }
  ],
  "浪网": [
    {
      "name": "浪网 入门",
      "priceText": "¥30/月",
      "traffic": "150GB/月",
      "type": "周期订阅",
      "audience": "网页、社交、短视频和轻度流媒体",
      "purchaseHref": "https://ermaozi01.wavenetaff.com/#/?code=hghwewpc",
      "text": "浪网 入门，¥30/月，150GB/月"
    },
    {
      "name": "浪网 进阶",
      "priceText": "¥70/月",
      "traffic": "400GB/月",
      "type": "周期订阅",
      "audience": "日常办公、AI 工具和中等频率视频",
      "purchaseHref": "https://ermaozi01.wavenetaff.com/#/?code=hghwewpc",
      "text": "浪网 进阶，¥70/月，400GB/月"
    },
    {
      "name": "浪网 高端",
      "priceText": "¥120/月",
      "traffic": "800GB/月",
      "type": "周期订阅",
      "audience": "高频视频、下载和远程办公",
      "purchaseHref": "https://ermaozi01.wavenetaff.com/#/?code=hghwewpc",
      "text": "浪网 高端，¥120/月，800GB/月"
    },
    {
      "name": "浪网 商业",
      "priceText": "¥200/月",
      "traffic": "2TB/月",
      "type": "周期订阅",
      "audience": "团队、大流量和高并发使用",
      "purchaseHref": "https://ermaozi01.wavenetaff.com/#/?code=hghwewpc",
      "text": "浪网 商业，¥200/月，2TB/月"
    },
    {
      "name": "浪网 年付标准",
      "priceText": "¥119/年",
      "traffic": "80GB/月",
      "type": "周期订阅",
      "audience": "轻度长期使用",
      "purchaseHref": "https://ermaozi01.wavenetaff.com/#/?code=hghwewpc",
      "text": "浪网 年付标准，¥119/年，80GB/月"
    },
    {
      "name": "浪网 定制线路包",
      "priceText": "¥640/月",
      "traffic": "500GB/月",
      "type": "周期订阅",
      "audience": "独立 IP、直播和跨境业务",
      "purchaseHref": "https://ermaozi01.wavenetaff.com/#/?code=hghwewpc",
      "text": "浪网 定制线路包，¥640/月，500GB/月"
    },
    {
      "name": "浪网 小流量包",
      "priceText": "¥239/一次性",
      "traffic": "180GB",
      "type": "不限时流量包",
      "features": [
        "特点：独立 IP、限 1 台设备"
      ],
      "purchaseHref": "https://ermaozi01.wavenetaff.com/#/?code=hghwewpc",
      "text": "浪网 小流量包，¥239/一次性，180GB",
      "oneTime": true
    },
    {
      "name": "浪网 标准流量包",
      "priceText": "¥569/一次性",
      "traffic": "450GB",
      "type": "不限时流量包",
      "features": [
        "特点：适合经常出差及两台设备使用"
      ],
      "purchaseHref": "https://ermaozi01.wavenetaff.com/#/?code=hghwewpc",
      "text": "浪网 标准流量包，¥569/一次性，450GB",
      "oneTime": true
    },
    {
      "name": "浪网 精英流量包",
      "priceText": "¥1099/一次性",
      "traffic": "900GB",
      "type": "不限时流量包",
      "features": [
        "特点：面向重度生产力和业务用户"
      ],
      "purchaseHref": "https://ermaozi01.wavenetaff.com/#/?code=hghwewpc",
      "text": "浪网 精英流量包，¥1099/一次性，900GB",
      "oneTime": true
    }
  ],
  "传送门": [
    {
      "name": "包月无限流量",
      "priceText": "¥68.00",
      "traffic": "不限量",
      "billingCycle": "月付",
      "type": "周期订阅",
      "features": [
        "设备数：1 台",
        "限速：500 Mbps",
        "备注：官方提示流量异常可能封禁"
      ],
      "text": "包月无限流量，¥68.00，不限量"
    },
    {
      "name": "包月 200G",
      "priceText": "¥29.80",
      "traffic": "200G/月",
      "billingCycle": "月付",
      "type": "周期订阅",
      "features": [
        "设备数：3 台",
        "限速：5000 Mbps",
        "备注：含全部节点"
      ],
      "text": "包月 200G，¥29.80，200G/月"
    },
    {
      "name": "包月 400G",
      "priceText": "¥39.90",
      "traffic": "400G/月",
      "billingCycle": "月付",
      "type": "周期订阅",
      "features": [
        "设备数：3 台",
        "限速：5000 Mbps",
        "备注：含全部节点"
      ],
      "text": "包月 400G，¥39.90，400G/月"
    },
    {
      "name": "包年 1000G",
      "priceText": "¥99.00",
      "traffic": "1000G/年",
      "billingCycle": "年付",
      "type": "周期订阅",
      "features": [
        "设备数：3 台",
        "限速：1000 Mbps",
        "备注：月均约 8 元"
      ],
      "text": "包年 1000G，¥99.00，1000G/年"
    },
    {
      "name": "永久 2000G",
      "priceText": "¥168.00",
      "traffic": "2000G 总量",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "features": [
        "设备数：3 台",
        "限速：2000 Mbps",
        "备注：官方标注“绝版”"
      ],
      "text": "永久 2000G，¥168.00，2000G 总量",
      "oneTime": true
    },
    {
      "name": "永久 3800G",
      "priceText": "¥268.00",
      "traffic": "3800G 总量",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "features": [
        "设备数：3 台",
        "限速：2000 Mbps",
        "备注：官方标注“绝版”"
      ],
      "text": "永久 3800G，¥268.00，3800G 总量",
      "oneTime": true
    },
    {
      "name": "家宽原生 IP 独享专线",
      "priceText": "¥488.00",
      "traffic": "定制",
      "billingCycle": "月付",
      "type": "周期订阅",
      "features": [
        "设备数：定制",
        "限速：定制",
        "备注：面向虾皮/TikTok/直播/跨境场景"
      ],
      "text": "家宽原生 IP 独享专线，¥488.00，定制"
    },
    {
      "name": "限时年付小包",
      "priceText": "¥99.00",
      "traffic": "59G/月，月重置",
      "billingCycle": "年付",
      "type": "周期订阅",
      "features": [
        "设备：仅个人使用",
        "带宽：不限速",
        "线路：主流国家 ANYCAST"
      ],
      "text": "限时年付小包，¥99.00，59G/月，月重置"
    },
    {
      "name": "行者",
      "priceText": "¥20.00",
      "traffic": "150G/月，月重置",
      "billingCycle": "月付",
      "type": "周期订阅",
      "features": [
        "设备：仅个人使用",
        "带宽：不限速",
        "线路：主流国家 ANYCAST"
      ],
      "text": "行者，¥20.00，150G/月，月重置"
    },
    {
      "name": "纵横",
      "priceText": "¥36.00",
      "traffic": "300G/月，月重置",
      "billingCycle": "月付",
      "type": "周期订阅",
      "features": [
        "设备：仅个人使用",
        "带宽：不限速",
        "线路：主流国家 ANYCAST"
      ],
      "text": "纵横，¥36.00，300G/月，月重置"
    },
    {
      "name": "凌霄",
      "priceText": "¥68.00",
      "traffic": "600G/月，月重置",
      "billingCycle": "月付",
      "type": "周期订阅",
      "features": [
        "设备：仅个人使用",
        "带宽：不限速",
        "线路：主流国家 ANYCAST"
      ],
      "text": "凌霄，¥68.00，600G/月，月重置"
    }
  ],
  "invisible": [
    {
      "name": "隐形人 白银纪元👑",
      "priceText": "¥24/月；¥68.4/季；¥129.6/半年；¥244.8/年；¥460.8/两年；¥648/三年",
      "traffic": "144GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://asfawsf.invisibleattt.sbs/#/?code=8q7IHM5V",
      "text": "隐形人 白银纪元👑，¥24/月；¥68.4/季；¥129.6/半年；¥244.8/年；¥460.8/两年；¥648/三年，144GB/周期"
    },
    {
      "name": "隐形人 黄金序列💥",
      "priceText": "¥48/月；¥136.8/季；¥259.2/半年；¥489.6/年；¥921.6/两年；¥1293/三年",
      "traffic": "360GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://asfawsf.invisibleattt.sbs/#/?code=8q7IHM5V",
      "text": "隐形人 黄金序列💥，¥48/月；¥136.8/季；¥259.2/半年；¥489.6/年；¥921.6/两年；¥1293/三年，360GB/周期"
    },
    {
      "name": "隐形人 铂金至臻🔱",
      "priceText": "¥105/月；¥299.25/季；¥567/半年；¥1071/年；¥2016/两年；¥2835/三年",
      "traffic": "750GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://asfawsf.invisibleattt.sbs/#/?code=8q7IHM5V",
      "text": "隐形人 铂金至臻🔱，¥105/月；¥299.25/季；¥567/半年；¥1071/年；¥2016/两年；¥2835/三年，750GB/周期"
    },
    {
      "name": "隐形人 钻石穹顶💎",
      "priceText": "¥185/月；¥527.25/季；¥999/半年；¥1887/年；¥3552/两年；¥4995/三年",
      "traffic": "1600GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://asfawsf.invisibleattt.sbs/#/?code=8q7IHM5V",
      "text": "隐形人 钻石穹顶💎，¥185/月；¥527.25/季；¥999/半年；¥1887/年；¥3552/两年；¥4995/三年，1600GB/周期"
    },
    {
      "name": "星耀风暴 365天不熄⚡",
      "priceText": "¥109/年",
      "traffic": "80GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://asfawsf.invisibleattt.sbs/#/?code=8q7IHM5V",
      "text": "星耀风暴 365天不熄⚡，¥109/年，80GB/周期"
    },
    {
      "name": "一次性小流量🌌",
      "priceText": "¥229/一次性",
      "traffic": "160GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://asfawsf.invisibleattt.sbs/#/?code=8q7IHM5V",
      "text": "一次性小流量🌌，¥229/一次性，160GB",
      "oneTime": true
    },
    {
      "name": "一次性标准流量包🌀",
      "priceText": "¥549/一次性",
      "traffic": "420GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://asfawsf.invisibleattt.sbs/#/?code=8q7IHM5V",
      "text": "一次性标准流量包🌀，¥549/一次性，420GB",
      "oneTime": true
    },
    {
      "name": "一次性精英流量包🌊",
      "priceText": "¥1199/一次性",
      "traffic": "1000GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://asfawsf.invisibleattt.sbs/#/?code=8q7IHM5V",
      "text": "一次性精英流量包🌊，¥1199/一次性，1000GB",
      "oneTime": true
    },
    {
      "name": "王者定制版✈",
      "priceText": "¥600/一次性",
      "traffic": "500GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://asfawsf.invisibleattt.sbs/#/?code=8q7IHM5V",
      "text": "王者定制版✈，¥600/一次性，500GB",
      "oneTime": true
    }
  ],
  "ssone": [
    {
      "name": "👑 每月-128G",
      "priceText": "¥15/月；¥42/季；¥75/半年；¥148/年",
      "traffic": "128GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://www.flybit6202.com/#/register?code=MmE2PsQJ",
      "text": "👑 每月-128G，¥15/月；¥42/季；¥75/半年；¥148/年，128GB/周期"
    },
    {
      "name": "👑 每月-192G",
      "priceText": "¥22/月；¥62/季；¥110/半年；¥216/年",
      "traffic": "192GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://www.flybit6202.com/#/register?code=MmE2PsQJ",
      "text": "👑 每月-192G，¥22/月；¥62/季；¥110/半年；¥216/年，192GB/周期"
    },
    {
      "name": "👑 每月-256G",
      "priceText": "¥28/月；¥80/季；¥140/半年；¥268/年",
      "traffic": "256GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://www.flybit6202.com/#/register?code=MmE2PsQJ",
      "text": "👑 每月-256G，¥28/月；¥80/季；¥140/半年；¥268/年，256GB/周期"
    },
    {
      "name": "👑 每月-512G",
      "priceText": "¥52/月；¥148/季；¥260/半年；¥498/年",
      "traffic": "512GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://www.flybit6202.com/#/register?code=MmE2PsQJ",
      "text": "👑 每月-512G，¥52/月；¥148/季；¥260/半年；¥498/年，512GB/周期"
    },
    {
      "name": "👑 不限时-128G",
      "priceText": "¥36/一次性",
      "traffic": "128GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://www.flybit6202.com/#/register?code=MmE2PsQJ",
      "text": "👑 不限时-128G，¥36/一次性，128GB",
      "oneTime": true
    },
    {
      "name": "👑 不限时-256G",
      "priceText": "¥68/一次性",
      "traffic": "256GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://www.flybit6202.com/#/register?code=MmE2PsQJ",
      "text": "👑 不限时-256G，¥68/一次性，256GB",
      "oneTime": true
    },
    {
      "name": "👑 不限时-512G",
      "priceText": "¥128/一次性",
      "traffic": "512GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://www.flybit6202.com/#/register?code=MmE2PsQJ",
      "text": "👑 不限时-512G，¥128/一次性，512GB",
      "oneTime": true
    },
    {
      "name": "👑 不限时-1024G",
      "priceText": "¥238/一次性",
      "traffic": "1024GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://www.flybit6202.com/#/register?code=MmE2PsQJ",
      "text": "👑 不限时-1024G，¥238/一次性，1024GB",
      "oneTime": true
    }
  ],
  "龙猫云": [
    {
      "name": "VIP1套餐",
      "priceText": "¥15/月；¥41/季；¥77/半年；¥144/年；¥252/两年；¥324/三年",
      "traffic": "100GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.lmvipaff.com/register?aff=aOkm2wPW",
      "text": "VIP1套餐，¥15/月；¥41/季；¥77/半年；¥144/年；¥252/两年；¥324/三年，100GB/周期"
    },
    {
      "name": "VIP2套餐",
      "priceText": "¥30/月；¥81/季；¥153/半年；¥288/年；¥504/两年；¥648/三年",
      "traffic": "200GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.lmvipaff.com/register?aff=aOkm2wPW",
      "text": "VIP2套餐，¥30/月；¥81/季；¥153/半年；¥288/年；¥504/两年；¥648/三年，200GB/周期"
    },
    {
      "name": "VIP3套餐",
      "priceText": "¥60/月；¥162/季；¥306/半年；¥576/年；¥1008/两年；¥1296/三年",
      "traffic": "400GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.lmvipaff.com/register?aff=aOkm2wPW",
      "text": "VIP3套餐，¥60/月；¥162/季；¥306/半年；¥576/年；¥1008/两年；¥1296/三年，400GB/周期"
    },
    {
      "name": "DIY定制套餐",
      "priceText": "¥680/月",
      "traffic": "0GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.lmvipaff.com/register?aff=aOkm2wPW",
      "text": "DIY定制套餐，¥680/月，0GB/周期"
    },
    {
      "name": "VIP4套餐",
      "priceText": "¥120/月；¥324/季；¥697/半年；¥1152/年；¥2016/两年；¥2592/三年",
      "traffic": "1000GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.lmvipaff.com/register?aff=aOkm2wPW",
      "text": "VIP4套餐，¥120/月；¥324/季；¥697/半年；¥1152/年；¥2016/两年；¥2592/三年，1000GB/周期"
    }
  ],
  "superbiu": [
    {
      "name": "Small Biu 50G",
      "priceText": "¥14/月；¥41/季；¥80/半年；¥158/年；¥313/两年；¥470/三年",
      "traffic": "50GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "Small Biu 50G，¥14/月；¥41/季；¥80/半年；¥158/年；¥313/两年；¥470/三年，50GB/周期"
    },
    {
      "name": "Mini Biu 100G",
      "priceText": "¥19/月；¥56/季；¥110/半年；¥218/年；¥435/两年；¥650/三年",
      "traffic": "100GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "Mini Biu 100G，¥19/月；¥56/季；¥110/半年；¥218/年；¥435/两年；¥650/三年，100GB/周期"
    },
    {
      "name": "Mini Biu 200G",
      "priceText": "¥32/月；¥96/季；¥190/半年；¥378/年；¥752/两年；¥1128/三年",
      "traffic": "200GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "Mini Biu 200G，¥32/月；¥96/季；¥190/半年；¥378/年；¥752/两年；¥1128/三年，200GB/周期"
    },
    {
      "name": "Medium Biu 300G",
      "priceText": "¥47/月；¥139/季；¥276/半年；¥550/年；¥1095/两年；¥1640/三年",
      "traffic": "300GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "Medium Biu 300G，¥47/月；¥139/季；¥276/半年；¥550/年；¥1095/两年；¥1640/三年，300GB/周期"
    },
    {
      "name": "Medium Biu 500G",
      "priceText": "¥77/月；¥229/季；¥456/半年；¥910/年；¥1815/两年；¥2720/三年",
      "traffic": "500GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "Medium Biu 500G，¥77/月；¥229/季；¥456/半年；¥910/年；¥1815/两年；¥2720/三年，500GB/周期"
    },
    {
      "name": "Medium Biu 1T",
      "priceText": "¥150/月；¥448/季；¥894/半年；¥1786/年；¥3565/两年；¥5345/三年",
      "traffic": "1000GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "Medium Biu 1T，¥150/月；¥448/季；¥894/半年；¥1786/年；¥3565/两年；¥5345/三年，1000GB/周期"
    },
    {
      "name": "super Pack 2T",
      "priceText": "¥293/月；¥879/季；¥1755/半年；¥3505/年；¥7010/两年",
      "traffic": "2000GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "super Pack 2T，¥293/月；¥879/季；¥1755/半年；¥3505/年；¥7010/两年，2000GB/周期"
    },
    {
      "name": "super Pack 4T",
      "priceText": "¥560/月；¥1675/季；¥3340/半年；¥6670/年",
      "traffic": "4000GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "super Pack 4T，¥560/月；¥1675/季；¥3340/半年；¥6670/年，4000GB/周期"
    },
    {
      "name": "Biu One-Year Data 120G",
      "priceText": "¥40/年",
      "traffic": "120GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "Biu One-Year Data 120G，¥40/年，120GB/周期"
    },
    {
      "name": "Biu One-Year Data 240G",
      "priceText": "¥79/年",
      "traffic": "240GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "Biu One-Year Data 240G，¥79/年，240GB/周期"
    },
    {
      "name": "Biu One-Year Data 380G",
      "priceText": "¥128/年",
      "traffic": "380GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "Biu One-Year Data 380G，¥128/年，380GB/周期"
    },
    {
      "name": "Biu One-Year Data 880G",
      "priceText": "¥238/年",
      "traffic": "880GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "Biu One-Year Data 880G，¥238/年，880GB/周期"
    },
    {
      "name": "Biu One-Year Data 1380G",
      "priceText": "¥355/年",
      "traffic": "1380GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "Biu One-Year Data 1380G，¥355/年，1380GB/周期"
    },
    {
      "name": "Biu One-Year Data 1880G",
      "priceText": "¥470/年",
      "traffic": "1880GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "Biu One-Year Data 1880G，¥470/年，1880GB/周期"
    },
    {
      "name": "独享节点定制",
      "priceText": "¥99/月",
      "traffic": "1GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "独享节点定制，¥99/月，1GB/周期"
    },
    {
      "name": "企业/工作室/跨境IEPL专线定制",
      "priceText": "¥2000/月",
      "traffic": "100GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "企业/工作室/跨境IEPL专线定制，¥2000/月，100GB/周期"
    },
    {
      "name": "企业/工作室/跨境IPLC专线定制",
      "priceText": "¥5000/月",
      "traffic": "0GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://biubiux.online/#/register?code=BasmsULb",
      "text": "企业/工作室/跨境IPLC专线定制，¥5000/月，0GB/周期"
    }
  ],
  "闪狐云": [
    {
      "name": "Standard Plan",
      "priceText": "¥40/月；¥108/季；¥204/半年；¥384/年；¥672/两年；¥864/三年",
      "traffic": "240GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://erozi01.ffvipaff.cc/register?aff=NCO1w4Iv",
      "text": "Standard Plan，¥40/月；¥108/季；¥204/半年；¥384/年；¥672/两年；¥864/三年，240GB/周期"
    },
    {
      "name": "Advanced Plan",
      "priceText": "¥72/月；¥194/季；¥367/半年；¥691/年；¥1209/两年；¥1555/三年",
      "traffic": "500GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://erozi01.ffvipaff.cc/register?aff=NCO1w4Iv",
      "text": "Advanced Plan，¥72/月；¥194/季；¥367/半年；¥691/年；¥1209/两年；¥1555/三年，500GB/周期"
    },
    {
      "name": "Premium Plan",
      "priceText": "¥125/月；¥337/季；¥637/半年；¥1200/年；¥2100/两年；¥2700/三年",
      "traffic": "1000GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://erozi01.ffvipaff.cc/register?aff=NCO1w4Iv",
      "text": "Premium Plan，¥125/月；¥337/季；¥637/半年；¥1200/年；¥2100/两年；¥2700/三年，1000GB/周期"
    },
    {
      "name": "Basic Plan",
      "priceText": "¥20/月；¥54/季；¥102/半年；¥192/年；¥336/两年；¥432/三年",
      "traffic": "120GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://erozi01.ffvipaff.cc/register?aff=NCO1w4Iv",
      "text": "Basic Plan，¥20/月；¥54/季；¥102/半年；¥192/年；¥336/两年；¥432/三年，120GB/周期"
    }
  ],
  "梦想云": [
    {
      "name": "轻度-入门套餐",
      "priceText": "¥8.8/月；¥25.87/季；¥50.16/半年；¥96/年",
      "traffic": "100GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://gx.dreamcl.sbs/#/register?code=GFUAEweX",
      "text": "轻度-入门套餐，¥8.8/月；¥25.87/季；¥50.16/半年；¥96/年，100GB/周期"
    },
    {
      "name": "豪华-进阶套餐",
      "priceText": "¥13/月；¥38.22/季；¥74.1/半年；¥140.4/年",
      "traffic": "300GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://gx.dreamcl.sbs/#/register?code=GFUAEweX",
      "text": "豪华-进阶套餐，¥13/月；¥38.22/季；¥74.1/半年；¥140.4/年，300GB/周期"
    },
    {
      "name": "重度-进阶套餐",
      "priceText": "¥30/月；¥88.2/季；¥171/半年；¥324/年",
      "traffic": "400GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://gx.dreamcl.sbs/#/register?code=GFUAEweX",
      "text": "重度-进阶套餐，¥30/月；¥88.2/季；¥171/半年；¥324/年，400GB/周期"
    },
    {
      "name": "TK专线(联系客服)贵宾V2",
      "priceText": "¥250/月",
      "traffic": "100000GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://gx.dreamcl.sbs/#/register?code=GFUAEweX",
      "text": "TK专线(联系客服)贵宾V2，¥250/月，100000GB/周期"
    },
    {
      "name": "TK专线(联系客服)贵宾V3",
      "priceText": "¥300/月",
      "traffic": "10000GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://gx.dreamcl.sbs/#/register?code=GFUAEweX",
      "text": "TK专线(联系客服)贵宾V3，¥300/月，10000GB/周期"
    }
  ],
  "tnt": [
    {
      "name": "TNT:VIP1",
      "priceText": "¥20/月；¥54/季；¥102/半年；¥192/年；¥336/两年；¥432/三年",
      "traffic": "110GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi02.tntvipaff.cc/#/register?code=f1EyPwf3",
      "text": "TNT:VIP1，¥20/月；¥54/季；¥102/半年；¥192/年；¥336/两年；¥432/三年，110GB/周期"
    },
    {
      "name": "TNT:VIP2",
      "priceText": "¥40/月；¥108/季；¥204/半年；¥336/年；¥672/两年；¥864/三年",
      "traffic": "220GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi02.tntvipaff.cc/#/register?code=f1EyPwf3",
      "text": "TNT:VIP2，¥40/月；¥108/季；¥204/半年；¥336/年；¥672/两年；¥864/三年，220GB/周期"
    },
    {
      "name": "TNT:VIP3",
      "priceText": "¥80/月；¥216/季；¥408/半年；¥768/年；¥1344/两年；¥1728/三年",
      "traffic": "460GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi02.tntvipaff.cc/#/register?code=f1EyPwf3",
      "text": "TNT:VIP3，¥80/月；¥216/季；¥408/半年；¥768/年；¥1344/两年；¥1728/三年，460GB/周期"
    },
    {
      "name": "DIY定制套餐",
      "priceText": "¥680/月",
      "traffic": "0GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi02.tntvipaff.cc/#/register?code=f1EyPwf3",
      "text": "DIY定制套餐，¥680/月，0GB/周期"
    },
    {
      "name": "TNT:VIP4",
      "priceText": "¥160/月；¥432/季；¥816/半年；¥1536/年；¥2688/两年；¥3456/三年",
      "traffic": "1100GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi02.tntvipaff.cc/#/register?code=f1EyPwf3",
      "text": "TNT:VIP4，¥160/月；¥432/季；¥816/半年；¥1536/年；¥2688/两年；¥3456/三年，1100GB/周期"
    },
    {
      "name": "TNT：季付限量包",
      "priceText": "¥30/季",
      "traffic": "60GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi02.tntvipaff.cc/#/register?code=f1EyPwf3",
      "text": "TNT：季付限量包，¥30/季，60GB/周期"
    },
    {
      "name": "TNT：年付限量包",
      "priceText": "¥98/年",
      "traffic": "60GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi02.tntvipaff.cc/#/register?code=f1EyPwf3",
      "text": "TNT：年付限量包，¥98/年，60GB/周期"
    }
  ],
  "_99bar": [
    {
      "name": "🔥九九@全年特惠套餐",
      "priceText": "¥99.99/年",
      "traffic": "66GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://99vpn.bar/#/register?code=qzpkbzHF",
      "text": "🔥九九@全年特惠套餐，¥99.99/年，66GB/周期"
    },
    {
      "name": "💥九九@特惠月套餐",
      "priceText": "¥9.9/月；¥29.9/季",
      "traffic": "70GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://99vpn.bar/#/register?code=qzpkbzHF",
      "text": "💥九九@特惠月套餐，¥9.9/月；¥29.9/季，70GB/周期"
    },
    {
      "name": "🏆九九@星耀VIP",
      "priceText": "¥12.99/月；¥36.99/季；¥72.99/半年；¥139.99/年",
      "traffic": "99GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://99vpn.bar/#/register?code=qzpkbzHF",
      "text": "🏆九九@星耀VIP，¥12.99/月；¥36.99/季；¥72.99/半年；¥139.99/年，99GB/周期"
    },
    {
      "name": "🥇九九@铂金VIP",
      "priceText": "¥24.99/月；¥72.99/季；¥139.99/半年；¥274.99/年",
      "traffic": "199GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://99vpn.bar/#/register?code=qzpkbzHF",
      "text": "🥇九九@铂金VIP，¥24.99/月；¥72.99/季；¥139.99/半年；¥274.99/年，199GB/周期"
    },
    {
      "name": "💎九九@钻石VIP",
      "priceText": "¥36.99/月；¥108.99/季；¥212.99/半年；¥419.99/年",
      "traffic": "299GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://99vpn.bar/#/register?code=qzpkbzHF",
      "text": "💎九九@钻石VIP，¥36.99/月；¥108.99/季；¥212.99/半年；¥419.99/年，299GB/周期"
    },
    {
      "name": "🌟 九九@星钻SVIP",
      "priceText": "¥35.9/一次性",
      "traffic": "111GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://99vpn.bar/#/register?code=qzpkbzHF",
      "text": "🌟 九九@星钻SVIP，¥35.9/一次性，111GB",
      "oneTime": true
    },
    {
      "name": "🔱 九九@至尊SVIP",
      "priceText": "¥69.9/一次性",
      "traffic": "222GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://99vpn.bar/#/register?code=qzpkbzHF",
      "text": "🔱 九九@至尊SVIP，¥69.9/一次性，222GB",
      "oneTime": true
    },
    {
      "name": "👑九九@皇冠SVIP",
      "priceText": "¥139.99/一次性",
      "traffic": "555GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://99vpn.bar/#/register?code=qzpkbzHF",
      "text": "👑九九@皇冠SVIP，¥139.99/一次性，555GB",
      "oneTime": true
    },
    {
      "name": "⚜️九九@尊耀SVIP",
      "priceText": "¥259.99/一次性",
      "traffic": "1111GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://99vpn.bar/#/register?code=qzpkbzHF",
      "text": "⚜️九九@尊耀SVIP，¥259.99/一次性，1111GB",
      "oneTime": true
    }
  ],
  "掌中世界": [
    {
      "name": "Basic",
      "priceText": "¥27/月；¥81/季；¥162/半年；¥324/年",
      "traffic": "150GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://qq.zjs2025.com/user/register?code=S74QiRGN",
      "text": "Basic，¥27/月；¥81/季；¥162/半年；¥324/年，150GB/周期"
    },
    {
      "name": "Pro",
      "priceText": "¥30/月；¥90/季；¥180/半年；¥360/年",
      "traffic": "420GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://qq.zjs2025.com/user/register?code=S74QiRGN",
      "text": "Pro，¥30/月；¥90/季；¥180/半年；¥360/年，420GB/周期"
    },
    {
      "name": "Air",
      "priceText": "¥168/年",
      "traffic": "60GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://qq.zjs2025.com/user/register?code=S74QiRGN",
      "text": "Air，¥168/年，60GB/周期"
    },
    {
      "name": "Ultra",
      "priceText": "¥589/一次性",
      "traffic": "5550GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://qq.zjs2025.com/user/register?code=S74QiRGN",
      "text": "Ultra，¥589/一次性，5550GB",
      "oneTime": true
    }
  ],
  "firefly": [
    {
      "name": "Firefly年付版",
      "priceText": "¥96/年",
      "traffic": "60GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.fireflyaff.com/#/?code=BUtf2Bj2",
      "text": "Firefly年付版，¥96/年，60GB/周期"
    },
    {
      "name": "Firefly Lite",
      "priceText": "¥25/月；¥67/季；¥127/半年；¥240/年；¥420/两年；¥540/三年",
      "traffic": "150GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.fireflyaff.com/#/?code=BUtf2Bj2",
      "text": "Firefly Lite，¥25/月；¥67/季；¥127/半年；¥240/年；¥420/两年；¥540/三年，150GB/周期"
    },
    {
      "name": "Firefly Plus",
      "priceText": "¥45/月；¥121/季；¥229/半年；¥432/年；¥756/两年；¥972/三年",
      "traffic": "300GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.fireflyaff.com/#/?code=BUtf2Bj2",
      "text": "Firefly Plus，¥45/月；¥121/季；¥229/半年；¥432/年；¥756/两年；¥972/三年，300GB/周期"
    },
    {
      "name": "Firefly Blaze",
      "priceText": "¥85/月；¥229/季；¥433/半年；¥816/年；¥1428/两年；¥1836/三年",
      "traffic": "600GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.fireflyaff.com/#/?code=BUtf2Bj2",
      "text": "Firefly Blaze，¥85/月；¥229/季；¥433/半年；¥816/年；¥1428/两年；¥1836/三年，600GB/周期"
    },
    {
      "name": "Firefly Nova",
      "priceText": "¥150/月；¥400/季；¥750/半年；¥1360/年；¥2399/两年；¥3119/三年",
      "traffic": "1000GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.fireflyaff.com/#/?code=BUtf2Bj2",
      "text": "Firefly Nova，¥150/月；¥400/季；¥750/半年；¥1360/年；¥2399/两年；¥3119/三年，1000GB/周期"
    },
    {
      "name": "Firefly不限时",
      "priceText": "¥100/一次性",
      "traffic": "100GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://ermaozi01.fireflyaff.com/#/?code=BUtf2Bj2",
      "text": "Firefly不限时，¥100/一次性，100GB",
      "oneTime": true
    }
  ],
  "无忧链接": [
    {
      "name": "MINI链接",
      "priceText": "¥79/年",
      "traffic": "40GB/月",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.worryfreeaff.com/#/?code=xSLORrqb",
      "text": "MINI链接，¥79/年，40GB/月"
    },
    {
      "name": "舒心链接",
      "priceText": "¥12.92/月；¥34.68/季；¥65.28/半年；¥123.76/年",
      "traffic": "100GB/月",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.worryfreeaff.com/#/?code=xSLORrqb",
      "text": "舒心链接，¥12.92/月；¥34.68/季；¥65.28/半年；¥123.76/年，100GB/月"
    },
    {
      "name": "省心链接",
      "priceText": "¥22.44/月；¥60.52/季；¥114.24/半年；¥214.88/年",
      "traffic": "200GB/月",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.worryfreeaff.com/#/?code=xSLORrqb",
      "text": "省心链接，¥22.44/月；¥60.52/季；¥114.24/半年；¥214.88/年，200GB/月"
    },
    {
      "name": "随心链接",
      "priceText": "¥52.36/月；¥140.76/季；¥266.56/半年；¥502.52/年",
      "traffic": "500GB/月",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.worryfreeaff.com/#/?code=xSLORrqb",
      "text": "随心链接，¥52.36/月；¥140.76/季；¥266.56/半年；¥502.52/年，500GB/月"
    },
    {
      "name": "忘忧链接",
      "priceText": "¥117/月；¥315/季；¥596/半年；¥1123/年；¥1965/两年；¥2527/三年",
      "traffic": "1000GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.worryfreeaff.com/#/?code=xSLORrqb",
      "text": "忘忧链接，¥117/月；¥315/季；¥596/半年；¥1123/年；¥1965/两年；¥2527/三年，1000GB/周期"
    },
    {
      "name": "100G永久不限时 无忧链接（参与优惠券，限时6.8折）",
      "priceText": "¥108/一次性",
      "traffic": "100GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://ermaozi01.worryfreeaff.com/#/?code=xSLORrqb",
      "text": "100G永久不限时 无忧链接（参与优惠券，限时6.8折），¥108/一次性，100GB",
      "oneTime": true
    },
    {
      "name": "300G永久不限时 无忧链接（参与优惠券，限时6.8折）",
      "priceText": "¥298/一次性",
      "traffic": "300GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://ermaozi01.worryfreeaff.com/#/?code=xSLORrqb",
      "text": "300G永久不限时 无忧链接（参与优惠券，限时6.8折），¥298/一次性，300GB",
      "oneTime": true
    }
  ],
  "u1s1": [
    {
      "name": "u1s1 · 就是好用包",
      "priceText": "¥96/年；¥180/两年；¥270/三年",
      "traffic": "60GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.vipaff.cc/#/?code=FC32x5Vs",
      "text": "u1s1 · 就是好用包，¥96/年；¥180/两年；¥270/三年，60GB/周期"
    },
    {
      "name": "u1s1 · 普通人真够了包",
      "priceText": "¥20/月；¥54/季；¥102/半年；¥192/年；¥336/两年；¥432/三年",
      "traffic": "120GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.vipaff.cc/#/?code=FC32x5Vs",
      "text": "u1s1 · 普通人真够了包，¥20/月；¥54/季；¥102/半年；¥192/年；¥336/两年；¥432/三年，120GB/周期"
    },
    {
      "name": "u1s1 · 你以为用不到包",
      "priceText": "¥40/月；¥108/季；¥204/半年；¥384/年；¥568/两年；¥864/三年",
      "traffic": "300GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.vipaff.cc/#/?code=FC32x5Vs",
      "text": "u1s1 · 你以为用不到包，¥40/月；¥108/季；¥204/半年；¥384/年；¥568/两年；¥864/三年，300GB/周期"
    },
    {
      "name": "u1s1 · 瘾大就拉满包",
      "priceText": "¥100/月；¥270/季；¥510/半年；¥960/年；¥1920/两年；¥2160/三年",
      "traffic": "700GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.vipaff.cc/#/?code=FC32x5Vs",
      "text": "u1s1 · 瘾大就拉满包，¥100/月；¥270/季；¥510/半年；¥960/年；¥1920/两年；¥2160/三年，700GB/周期"
    },
    {
      "name": "u1s1 · 我全都要包",
      "priceText": "¥180/月；¥486/季；¥918/半年；¥1728/年；¥3024/两年；¥3888/三年",
      "traffic": "1500GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.vipaff.cc/#/?code=FC32x5Vs",
      "text": "u1s1 · 我全都要包，¥180/月；¥486/季；¥918/半年；¥1728/年；¥3024/两年；¥3888/三年，1500GB/周期"
    },
    {
      "name": "u1s1 · 定制包",
      "priceText": "¥600/月",
      "traffic": "0GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.vipaff.cc/#/?code=FC32x5Vs",
      "text": "u1s1 · 定制包，¥600/月，0GB/周期"
    }
  ],
  "kuajiecloud": [
    {
      "name": "跨界年付版（¥96/年 · 60GB）",
      "priceText": "¥96/年",
      "traffic": "60GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://vipermaozi.kuajieaff.com/#/?code=lPz0u1LR",
      "text": "跨界年付版（¥96/年 · 60GB），¥96/年，60GB/周期"
    },
    {
      "name": "轻云 Lite（¥20/月 · 120GB）",
      "priceText": "¥20/月；¥54/季；¥102/半年；¥192/年；¥336/两年；¥432/三年",
      "traffic": "120GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://vipermaozi.kuajieaff.com/#/?code=lPz0u1LR",
      "text": "轻云 Lite（¥20/月 · 120GB），¥20/月；¥54/季；¥102/半年；¥192/年；¥336/两年；¥432/三年，120GB/周期"
    },
    {
      "name": "跃云 Leap（¥40/月 · 330GB",
      "priceText": "¥40/月；¥108/季；¥204/半年；¥384/年；¥672/两年；¥864/三年",
      "traffic": "330GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://vipermaozi.kuajieaff.com/#/?code=lPz0u1LR",
      "text": "跃云 Leap（¥40/月 · 330GB，¥40/月；¥108/季；¥204/半年；¥384/年；¥672/两年；¥864/三年，330GB/周期"
    },
    {
      "name": "凌云 Soar（¥90/月 · 830GB）",
      "priceText": "¥90/月；¥243/季；¥459/半年；¥864/年；¥1512/两年；¥1944/三年",
      "traffic": "830GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://vipermaozi.kuajieaff.com/#/?code=lPz0u1LR",
      "text": "凌云 Soar（¥90/月 · 830GB），¥90/月；¥243/季；¥459/半年；¥864/年；¥1512/两年；¥1944/三年，830GB/周期"
    },
    {
      "name": "无界 Infinity（¥130/月 · 1800GB）",
      "priceText": "¥130/月；¥351/季；¥663/半年；¥1248/年；¥2184/两年；¥2808/三年",
      "traffic": "1800GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://vipermaozi.kuajieaff.com/#/?code=lPz0u1LR",
      "text": "无界 Infinity（¥130/月 · 1800GB），¥130/月；¥351/季；¥663/半年；¥1248/年；¥2184/两年；¥2808/三年，1800GB/周期"
    }
  ],
  "civetnet": [
    {
      "name": "灵猫·年付小包",
      "priceText": "¥85/年",
      "traffic": "45GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi.civetaff.com/#/?code=Ammn9sdD",
      "text": "灵猫·年付小包，¥85/年，45GB/周期"
    },
    {
      "name": "灵猫·年付Small",
      "priceText": "¥195/年",
      "traffic": "150GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi.civetaff.com/#/?code=Ammn9sdD",
      "text": "灵猫·年付Small，¥195/年，150GB/周期"
    },
    {
      "name": "灵猫·年付Big",
      "priceText": "¥295/年",
      "traffic": "300GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi.civetaff.com/#/?code=Ammn9sdD",
      "text": "灵猫·年付Big，¥295/年，300GB/周期"
    },
    {
      "name": "灵猫·季付Small",
      "priceText": "¥65/季",
      "traffic": "150GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi.civetaff.com/#/?code=Ammn9sdD",
      "text": "灵猫·季付Small，¥65/季，150GB/周期"
    },
    {
      "name": "灵猫·季付Big",
      "priceText": "¥125/季",
      "traffic": "300GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi.civetaff.com/#/?code=Ammn9sdD",
      "text": "灵猫·季付Big，¥125/季，300GB/周期"
    },
    {
      "name": "灵猫·月付Small",
      "priceText": "¥25/月",
      "traffic": "150GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi.civetaff.com/#/?code=Ammn9sdD",
      "text": "灵猫·月付Small，¥25/月，150GB/周期"
    },
    {
      "name": "灵猫·月付Big",
      "priceText": "¥45/月",
      "traffic": "300GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi.civetaff.com/#/?code=Ammn9sdD",
      "text": "灵猫·月付Big，¥45/月，300GB/周期"
    }
  ],
  "edge-x": [
    {
      "name": "标准版 - 循环 - 200GB",
      "priceText": "¥22.8/月；¥64.8/季；¥128.8/半年；¥248.8/年",
      "traffic": "200GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://edge-invite.com/#/register?code=LCH9laOs",
      "text": "标准版 - 循环 - 200GB，¥22.8/月；¥64.8/季；¥128.8/半年；¥248.8/年，200GB/周期"
    },
    {
      "name": "标准版 - 循环 - 300GB",
      "priceText": "¥34.8/月；¥98.8/季；¥198.8/半年；¥388.8/年",
      "traffic": "300GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://edge-invite.com/#/register?code=LCH9laOs",
      "text": "标准版 - 循环 - 300GB，¥34.8/月；¥98.8/季；¥198.8/半年；¥388.8/年，300GB/周期"
    },
    {
      "name": "团队版 - 循环 - 600GB",
      "priceText": "¥64.8/月；¥192.8/季；¥368.8/半年；¥728.8/年",
      "traffic": "600GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://edge-invite.com/#/register?code=LCH9laOs",
      "text": "团队版 - 循环 - 600GB，¥64.8/月；¥192.8/季；¥368.8/半年；¥728.8/年，600GB/周期"
    },
    {
      "name": "轻量版 - 全年 - 800GB",
      "priceText": "¥168/年",
      "traffic": "800GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://edge-invite.com/#/register?code=LCH9laOs",
      "text": "轻量版 - 全年 - 800GB，¥168/年，800GB/周期"
    },
    {
      "name": "标准版 - 全年 - 1600GB",
      "priceText": "¥268/年",
      "traffic": "1600GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://edge-invite.com/#/register?code=LCH9laOs",
      "text": "标准版 - 全年 - 1600GB，¥268/年，1600GB/周期"
    },
    {
      "name": "标准版 - 全年 - 3600GB",
      "priceText": "¥468/年",
      "traffic": "3600GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://edge-invite.com/#/register?code=LCH9laOs",
      "text": "标准版 - 全年 - 3600GB，¥468/年，3600GB/周期"
    }
  ],
  "唯兔云": [
    {
      "name": "唯兔云 · 年付加强专线",
      "priceText": "¥120/年",
      "traffic": "75GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://a01.v2cvipaff.cc/#/?code=iaD6AgSx",
      "text": "唯兔云 · 年付加强专线，¥120/年，75GB/周期"
    },
    {
      "name": "唯兔云 · 年付版限量款",
      "priceText": "¥79.9/年",
      "traffic": "45GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://a01.v2cvipaff.cc/#/?code=iaD6AgSx",
      "text": "唯兔云 · 年付版限量款，¥79.9/年，45GB/周期"
    },
    {
      "name": "唯兔云 · 普通版",
      "priceText": "¥19.9/月；¥59.9/季；¥119.9/半年；¥238.9/年；¥477.9/两年；¥716.9/三年",
      "traffic": "150GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://a01.v2cvipaff.cc/#/?code=iaD6AgSx",
      "text": "唯兔云 · 普通版，¥19.9/月；¥59.9/季；¥119.9/半年；¥238.9/年；¥477.9/两年；¥716.9/三年，150GB/周期"
    },
    {
      "name": "唯兔云 · 进阶版",
      "priceText": "¥29.9/月；¥80.9/季；¥152.9/半年；¥286.9/年；¥502.9/两年；¥645.9/三年",
      "traffic": "200GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://a01.v2cvipaff.cc/#/?code=iaD6AgSx",
      "text": "唯兔云 · 进阶版，¥29.9/月；¥80.9/季；¥152.9/半年；¥286.9/年；¥502.9/两年；¥645.9/三年，200GB/周期"
    },
    {
      "name": "唯兔云 · 专业版",
      "priceText": "¥59.9/月；¥161.9/季；¥305.9/半年；¥547.9/年；¥1006.9/两年；¥1294.9/三年",
      "traffic": "500GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://a01.v2cvipaff.cc/#/?code=iaD6AgSx",
      "text": "唯兔云 · 专业版，¥59.9/月；¥161.9/季；¥305.9/半年；¥547.9/年；¥1006.9/两年；¥1294.9/三年，500GB/周期"
    },
    {
      "name": "唯兔云 · 至尊版",
      "priceText": "¥119.9/月；¥323.9/季；¥611.9/半年；¥1150.9/年；¥2013.9/两年；¥2590.9/三年",
      "traffic": "1000GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://a01.v2cvipaff.cc/#/?code=iaD6AgSx",
      "text": "唯兔云 · 至尊版，¥119.9/月；¥323.9/季；¥611.9/半年；¥1150.9/年；¥2013.9/两年；¥2590.9/三年，1000GB/周期"
    },
    {
      "name": "唯兔云 · 永久不限时",
      "priceText": "¥100/一次性",
      "traffic": "100GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://a01.v2cvipaff.cc/#/?code=iaD6AgSx",
      "text": "唯兔云 · 永久不限时，¥100/一次性，100GB",
      "oneTime": true
    },
    {
      "name": "唯兔云 · 永久不限时",
      "priceText": "¥160/一次性",
      "traffic": "200GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://a01.v2cvipaff.cc/#/?code=iaD6AgSx",
      "text": "唯兔云 · 永久不限时，¥160/一次性，200GB",
      "oneTime": true
    },
    {
      "name": "唯兔云 · 永久不限时",
      "priceText": "¥340/一次性",
      "traffic": "500GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://a01.v2cvipaff.cc/#/?code=iaD6AgSx",
      "text": "唯兔云 · 永久不限时，¥340/一次性，500GB",
      "oneTime": true
    }
  ],
  "极连云": [
    {
      "name": "限时年付套餐体验",
      "priceText": "¥96/年",
      "traffic": "60GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.jlcvipaff.cc/#/register?code=GHDiZb1m",
      "text": "限时年付套餐体验，¥96/年，60GB/周期"
    },
    {
      "name": "极连云 · 基础套餐",
      "priceText": "¥18/月；¥51.3/季；¥97.2/半年；¥183.6/年；¥345.6/两年；¥486/三年",
      "traffic": "100GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.jlcvipaff.cc/#/register?code=GHDiZb1m",
      "text": "极连云 · 基础套餐，¥18/月；¥51.3/季；¥97.2/半年；¥183.6/年；¥345.6/两年；¥486/三年，100GB/周期"
    },
    {
      "name": "极连云 · 进阶套餐",
      "priceText": "¥32/月；¥102/季；¥194/半年；¥367/年；¥691/两年；¥972/三年",
      "traffic": "200GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.jlcvipaff.cc/#/register?code=GHDiZb1m",
      "text": "极连云 · 进阶套餐，¥32/月；¥102/季；¥194/半年；¥367/年；¥691/两年；¥972/三年，200GB/周期"
    },
    {
      "name": "极连云 · 旗舰套餐",
      "priceText": "¥61/月；¥205/季；¥388.8/半年；¥734.4/年；¥1382/两年；¥1944/三年",
      "traffic": "500GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.jlcvipaff.cc/#/register?code=GHDiZb1m",
      "text": "极连云 · 旗舰套餐，¥61/月；¥205/季；¥388.8/半年；¥734.4/年；¥1382/两年；¥1944/三年，500GB/周期"
    },
    {
      "name": "极连云 · 尊享套餐",
      "priceText": "¥122/月；¥410.4/季；¥777.6/半年；¥1468.8/年；¥2764.8/两年；¥3888/三年",
      "traffic": "1000GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.jlcvipaff.cc/#/register?code=GHDiZb1m",
      "text": "极连云 · 尊享套餐，¥122/月；¥410.4/季；¥777.6/半年；¥1468.8/年；¥2764.8/两年；¥3888/三年，1000GB/周期"
    },
    {
      "name": "极连云 · 不限时套餐",
      "priceText": "¥399/一次性",
      "traffic": "600GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://ermaozi01.jlcvipaff.cc/#/register?code=GHDiZb1m",
      "text": "极连云 · 不限时套餐，¥399/一次性，600GB",
      "oneTime": true
    }
  ],
  "光年梯": [
    {
      "name": "年付限时套餐",
      "priceText": "¥89/年",
      "traffic": "50GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.gntvipaff.cc/#/?code=FSEQIfPr",
      "text": "年付限时套餐，¥89/年，50GB/周期"
    },
    {
      "name": "光年梯 入门版",
      "priceText": "¥18/月；¥50/季；¥90/半年；¥160/年；¥300/两年；¥420/三年",
      "traffic": "110GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.gntvipaff.cc/#/?code=FSEQIfPr",
      "text": "光年梯 入门版，¥18/月；¥50/季；¥90/半年；¥160/年；¥300/两年；¥420/三年，110GB/周期"
    },
    {
      "name": "光年梯 晋级版",
      "priceText": "¥34/月；¥100/季；¥180/半年；¥320/年；¥610/两年；¥850/三年",
      "traffic": "220GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.gntvipaff.cc/#/?code=FSEQIfPr",
      "text": "光年梯 晋级版，¥34/月；¥100/季；¥180/半年；¥320/年；¥610/两年；¥850/三年，220GB/周期"
    },
    {
      "name": "光年梯 专业版",
      "priceText": "¥68/月；¥200/季；¥375/半年；¥667/年；¥1251/两年；¥1752/三年",
      "traffic": "450GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.gntvipaff.cc/#/?code=FSEQIfPr",
      "text": "光年梯 专业版，¥68/月；¥200/季；¥375/半年；¥667/年；¥1251/两年；¥1752/三年，450GB/周期"
    },
    {
      "name": "光年梯 至尊版",
      "priceText": "¥130/月；¥390/季；¥702/半年；¥1248/年；¥2340/两年；¥3276/三年",
      "traffic": "900GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.gntvipaff.cc/#/?code=FSEQIfPr",
      "text": "光年梯 至尊版，¥130/月；¥390/季；¥702/半年；¥1248/年；¥2340/两年；¥3276/三年，900GB/周期"
    },
    {
      "name": "独享私人专线节点",
      "priceText": "¥680/月",
      "traffic": "500GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.gntvipaff.cc/#/?code=FSEQIfPr",
      "text": "独享私人专线节点，¥680/月，500GB/周期"
    }
  ],
  "光速云": [
    {
      "name": "光速云 · 轻量版",
      "priceText": "¥99/年",
      "traffic": "59GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.gsyvipaff.com/#/?code=d1eMb3ku",
      "text": "光速云 · 轻量版，¥99/年，59GB/周期"
    },
    {
      "name": "光速云 · 极速版",
      "priceText": "¥17/月；¥50/季；¥90/半年；¥160/年；¥300/两年；¥420/三年",
      "traffic": "110GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.gsyvipaff.com/#/?code=d1eMb3ku",
      "text": "光速云 · 极速版，¥17/月；¥50/季；¥90/半年；¥160/年；¥300/两年；¥420/三年，110GB/周期"
    },
    {
      "name": "光速云 · 流光版",
      "priceText": "¥34/月；¥100/季；¥180/半年；¥320/年；¥610/两年；¥850/三年",
      "traffic": "220GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.gsyvipaff.com/#/?code=d1eMb3ku",
      "text": "光速云 · 流光版，¥34/月；¥100/季；¥180/半年；¥320/年；¥610/两年；¥850/三年，220GB/周期"
    },
    {
      "name": "光速云 · 量子版",
      "priceText": "¥68/月；¥200/季；¥375/半年；¥667/年；¥1251/两年；¥1752/三年",
      "traffic": "450GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.gsyvipaff.com/#/?code=d1eMb3ku",
      "text": "光速云 · 量子版，¥68/月；¥200/季；¥375/半年；¥667/年；¥1251/两年；¥1752/三年，450GB/周期"
    },
    {
      "name": "光速云 · 无界版",
      "priceText": "¥130/月；¥390/季；¥702/半年；¥1248/年；¥2340/两年；¥3276/三年",
      "traffic": "900GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.gsyvipaff.com/#/?code=d1eMb3ku",
      "text": "光速云 · 无界版，¥130/月；¥390/季；¥702/半年；¥1248/年；¥2340/两年；¥3276/三年，900GB/周期"
    },
    {
      "name": "光速云 · 不限时套餐",
      "priceText": "¥680/一次性",
      "traffic": "1000GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://ermaozi01.gsyvipaff.com/#/?code=d1eMb3ku",
      "text": "光速云 · 不限时套餐，¥680/一次性，1000GB",
      "oneTime": true
    },
    {
      "name": "光速云 · 定制套餐",
      "priceText": "¥680/月",
      "traffic": "500GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://ermaozi01.gsyvipaff.com/#/?code=d1eMb3ku",
      "text": "光速云 · 定制套餐，¥680/月，500GB/周期"
    }
  ],
  "全球云": [
    {
      "name": "轻量版",
      "priceText": "¥99/年",
      "traffic": "59GB（重置方式未说明）",
      "type": "周期订阅",
      "audience": "低频备用，能接受年付风险",
      "purchaseHref": "https://ermaozi01.gcvipaff.cc/#/?code=PGcNh6bA",
      "text": "轻量版，¥99/年，59GB（重置方式未说明）"
    },
    {
      "name": "BGP 智能优化 · 入门方案",
      "priceText": "¥20/月",
      "traffic": "120GB/月",
      "type": "周期订阅",
      "audience": "首次测试、轻中度使用",
      "purchaseHref": "https://ermaozi01.gcvipaff.cc/#/?code=PGcNh6bA",
      "text": "BGP 智能优化 · 入门方案，¥20/月，120GB/月"
    },
    {
      "name": "BGP 智能优化 · 进阶方案",
      "priceText": "¥40/月",
      "traffic": "300GB/月",
      "type": "周期订阅",
      "audience": "日常视频与 AI 工具",
      "purchaseHref": "https://ermaozi01.gcvipaff.cc/#/?code=PGcNh6bA",
      "text": "BGP 智能优化 · 进阶方案，¥40/月，300GB/月"
    },
    {
      "name": "BGP 智能优化 · 高端方案",
      "priceText": "¥100/月",
      "traffic": "700GB/月",
      "type": "周期订阅",
      "audience": "多设备、高流量使用",
      "purchaseHref": "https://ermaozi01.gcvipaff.cc/#/?code=PGcNh6bA",
      "text": "BGP 智能优化 · 高端方案，¥100/月，700GB/月"
    },
    {
      "name": "BGP 智能优化 · 商业方案",
      "priceText": "¥180/月",
      "traffic": "1500GB/月",
      "type": "周期订阅",
      "audience": "团队或重度使用",
      "purchaseHref": "https://ermaozi01.gcvipaff.cc/#/?code=PGcNh6bA",
      "text": "BGP 智能优化 · 商业方案，¥180/月，1500GB/月"
    },
    {
      "name": "独享私人专线节点",
      "priceText": "¥680/月",
      "traffic": "500GB/月",
      "type": "周期订阅",
      "audience": "需要独享节点并先确认线路规格的用户",
      "purchaseHref": "https://ermaozi01.gcvipaff.cc/#/?code=PGcNh6bA",
      "text": "独享私人专线节点，¥680/月，500GB/月"
    },
    {
      "name": "BGP 智能优化 · 不限时轻量包",
      "priceText": "¥100/一次性",
      "traffic": "100GB",
      "type": "不限时流量包",
      "features": [
        "特点：低频备用"
      ],
      "purchaseHref": "https://ermaozi01.gcvipaff.cc/#/?code=PGcNh6bA",
      "text": "BGP 智能优化 · 不限时轻量包，¥100/一次性，100GB",
      "oneTime": true
    },
    {
      "name": "BGP 智能优化 · 不限时标准包",
      "priceText": "¥360/一次性",
      "traffic": "400GB",
      "type": "不限时流量包",
      "features": [
        "特点：中等流量备用"
      ],
      "purchaseHref": "https://ermaozi01.gcvipaff.cc/#/?code=PGcNh6bA",
      "text": "BGP 智能优化 · 不限时标准包，¥360/一次性，400GB",
      "oneTime": true
    },
    {
      "name": "BGP 智能优化 · 不限时大容量包",
      "priceText": "¥700/一次性",
      "traffic": "800GB",
      "type": "不限时流量包",
      "features": [
        "特点：高流量备用"
      ],
      "purchaseHref": "https://ermaozi01.gcvipaff.cc/#/?code=PGcNh6bA",
      "text": "BGP 智能优化 · 不限时大容量包，¥700/一次性，800GB",
      "oneTime": true
    }
  ],
  "uuone": [
    {
      "name": "Lite—月付150G",
      "priceText": "¥19/月；¥36.9/季；¥59.9/半年；¥106/年",
      "traffic": "150GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://uuone.at/?code=AjqYdZlJ",
      "text": "Lite—月付150G，¥19/月；¥36.9/季；¥59.9/半年；¥106/年，150GB/周期"
    },
    {
      "name": "Pro—月付300G",
      "priceText": "¥29/月；¥69/季；¥129/半年；¥235/年",
      "traffic": "300GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://uuone.at/?code=AjqYdZlJ",
      "text": "Pro—月付300G，¥29/月；¥69/季；¥129/半年；¥235/年，300GB/周期"
    },
    {
      "name": "Max—月付800G",
      "priceText": "¥49/月；¥135/季；¥259/半年；¥459/年",
      "traffic": "800GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://uuone.at/?code=AjqYdZlJ",
      "text": "Max—月付800G，¥49/月；¥135/季；¥259/半年；¥459/年，800GB/周期"
    },
    {
      "name": "永久450G",
      "priceText": "¥99/一次性",
      "traffic": "450GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://uuone.at/?code=AjqYdZlJ",
      "text": "永久450G，¥99/一次性，450GB",
      "oneTime": true
    }
  ],
  "影子云": [
    {
      "name": "基础套餐-月付",
      "priceText": "¥18.8/月；¥54.8/季；¥208.8/年；¥408.8/两年；¥608.8/三年",
      "traffic": "150GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://www.yingzi01.com/register?code=TYHpo13G",
      "text": "基础套餐-月付，¥18.8/月；¥54.8/季；¥208.8/年；¥408.8/两年；¥608.8/三年，150GB/周期"
    },
    {
      "name": "标准套餐-月付",
      "priceText": "¥38.8/月；¥108.8/季；¥408.8/年；¥808.8/两年；¥1208.8/三年",
      "traffic": "350GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://www.yingzi01.com/register?code=TYHpo13G",
      "text": "标准套餐-月付，¥38.8/月；¥108.8/季；¥408.8/年；¥808.8/两年；¥1208.8/三年，350GB/周期"
    },
    {
      "name": "高级套餐-月付",
      "priceText": "¥84.8/月；¥248.8/季；¥958.8/年；¥1908.8/两年；¥2788.8/三年",
      "traffic": "850GB/周期",
      "billingCycle": "多周期",
      "type": "周期订阅",
      "purchaseHref": "https://www.yingzi01.com/register?code=TYHpo13G",
      "text": "高级套餐-月付，¥84.8/月；¥248.8/季；¥958.8/年；¥1908.8/两年；¥2788.8/三年，850GB/周期"
    },
    {
      "name": "不限时188G",
      "priceText": "¥118/一次性",
      "traffic": "188GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://www.yingzi01.com/register?code=TYHpo13G",
      "text": "不限时188G，¥118/一次性，188GB",
      "oneTime": true
    },
    {
      "name": "不限时388G",
      "priceText": "¥218/一次性",
      "traffic": "388GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://www.yingzi01.com/register?code=TYHpo13G",
      "text": "不限时388G，¥218/一次性，388GB",
      "oneTime": true
    },
    {
      "name": "不限时888G",
      "priceText": "¥488/一次性",
      "traffic": "888GB",
      "billingCycle": "一次性",
      "type": "不限时流量包",
      "purchaseHref": "https://www.yingzi01.com/register?code=TYHpo13G",
      "text": "不限时888G，¥488/一次性，888GB",
      "oneTime": true
    }
  ]
}
// airport:sync-plans:end

const curatedAirportPlanCatalog: Record<string, AirportPlan[]> = {
  flybit: [
    { name: '每月-128G', priceText: '15元/月', traffic: '128G/月', billingCycle: '月付', type: '周期订阅', features: ['不限设备', '解锁流媒体/ChatGPT'], text: '每月-128G，15元/月，128G/月' },
    { name: '每月-192G', priceText: '22元/月', traffic: '192G/月', billingCycle: '月付', type: '周期订阅', features: ['不限设备', '解锁流媒体/ChatGPT'], text: '每月-192G，22元/月，192G/月' },
    { name: '每月-256G', priceText: '28元/月', traffic: '256G/月', billingCycle: '月付', type: '周期订阅', features: ['不限设备', '解锁流媒体/ChatGPT'], text: '每月-256G，28元/月，256G/月' },
    { name: '每月-512G', priceText: '52元/月', traffic: '512G/月', billingCycle: '月付', type: '周期订阅', features: ['不限设备', '解锁流媒体/ChatGPT'], text: '每月-512G，52元/月，512G/月' },
    { name: '不限时-128G', priceText: '36元/一次性', traffic: '128G', billingCycle: '一次性', type: '不限时流量包', features: ['无期限', '不限设备'], text: '不限时-128G，36元/一次性，128G', oneTime: true },
    { name: '不限时-256G', priceText: '68元/一次性', traffic: '256G', billingCycle: '一次性', type: '不限时流量包', features: ['无期限', '不限设备'], text: '不限时-256G，68元/一次性，256G', oneTime: true },
    { name: '不限时-512G', priceText: '128元/一次性', traffic: '512G', billingCycle: '一次性', type: '不限时流量包', features: ['无期限', '不限设备'], text: '不限时-512G，128元/一次性，512G', oneTime: true },
    { name: '不限时-1024G', priceText: '238元/一次性', traffic: '1024G', billingCycle: '一次性', type: '不限时流量包', features: ['无期限', '不限设备'], text: '不限时-1024G，238元/一次性，1024G', oneTime: true },
  ],
  '迅达': [
    { name: '基础套', priceText: '¥15/月', traffic: '120GB/月', billingCycle: '月付', type: '周期订阅', audience: '轻度用户', features: ['小众节点支持', '5 台设备', '手动重置 ¥15/次'], text: '基础套，¥15/月，120GB/月' },
    { name: '中级套', priceText: '¥35/月', traffic: '300GB/月', billingCycle: '月付', type: '周期订阅', audience: '日常使用', features: ['流媒体无障碍', '多地 BGP 跨境专线', '10 台设备', '手动重置 ¥35/次'], text: '中级套，¥35/月，300GB/月', recommended: true },
    { name: '高级套', priceText: '¥50/月', traffic: '600GB/月', billingCycle: '月付', type: '周期订阅', audience: '重度用户', features: ['流媒体无障碍', '全域企业级跨境专线', '10 台设备', '手动重置 ¥50/次'], text: '高级套，¥50/月，600GB/月' },
  ],
  xxyun: [
    { name: '初级套餐', priceText: '¥9.99/月', traffic: '100G/月', billingCycle: '月付', type: '周期订阅', audience: '轻量追剧、社区浏览', text: '初级套餐，¥9.99/月，100G/月' },
    { name: '中级套餐', priceText: '¥19.9/月', traffic: '300G/月', billingCycle: '月付', type: '周期订阅', audience: '日常办公、多人共用', text: '中级套餐，¥19.9/月，300G/月' },
    { name: '高级套餐', priceText: '¥39.9/月', traffic: '1000G/月', billingCycle: '月付', type: '周期订阅', audience: '重度影视、直播上传', text: '高级套餐，¥39.9/月，1000G/月' },
    { name: '500G 不限时', priceText: '¥66.66/次', traffic: '500G', billingCycle: '一次性', type: '不限时流量包', audience: '偶尔使用、旅行备用', text: '500G 不限时，¥66.66/次，500G', oneTime: true },
    { name: '2888G 不限时', priceText: '¥199/次', traffic: '2888G', billingCycle: '一次性', type: '不限时流量包', audience: '长期囤货、家庭共用', text: '2888G 不限时，¥199/次，2888G', oneTime: true },
  ],
  danke: [
    { name: '年费6T特惠', priceText: '¥68/年', traffic: '每月 500GB（全年 6TB）', billingCycle: '年付', type: '周期订阅', audience: '长期稳定使用、预算优先', text: '年费6T特惠，¥68/年，每月 500GB（全年 6TB）' },
    { name: '体验套餐', priceText: '¥3.00/月', traffic: '88GB/月', billingCycle: '月付', type: '周期订阅', audience: '先试用、轻量备用', text: '体验套餐，¥3.00/月，88GB/月' },
    { name: 'Basic', priceText: '¥9.90/月', traffic: '500GB/月', billingCycle: '月付', type: '周期订阅', audience: '日常主力', text: 'Basic，¥9.90/月，500GB/月', recommended: true },
    { name: 'Pro', priceText: '¥18.00/月', traffic: '1000GB/月', billingCycle: '月付', type: '周期订阅', audience: '多设备与重度流量用户', text: 'Pro，¥18.00/月，1000GB/月' },
    { name: '不限时500GB', priceText: '¥49.90/一次性', traffic: '500GB', billingCycle: '一次性', type: '不限时流量包', audience: '备用流量', text: '不限时500GB，¥49.90/一次性，500GB', oneTime: true },
    { name: '不限时1000GB', priceText: '¥89.90/一次性', traffic: '1000GB', billingCycle: '一次性', type: '不限时流量包', audience: '大容量备用流量', text: '不限时1000GB，¥89.90/一次性，1000GB', oneTime: true },
  ],
}

export const airportPlanCatalog: Record<string, AirportPlan[]> = {
  ...generatedAirportPlanCatalog,
  ...curatedAirportPlanCatalog,
}

// 公开展示字段。佣金、合作、返佣等运营信息只放 private，组件和文章不会读取。
export const airportSources: AirportSource[] = [
  {
    id: 'flybit',
    name: 'flybit',
    description: '解锁主流流媒体和ChatGPT，IEPL接口线路和普通线路一样的价格，机场稳定，几乎全部节点全天候可用。购买之前记得领一下首页的优惠券再下单。',
    rank: 1,
    officialHref: 'https://goflybit.com/#/register?code=7h1NCdM7',
    universalSubscription: true,
    minPlanText: '15元 128G/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/flybitvip',
    reviewHref: '/blog/flybit/',
    rankChangeLabel: '-',
    image: 'https://image.ermao.net/images/blog/flybit/20260302_202715-c22f02.png',
    tags: ['IEPL', 'Netflix', 'ChatGPT'],
  },
  {
    id: 'xsus',
    name: 'XSUS',
    description: 'XSUS 当前最低订阅为 8元 168G/30天，购买前建议先看详情页、自行测试常用节点和晚高峰表现。',
    rank: 2,
    officialHref: 'https://xsus.cloud/register?code=xJFcT1Dw',
    universalSubscription: true,
    minPlanText: '8元 168G/30天',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/xsusvpn',
    reviewHref: '/blog/xsus/',
    rankChangeLabel: '-',
    image: 'https://image.ermao.net/images/blog/xsus/20260129_162650-08b59d.png',
    tags: ['BGP', '不限时', '大流量'],
  },
  {
    id: 'xxyun',
    name: 'xxyun',
    description: '老牌机场稳定运行两年 超高性价比，节点质量高，晚高峰不限速，不限制设备。全BGP中转，国内三网优化 流媒体完美解锁（包括Netflix , Disney+, HBO等） 全天候在线，高效客服响应',
    rank: 3,
    officialHref: 'https://xxyun.at/?code=HOWnn58c',
    universalSubscription: true,
    minPlanText: '9.99元 100G/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/+eYsE6P_xvjk2NGY5',
    reviewHref: '/blog/xxyun/',
    rankChangeLabel: '-',
    image: 'https://image.ermao.net/images/blog/xxyun/image.png',
    tags: ['BGP', '不限速', '备用'],
  },
  {
    id: '网际快车',
    name: '网际快车',
    description: '网际快车主打住宅IP、万能订阅与四端专用VPN，支持不限设备数量，适合多设备家庭和长期备用线路场景。',
    rank: 5,
    officialHref: 'https://ermao.快车.com?c=USNCXQ',
    universalSubscription: true,
    minPlanText: '6.8元 20GB(不限时)',
    hasOneTimePackage: true,
    telegramHref: '',
    reviewHref: '/blog/wangjikuaiche-review-price/',
    rankChangeLabel: '↓1',
    image: 'https://image.ermao.net/images/blog/wangjikuaiche-review-price/20260320_093817-9c5367.png',
    tags: ['住宅 IP', '万能订阅', '多设备'],
  },
  {
    id: 'cocoduck',
    name: 'cocoduck',
    description: 'CocoDuck机场详细评测：由海外团队运营的高品质翻墙机场，拥有两年稳定运营历史、自有四个机房、40+全球节点，支持OpenAI和流媒体解锁，是比较值得信赖的稳定机场之一。',
    rank: 4,
    officialHref: 'https://www.cocoduck.site/auth/register?code=25c8b515df',
    universalSubscription: true,
    minPlanText: '15元 150G/月',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/cocoduck_pub',
    reviewHref: '/article/cocoduck/',
    rankChangeLabel: '↑1',
    image: 'https://image.ermao.net/images/article/cocoduck/image.png',
    tags: ['海外团队', '自有机房', 'OpenAI'],
  },
  {
    id: '阿达西',
    name: '阿达西',
    description: '新出的轻量级机场，这是目前最便宜的机场！节点虽少但背靠大树好乘凉，速度和稳定性都不错。非常适合偶尔翻墙或是长时间浏览推特、Facebook等社交网站的同学。',
    rank: 6,
    officialHref: 'https://adaxi.net/?r=68917',
    universalSubscription: false,
    minPlanText: '3元 20G/月',
    hasOneTimePackage: true,
    telegramHref: '',
    reviewHref: '/article/zf12sje8/',
    rankChangeLabel: '-',
  },
  {
    id: 'u1s1',
    name: 'u1s1',
    description: 'u1s1 机场是一家主打 IPLC 专线并且不限制设备连接数的翻墙机场。他们拥有最高 2000Mbps 的带宽，并承诺晚高峰不降速。解锁 Netflix、TikTok 等流媒体以及 ChatGPT，当前有 96 元年付 60GB 与 20 元 120GB 月付等周期套餐。',
    rank: 7,
    officialHref: 'https://ermaozi01.vipaff.cc/#/?code=FC32x5Vs',
    universalSubscription: true,
    minPlanText: '20元 120G/月',
    hasOneTimePackage: false,
    telegramHref: '',
    reviewHref: '/article/u1s1/',
    rankChangeLabel: '-',
    image: 'https://image.ermao.net/images/article/u1s1/20260505_152753-9d7d99.png',
    tags: ['IPLC', '不限设备', '重度'],
  },
  {
    id: '大哥云',
    name: '大哥云',
    description: '大哥云机场5年老品牌，可以免费试用，支持奈飞等多家流媒体解锁，支持YOUTUBE 8K流畅观看支持IPLC线路。',
    rank: 8,
    officialHref: 'https://ermao.dgywzc.com/#/register?code=peAVAa8D',
    universalSubscription: true,
    minPlanText: '19.9元 100G/月',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/dageyun',
    reviewHref: '/blog/dageyun/',
    rankChangeLabel: '-',
    image: 'https://image.ermao.net/images/blog/dageyun/image.jpg',
    tags: ['老牌', 'BGP', 'IPLC'],
  },
  {
    id: '冲上云霄',
    name: '冲上云霄',
    description: '这是目前来看最便宜的机场，用户也比较多，节点质量过关。缺点是购买稍微麻烦一点，需要购买充值码进行充值后才能购买套餐。',
    rank: 9,
    officialHref: 'https://cpdd.one/?r=32083',
    universalSubscription: true,
    minPlanText: '5元 80G/30天',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/vpnpn123',
    reviewHref: '/article/dycrz2ch/',
    rankChangeLabel: '-',
  },
  {
    id: 'invisible',
    name: '隐形人',
    description: '服务商称隐形人已运营约 2 年，主打企业级 IEPL 纯专线、1 倍流量与不限设备；最低月付为 24 元 144GB，支持通用订阅并提供不限时流量包。',
    rank: 26,
    officialHref: 'https://asfawsf.invisibleattt.sbs/#/?code=8q7IHM5V',
    universalSubscription: true,
    minPlanText: '24元 144GB/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/+X8FDHRLKtS80Nzdl',
    reviewHref: '/blog/invisible-airport/',
    rankChangeLabel: '新上',
    image: 'https://image.ermao.net/images/blog/invisible-airport/20260728_145938-6f3344.png',
    tags: ['IEPL', '通用订阅', '不限时流量包'],
  },
  {
    id: 'kuajiecloud',
    name: '跨界云',
    description: '服务商称跨界云于 2026 年开业，并已将整体网络升级为全专线链路；最低周期套餐为 20 元月付 120GB，支持通用订阅。',
    rank: 20,
    officialHref: 'https://vipermaozi.kuajieaff.com/#/?code=lPz0u1LR',
    universalSubscription: true,
    minPlanText: '20元 120GB/月',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/kuajie11',
    reviewHref: '/blog/kuajiecloud-airport/',
    rankChangeLabel: '新上',
    image: 'https://image.ermao.net/images/blog/kuajiecloud-airport/20260728_105101-44d498.png',
    tags: ['全专线', '通用订阅', '大流量'],
  },
  {
    id: 'civetnet',
    name: '灵猫网络',
    description: '服务商称灵猫网络于 2026 年开始运营，主打 IPLC、1 倍流量、不限设备与流媒体、AI 解锁；常规月付最低 25 元 150GB，另有 85 元年付 45GB 小包。',
    rank: 27,
    officialHref: 'https://ermaozi.civetaff.com/#/?code=Ammn9sdD',
    universalSubscription: true,
    minPlanText: '85元 45GB/年',
    hasOneTimePackage: false,
    telegramHref: '',
    reviewHref: '/blog/civetnet-airport/',
    rankChangeLabel: '新上',
    image: 'https://image.ermao.net/images/blog/civetnet-airport/20260728_104050-5a2230.png',
    tags: ['IPLC', '通用订阅', '不限设备'],
  },
  {
    id: 'miaomiaoyun',
    name: '秒秒云',
    description: '服务商称秒秒云已运营约 4 年，早期从免费公益服务起步；常规月付最低 14 元 128GB，支持通用订阅，并提供年付特惠和两档不限时流量包。',
    rank: 18,
    officialHref: 'https://dl2.mmy8.com/#/register?code=jcr5CpCT',
    universalSubscription: true,
    minPlanText: '14元 128GB/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/mmyun9',
    reviewHref: '/blog/miaomiaoyun-airport/',
    rankChangeLabel: '新上',
    image: 'https://image.ermao.net/images/blog/miaomiaoyun-airport/20260728_102306-7e2ba7.png',
    tags: ['四年运营', '通用订阅', '不限时流量包'],
  },
  {
    id: '锦云',
    name: '锦云',
    description: '服务商称锦云目前运营约 2 个月，主打小流量套餐；最低月付为 6 元、标注 50GB，支持通用订阅，并提供两档一次性不限时流量包。',
    rank: 19,
    officialHref: 'https://jybdw1.wanhlj.com:8888/#/register?code=7pcmThto',
    universalSubscription: true,
    minPlanText: '6元 50GB（月付）',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/jyun555',
    reviewHref: '/blog/jinyun-airport/',
    rankChangeLabel: '新上',
    image: 'https://image.ermao.net/images/blog/jinyun-airport/20260728_101501-807523.png',
    tags: ['小流量', '通用订阅', '不限时流量包'],
  },
  {
    id: 'twilight',
    name: '暮光加速',
    description: '服务商称暮光加速于 2025 年成立并采用 VLESS；常规月付最低 20 元 120GB，支持通用订阅，并提供年付轻量版和三档一次性不限时流量包。',
    rank: 25,
    officialHref: 'https://ermaozi01.twilightaff.com/#/?code=4lhDLNFL',
    universalSubscription: true,
    minPlanText: '20元 120GB/月',
    hasOneTimePackage: true,
    telegramHref: '',
    reviewHref: '/blog/twilight-airport/',
    rankChangeLabel: '新上',
    image: 'https://image.ermao.net/images/blog/twilight-airport/20260723_175315-d2350d.png',
    tags: ['VLESS', '通用订阅', '不限时流量包'],
  },
  {
    id: '智联网络',
    name: '智联网络',
    description: '智联网络是一家运营约半年的低价机场，服务商称支持注册免费试用和每日签到赠送流量；标准版最低 5 元 500GB/月，并支持通用订阅。',
    rank: 17,
    officialHref: 'https://a.zlwl.org/auth/register?code=dre2B4',
    universalSubscription: true,
    minPlanText: '5元 500GB/月',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/zlwl_org',
    reviewHref: '/blog/zlwl-airport/',
    rankChangeLabel: '新上',
    image: 'https://image.ermao.net/images/blog/zlwl-airport/20260723_170239-92f71d.png',
    tags: ['免费试用', '每日签到', '通用订阅'],
  },
  {
    id: 'firefly',
    name: 'Firefly',
    description: 'Firefly 是海外团队在 2026 年新开的机场，服务商主打 IPLC、VLESS、原生 IP 与不限设备；月付最低 25 元 150GB，也有年付和一次性不限时流量包。',
    rank: 21,
    officialHref: 'https://ermaozi01.fireflyaff.com/#/?code=BUtf2Bj2',
    universalSubscription: true,
    minPlanText: '96元 60GB/月（年付）',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/fireflyjichang',
    reviewHref: '/blog/firefly-airport/',
    rankChangeLabel: '新上',
    image: 'https://image.ermao.net/images/blog/firefly-airport/20260723_161238-212580.png',
    tags: ['IPLC', 'VLESS', '原生 IP'],
  },
  {
    id: '无忧链接',
    name: '无忧链接',
    description: '无忧链接支持通用订阅与主流客户端，截图显示周期套餐现价最低 12.92 元 100GB/月，另有 79 元年付每月 40GB 套餐和一次性不限时流量包。',
    rank: 24,
    officialHref: 'https://ermaozi01.worryfreeaff.com/#/?code=xSLORrqb',
    universalSubscription: true,
    minPlanText: '12.92元 100GB/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/axxxing',
    reviewHref: '/blog/wuyoulink/',
    rankChangeLabel: '新上',
    image: 'https://image.ermao.net/images/blog/wuyoulink/20260723_155542-f42aee.png',
    tags: ['通用订阅', '不限时流量包', '流媒体'],
  },
  {
    id: '可信云',
    name: '可信云',
    description: '可信云主打 IPLC 专线、1 倍流量与不限设备，周期套餐最低 9 元 45GB/月；目前暂不支持通用订阅，适合先从月付小档验证客户端兼容和本地线路表现。',
    rank: 16,
    officialHref: 'https://ermaozi01.kosingaff.com/#/register?code=aG3TCu1y',
    universalSubscription: false,
    minPlanText: '9元 45GB/月',
    hasOneTimePackage: true,
    telegramHref: '',
    reviewHref: '/blog/kexinyun/',
    rankChangeLabel: '新上',
    image: 'https://image.ermao.net/images/blog/kexinyun/20260723_124327-62e599.png',
    tags: ['IPLC', '不限设备', '1 倍流量'],
  },
  {
    id: '梯子云',
    name: '梯子云（LadderCloud）',
    description: '梯子云主打 VLESS、IEPL 与自研全平台客户端，同时支持通用订阅；套餐覆盖月付、年度小包和一次性不限时流量包，适合先从小档验证本地线路表现。',
    rank: 23,
    officialHref: 'https://ermaozi01.ladderaff.com/#/?code=VZVXWbiq',
    universalSubscription: true,
    minPlanText: '25元 125GB/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/+2G6oVTJor6oxMmVl',
    reviewHref: '/blog/laddercloud/',
    rankChangeLabel: '新上',
    image: 'https://image.ermao.net/images/blog/laddercloud/20260723_122808-23ba3e.png',
    tags: ['IEPL', 'VLESS', '自研客户端'],
  },
  {
    id: 'uuone',
    name: 'uuone',
    description: 'uuone 是一家专注于提供 高性价比 出海加速服务的 翻墙机场。其核心优势在于提供 BGP三网优化 中转线路，确保超高性价比的同时，拥有高质量的节点表现。',
    rank: 10,
    officialHref: 'https://uuone.at/?code=AjqYdZlJ',
    universalSubscription: false,
    minPlanText: '19元 150GB/月',
    hasOneTimePackage: true,
    telegramHref: '',
    reviewHref: '/blog/uuone/',
    rankChangeLabel: '↑11',
    image: 'https://image.ermao.net/images/blog/uuone/image-1.png',
    tags: ['BGP', '高流量', '不限速'],
  },
  {
    id: 'danke',
    name: 'Danke',
    description: '这是一个主打高性价比的中转机场，官方定位是“稳定三年，低至3元/月”。提供 500GB 月付与不限时流量包，支持 AnyTLS 协议，适合想先低成本试用、再按需求升级套餐的用户。',
    rank: 15,
    officialHref: 'https://www.dankewed.com/#/register?code=a0zksG3J',
    universalSubscription: false,
    minPlanText: '3元 88GB/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/dankewed1',
    reviewHref: '/blog/danke/',
    rankChangeLabel: '↑7',
    image: 'https://image.ermao.net/images/blog/danke/20260403_165913-188225.png',
    tags: ['AnyTLS', '低价', '流量包'],
  },
  {
    id: '影子云',
    name: '影子云',
    description: '影子云更适合想先小包试用的人，卖点集中在海外公有云中转、AnyTLS/Hysteria2 和通用订阅。它不属于低价冲量型机场，但如果你想找一条手机电脑都能直接导入、先用起来再决定是否长期续费的线路，这家可以放进候选名单。',
    rank: 59,
    officialHref: 'https://www.yingzi01.com/register?code=TYHpo13G',
    universalSubscription: true,
    minPlanText: '18.80元 150G/月',
    hasOneTimePackage: true,
    telegramHref: '',
    reviewHref: '/blog/yingziyun/',
    rankChangeLabel: '↓36',
    image: 'https://image.ermao.net/images/blog/yingziyun/20260704_193846-0433db.png',
    tags: ['公有云中转', '通用订阅', '流量包'],
  },
  {
    id: '山水云',
    name: '山水云',
    description: '山水云主打通用订阅，节点以中转 + 直连为主，支持微信和支付宝，适合想先用低门槛月付试水、后续再按流量升级的用户。',
    rank: 41,
    officialHref: 'https://ss2.byvvcsx.com/#/register?code=zQA4TyPT',
    universalSubscription: true,
    minPlanText: '14.99元 100G/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/ssyun999',
    reviewHref: '/blog/2k7jn2n8/',
    rankChangeLabel: '↓17',
    image: 'https://image.ermao.net/images/blog/2k7jn2n8/20260704_195922-14ee83.png',
    tags: ['通用订阅', '一次性套餐', '月付'],
  },
  {
    id: 'ssone',
    name: 'ssone',
    description: '以上所有套餐均有月付、季付、半年、一年、两年、三年等多种付费周期可选。',
    rank: 50,
    officialHref: 'https://www.flybit6202.com/#/register?code=MmE2PsQJ',
    universalSubscription: false,
    minPlanText: '15元 128GB/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/+rYzRmCbJfIw3ZTM1',
    reviewHref: '/article/ssone/',
    rankChangeLabel: '↓25',
    image: 'https://image.ermao.net/images/article/ssone/image.png',
    tags: ['Netflix', '节点多', '进阶'],
  },
  {
    id: '龙猫云',
    name: '龙猫云',
    description: '超高性价比，节点质量高，客服实时在线，晚高峰不限速，不限制设备。IPLC深港、沪美、沪日专线，流媒体完美解锁（包括Netflix , Disney+, HBO等） 完美解锁ChatGPT、Gemini、Copilot 支持Tiktok本土短视频运营和直播',
    rank: 11,
    officialHref: 'https://ermaozi01.lmvipaff.com/register?aff=aOkm2wPW',
    universalSubscription: true,
    minPlanText: '15元 100G/月',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/totoro_clouds',
    reviewHref: '/article/b6t9mwuv/',
    rankChangeLabel: '↑15',
  },
  {
    id: 'edge-x',
    name: 'Edge-X',
    description: 'Edge-X 的定位是 IEPL 专线为主、直连节点为补充，并通过倍率策略降低错峰成本。已知信息里 IEPL 日常 1 倍率，02:00-10:00 为 0.5 倍率，直连节点全天 0.2 倍率，更适合先低档验证再升级。',
    rank: 12,
    officialHref: 'https://edge-invite.com/#/register?code=LCH9laOs',
    universalSubscription: true,
    minPlanText: '22.8元/月起',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/EdgeX_Notice',
    reviewHref: '/article/edge-x/',
    rankChangeLabel: '↑15',
    image: 'https://image.ermao.net/images/article/edge-x/20260509_083554-1403ca.png',
    tags: ['IEPL', '低倍率', '流媒体'],
  },
  {
    id: '迅达',
    name: '迅达',
    description: '迅达主打稳定与高性价比，节点覆盖 87 个国家，支持 Netflix、YouTube 4K、TikTok、ChatGPT 等主流服务访问。套餐支持 5-10 台设备同时在线，提供 7x24 小时工单支持；官方明确限个人使用，禁止多人共用。',
    rank: 13,
    officialHref: 'https://sulianproxy.com/register?code=bXIAotbG',
    universalSubscription: false,
    minPlanText: '15元 120G/月',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/xundaroot',
    reviewHref: '/blog/xunda/',
    rankChangeLabel: '↑15',
  },
  {
    id: '星岛梦',
    name: '星岛梦',
    description: '星岛梦IEPL专线机场，提供高品质线路，支持 Trojan/SS 等协议，专注于稳定流媒体与跨境业务。全线解锁 Netflix、Disney+、YouTube、ChatGPT、Gemini 等平台与 AI 服务，并支持 TikTok 跨区，适合跨境电商、直播运营、远程办公等高要求用户。套餐无限速、无倍率、不限制设备数（合理使用），支持支付宝、USDT 付款。节点覆盖港台、日美新、东南亚、韩国及多国欧美地区，价格亲民，月付最低16元起，另提供1T大流量永久套餐。拥有多客服团队与海外技术支持，可提供小火箭下载、TG代注册等增值服务。',
    rank: 60,
    officialHref: 'https://ermaov1.xdmvipaff.cc/#/?code=O9Q9H6VY',
    universalSubscription: false,
    minPlanText: '16元 100G/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/XDM6666666',
    reviewHref: '/article/xingdaomeng/',
    rankChangeLabel: '↓31',
    image: 'https://image.ermao.net/images/article/xingdaomeng/image.png',
    tags: ['IEPL', 'AI 工具', '流媒体'],
  },
  {
    id: '唯兔云',
    name: '唯兔云',
    description: '唯兔云IPLC专线，Trojan协议，解锁各大流媒体，解锁ChatGPT、Gemini等AI，解锁Tiktok，支持电商、直播运营。套餐无倍率、不限速、不限制设备数量，支持支付宝微信usdt，除了港、台、日、美、新常规的五国节点以外，我们还有东南亚五国，韩国以及一些欧美国家。当前年付版79.9元45GB，普通版19.9元150GB/月。售后服务绝对有保障，多人客服团队轮流坐班，海外技术团队稳定可靠。可提供小火箭下载账号，可提供TG代注册服务等等',
    rank: 29,
    officialHref: 'https://a01.v2cvipaff.cc/#/?code=iaD6AgSx',
    universalSubscription: false,
    minPlanText: '79.9元 45GB/年',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/v2yun_v2',
    reviewHref: '/article/weituyun/',
    rankChangeLabel: '↑1',
    image: 'https://image.ermao.net/images/article/weituyun/image.png',
    tags: ['IPLC', '不限设备', '流媒体'],
  },
  {
    id: '灵动云',
    name: '灵动云',
    description: '灵动云于 2025 年开始运营，官方主打 Trojan 协议专线、流媒体与 ChatGPT 解锁，提供月付、年付小包和一次性不限时流量包，适合先用小档验证或作为备用线路。',
    officialHref: 'https://ermaozi01.lingdongaff.com/#/?code=aJUlcAOo',
    universalSubscription: true,
    minPlanText: '20元 100GB/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/+6UadfRoVSC04Zjll',
    reviewHref: '/blog/lingdongyun/',
    image: 'https://image.ermao.net/images/blog/lingdongyun/20260723_121505-a742b5.png',
    tags: ['Trojan', '通用订阅', '不限时流量包'],
  },
  {
    id: 'superbiu',
    name: 'superbiu',
    description: 'SuperBiu 机场依托三网（电信/联通/移动）入口的 IPLC 专线，实现跨境高速互联。当前套餐包括 14 元 50GB 月付及多档按月、按年流量方案。',
    rank: 46,
    officialHref: 'https://biubiux.online/#/register?code=BasmsULb',
    universalSubscription: false,
    minPlanText: '14元 50GB/月',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/superbiu888',
    reviewHref: '/blog/superbiu/',
    rankChangeLabel: '↓13',
    image: 'https://image.ermao.net/images/blog/superbiu/image-1.jpg',
    tags: ['IPLC', '三网', '低价'],
  },
  {
    id: '极连云',
    name: '极连云',
    description: '极连云提供高性价比的IEPL专线VPN服务，支持Trojan和Shadowsocks协议，解锁Netflix、YouTube等主流流媒体平台。套餐不限速、不限设备数，适合轻度到中度用户。支持支付宝和USDT支付，拥有多节点覆盖全球，确保稳定高速连接。',
    rank: 14,
    officialHref: 'https://ermaozi01.jlcvipaff.cc/#/register?code=GHDiZb1m',
    universalSubscription: false,
    minPlanText: '96元 60GB/年',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/JLYCloud',
    reviewHref: '/blog/jilianyun/',
    rankChangeLabel: '↑20',
    image: 'https://image.ermao.net/images/blog/jilianyun/image.jpg',
    tags: ['IPLC', '不限设备', '低价'],
  },
  {
    id: 'runway',
    name: 'Runway',
    description: 'Runway 主打「打造极致的互联网连接跑道」，采用 Shadowsocks 协议，提供从入门到高流量的分层套餐，支持 Netflix、YouTube 等流媒体解锁。',
    rank: 35,
    officialHref: 'https://www.runwayhz.com/#/register?code=RiIDywqb',
    universalSubscription: false,
    minPlanText: '9.9元 100G/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/runwayhzop',
    reviewHref: '/blog/runway/',
    rankChangeLabel: '-',
    image: 'https://image.ermao.net/images/blog/1szjh0in/20260310_102236-6690ab.png',
    tags: ['SS 协议', '分层套餐', '流媒体'],
  },
  {
    id: '闪狐云',
    name: '闪狐云',
    description: '闪狐云是目前我用过的节点质量最高的机场，价格虽然不是最便宜的，但是性价比非常高。支持支付宝。BGP隧道中转，IPLC高速内网纯专线出口，延迟低 5大运营商动态优化。trojan协议，安全、高速、加密。解锁全球流媒体、AI工具。无设备和ip限制。1000Mbps速率，晚高峰不限速 专业人工客服，快速响应 接受企业或者个人定制业务',
    rank: 31,
    officialHref: 'https://erozi01.ffvipaff.cc/register?aff=NCO1w4Iv',
    universalSubscription: true,
    minPlanText: '20元 120G/月',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/flashfoxcloud',
    reviewHref: '/article/bls8yo25/',
    rankChangeLabel: '↑5',
  },
  {
    id: '光年梯',
    name: '光年梯',
    description: '光年梯是由资深团队运营的高品质翻墙机场，拥有多年的稳定运营历史和丰富的技术经验。其自有机房和全球节点网络确保了用户能够享受到快速、稳定的网络连接。',
    rank: 42,
    officialHref: 'https://ermaozi01.gntvipaff.cc/#/?code=FSEQIfPr',
    universalSubscription: false,
    minPlanText: '18元 110G/月',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/guangnianti',
    reviewHref: '/blog/guangnianti/',
    rankChangeLabel: '↓5',
    image: 'https://image.ermao.net/images/blog/guangnianti/20260129_160048-961842.jpg',
    tags: ['IEPL', 'Trojan', '流媒体'],
  },
  {
    id: '梦想云',
    name: '梦想云',
    description: '梦想云开设于 2023 年 2 月，主打三网直连混搭与 BGP 跨境专线，节点以常用五大地区为主。流媒体与 ChatGPT 可用性表现较稳，适合作为日常主力线路。',
    rank: 47,
    officialHref: 'https://gx.dreamcl.sbs/#/register?code=GFUAEweX',
    universalSubscription: false,
    minPlanText: '8.8元 100GB/月',
    hasOneTimePackage: false,
    telegramHref: '',
    reviewHref: '/blog/mengxiangyun/',
    rankChangeLabel: '↓9',
    image: 'https://image.ermao.net/images/blog/mengxiangyun/20260403_092831-7354b4.png',
    tags: ['BGP', '大流量', '低价'],
  },
  {
    id: '灯塔cloud',
    name: '灯塔cloud',
    description: '灯塔cloud机场客服响应速度很快，态度非常好，节点质量也很棒。灯塔Cloud团队会定期更新节点列表，确保节点的稳定性和可用性。同时，节点会根据网络状况动态调整，提供最优的连接体验。',
    rank: 30,
    officialHref: 'https://www.dengta.cloud/#/register?code=n4jB4z5R',
    universalSubscription: false,
    minPlanText: '10元 100G/月',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/+xBRgJGSBcNdlNWJl',
    reviewHref: '/article/osp1vx6y/',
    rankChangeLabel: '↑9',
  },
  {
    id: 'cyberguard',
    name: 'CyberGuard',
    description: 'CyberGuard主要提供安全网络访问解决方案。由网络安全专家团队创立，总部位于北美，专为亚太地区用户优化设计。经过5年技术打磨，该服务致力于保障用户数据安全并提供顺畅网络体验。其创新技术架构帮助用户保护隐私的同时，确保稳定访问各类网络资源。适合需要数据安全保障和流畅网络体验的各类用户使用',
    rank: 28,
    officialHref: 'https://www.cyberguard.best/#/register?code=yoyUW3R9',
    universalSubscription: false,
    minPlanText: '18元 100G/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/CyberGuardChat',
    reviewHref: '/article/4m7fg8r9/',
    rankChangeLabel: '↑12',
  },
  {
    id: '百变小樱',
    name: '百变小樱',
    description: '百变小樱是一家自2020年起运营的低调小众机场，线路稳定可靠，采用隧道与专线结合的架构。其套餐支持两种不同的使用方式，并配有定制化精简面板，有效避免节点列表冗长。团队已迁至海外运营，确保无按流量风险，主打产品特点为稳定性、全流媒体解锁、超低价格以及附赠流媒体账号。另外，此机场支持SSR系列代理软件，例如小火箭和Clash。支付方式涵盖支付宝、微信支付以及USDT。',
    rank: 34,
    officialHref: 'https://www.bbxy88.xyz/v2/register?code=WuuD',
    universalSubscription: true,
    minPlanText: '15元 100G/30天',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/+IugiUXlyYqgyNjE0',
    reviewHref: '/article/jd2i293q/',
    rankChangeLabel: '↑7',
  },
  {
    id: '白羊星',
    name: '白羊星',
    description: '白羊星是一家新兴机场，节点质量还不错，支持按流量购买，支持支付宝、微信、USDT支付。',
    rank: 38,
    officialHref: 'https://baiyangxi.com/#/register?code=gelkjfjz',
    universalSubscription: false,
    minPlanText: '12元 100G/月',
    hasOneTimePackage: true,
    telegramHref: '',
    reviewHref: '/article/zuuzyvvh/',
    rankChangeLabel: '↑4',
  },
  {
    id: 'sogo云',
    name: 'sogo云',
    description: 'Sogo云定位偏新手友好，提供自研客户端一键使用，同时支持通用订阅导入。作为新开业服务，更建议先用低档套餐连续验证高峰稳定性，再决定是否长期使用。',
    rank: 48,
    officialHref: 'https://ermaozi.sogoaff.com/#/login?code=yxneZJKR',
    universalSubscription: false,
    minPlanText: '20元 150G/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/sogoyun',
    reviewHref: '/blog/sogoyun/',
    rankChangeLabel: '↓5',
    image: 'https://image.ermao.net/images/blog/sogo云/20260414_090807-edf50c.png',
    tags: ['自研客户端', '通用订阅', '流量包'],
  },
  {
    id: '光速云',
    name: '光速云',
    description: '光速云IEPL专线机场，提供高品质线路，支持 Trojan/SS 等协议，专注于稳定流媒体与跨境业务。全线解锁 Netflix、Disney+、YouTube、ChatGPT、Gemini 等平台与 AI 服务，并支持 TikTok 跨区，适合跨境电商、直播运营、远程办公等高要求用户。套餐无限速、无倍率、不限制设备数（合理使用），支持支付宝、USDT 付款。节点覆盖港台、日美新、东南亚、韩国及多国欧美地区，当前轻量版99元/年、极速版17元110GB/月，另提供1T大流量永久套餐。拥有多客服团队与海外技术支持，可提供小火箭下载、TG代注册等增值服务。',
    rank: 39,
    officialHref: 'https://ermaozi01.gsyvipaff.com/#/?code=d1eMb3ku',
    universalSubscription: false,
    minPlanText: '99元 59GB/年',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/LightspeedCloud',
    reviewHref: '/blog/guangsuyun/',
    rankChangeLabel: '↑5',
    image: 'https://image.ermao.net/images/blog/guangsuyun/image.png',
    tags: ['专线', '低价', '备用'],
  },
  {
    id: '全球云',
    name: '全球云',
    description: '全球云周期套餐最低 20 元 120GB/月，另有 99 元年付轻量版、三档不限时包和独享节点；服务商主打 IPLC/IEPL、VLESS 与 70+ 节点。',
    rank: 49,
    officialHref: 'https://ermaozi01.gcvipaff.cc/#/?code=PGcNh6bA',
    universalSubscription: true,
    minPlanText: '20元 120GB/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/quanqiuyun001',
    reviewHref: '/blog/quanqiuyun/',
    rankChangeLabel: '↓4',
    image: 'https://image.ermao.net/images/blog/quanqiuyun/20260205_093332-a4e9dc.png',
    tags: ['IPLC/IEPL', 'VLESS', '不限时流量包'],
  },
  {
    id: 'tnt',
    name: 'TNT',
    description: '全IPLC专线，不限速 原生IP解锁流媒体 解锁 Chatgpt，Tiktok 高效客服响应 不限制客户端',
    rank: 51,
    officialHref: 'https://ermaozi02.tntvipaff.cc/#/register?code=f1EyPwf3',
    universalSubscription: false,
    minPlanText: '30元 60GB/季',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/TNTCloud2',
    reviewHref: '/article/4uxesz79/',
    rankChangeLabel: '↓5',
  },
  {
    id: '纵云梯',
    name: '纵云梯',
    description: '纵云梯是一家新机场，个人体验了一下速度还不错，客服响应也比较快。',
    rank: 32,
    officialHref: 'https://zongyunti.com/?r=60147',
    universalSubscription: true,
    minPlanText: '10元 60G/30天',
    hasOneTimePackage: false,
    telegramHref: '',
    reviewHref: '/article/e5lzcgzg/',
    rankChangeLabel: '↑15',
  },
  {
    id: '加速啦',
    name: '加速啦',
    description: '全自研开发面板，海外团队运营，专线节点1倍率，安全好用省心无日志纪录，节点质量高，客服实时在线，晚高峰不限速，不限制设备。',
    rank: 43,
    officialHref: 'https://jiasu.la/?r=39116',
    universalSubscription: true,
    minPlanText: '10元 80G/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/jiasu_la',
    reviewHref: '/article/kewe92tu/',
    rankChangeLabel: '↑5',
  },
  {
    id: '_99bar',
    name: '99吧',
    description: '成立时间：2024.8.23 翻墙协议：Shadowsocks 入口：深港IEPL专线 + 广东移动中转 过境：IEPL；公网中转 落地：快车道、BageVM、Lain、Akari、Misaka、等 解锁支持： Netflix、Disney+、TikTok、ChatGPT 备注：无设备数量限制，多端配置同步，全网所有节点​​1倍率扣流。',
    rank: 45,
    officialHref: 'https://99vpn.bar/#/register?code=qzpkbzHF',
    universalSubscription: false,
    minPlanText: '9.9元 70GB/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/jiujiuchat',
    reviewHref: '',
    rankChangeLabel: '↑4',
  },
  {
    id: 'aladdin',
    name: 'Aladdin',
    description: '这家机场是我自己用的，节点质量非常高，解锁大部分主流媒体，可以访问openai，有 emby 和 奈飞 劫持。支持支付宝、微信、USDT支付。',
    rank: 52,
    officialHref: 'https://short.thisgourl.xyz/#/register?code=tvLw0oMj',
    universalSubscription: false,
    minPlanText: '30元 390G/半年',
    hasOneTimePackage: false,
    telegramHref: '',
    reviewHref: '',
    rankChangeLabel: '↓2',
  },
  {
    id: '老头vpn',
    name: '老头vpn',
    description: '老头VPN 从2016年开始运营，资历非常老，期间一直保持高质量服务。全球华人公认的老牌国际加速服务厂商 高达2Gbps的单线接入能力。支持微信支付宝。',
    rank: 44,
    officialHref: 'https://www.chattous.net/register?code=3OWtZ9Bi',
    universalSubscription: false,
    minPlanText: '25元 150G/月',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/OldManVPN',
    reviewHref: '/article/laotouvpn/',
    rankChangeLabel: '↑7',
    image: 'https://image.ermao.net/images/article/laotouvpn/image.png',
    tags: ['老牌', 'IEPL', '原生 IP'],
  },
  {
    id: '寰宇云',
    name: '寰宇云',
    description: '寰宇云是新开业的 IPLC 中转定位机场，月付、年付小包和不限时流量包并行，适合先低成本验证本地可用性，再决定是否升级长期使用。',
    rank: 53,
    officialHref: 'https://vip4.huanyuyunbest.com/#/register?code=W82s7u2a',
    universalSubscription: false,
    minPlanText: '18元 150GB/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/+zXIUmCa1aLBmOGQx',
    reviewHref: '/blog/huanyuyun/',
    rankChangeLabel: '↓1',
    image: 'https://image.ermao.net/images/blog/huanyuyun/20260417_082505-079a0c.png',
    tags: ['IPLC', '不限时', '新站'],
  },
  {
    id: '掌中世界',
    name: '掌中世界',
    description: '节点稳定，客服24小时在线，解锁主流流媒体。',
    rank: 40,
    officialHref: 'https://qq.zjs2025.com/user/register?code=S74QiRGN',
    universalSubscription: false,
    minPlanText: '27元 150GB/月',
    hasOneTimePackage: true,
    telegramHref: '',
    reviewHref: '/article/7eogfldo/',
    rankChangeLabel: '↑13',
  },
  {
    id: '瞬云',
    name: '瞬云',
    description: '瞬云主打 30+ 多地区节点与 ANYCAST 高速线路，官方标示支持 Netflix、Disney+、TikTok、ChatGPT 等场景，支持支付宝、微信、USDT 支付，并提供工单和在线客服。',
    rank: 54,
    officialHref: 'https://aaa.jichang.best/#/register?code=QEiJcAPp',
    universalSubscription: true,
    minPlanText: '8.25元 59G/月',
    hasOneTimePackage: false,
    telegramHref: '',
    reviewHref: '/blog/shunyun/',
    rankChangeLabel: '-',
    image: 'https://image.ermao.net/images/blog/shunyun/20260407_101246-ab75d9.png',
    tags: ['ANYCAST', '30+ 节点', '自研入口'],
  },
  {
    id: '二猫云',
    name: '二猫云',
    description: '二猫云定位是新开业的专线型月付机场，套餐阶梯从 100GB 到 800GB，适合先用低档验证晚高峰稳定性后再升级。',
    rank: 37,
    officialHref: 'https://v01.2maoyunaff.cc/#/register?code=6n2UaV1A',
    universalSubscription: false,
    minPlanText: '16元 100G/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/ermaov1',
    reviewHref: '/blog/ermaoyun/',
    rankChangeLabel: '↑18',
    image: 'https://image.ermao.net/images/blog/ermaoyun/20260414_104113-5bbd8b.png',
    tags: ['新站', 'IPLC', 'IEPL'],
  },
  {
    id: 'xxai',
    name: 'xxai',
    description: '节点质量非常硬。全 IEPL 专线节点、低延迟游戏 & 直播专线、AI 工具 & 流媒体视频解锁。支持按流量购买。',
    rank: 61,
    officialHref: 'https://xx-ai.co?invite_code=K2TpsDcg',
    universalSubscription: false,
    minPlanText: '16.9元 100G/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/xxai_official',
    reviewHref: '',
    rankChangeLabel: '↓5',
  },
  {
    id: '一翻云',
    name: '一翻云',
    description: '一翻云适合预算敏感、希望先从小档位验证可用性的用户。套餐梯度从 150GB 到 1200GB，覆盖轻度到中重度需求，同时提供一次性流量包；通用订阅暂不支持，更建议按月付路径逐步升级。',
    rank: 55,
    officialHref: 'https://ermaozi.yifanaff.com/#/register?code=wQxPnuZv',
    universalSubscription: false,
    minPlanText: '30元 150G/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/1flyunvip',
    reviewHref: '/article/yifanyun/',
    rankChangeLabel: '↑2',
    image: 'https://image.ermao.net/images/article/yifanyun/20260422_214050-889482.png',
    tags: ['流量梯度', '一次性订阅', '轻中度'],
  },
  {
    id: '速界',
    name: '速界',
    description: '速界主打 IEPL 路线和多档周期套餐，当前可确认信息是：不支持通用订阅、暂无 TG 群或频道。更适合先小档验证，再按真实使用量升级。',
    rank: 56,
    officialHref: 'https://ermaozi01.speedworldaff.cc/#/register?code=SLWrHAPx',
    universalSubscription: false,
    minPlanText: '25元/月',
    hasOneTimePackage: false,
    telegramHref: '',
    reviewHref: '/article/sujie/',
    rankChangeLabel: '↑2',
    image: 'https://image.ermao.net/images/article/sujie/20260601_161523-e997ac.png',
    tags: ['IEPL', '周期套餐', '专线'],
  },
  {
    id: '快狸',
    name: '快狸',
    description: '快狸目前定位是低门槛入门：最低档价格友好，支付方式完善，套餐梯度从轻度到重度都有覆盖。当前已知边界是暂不支持通用订阅、暂无 TG 群，更适合先小档验证再决定是否长期续费。',
    rank: 62,
    officialHref: 'https://ermaozi.kuailicloud.cc/#/register?code=nwj3Tk14',
    universalSubscription: false,
    minPlanText: '10元 30G/月',
    hasOneTimePackage: true,
    telegramHref: '',
    reviewHref: '/article/kuaili/',
    rankChangeLabel: '↓3',
    image: 'https://image.ermao.net/images/blog/xvqi7n99/20260601_171625-67cb05.png',
    tags: ['新站', '低价', '多档套餐'],
  },
  {
    id: '边缘节点',
    name: '边缘节点',
    description: '边缘节点更偏向低门槛试错路线：有 108 元年付小流量入门档，也有 25/50/100/200 元月付阶梯。已知边界是暂不支持通用订阅、暂无 TG 群，更适合先小档验证再升级。',
    rank: 57,
    officialHref: 'https://ermaozi.edgenovaaff.cc/#/register?code=oErRsBNy',
    universalSubscription: false,
    minPlanText: '9元/月(年付45G)',
    hasOneTimePackage: true,
    telegramHref: '',
    reviewHref: '/article/bianyuanjiedian/',
    rankChangeLabel: '↑3',
    image: 'https://image.ermao.net/images/article/edge-x/20260619_163356-bc37f3.png',
    tags: ['低门槛', 'IPLC', '备用'],
  },
  {
    id: '好鸭云',
    name: '好鸭云',
    description: '节点非常稳定，老板态度好，客服也很热情，支持支付宝。最重要的是会随套餐送Emby影视服务(一个看高清电影、电视剧、番剧的站点)！MisakaF、aca替代方案。喜欢看剧的同学可以试试。',
    rank: 58,
    officialHref: 'https://vuser.niceduck.io/register?code=QS0hzI2y',
    universalSubscription: false,
    minPlanText: '12元 100G/月',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/niceduck_group',
    reviewHref: '/article/73dnyy9a/',
    rankChangeLabel: '↑3',
  },
  {
    id: '随便云',
    name: '随便云',
    description: '随便云提供灵活的月付套餐和不限时流量包，满足不同用户的需求。所有的套餐均支持 全节点 IEPL / 中转支持 和 多地区 Netflix + 其他流媒体解锁。',
    rank: 33,
    officialHref: 'https://wcnm.one/register?code=YZxHwCws',
    universalSubscription: true,
    minPlanText: '10元 68G/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/suibianvip',
    reviewHref: '/blog/suibian/',
    rankChangeLabel: '↑29',
    image: 'https://image.ermao.net/images/blog/suibian/20260112_150826-2f11d9.png',
    tags: ['BGP', 'IEPL', '备用'],
  },
  {
    id: 'ccyz',
    name: 'ccyz',
    description: '主打高性价比与专线稳定，采用 BGP+IEPL 双重优化，晚高峰依旧保持高速。支持 Netflix、Disney+、HBO 等主流流媒体解锁，并提供全天候客服响应，适合长期使用或需要稳定带宽的用户。',
    officialHref: 'https://xxyun.at/?code=HOWnn58c',
    universalSubscription: false,
    minPlanText: '15元 150G/月',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/+jiosLuqA9Mk0Yjkx',
    reviewHref: '/blog/ccyz/',
    image: 'https://image.ermao.net/images/blog/ccyz/image-1.png',
    tags: ['BGP', 'IEPL', '晚高峰'],
  },
  {
    id: '青云梯',
    name: '青云梯',
    description: '机场比较稳定，解锁Chatgpt，Tiktok及各大流媒体，四年老牌专线，最便宜套餐 98 一年每月 60g，折合每个月 8 元。',
    rank: 36,
    officialHref: 'https://ermaozi02.qytvipaff.cc/register?aff=W5ICDu2y',
    universalSubscription: false,
    minPlanText: '8 元60g/月(年付)',
    hasOneTimePackage: false,
    telegramHref: 'https://t.me/qingyunticc',
    reviewHref: '/article/mcridsxx/',
    rankChangeLabel: '↑28',
  },
  {
    id: '浪网',
    name: '浪网',
    description: '浪网主打高性能 VLESS、BGP 多线路智能调度和专线出口，并提供自研客户端降低配置门槛。套餐覆盖月付、年付、一次性不限时流量包与独立 IP 定制线路，适合从新手日常使用到大流量、直播和跨境业务等不同场景。',
    rank: 22,
    officialHref: 'https://ermaozi01.wavenetaff.com/#/?code=hghwewpc',
    universalSubscription: false,
    minPlanText: '30元 150GB/月',
    hasOneTimePackage: true,
    telegramHref: 'https://t.me/+vR-Qm3CQ7IQ2ZDg1',
    reviewHref: '/blog/wangwang-airport/',
    rankChangeLabel: '新上',
    image: 'https://image.ermao.net/images/blog/wangwang-airport/20260723_112231-1e1ac2.png',
    tags: ['VLESS', '自研客户端', '不限时流量包'],
  },
  {
    id: '传送门',
    name: '传送门',
    description: '自研 App，订阅异常自动恢复，适合不想手动排障的新手。',
    officialHref: 'https://aa.csmfby.com/?code=b9eUUu00',
    universalSubscription: 'unknown',
    minPlanText: '99元/年',
    hasOneTimePackage: 'unknown',
    reviewHref: '/blog/8svdlqds/',
    image: 'https://image.ermao.net/images/blog/8svdlqds/20260407_102504-14e480.png',
    tags: ['自研 App', '自动恢复', '新手'],
  },
]

export const airportRecords: AirportRecord[] = airportSources.map(seed => ({
    ...seed,
    plans: airportPlanCatalog[seed.id] ?? [],
  }))

export const airportRanking = [...airportRecords]
  .filter(item => typeof item.rank === 'number')
  .sort((a, b) => a.rank! - b.rank!)

// 官网链接可能包含推广参数，组件会统一输出 rel="sponsored nofollow noopener"。

export const airportRisks: AirportRiskItem[] = [
  {
    name: '隐云',
    status: '高风险观察',
    description: '与奈云、CAC、OKAC 存在同主体联动风险，相关主体近期异常较多。当前建议暂停续费和新购，先看完整风险说明。',
    href: '/blog/yinyun/',
  },
]

export const airportGuides: AirportGuideItem[] = [
  {
    title: '第一次购买',
    description: '优先月付或试用，不建议年付、三年付、终身套餐。',
  },
  {
    title: '重视稳定性',
    description: '优先看 IEPL/IPLC、BGP 优化、晚高峰测速记录和历史运营时间。',
  },
  {
    title: '重视客户端自由度',
    description: '优先选择支持通用订阅、Clash、Shadowrocket、mihomo 的机场。',
  },
  {
    title: '重视避坑',
    description: '购买前先搜站内跑路记录，确认官网、订阅、工单、TG 群近期是否正常。',
  },
  {
    title: '重视价格',
    description: '不要只看最低价，还要看流量、倍率、设备数、是否限速和是否按自然月重置。',
  },
]
