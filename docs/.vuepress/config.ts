import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { plumeTheme } from 'vuepress-theme-plume'
import { fileURLToPath } from 'node:url'
// @ts-ignore
import statsPlugin from './plugins/stats/index.js'
import imagePerformancePlugin from './plugins/image-performance.js'
import geoPlugin, { enhanceArticleJsonLd } from './plugins/geo.js'

const hostname = 'https://www.ermao.net'
const statsWorkerUrl = process.env.STATS_WORKER_URL || 'https://views.ermao.net'
const defaultLocalePath = '/'
const englishLocalePath = '/en/'
const defaultLang = 'zh-CN'
const siteTitle = '二毛'
const siteDescription = '二毛网络工具资料库长期更新机场评测与风险记录，以及 Clash、Shadowrocket、软路由配置和网络故障排查教程。'
const siteLocales = {
  [defaultLocalePath]: {
    lang: defaultLang,
    title: siteTitle,
    description: siteDescription,
  },
  [englishLocalePath]: {
    lang: 'en-US',
    title: 'Ermao',
    description: 'Ermao maintains independent reviews and risk records for proxy services, plus practical guides to Clash, Shadowrocket, routers, and network troubleshooting.',
  },
}
const utilityPagePrefixes = [
  '/blog/tags/',
  '/blog/categories/',
  '/blog/archives/',
  '/en/blog/tags/',
  '/en/blog/categories/',
  '/en/blog/archives/',
]
const utilityPagePaths = ['/ad-board/', '/stats/', '/en/stats/']
const generatedPageDescriptions: Record<string, string> = {
  '/ad-board/': '在二毛广告板发表百字以内的匿名便签；便签优先落在空隙处，点赞后立即置顶，外部链接跳转前显示风险提示。',
  '/blog/': '浏览二毛博客的全部文章，涵盖机场评测与风险记录、Clash 和 Shadowrocket 客户端、软路由配置及网络故障排查。',
  '/blog/archives/': '按发布时间浏览二毛博客文章归档，查找历年机场评测、网络工具教程、风险预警和每周网络动态。',
  '/blog/categories/': '按内容分类浏览二毛博客，快速进入机场推荐、翻墙工具、风险预警、网络新闻和技术文档等栏目。',
  '/blog/tags/': '通过主题标签查找二毛博客内容，包括 Clash、VPN、机场评测、Shadowrocket、OpenWrt 和网络安全等主题。',
  '/stats/': '查看二毛博客的公开内容统计，包括文章数量、分类分布、更新情况和站内内容变化趋势。',
  '/en/blog/': 'Browse all Ermao articles, including proxy-service reviews and risk records, Clash and Shadowrocket guides, router configuration, and network troubleshooting.',
  '/en/blog/archives/': 'Browse the Ermao Blog archive by publication date to find proxy reviews, network-tool guides, risk alerts, and weekly network updates.',
  '/en/blog/categories/': 'Browse Ermao Blog by category, including proxy-service reviews, access tools, risk alerts, network news, and technical guides.',
  '/en/blog/tags/': 'Find Ermao Blog articles by topic, including Clash, VPNs, proxy services, Shadowrocket, OpenWrt, and network security.',
  '/en/stats/': 'View public Ermao Blog content statistics, including article counts, category distribution, update activity, and site-wide content trends.',
}

const isUtilityPage = (path: string) =>
  utilityPagePaths.includes(path) || utilityPagePrefixes.some(prefix => path.startsWith(prefix))

const isArticlePage = (page: any) =>
  Boolean(page.filePathRelative?.replace(/^en\//, '').startsWith('blog/'))
  && !page.frontmatter.home
  && !isUtilityPage(page.path)

const appendNoindex = (head: any[]) => {
  const hasRobots = head.some((item) => item?.[0] === 'meta' && item?.[1]?.name === 'robots')
  if (!hasRobots) {
    head.push(['meta', { name: 'robots', content: 'noindex,follow' }])
  }
}

const homepagePostLinksPlugin = () => ({
  name: 'ermao-homepage-post-links',
  alias: {
    '@theme/Posts/VPPostsExtract.vue': fileURLToPath(
      new URL('./overrides/VPPostsExtract.vue', import.meta.url),
    ),
  },
})

const utilityPagesPlugin = () => ({
  name: 'ermao-utility-pages',
  extendsPage: (page: any) => {
    page.frontmatter.head ??= []
    const isEnglishPage = page.path.startsWith(englishLocalePath)
    const hasHeadMeta = (key: string, value: string) =>
      page.frontmatter.head.some((item: any) =>
        item?.[0] === 'meta' && item?.[1]?.[key] === value,
      )

    if (!hasHeadMeta('property', 'og:image:alt')) {
      page.frontmatter.head.push([
        'meta',
        {
          property: 'og:image:alt',
          content: isEnglishPage ? 'Ermao Blog' : '二毛博客',
        },
      ])
    }
    if (!hasHeadMeta('name', 'keywords')) {
      page.frontmatter.head.push([
        'meta',
        {
          name: 'keywords',
          content: isEnglishPage
            ? 'proxy service reviews,provider risk,VPN,censorship circumvention,Clash,Shadowrocket,OpenWrt,router guides'
            : '机场评测,机场风险,VPN,科学上网,翻墙,Clash,Shadowrocket,软路由,OpenWrt',
        },
      ])
    }

    const description = generatedPageDescriptions[page.path]
    if (description) {
      page.frontmatter.description = description
    }

    if (page.path === '/blog/' || page.path === '/en/blog/') {
      page.frontmatter.head.push(['link', { rel: 'canonical', href: `${hostname}${page.path}` }])
    }

    if (!isUtilityPage(page.path)) return

    page.frontmatter.search = false
    page.frontmatter.sitemap = false
    appendNoindex(page.frontmatter.head)
  },
})

export default defineUserConfig({
  lang: defaultLang,
  title: siteTitle,
  description: siteDescription,
  locales: siteLocales,
  shouldPrefetch: false,
  plugins: [
    homepagePostLinksPlugin(),
    utilityPagesPlugin(),
    imagePerformancePlugin(),
    geoPlugin(),
    statsPlugin({
      workerUrl: statsWorkerUrl
    })
  ],
  head: [
    ['link', { rel: 'icon', href: '/img/logo.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'preconnect', href: 'https://image.ermao.net' }],
    ['link', { rel: 'dns-prefetch', href: 'https://views.ermao.net' }],
    ['link', { rel: 'dns-prefetch', href: 'https://giscus.app' }],
    ['meta', { name: 'theme-color', content: '#336f87' }],
    ['meta', { name: 'color-scheme', content: 'light dark' }],
    ['meta', { name: 'referrer', content: 'strict-origin-when-cross-origin' }],
    ['meta', { name: 'twitter:site', content: '@ermaozi4' }],
    ["meta", {"name": "yandex-verification", "content": "e1e26631cf282ae3"}],
    ["meta", {"name": "baidu-site-verification", "content": "codeva-XDTarR9mnY"}]
  ],
  theme: plumeTheme({
    hostname,
    locales: {
      [defaultLocalePath]: {
        selectLanguageName: '简体中文',
        collections: [
          {
            type: 'post',
            dir: 'blog',
            title: '博客',
            archivesLink: '/blog/archives/',
            tagsLink: '/blog/tags/',
            categoriesLink: '/blog/categories/',
          },
        ],
        logo: '/img/logo.svg',
        home: defaultLocalePath,
        footer: { message: "© 2025 二毛 · <a href='/editorial-policy/'>编辑政策</a> · <a href='/affiliate-disclosure/'>推广披露</a> · <a href='/corrections/'>更正</a> · 📧 <a href='mailto:admin@ermao.net'>admin@ermao.net</a>" },
        navbar: [
          { text: '二毛博客', link: '/blog/', icon: 'material-symbols:home-rounded' },
          { text: '交流群', link: 'https://t.me/fanqiangjiaoliu', icon: 'material-symbols:group-rounded' },
          {
            text: '翻墙工具',
            icon: 'ic:baseline-construction',
            items: [
              { text: '机场推荐', link: '/airport/', icon: 'material-symbols:flight-takeoff' },
              { text: '工具汇总推荐', link: '/article/fanqiang-tools/', icon: 'ic:baseline-construction' },
              { text: 'Windows/Linux/MacOS', link: '/article/0gematwc/', icon: 'ic:baseline-personal-video' },
              { text: 'Android手机', link: '/article/eh8f4n86/', icon: 'ic:baseline-android' },
              { text: 'iOS苹果手机', link: '/blog/clashmi/', icon: 'ic:baseline-rocket-launch' },
              { text: '免费AppleID共享账号', link: '/blog/freeappleid/', icon: 'ic:twotone-apple' },
            ],
          },
          {
            text: '更多',
            icon: 'icon-park-outline:more-three',
            items: [
              { text: '归档', link: '/blog/archives/', icon: 'material-symbols:archive-rounded' },
              { text: '友链', link: '/friends/', icon: 'material-symbols:footprint' },
              { text: '标签', link: '/blog/tags/', icon: 'material-symbols:sell' },
              { text: '统计', link: '/stats/', icon: 'ic:baseline-data-usage' },
              { text: '广告板', link: '/ad-board/', icon: 'material-symbols:dashboard-outline-rounded' },
              { text: 'Claude 环境自检', link: '/claude-env-check/', icon: 'material-symbols:shield-outline-rounded' },
              { text: '关于与评测方法', link: '/about/', icon: 'material-symbols:verified-user-outline' },
            ],
          },
        ],
        profile: {
          name: siteTitle,
          description: '老老实实的二毛',
          avatar: '/img/logo.svg',
        },
        social: [
          { icon: 'x', link: 'https://x.com/ermaozi4' },
          { icon: 'telegram', link: 'https://t.me/ermaozi01' },
          { icon: 'ic:round-email', link: 'mailto:admin@ermao.net' },
        ],
      },
      [englishLocalePath]: {
        selectLanguageName: 'English',
        collections: [
          {
            type: 'post',
            dir: 'blog',
            title: 'Blog',
            archivesLink: '/blog/archives/',
            tagsLink: '/blog/tags/',
            categoriesLink: '/blog/categories/',
          },
        ],
        logo: '/img/logo.svg',
        home: englishLocalePath,
        footer: { message: "© 2025 Ermao · <a href='/en/editorial-policy/'>Editorial Policy</a> · <a href='/en/affiliate-disclosure/'>Affiliate Disclosure</a> · <a href='/en/corrections/'>Corrections</a> · 📧 <a href='mailto:admin@ermao.net'>admin@ermao.net</a>" },
        navbar: [
          { text: 'Ermao Blog', link: '/en/blog/', icon: 'material-symbols:home-rounded' },
          { text: 'Community', link: 'https://t.me/fanqiangjiaoliu', icon: 'material-symbols:group-rounded' },
          {
            text: 'Access Tools',
            icon: 'ic:baseline-construction',
            items: [
              { text: 'Proxy Service Reviews', link: '/en/airport/', icon: 'material-symbols:flight-takeoff' },
              { text: 'Recommended Tools', link: '/en/article/fanqiang-tools/', icon: 'ic:baseline-construction' },
              { text: 'Windows / Linux / macOS', link: '/en/article/0gematwc/', icon: 'ic:baseline-personal-video' },
              { text: 'Android', link: '/en/article/eh8f4n86/', icon: 'ic:baseline-android' },
              { text: 'iOS', link: '/en/blog/clashmi/', icon: 'ic:baseline-rocket-launch' },
              { text: 'Free Shared Apple IDs', link: '/en/blog/freeappleid/', icon: 'ic:twotone-apple' },
            ],
          },
          {
            text: 'More',
            icon: 'icon-park-outline:more-three',
            items: [
              { text: 'Archives', link: '/en/blog/archives/', icon: 'material-symbols:archive-rounded' },
              { text: 'Friends', link: '/en/friends/', icon: 'material-symbols:footprint' },
              { text: 'Tags', link: '/en/blog/tags/', icon: 'material-symbols:sell' },
              { text: 'Statistics', link: '/en/stats/', icon: 'ic:baseline-data-usage' },
              { text: 'Claude Environment Check', link: '/en/claude-env-check/', icon: 'material-symbols:shield-outline-rounded' },
              { text: 'About & Review Methods', link: '/en/about/', icon: 'material-symbols:verified-user-outline' },
            ],
          },
        ],
        profile: {
          name: 'Ermao',
          description: 'Independent notes and honest reviews',
          avatar: '/img/logo.svg',
        },
        social: [
          { icon: 'x', link: 'https://x.com/ermaozi4' },
          { icon: 'telegram', link: 'https://t.me/ermaozi01' },
          { icon: 'ic:round-email', link: 'mailto:admin@ermao.net' },
        ],
      },
    },
    llmstxt: {
      locale: 'all',
    },
    search: {
      provider: 'local',
      isSearchable: page =>
        Boolean(page.filePath)
        && page.frontmatter.search !== false
        && !isUtilityPage(page.path),
    },
    plugins: {
      markdownImage: false,
      sitemap: {
        changefreq: 'weekly',
      },
      seo: {
        canonical: hostname,
        fallBackImage: `${hostname}/img/logo.svg`,
        author: {
          name: '二毛',
          url: hostname,
        },
        twitterID: '@ermaozi4',
        isArticle: isArticlePage,
        jsonLd: (jsonLd, page) => enhanceArticleJsonLd(jsonLd as Record<string, any>, page) as any,
        customHead: (head, page) => {
          if (isUtilityPage(page.path)) {
            appendNoindex(head)
          }
        },
      },
      comment: {
        provider: 'Giscus',
        comment: true,
        repo: 'ermaozi/ermao.net',
        repoId: 'R_kgDOL4rZSQ',
        category: 'Announcements',
        categoryId: 'DIC_kwDOL4rZSc4CiGyu',
        lazyLoading: true,
      },
    },
    markdown: {
      mermaid: true,
      collapse: true,
      chartjs: true,
      youtube: true,
      abbr: true,
    }
  }),
  bundler: viteBundler({
    viteOptions: {
      optimizeDeps: {
        include: ['vue-chartjs', 'chart.js'],
        exclude: [
          'mark.js/src/vanilla.js',
          '@vueuse/integrations/useFocusTrap',
          '@vueuse/core',
          'bcrypt-ts/browser',
          '@vuepress/helper/client',
          '@iconify/vue',
          '@iconify/vue/offline'
        ]
      }
    }
  }),
})
