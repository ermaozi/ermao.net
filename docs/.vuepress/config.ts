import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { plumeTheme } from 'vuepress-theme-plume'
// @ts-ignore
import statsPlugin from './plugins/stats/index.js'
import imagePerformancePlugin from './plugins/image-performance.js'
import geoPlugin, { enhanceArticleJsonLd } from './plugins/geo.js'

const hostname = 'https://www.ermao.net'
const siteDescription = '二毛网络工具资料库长期更新机场评测与风险记录，以及 Clash、Shadowrocket、软路由配置和网络故障排查教程。'
const utilityPagePrefixes = ['/blog/tags/', '/blog/categories/', '/blog/archives/']
const utilityPagePaths = ['/stats/']

const siteStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${hostname}/#website`,
      url: hostname,
      name: '二毛',
      description: siteDescription,
      inLanguage: 'zh-CN',
      publisher: {
        '@id': `${hostname}/about/#person`,
      },
    },
    {
      '@type': 'Person',
      '@id': `${hostname}/about/#person`,
      name: '二毛',
      url: `${hostname}/about/`,
      image: `${hostname}/img/logo.svg`,
      description: '二毛博客作者，长期记录科学上网工具、机场服务、软路由与实用软件的测试和使用经验。',
      sameAs: [
        'https://x.com/ermaozi4',
        'https://t.me/ermaozi01',
      ],
    },
  ],
}

const isUtilityPage = (path: string) =>
  utilityPagePaths.includes(path) || utilityPagePrefixes.some(prefix => path.startsWith(prefix))

const isArticlePage = (page: any) =>
  Boolean(page.filePathRelative?.startsWith('blog/'))
  && !page.frontmatter.home
  && !isUtilityPage(page.path)

const appendNoindex = (head: any[]) => {
  const hasRobots = head.some((item) => item?.[0] === 'meta' && item?.[1]?.name === 'robots')
  if (!hasRobots) {
    head.push(['meta', { name: 'robots', content: 'noindex,follow' }])
  }
}

const utilityPagesPlugin = () => ({
  name: 'ermao-utility-pages',
  extendsPage: (page: any) => {
    if (!isUtilityPage(page.path)) return

    page.frontmatter.search = false
    page.frontmatter.sitemap = false
    page.frontmatter.head ??= []
    appendNoindex(page.frontmatter.head)
  },
})

export default defineUserConfig({
  lang: 'zh-CN',
  title: '二毛',
  description: siteDescription,
  shouldPrefetch: false,
  plugins: [
    utilityPagesPlugin(),
    imagePerformancePlugin(),
    geoPlugin(),
    statsPlugin({
      workerUrl: 'https://views.ermao.net' // 请替换为实际的 Worker 地址
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
    ['meta', { property: 'og:image:alt', content: '二毛博客' }],
    ['meta', { name: 'twitter:site', content: '@ermaozi4' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(siteStructuredData)],
    ["meta", {"name": "keywords", "content": "机场评测,机场风险,VPN,科学上网,翻墙,Clash,Shadowrocket,软路由,OpenWrt"}],
    ["meta", {"name": "yandex-verification", "content": "e1e26631cf282ae3"}],
    ["meta", {"name": "baidu-site-verification", "content": "codeva-XDTarR9mnY"}]
  ],
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: '博客',
        archivesLink: '/blog/archives/',
        tagsLink: '/blog/tags/',
        categoriesLink: '/blog/categories/',
      },],
    logo: '/img/logo.svg',
    home: '/',
    hostname,
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
        text: "更多",
        icon: 'icon-park-outline:more-three',
        items: [
          { text: '归档', link: '/blog/archives/', icon: 'material-symbols:archive-rounded' },
          { text: '友链' , link: '/friends/', icon: 'material-symbols:footprint' },
          { text: '标签', link: '/blog/tags/', icon: 'material-symbols:sell' },
          { text: '统计', link: '/stats/', icon: 'ic:baseline-data-usage' },
          { text: '关于与评测方法', link: '/about/', icon: 'material-symbols:verified-user-outline' },
        ],
      },
    ],
    profile: {
        name: '二毛',
        description: '老老实实的二毛',
        avatar: '/img/logo.svg',
      },
    social: [
        { icon: 'x', link: 'https://x.com/ermaozi4' },
        { icon: 'telegram', link: 'https://t.me/ermaozi01' },
        { icon: 'ic:round-email', link: 'mailto:admin@ermao.net' }
      ],
    llmstxt: true,
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
