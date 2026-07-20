import fs from 'node:fs'
import path from 'node:path'

type ParsedFields = Record<string, string>

const labels = [
  '机场名称',
  '机场网址',
  '机场logo',
  '支持的付款方式',
  '佣金比例(循环)',
  '机场运营时长',
  '机场简介/广告词',
  '是否支持通用订阅',
  'TG群或频道',
  '测速截图',
  '是否有一次性订阅(限量不限时)',
  '最便宜的订阅价格与流量',
  '价格表',
]

const labelSet = new Set(labels)

const normalizeValue = (value?: string) => {
  const normalized = value?.trim() ?? ''
  return normalized || 'unknown'
}

const parseBoolean = (value: string) => {
  const normalized = value.trim().toLowerCase()
  if (/^(是|有|支持|true|yes|y|1|✔|✅)/i.test(normalized)) return true
  if (/^(否|无|没有|不支持|false|no|n|0|✘|❌)/i.test(normalized)) return false
  return 'unknown'
}

const splitList = (value: string) => {
  if (!value || value === 'unknown') return []

  return value
    .split(/\r?\n|,|，|、/)
    .map(item => item.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)
}

const parseFields = (input: string): ParsedFields => {
  const fields: ParsedFields = {}
  let currentLabel = ''

  for (const line of input.split(/\r?\n/)) {
    if (/^##\s+/.test(line)) {
      currentLabel = ''
      continue
    }

    const labelMatch = line.match(/^([^:：]+)[:：]\s*(.*)$/)

    if (labelMatch && labelSet.has(labelMatch[1].trim())) {
      currentLabel = labelMatch[1].trim()
      fields[currentLabel] = labelMatch[2].trim()
      continue
    }

    if (currentLabel) {
      fields[currentLabel] = [fields[currentLabel], line].filter(Boolean).join('\n').trim()
    }
  }

  return fields
}

const createId = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_-]/gu, '')

const createDraft = (fields: ParsedFields, sourceFile: string) => {
  const name = normalizeValue(fields['机场名称'])
  const priceTable = splitList(normalizeValue(fields['价格表']))

  return {
    id: createId(name),
    name,
    status: 'active',
    anchor: createId(name),
    officialHref: normalizeValue(fields['机场网址']),
    logo: normalizeValue(fields['机场logo']),
    paymentMethods: splitList(normalizeValue(fields['支持的付款方式'])),
    operationTime: normalizeValue(fields['机场运营时长']),
    slogan: normalizeValue(fields['机场简介/广告词']),
    description: normalizeValue(fields['机场简介/广告词']),
    universalSubscription: parseBoolean(normalizeValue(fields['是否支持通用订阅'])),
    telegramHref: normalizeValue(fields['TG群或频道']),
    speedTestImages: splitList(normalizeValue(fields['测速截图'])),
    hasOneTimePackage: parseBoolean(normalizeValue(fields['是否有一次性订阅(限量不限时)'])),
    minPlanText: normalizeValue(fields['最便宜的订阅价格与流量']),
    minPlan: {
      text: normalizeValue(fields['最便宜的订阅价格与流量']),
    },
    plans: priceTable.map(text => ({ text })),
    tags: [],
    claimedByProvider: true,
    private: {
      commissionRateRecurring: normalizeValue(fields['佣金比例(循环)']),
      publishDecision: 'testing',
      sourceNote: `intake:${path.relative(process.cwd(), sourceFile)}`,
      notes: [],
    },
  }
}

const file = process.argv[2]

if (!file) {
  console.error('Usage: pnpm airport:intake <path-to-intake.md>')
  process.exit(1)
}

const sourceFile = path.resolve(file)
const input = fs.readFileSync(sourceFile, 'utf8')
const fields = parseFields(input)
const draft = createDraft(fields, sourceFile)

console.log(JSON.stringify(draft, null, 2))
