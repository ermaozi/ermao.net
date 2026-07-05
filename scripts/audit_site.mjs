#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { glob } from 'glob'

const root = process.cwd()
const docsDir = path.join(root, 'docs')
const now = new Date()

const markdownFiles = (await glob('docs/**/*.md', {
  ignore: [
    'docs/.vuepress/dist/**',
    'docs/.vuepress/.cache/**',
    'docs/.vuepress/.temp/**',
  ],
})).sort()

const pages = []
const errors = []
const warnings = []

const addIssue = (bucket, type, file, message) => {
  bucket.push({ type, file, message })
}

const exists = async (file) => {
  try {
    await fs.access(file)
    return true
  }
  catch {
    return false
  }
}

const toText = (value) => {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  return String(value).trim()
}

const addRouteVariants = (routeSet, route) => {
  if (!route || !route.startsWith('/')) return

  routeSet.add(route)
  routeSet.add(decodeURI(route))

  const trimmed = route.endsWith('/') && route !== '/' ? route.slice(0, -1) : route
  routeSet.add(trimmed)
  routeSet.add(`${trimmed}/`)
  routeSet.add(`${trimmed}/index.html`)

  if (route.endsWith('/')) {
    routeSet.add(`${route}index.html`)
  }
}

const cleanUrl = (raw) => {
  let url = raw.trim()
  if (url.startsWith('<') && url.endsWith('>')) {
    url = url.slice(1, -1)
  }

  const titledLink = url.match(/^(\S+)(?:\s+"[^"]*")?$/)
  return titledLink ? titledLink[1] : url
}

const stripHashAndQuery = (url) => url.split('#')[0].split('?')[0]

const isExternalLike = (url) =>
  /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url)

const shouldSkipMarkdownTarget = (content, index, url) => {
  if (content[index - 1] === '@') return true
  if (!url || url.startsWith('#')) return true
  return isExternalLike(url)
}

for (const file of markdownFiles) {
  const raw = await fs.readFile(file, 'utf8')
  try {
    const parsed = matter(raw)
    pages.push({ file, raw, ...parsed })
  }
  catch (error) {
    addIssue(errors, 'frontmatter-parse', file, error.message)
  }
}

const routeSet = new Set(['/'])
const permalinkMap = new Map()

for (const page of pages) {
  const permalink = toText(page.data?.permalink)
  if (permalink) {
    addRouteVariants(routeSet, permalink)

    if (!permalinkMap.has(permalink)) {
      permalinkMap.set(permalink, [])
    }
    permalinkMap.get(permalink).push(page.file)
  }

  if (page.data?.home) {
    addRouteVariants(routeSet, '/')
  }
}

for (const [permalink, files] of permalinkMap.entries()) {
  if (files.length > 1) {
    addIssue(errors, 'duplicate-permalink', files.join(', '), permalink)
  }
}

for (const page of pages) {
  const frontmatter = page.data || {}
  const isHome = Boolean(frontmatter.home)
  const isStatsPage = page.file === 'docs/stats.md'
  const isSpecialPage = isHome || isStatsPage

  const title = toText(frontmatter.title)
  const description = toText(frontmatter.description)
  const permalink = toText(frontmatter.permalink)

  if (!title && !isSpecialPage) {
    addIssue(errors, 'missing-title', page.file, 'Missing frontmatter title')
  }

  if (!description && !isSpecialPage) {
    addIssue(errors, 'missing-description', page.file, 'Missing frontmatter description')
  }

  if (!permalink && !isHome) {
    addIssue(errors, 'missing-permalink', page.file, 'Missing frontmatter permalink')
  }

  if (description && description.length < 45 && !isSpecialPage) {
    addIssue(warnings, 'short-description', page.file, `${description.length} chars`)
  }

  if (description && description.length > 180) {
    addIssue(warnings, 'long-description', page.file, `${description.length} chars`)
  }

  if (frontmatter.createTime) {
    const createdAt = new Date(String(frontmatter.createTime).replace(/\//g, '-'))
    if (Number.isNaN(createdAt.getTime())) {
      addIssue(errors, 'invalid-create-time', page.file, String(frontmatter.createTime))
    }
    else if (createdAt > now) {
      addIssue(errors, 'future-create-time', page.file, String(frontmatter.createTime))
    }
  }
}

const resolveRelativeCandidates = (sourceFile, target) => {
  const resolved = path.resolve(path.dirname(path.join(root, sourceFile)), decodeURI(target))
  const candidates = [resolved]

  if (!path.extname(resolved)) {
    candidates.push(`${resolved}.md`, path.join(resolved, 'index.md'))
  }

  return candidates
}

const hasExistingCandidate = async (candidates) => {
  for (const candidate of candidates) {
    if (await exists(candidate)) return true
  }
  return false
}

for (const page of pages) {
  const linkPattern = /(!?)\[[^\]\n]*(?:\][^\[]*)?\]\(([^)]+)\)/g
  let match

  while ((match = linkPattern.exec(page.content)) !== null) {
    const isImage = match[1] === '!'
    const url = cleanUrl(match[2])

    if (shouldSkipMarkdownTarget(page.content, match.index, url)) continue

    const target = stripHashAndQuery(url)
    if (!target) continue

    if (isImage) {
      if (target.startsWith('/')) {
        const publicTarget = path.join(root, 'docs/.vuepress/public', decodeURI(target.replace(/^\//, '')))
        const docsTarget = path.join(docsDir, decodeURI(target.replace(/^\//, '')))

        if (!await hasExistingCandidate([publicTarget, docsTarget])) {
          addIssue(errors, 'missing-local-image', page.file, url)
        }
      }
      else if (!await hasExistingCandidate(resolveRelativeCandidates(page.file, target))) {
        addIssue(errors, 'missing-local-image', page.file, url)
      }

      continue
    }

    if (target.startsWith('/')) {
      const routeVariants = [
        target,
        target.endsWith('/') ? target.slice(0, -1) : `${target}/`,
        target.endsWith('/') ? `${target}index.html` : `${target}/index.html`,
      ]

      if (routeVariants.some((route) => routeSet.has(route))) continue

      if (target.endsWith('.md')) {
        const absoluteMarkdown = path.join(docsDir, decodeURI(target.replace(/^\//, '')))
        if (await exists(absoluteMarkdown)) continue
      }

      addIssue(errors, 'broken-absolute-link', page.file, url)
    }
    else if (!await hasExistingCandidate(resolveRelativeCandidates(page.file, target))) {
      addIssue(errors, 'broken-relative-link', page.file, url)
    }
  }
}

const printIssues = (label, issues) => {
  console.log(`${label}: ${issues.length}`)

  for (const issue of issues.slice(0, 80)) {
    console.log(`- [${issue.type}] ${issue.file}: ${issue.message}`)
  }

  if (issues.length > 80) {
    console.log(`- ... ${issues.length - 80} more`)
  }
}

console.log(`Audited ${markdownFiles.length} markdown files.`)
printIssues('Errors', errors)
printIssues('Warnings', warnings)

if (errors.length > 0) {
  process.exitCode = 1
}
