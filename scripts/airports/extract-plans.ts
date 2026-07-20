import fs from 'node:fs'
import path from 'node:path'

interface ExtractedTable {
  file: string
  title: string
  permalink: string
  headers: string[]
  rows: string[][]
}

const root = process.argv[2] ?? 'docs/blog/机场推荐'
const rootPath = path.resolve(root)

const cleanCell = (value: string) =>
  value
    .replace(/^\s*\|?/, '')
    .replace(/\|?\s*$/, '')
    .replace(/\*\*/g, '')
    .trim()

const splitRow = (line: string) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(cleanCell)

const isDivider = (line: string) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line)

const isPlanTable = (headers: string[]) => {
  const headerText = headers.join(' ')
  return /套餐/.test(headerText) && /(价格|月费|原价|券后价)/.test(headerText) && /流量/.test(headerText)
}

const collectMarkdownFiles = (target: string): string[] => {
  const stat = fs.statSync(target)
  if (stat.isFile()) return target.endsWith('.md') ? [target] : []

  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(target, entry.name)
    if (entry.isDirectory()) return collectMarkdownFiles(child)
    return entry.name.endsWith('.md') ? [child] : []
  })
}

const extractTables = (file: string): ExtractedTable[] => {
  const content = fs.readFileSync(file, 'utf8')
  const title = content.match(/^title:\s*(.+)$/m)?.[1]?.replace(/^['"]|['"]$/g, '') ?? ''
  const permalink = content.match(/^permalink:\s*(.+)$/m)?.[1]?.replace(/^['"]|['"]$/g, '') ?? ''
  const lines = content.split(/\r?\n/)
  const tables: ExtractedTable[] = []

  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].trim().startsWith('|') || !lines[index + 1] || !isDivider(lines[index + 1])) {
      continue
    }

    const headers = splitRow(lines[index])
    const rows: string[][] = []
    index += 2

    while (index < lines.length && lines[index].trim().startsWith('|')) {
      rows.push(splitRow(lines[index]))
      index += 1
    }

    if (isPlanTable(headers) && rows.length > 0) {
      tables.push({
        file: path.relative(process.cwd(), file),
        title,
        permalink,
        headers,
        rows,
      })
    }
  }

  return tables
}

const results = collectMarkdownFiles(rootPath).flatMap(extractTables)

console.log(JSON.stringify(results, null, 2))
