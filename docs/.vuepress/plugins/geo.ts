import type { App, Page } from 'vuepress/core'
import fs from 'node:fs/promises'
import path from 'node:path'

const hostname = 'https://www.ermao.net'
const authorId = `${hostname}/about/#person`

const toIsoDate = (value: unknown) => {
  if (!value) return undefined
  const date = new Date(String(value).replace(/\//g, '-'))
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

const absoluteUrl = (route: string) => new URL(route, hostname).toString()

const sectionFromFile = (filePathRelative?: string | null) => {
  const parts = filePathRelative?.split('/') ?? []
  return parts.length > 2 ? parts[1] : '博客'
}

const breadcrumbData = (page: Page) => {
  const items = [
    { '@type': 'ListItem', position: 1, name: '首页', item: `${hostname}/` },
  ]

  if (page.filePathRelative?.startsWith('blog/')) {
    items.push({ '@type': 'ListItem', position: 2, name: '博客', item: `${hostname}/blog/` })
  }

  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: String(page.frontmatter.title || page.title),
    item: absoluteUrl(page.path),
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

export const enhanceArticleJsonLd = (jsonLd: Record<string, any>, page: any) => {
  const frontmatter = page.frontmatter ?? {}
  const isBlogPost = page.filePathRelative?.startsWith('blog/')
  if (!isBlogPost) return jsonLd

  const published = toIsoDate(frontmatter.createTime)
  const modified = toIsoDate(frontmatter.updateTime) || published || jsonLd.dateModified
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : []
  const citations = Array.isArray(frontmatter.sources)
    ? frontmatter.sources.map(String).filter((source: string) => /^https?:\/\//.test(source))
    : []

  return {
    ...jsonLd,
    '@type': 'BlogPosting',
    '@id': `${absoluteUrl(page.path)}#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(page.path),
    },
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    inLanguage: 'zh-CN',
    articleSection: sectionFromFile(page.filePathRelative),
    ...(tags.length ? { keywords: tags.join(', ') } : {}),
    ...(citations.length ? { citation: citations } : {}),
    author: { '@id': authorId },
    publisher: { '@id': authorId },
    isPartOf: { '@id': `${hostname}/#website` },
  }
}

const buildRobotsTxt = () => `# Crawlers used by search and answer engines are explicitly allowed.
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: OAI-SearchBot
Allow: /

# GPTBot is controlled separately because model training and search discovery
# are different purposes. Change this rule if the editorial policy changes.
User-agent: GPTBot
Disallow: /

User-agent: *
Allow: /

Sitemap: ${hostname}/sitemap.xml
`

export default () => ({
  name: 'ermao-geo',
  extendsPage: (page: Page) => {
    if (!page.filePathRelative || page.frontmatter.noindex) return
    page.frontmatter.head ??= []
    page.frontmatter.head.push([
      'script',
      { type: 'application/ld+json' },
      JSON.stringify(breadcrumbData(page)),
    ])
  },
  onGenerated: async (app: App) => {
    await fs.writeFile(app.dir.dest('robots.txt'), buildRobotsTxt(), 'utf8')
  },
})
