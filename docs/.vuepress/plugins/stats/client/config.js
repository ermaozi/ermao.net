import { defineClientConfig } from '@vuepress/client'
import { useRouter } from 'vue-router'
import PageViews from './components/PageViews.vue'
import PopularPostsRoot from './components/PopularPostsRoot.vue'
import StatsLayout from './layouts/StatsLayout.vue'
import FullStatsLayout from './layouts/FullStatsLayout.vue'

const resolveWorkerUrl = () => {
  // @ts-ignore
  let workerUrl = __STATS_WORKER_URL__

  if (typeof workerUrl === 'string' && workerUrl.startsWith('"') && workerUrl.endsWith('"')) {
    workerUrl = workerUrl.slice(1, -1)
  }

  return workerUrl
}

const normalizePath = (path) => path?.split('#')[0] || ''

export default defineClientConfig({
  layouts: {
    Layout: StatsLayout,
    StatsLayout: FullStatsLayout
  },
  rootComponents: [
    PopularPostsRoot
  ],
  enhance({ app }) {
    app.component('PageViews', PageViews)
  },
  setup() {
    const router = useRouter()
    let lastTrackedPath = ''

    const sendView = (path) => {
      try {
        const workerUrl = resolveWorkerUrl()
        if (!workerUrl) return

        const normalizedPath = normalizePath(path)
        if (!normalizedPath || normalizedPath === lastTrackedPath) return
        lastTrackedPath = normalizedPath

        const payload = {
          path: normalizedPath,
          referrer: document.referrer || null,
          ua: navigator.userAgent || null,
          // New fields
          lang: navigator.language || null,
          screen: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : null,
          ts: Date.now()
        }
        
        const body = JSON.stringify(payload)
        
        if (navigator.sendBeacon) {
          const blob = new Blob([body], { type: 'application/json' })
          if (navigator.sendBeacon(workerUrl, blob)) return
        }

        fetch(workerUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {})
      } catch (e) {
        // Ignore analytics failures; page rendering should never depend on stats.
      }
    }

    if (typeof window !== 'undefined' && router?.afterEach) {
      const trackCurrentPage = () => {
        sendView(`${window.location.pathname}${window.location.search}`)
      }

      if (typeof router.isReady === 'function') {
        router.isReady().then(trackCurrentPage)
      }
      else {
        trackCurrentPage()
      }

      router.afterEach((to, from) => {
            const toPath = normalizePath(to.fullPath)
            const fromPath = normalizePath(from?.fullPath)

            // 忽略仅 hash 变化的路由跳转
            if (toPath === fromPath) return

            sendView(toPath)
        })
    }
  }
})
