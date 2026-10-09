import fs from 'node:fs'
import path from 'node:path'
import { airportSources, type AirportPlan } from '../../docs/.vuepress/data/airports'
import { extractPlanTables, plansFromTable } from './plan-tables'

const root = path.resolve('docs/blog/机场推荐')
const outputFile = path.resolve('docs/.vuepress/data/airports.ts')
const startMarker = '// airport:sync-plans:start'
const endMarker = '// airport:sync-plans:end'

const normalize = (value: string) => value.toLowerCase().replace(/机场|推荐|评测|套餐|价格|云/g, '').replace(/[^a-z0-9\u3400-\u9fff]/g, '')

const files = (directory: string): string[] => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const child = path.join(directory, entry.name)
  return entry.isDirectory() ? files(child) : entry.name.endsWith('.md') ? [child] : []
})

const allTables = files(root).flatMap(file => extractPlanTables(fs.readFileSync(file, 'utf8'), file))
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
    const score = (table: (typeof allTables)[number]) => (table.file.includes('/2026/') ? 30 : table.file.includes('/2025/') ? 20 : table.file.endsWith('/vpn.md') ? 10 : 0)
    return score(b) - score(a) || b.rows.length - a.rows.length
  })
  if (!sorted[0]) return []
  return sorted.filter(table => table.file === sorted[0].file)
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
