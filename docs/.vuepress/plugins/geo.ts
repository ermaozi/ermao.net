import type { App, Page } from 'vuepress/core'
import fs from 'node:fs/promises'
import path from 'node:path'

const hostname = 'https://www.ermao.net'
const localeData = {
  'zh-CN': {
    path: '/',
    siteName: '二毛',
    siteDescription: '二毛网络工具资料库长期更新机场评测与风险记录，以及 Clash、Shadowrocket、软路由配置和网络故障排查教程。',
    authorDescription: '二毛博客作者，长期记录科学上网工具、机场服务、软路由与实用软件的测试和使用经验。',
    homeText: '首页',
    postsText: '博客',
  },
  'en-US': {
    path: '/en/',
    siteName: 'Ermao',
    siteDescription: 'Ermao maintains independent reviews and risk records for proxy services, plus practical guides to Clash, Shadowrocket, routers, and network troubleshooting.',
    authorDescription: 'Ermao writes independent reviews and practical guides about proxy services, network tools, routers, software, and troubleshooting.',
    homeText: 'Home',
    postsText: 'Blog',
  },
} as const

type SupportedLang = keyof typeof localeData

const getPageLang = (page: any): SupportedLang =>
  page.lang === 'en-US' || page.frontmatter?.lang === 'en-US' || page.path?.startsWith('/en/')
    ? 'en-US'
    : 'zh-CN'

const getLocale = (page: any) => localeData[getPageLang(page)]
const getAuthorId = (page: any) => `${hostname}${getLocale(page).path}about/#person`
const getWebsiteId = (page: any) => `${hostname}${getLocale(page).path}#website`

const toIsoDate = (value: unknown) => {
  if (!value) return undefined
  const date = new Date(String(value).replace(/\//g, '-'))
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

const absoluteUrl = (route: string) => new URL(route, hostname).toString()

const sectionFromFile = (filePathRelative: string | null | undefined, fallback: string) => {
  const parts = filePathRelative?.split('/') ?? []
  const blogIndex = parts.indexOf('blog')
  return blogIndex >= 0 && parts[blogIndex + 1] ? parts[blogIndex + 1] : fallback
}

const breadcrumbData = (page: Page) => {
  const locale = getLocale(page)
  const items = [
    { '@type': 'ListItem', position: 1, name: locale.homeText, item: `${hostname}${locale.path}` },
  ]

  if (page.filePathRelative?.split('/').includes('blog')) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: locale.postsText,
      item: `${hostname}${locale.path}blog/`,
    })
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

const siteStructuredData = (page: Page) => {
  const lang = getPageLang(page)
  const locale = localeData[lang]
  const websiteId = getWebsiteId(page)
  const authorId = getAuthorId(page)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${hostname}${locale.path}`,
        name: locale.siteName,
        description: locale.siteDescription,
        inLanguage: lang,
        publisher: { '@id': authorId },
      },
      {
        '@type': 'Person',
        '@id': authorId,
        name: locale.siteName,
        url: `${hostname}${locale.path}about/`,
        image: `${hostname}/img/logo.svg`,
        description: locale.authorDescription,
        sameAs: [
          'https://x.com/ermaozi4',
          'https://t.me/ermaozi01',
        ],
      },
    ],
  }
}

export const enhanceArticleJsonLd = (jsonLd: Record<string, any>, page: any) => {
  const frontmatter = page.frontmatter ?? {}
  const isBlogPost = page.filePathRelative?.split('/').includes('blog')
  if (!isBlogPost) return jsonLd

  const pageLang = getPageLang(page)
  const locale = localeData[pageLang]
  const authorId = getAuthorId(page)
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
    inLanguage: pageLang,
    articleSection: sectionFromFile(page.filePathRelative, locale.postsText),
    ...(tags.length ? { keywords: tags.join(', ') } : {}),
    ...(citations.length ? { citation: citations } : {}),
    author: { '@id': authorId },
    publisher: { '@id': authorId },
    isPartOf: { '@id': getWebsiteId(page) },
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
    const isGeneratedCollectionPage = /^\/(?:en\/)?blog\/(?:|archives\/|categories\/|tags\/)$/.test(page.path)
    if ((!page.filePathRelative && !isGeneratedCollectionPage) || page.frontmatter.noindex) return
    page.frontmatter.head ??= []
    const pageLang = getPageLang(page)
    const defaultRoute = pageLang === 'en-US'
      ? page.path.replace(/^\/en(?=\/|$)/, '') || '/'
      : page.path
    const alternateRoute = pageLang === 'en-US'
      ? defaultRoute
      : `/en${page.path}`

    if (isGeneratedCollectionPage) {
      const hasCanonical = page.frontmatter.head.some((item: unknown) =>
        Array.isArray(item)
        && item[0] === 'link'
        && item[1]?.rel === 'canonical',
      )
      if (!hasCanonical) {
        page.frontmatter.head.push([
          'link',
          { rel: 'canonical', href: absoluteUrl(page.path) },
        ])
      }
      page.frontmatter.head.push([
        'link',
        {
          rel: 'alternate',
          hreflang: pageLang === 'en-US' ? 'zh-CN' : 'en-US',
          href: absoluteUrl(alternateRoute),
        },
      ])
      page.frontmatter.head.push([
        'meta',
        { property: 'og:url', content: absoluteUrl(page.path) },
      ])
      page.frontmatter.head.push([
        'meta',
        { property: 'og:site_name', content: getLocale(page).siteName },
      ])
      page.frontmatter.head.push([
        'meta',
        { property: 'og:type', content: 'website' },
      ])
      page.frontmatter.head.push([
        'meta',
        { property: 'og:locale', content: pageLang },
      ])
      page.frontmatter.head.push([
        'meta',
        { property: 'og:locale:alternate', content: pageLang === 'en-US' ? 'zh-CN' : 'en-US' },
      ])
    }
    page.frontmatter.head.push([
      'link',
      {
        rel: 'alternate',
        hreflang: pageLang,
        href: absoluteUrl(page.path),
      },
    ])
    page.frontmatter.head.push([
      'link',
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: absoluteUrl(defaultRoute),
      },
    ])
    page.frontmatter.head.push([
      'script',
      { type: 'application/ld+json' },
      JSON.stringify(siteStructuredData(page)),
    ])
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
