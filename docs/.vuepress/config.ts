import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { plumeTheme } from 'vuepress-theme-plume'
// @ts-ignore
import statsPlugin from './plugins/stats/index.js'

export default defineUserConfig({
  lang: 'zh-CN',
  plugins: [
    statsPlugin({
      workerUrl: 'https://views.ermao.net' // 请替换为实际的 Worker 地址
    })
  ],
  head: [
    ['link', { rel: 'icon', href: '/images/favicon.ico' }],
    ["meta", {"name": "keywords", "content": "机场,便宜机场,梯子,vpn,科学上网,翻墙,clash,trojan,python,服务器"}],
    ["meta", {"name": "description", "content": "开发、运维、科学上网相关内容，打破技术壁垒"}],
    ["meta", {"name": "yandex-verification", "content": "e1e26631cf282ae3"}],
    ["meta", {"name": "baidu-site-verification", "content": "codeva-XDTarR9mnY"}]
  ],
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: '博客'
      },],
    logo: '/images/logo.svg',
    home: '/',
    hostname: 'https://www.ermao.net',
    footer: { message: "© 2025 二猫子 📧 <a href='mailto:admin@ermao.net'>admin@ermao.net</a>" },
    navbar: [
      { text: '二猫子博客', link: '/blog/', icon: 'material-symbols:home-rounded' },
      { text: '机场推荐', link: '/airport/', icon: 'material-symbols:flight-takeoff' },
      {
        text: '翻墙工具',
        icon: 'ic:baseline-construction',
        items: [
          { text: 'Windows/Linux/MacOS', link: '/article/0gematwc/', icon: 'ic:baseline-personal-video' },
          { text: 'Android手机', link: '/article/eh8f4n86/', icon: 'ic:baseline-android' },
          { text: 'iOS苹果手机', link: '/article/z747kgjd/', icon: 'ic:baseline-rocket-launch' },
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
        ],
      },
    ],
    profile: {
        name: '二猫子',
        description: '老老实实的二猫子',
        avatar: '/images/logo.svg',
      },
    social: [
        { icon: 'github', link: 'https://github.com/ermaozi' },
        { icon: 'telegram', link: 'https://t.me/ermaozi01' },
        {
          icon: {svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="3 3 24 24"><g fill="currentColor"><path d="M22 7.535V17a3 3 0 0 1-2.824 2.995L19 20H5a3 3 0 0 1-2.995-2.824L2 17V7.535l9.445 6.297l.116.066a1 1 0 0 0 .878 0l.116-.066z"/><path d="M19 4c1.08 0 2.027.57 2.555 1.427L12 11.797l-9.555-6.37a3 3 0 0 1 2.354-1.42L5 4z"/></g></svg>'},
          link: 'mailto:admin@ermao.net'
        }
      ],
    llmstxt: true,
    plugins: {
      comment: {
        provider: 'Giscus',
        comment: true,
        repo: 'ermaozi/ermao.net',
        repoId: 'R_kgDOL4rZSQ',
        category: 'Announcements',
        categoryId: 'DIC_kwDOL4rZSc4CiGyu',
      },
    },
    markdown: {
      collapse: true,
      chartjs: true,
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