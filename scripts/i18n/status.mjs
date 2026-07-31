#!/usr/bin/env node

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { glob } from 'glob'

const root = process.cwd()
const writeReport = process.argv.includes('--write')
const strict = process.argv.includes('--check')

const categoryDirectories = {
  'python攻略': 'python-guides',
  '文档': 'guides',
  '新闻': 'news',
  '机场推荐': 'proxy-reviews',
  '杂事': 'misc',
  '翻墙工具': 'access-tools',
  '翻墙新闻': 'censorship-news',
  '跑路机场': 'provider-risk',
}

const sourceFiles = (await glob('docs/**/*.md', {
  ignore: [
    'docs/en/**',
    'docs/.vuepress/**',
  ],
})).sort()

const hash = value => crypto.createHash('sha256').update(value).digest('hex').slice(0, 16)

const targetFor = (source) => {
  if (!source.startsWith('docs/blog/')) {
    return source.replace(/^docs\//, 'docs/en/')
  }

  const relative = source.slice('docs/blog/'.length)
  const [category, ...rest] = relative.split('/')
  const targetCategory = categoryDirectories[category]
  if (!targetCategory) {
    throw new Error(`No English category mapping for ${category}`)
  }
  return path.posix.join('docs/en/blog', targetCategory, ...rest)
}

const expectedEnglishPermalink = (permalink) => {
  if (!permalink || permalink === '/') return '/en/'
  return `/en${permalink}`
}

const stripCode = content =>
  content
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]+`/g, '')
    .replace(/\]\([^)\n]*\)/g, ']')
    .replace(/(?:href|src|link)\s*=\s*["'][^"']*["']/g, '')
    .replace(/https?:\/\/\S+/g, '')

const countHan = content => (stripCode(content).match(/\p{Script=Han}/gu) || []).length

const files = []

for (const source of sourceFiles) {
  const target = targetFor(source)
  const sourceRaw = await fs.readFile(path.join(root, source), 'utf8')
  const sourcePage = matter(sourceRaw)
  const sourcePermalink = sourcePage.data.permalink || (source === 'docs/index.md' ? '/' : '')
  const item = {
    source,
    target,
    sourceHash: hash(sourceRaw),
    sourcePermalink,
    expectedPermalink: expectedEnglishPermalink(sourcePermalink),
    status: 'missing',
    issues: [],
  }

  try {
    const targetRaw = await fs.readFile(path.join(root, target), 'utf8')
    const targetPage = matter(targetRaw)
    const hanCharacters = countHan(targetPage.content)

    if (targetPage.data.lang !== 'en-US') {
      item.issues.push('missing-lang-en-US')
    }
    if (targetPage.data.permalink && targetPage.data.permalink !== item.expectedPermalink) {
      item.issues.push('wrong-english-permalink')
    }
    if (sourcePermalink && sourcePermalink !== '/' && targetPage.data.translationOf !== sourcePermalink) {
      item.issues.push('missing-or-wrong-translationOf')
    }
    if (countHan(sourcePage.content) > 0 && targetPage.content.trim() === sourcePage.content.trim()) {
      item.issues.push('body-identical-to-source')
    }
    if (hanCharacters > 20) {
      item.issues.push(`unreviewed-han-characters:${hanCharacters}`)
    }
    if (/]\(\/(?!en\/)/.test(targetPage.content)) {
      item.issues.push('root-internal-links-remain')
    }
    if (/(?:href|link)\s*=\s*["']\/(?!en\/)/.test(targetPage.content)) {
      item.issues.push('root-component-links-remain')
    }

    item.hanCharacters = hanCharacters
    item.status = item.issues.length ? 'needs-review' : 'translated'
  }
  catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }

  files.push(item)
}

const summary = files.reduce((result, item) => {
  result[item.status] = (result[item.status] || 0) + 1
  return result
}, {
  total: files.length,
  translated: 0,
  'needs-review': 0,
  missing: 0,
})

const report = {
  generatedAt: new Date().toISOString(),
  summary,
  categoryDirectories,
  files,
}

if (writeReport) {
  const output = path.join(root, '.translation/status.json')
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

console.log(`Translation status: ${summary.translated}/${summary.total} translated, ${summary['needs-review']} need review, ${summary.missing} missing.`)

for (const item of files.filter(item => item.status === 'needs-review').slice(0, 20)) {
  console.log(`- ${item.target}: ${item.issues.join(', ')}`)
}

if (strict && summary.translated !== summary.total) {
  process.exitCode = 1
}
