import {
  airportRanking,
  airportRecords,
  type AirportBoolean,
  type AirportRecord,
} from '../../docs/.vuepress/data/airports'

const publicTextFields = [
  'name',
  'officialHref',
  'description',
  'minPlanText',
] as const

const sensitivePattern = /(佣金|返佣|推广|affiliate|commission)/i

const errors: string[] = []
const warnings: string[] = []
const seenIds = new Map<string, AirportRecord>()
const seenRanks = new Map<number, AirportRecord>()

const formatBoolean = (value: AirportBoolean) => {
  if (value === true) return 'true'
  if (value === false) return 'false'
  return 'unknown'
}

const addWarningForUnknown = (record: AirportRecord, field: string, value: AirportBoolean) => {
  if (value === 'unknown') {
    warnings.push(`${record.name}: ${field} 仍为 unknown`)
  }
}

for (const record of airportRecords) {
  const previous = seenIds.get(record.id)
  if (previous) {
    errors.push(`重复 id: ${record.id} (${previous.name} / ${record.name})`)
  }
  seenIds.set(record.id, record)

  if (!record.name.trim()) errors.push(`${record.id}: 缺少 name`)
  if (!record.officialHref.trim()) errors.push(`${record.name}: 缺少 officialHref`)
  if (!record.minPlanText.trim()) warnings.push(`${record.name}: 缺少 minPlanText`)

  const ranked = seenRanks.get(record.rank)
  if (ranked) {
    errors.push(`重复 rank ${record.rank}: ${ranked.name} / ${record.name}`)
  }
  seenRanks.set(record.rank, record)

  addWarningForUnknown(record, 'universalSubscription', record.universalSubscription)
  addWarningForUnknown(record, 'hasOneTimePackage', record.hasOneTimePackage)

  for (const field of publicTextFields) {
    const value = record[field]
    if (typeof value === 'string' && sensitivePattern.test(value)) {
      errors.push(`${record.name}: 公开字段 ${field} 含敏感运营词汇`)
    }
  }

  if (record.universalSubscription === 'unknown' || record.hasOneTimePackage === 'unknown') {
    warnings.push(
      `${record.name}: 布尔字段未完全确认 (${formatBoolean(record.universalSubscription)} / ${formatBoolean(record.hasOneTimePackage)})`,
    )
  }
}

const expectedRanks = airportRanking.map(item => item.rank)
const maxRank = Math.max(...expectedRanks)
for (let rank = 1; rank <= maxRank; rank += 1) {
  if (!seenRanks.has(rank)) {
    errors.push(`排名缺口: rank ${rank}`)
  }
}

if (errors.length > 0) {
  console.error('airport:check failed\n')
  for (const error of errors) console.error(`- ${error}`)
}

if (warnings.length > 0) {
  console.log(errors.length > 0 ? '\nwarnings:' : 'airport:check warnings:')
  for (const warning of warnings) console.log(`- ${warning}`)
}

if (errors.length === 0) {
  console.log(`airport:check passed (${airportRecords.length} records, ${warnings.length} warnings)`)
}

process.exit(errors.length > 0 ? 1 : 0)
