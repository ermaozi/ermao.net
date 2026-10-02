import { createPage, type App } from 'vuepress/core'

// Match the explicitly configured collection page size in config.ts.
export const POSTS_PER_PAGE = 15

export default () => ({
  name: 'ermao-static-pagination',
  onInitialized: async (app: App) => {
    for (const locale of ['/', '/en/']) {
      const home = app.pages.find(page => page.path === locale)!
      const prefix = locale === '/' ? 'blog/' : 'en/blog/'
      const posts = app.pages.filter(page => page.filePathRelative?.startsWith(prefix)
        && page.frontmatter.article !== false && page.frontmatter.draft !== true)
      const total = Math.ceil(posts.length / POSTS_PER_PAGE)
      for (let number = 2; number <= total; number++) {
        const route = `${locale}page/${number}/`
        const title = locale === '/' ? `博客文章 — 第 ${number} 页` : `Blog articles — Page ${number}`
        app.pages.push(await createPage(app, {
          path: route,
          frontmatter: {
            ...home.frontmatter,
            title,
            description: locale === '/' ? `浏览二毛博客第 ${number} 页文章，查看机场资料、网络工具与配置教程。` : `Browse page ${number} of Ermao articles on proxy services, network tools, and configuration.`,
            head: [
              ['link', { rel: 'canonical', href: `https://www.ermao.net${route}` }],
              ['meta', { property: 'og:url', content: `https://www.ermao.net${route}` }],
            ],
            article: false,
            search: false,
            sitemap: true,
          },
        }))
      }
    }
  },
})
