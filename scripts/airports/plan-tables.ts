import type { AirportPlan } from '../../docs/.vuepress/data/airports'

interface MarkdownTable {
  file: string
  heading: string
  headings: string[]
  headers: string[]
  rows: string[][]
}

const cleanCell = (value: string) => value.replace(/\*\*/g, '').trim()
const splitRow = (line: string) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cleanCell)
const isDivider = (line: string) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line)
const isPlanTable = (headers: string[]) => /套餐/.test(headers.join(' ')) && /(价格|月费|原价|券后价)/.test(headers.join(' ')) && /流量/.test(headers.join(' '))
// Convert source-table HTML to text without leaving tag delimiters behind,
// even for nested/malformed input. Rendering still uses Vue text interpolation.
const stripHtmlTags = (value: string) => {
  let insideTag = false
  let text = ''
  for (const char of value) {
    if (char === '<') insideTag = true
    else if (char === '>') insideTag = false
    else if (!insideTag) text += char
  }
  return text
}
const stripMarkdown = (value: string) => stripHtmlTags(value.replace(/!?(?:\[([^\]]*)\])\([^)]*\)/g, '$1')).trim()
const getLink = (value: string) => value.match(/\[[^\]]*\]\((https?:\/\/[^)]+)\)/)?.[1]

export const extractPlanTables = (markdown: string, file = ''): MarkdownTable[] => {
  const lines = markdown.split(/\r?\n/)
  const tables: MarkdownTable[] = []
  let heading = ''
  const headings: string[] = []

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^(#{1,6})\s+(.+?)(?:\s+\{#[^}]+\})?$/)
    if (match) {
      heading = stripMarkdown(match[2])
      headings.length = match[1].length - 1
      headings.push(heading)
    }
    if (!lines[index].trim().startsWith('|') || !lines[index + 1] || !isDivider(lines[index + 1])) continue

    const headers = splitRow(lines[index])
    const rows: string[][] = []
    index += 2
    while (index < lines.length && lines[index].trim().startsWith('|')) {
      rows.push(splitRow(lines[index]))
      index += 1
    }
    if (isPlanTable(headers) && rows.length) tables.push({ file, heading, headings: [...headings].filter(Boolean), headers, rows })
    // The next line may be an adjacent heading; do not skip it.
    index -= 1
  }
  return tables
}

// Use explicit plan/expiry language only. Unlimited speed, devices, traffic,
// or permanent IP/support are not evidence that a plan has no expiry.
const recurringPattern = /月付|年付|季付|半年付|包月|包年|周期(?:订阅|套餐)|(?:每|\/)\s*(?:[一二三两半]|\d+)?(?:个月|月|年|季度|季|天)/
const hasOneTimeEvidence = (value: string) => value.split(/[，,。；;\n]/).some(part => {
  if (/(?:不支持|不提供|不保证|不承诺|未确认|没有|并非|不是|非|无)\s*(?:一次性|不限时|永久(?:套餐|流量))/.test(part)) return false
  return /不限时|无限时长|(?:流量|套餐|包)(?:永不过期|不过期|永久有效)|永久(?:不限时|套餐|流量)|终身(?:套餐|流量包)|一次性(?:购买|付款|付费|流量|套餐|价格)|^\s*(?:一次性|永久|不过期)\s*$|[/:：]\s*一次性/.test(part)
})

export const isOneTimePlan = (plan: Pick<AirportPlan, 'name' | 'priceText' | 'traffic' | 'billingCycle' | 'features'>, headings: string[] = []): boolean => {
  const direct = [plan.name, plan.priceText, plan.billingCycle].filter(Boolean).join(' ')
  // A one-off payment can still buy a fixed-term plan. Explicit periods win.
  const finiteCycle = /(?:[一二三两半]|\d+)\s*(?:天|周|个月|月|年)|季度/.test(plan.billingCycle ?? '')
  const finiteTerm = /(?:有效期|限期|期限)\s*(?:为)?\s*(?:[一二三两半]|\d+)\s*(?:天|周|个月|月|年)/.test(direct)
  if (recurringPattern.test(direct) || finiteCycle || finiteTerm) return false
  if (hasOneTimeEvidence(direct)) return true
  // A monthly/annual row is never converted just because a broader heading
  // mentions both recurring subscriptions and non-expiring traffic packs.
  if ([plan.traffic, ...(plan.features ?? [])].some(value => value && !recurringPattern.test(value) && hasOneTimeEvidence(value))) return true
  for (const heading of [...headings].reverse()) {
    if (recurringPattern.test(heading)) return false
    if (hasOneTimeEvidence(heading)) return true
  }
  return false
}

export const plansFromTable = (table: MarkdownTable): AirportPlan[] => {
  const headerIndex = (pattern: RegExp) => table.headers.findIndex(header => pattern.test(header))
  const nameIndex = headerIndex(/套餐(?:名称)?/)
  const preferredPriceIndex = headerIndex(/券后价/)
  const priceIndex = preferredPriceIndex >= 0 ? preferredPriceIndex : headerIndex(/价格|月费|一次性价格/)
  const trafficIndex = headerIndex(/流量/)
  const cycleIndex = headerIndex(/周期|时长/)
  const audienceIndex = headerIndex(/适用|人群|建议/)
  const purchaseIndex = headerIndex(/购买/)

  return table.rows.map((row) => {
    const name = stripMarkdown(row[nameIndex] ?? row[0] ?? '')
    const priceText = stripMarkdown(row[priceIndex] ?? '')
    const traffic = stripMarkdown(row[trafficIndex] ?? '')
    const billingCycle = cycleIndex >= 0 ? stripMarkdown(row[cycleIndex] ?? '') : undefined
    const audience = audienceIndex >= 0 ? stripMarkdown(row[audienceIndex] ?? '') : undefined
    const ignored = new Set([nameIndex, priceIndex, trafficIndex, cycleIndex, audienceIndex, purchaseIndex])
    const features = row.flatMap((cell, index) => {
      if (ignored.has(index) || !stripMarkdown(cell)) return []
      return [`${table.headers[index] ?? '说明'}：${stripMarkdown(cell)}`]
    })
    const purchaseHref = purchaseIndex >= 0 ? getLink(row[purchaseIndex] ?? '') : undefined
    const oneTime = isOneTimePlan({ name, priceText, traffic, billingCycle, features }, table.headings)

    return {
      name,
      priceText,
      traffic,
      billingCycle,
      type: oneTime ? '不限时流量包' : '周期订阅',
      audience,
      features: features.length ? features : undefined,
      purchaseHref,
      text: [name, priceText, traffic].filter(Boolean).join('，'),
      oneTime: oneTime || undefined,
    }
  })
}

