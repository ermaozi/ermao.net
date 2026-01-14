import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default (options = {}) => {
  return {
    name: 'vuepress-plugin-stats',
    clientConfigFile: path.resolve(__dirname, './client/config.js'),
    define: {
      __STATS_WORKER_URL__: JSON.stringify(options.workerUrl || '')
    },
    async onInitialized(app) {
        const map = {}
        for (const page of app.pages) {
            if (page.title) {
                map[page.path] = page.title
            }
        }
        await app.writeTemp('stats/page-map.js', `export const pageMap = ${JSON.stringify(map)}`)
    },
    alias: (app) => ({
        '@theme/Posts/VPPostItem.vue': path.resolve(__dirname, './client/overrides/VPPostItem.vue'),
        '@stats/StatsPage.vue': path.resolve(__dirname, './client/components/StatsPage.vue'),
        '@stats/page-map': app.dir.temp('stats/page-map.js')
    })
  }
}
