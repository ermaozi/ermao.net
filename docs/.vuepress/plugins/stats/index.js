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
    alias: {
        '@theme/Posts/VPPostItem.vue': path.resolve(__dirname, './client/overrides/VPPostItem.vue')
    }
  }
}
