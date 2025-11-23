import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'zh-CN',
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
    footer: { message: "© 2024 二猫子 📧 <a href='mailto:admin@ermao.net'>admin@ermao.net</a>" },
    navbar: [
      { text: '二猫子博客', link: '/blog/' },
      { text: '标签', link: '/blog/tags/' },
      { text: '归档', link: '/blog/archives/' },
      { text: '友链' , link: '/friends/'},
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
          icon: {svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=fill"> <g id="email"> <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M7 2.75C5.38503 2.75 3.92465 3.15363 2.86466 4.1379C1.79462 5.13152 1.25 6.60705 1.25 8.5V15.5C1.25 17.393 1.79462 18.8685 2.86466 19.8621C3.92465 20.8464 5.38503 21.25 7 21.25H17C18.615 21.25 20.0754 20.8464 21.1353 19.8621C22.2054 18.8685 22.75 17.393 22.75 15.5V8.5C22.75 6.60705 22.2054 5.13152 21.1353 4.1379C20.0754 3.15363 18.615 2.75 17 2.75H7ZM19.2285 8.3623C19.5562 8.10904 19.6166 7.63802 19.3633 7.31026C19.1101 6.98249 18.6391 6.9221 18.3113 7.17537L12.7642 11.4616C12.3141 11.8095 11.6858 11.8095 11.2356 11.4616L5.6886 7.17537C5.36083 6.9221 4.88982 6.98249 4.63655 7.31026C4.38328 7.63802 4.44367 8.10904 4.77144 8.3623L10.3185 12.6486C11.3089 13.4138 12.691 13.4138 13.6814 12.6486L19.2285 8.3623Z"></path> </g> </g> </g></svg>'},
          link: 'mailto:admin@ermao.net'
        }
      ],
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
    }
  }),
  bundler: viteBundler({
    viteOptions: {
      optimizeDeps: {
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