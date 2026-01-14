import { defineClientConfig } from '@vuepress/client'
import { useRouter } from 'vue-router'
import PageViews from './components/PageViews.vue'
import StatsLayout from './layouts/StatsLayout.vue'

export default defineClientConfig({
  layouts: {
    Layout: StatsLayout
  },
  enhance({ app }) {
    app.component('PageViews', PageViews)
  },
  setup() {
    const router = useRouter()


    const sendView = (path) => {
      try {
        // @ts-ignore
        let workerUrl = __STATS_WORKER_URL__
        
        // Fix for potential double-quoting issue
        if (typeof workerUrl === 'string' && workerUrl.startsWith('"') && workerUrl.endsWith('"')) {
           workerUrl = workerUrl.slice(1, -1)
        }

        if (!workerUrl) return

        const payload = {
          path,
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
          navigator.sendBeacon(workerUrl, blob)
        } else {
          fetch(workerUrl, { 
            method: 'POST', 
            headers: { 'content-type': 'application/json' }, 
            body 
          }).catch(() => {})
        }
      } catch (e) {
        console.error(e)
      }
    }

    if (typeof window !== 'undefined') {
        router.afterEach((to) => {
            sendView(to.fullPath)
        })
    }
  }
})
