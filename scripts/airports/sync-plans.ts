import fs from 'node:fs'
import path from 'node:path'
import { airportSources, type AirportPlan } from '../../docs/.vuepress/data/airports'

interface MarkdownTable {
  file: string
  heading: string
  headers: string[]
  rows: string[][]
}

const root = path.resolve('docs/blog/机场推荐')
const outputFile = path.resolve('docs/.vuepress/data/airports.ts')
const startMarker = '// airport:sync-plans:start'
const endMarker = '// airport:sync-plans:end'

const cleanCell = (value: string) => value.replace(/\*\*/g, '').trim()
const splitRow = (line: string) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cleanCell)
const isDivider = (line: string) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line)
const isPlanTable = (headers: string[]) => /套餐/.test(headers.join(' ')) && /(价格|月费|原价|券后价)/.test(headers.join(' ')) && /流量/.test(headers.join(' '))
const normalize = (value: string) => value.toLowerCase().replace(/机场|推荐|评测|套餐|价格|云/g, '').replace(/[^a-z0-9\u3400-\u9fff]/g, '')
const stripMarkdown = (value: string) => value.replace(/!?(?:\[([^\]]*)\])\([^)]*\)/g, '$1').replace(/<[^>]+>/g, '').trim()
const getLink = (value: string) => value.match(/\[[^\]]*\]\((https?:\/\/[^)]+)\)/)?.[1]

const files = (directory: string): string[] => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const child = path.join(directory, entry.name)
  return entry.isDirectory() ? files(child) : entry.name.endsWith('.md') ? [child] : []
})

const extract = (file: string): MarkdownTable[] => {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  const tables: MarkdownTable[] = []
  let heading = ''

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^#{2,4}\s+(.+?)(?:\s+\{#[^}]+\})?$/)
    if (match) heading = stripMarkdown(match[1])
    if (!lines[index].trim().startsWith('|') || !lines[index + 1] || !isDivider(lines[index + 1])) continue

    const headers = splitRow(lines[index])
    const rows: string[][] = []
    index += 2
    while (index < lines.length && lines[index].trim().startsWith('|')) {
      rows.push(splitRow(lines[index]))
      index += 1
    }
    if (isPlanTable(headers) && rows.length) tables.push({ file, heading, headers, rows })
  }
  return tables
}

const allTables = files(root).flatMap(extract)
const tablesForSeed = (seed: (typeof airportSources)[number]) => {
  const candidates = allTables.filter((table) => {
    const fileName = path.basename(table.file, '.md')
    const identity = `${table.heading} ${fileName}`
    return [seed.id, seed.name].some(name => {
      const needle = normalize(name)
      return needle.length > 0 && normalize(identity).includes(needle)
    })
  })

  const sorted = candidates.sort((a, b) => {
    const score = (table: MarkdownTable) => (table.file.includes('/2026/') ? 30 : table.file.includes('/2025/') ? 20 : table.file.endsWith('/vpn.md') ? 10 : 0)
    return score(b) - score(a) || b.rows.length - a.rows.length
  })
  if (!sorted[0]) return []
  return sorted.filter(table => table.file === sorted[0].file)
}

const plansFromTable = (table: MarkdownTable): AirportPlan[] => {
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
    const oneTime = /一次性|不限时|永久/.test(`${name} ${priceText} ${billingCycle ?? ''}`)

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

const catalog: Record<string, AirportPlan[]> = {}
const sources: string[] = []
for (const seed of airportSources) {
  const tables = tablesForSeed(seed)
  if (!tables.length) continue
  const seen = new Set<string>()
  catalog[seed.id] = tables.flatMap(plansFromTable).filter((plan) => {
    const key = `${plan.name}|${plan.priceText}|${plan.traffic}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  sources.push(`// ${seed.id}: ${path.relative(process.cwd(), tables[0].file)} — ${tables.map(table => table.heading).join(' / ')}`)
}

const serialized = JSON.stringify(catalog, null, 2)
  .replace(/"([^"\n]+)":/g, (_match, key: string) => `${JSON.stringify(key)}:`)

const generatedBlock = `${startMarker}\n// 此区块由 pnpm airport:sync-plans 生成，请勿手工编辑。\n// 事实源优先级：2026 详情页 > 2025 详情页 > 主站总表。\n${sources.join('\n')}\nconst generatedAirportPlanCatalog: Record<string, AirportPlan[]> = ${serialized}\n${endMarker}`
const current = fs.readFileSync(outputFile, 'utf8')
const start = current.indexOf(startMarker)
const end = current.indexOf(endMarker)
if (start < 0 || end < start) throw new Error(`未在 ${outputFile} 找到价格表同步标记`)
const content = `${current.slice(0, start)}${generatedBlock}${current.slice(end + endMarker.length)}`

fs.writeFileSync(outputFile, content)
console.log(`已同步 ${Object.keys(catalog).length} 家机场、${Object.values(catalog).flat().length} 个套餐到 ${path.relative(process.cwd(), outputFile)}`)
