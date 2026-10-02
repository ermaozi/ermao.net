import { defineAsyncComponent } from 'vue'
import { defineClientConfig } from 'vuepress/client'
import AffiliateLink from './components/AffiliateLink.vue'
import SeoRouteHeading from './components/SeoRouteHeading.vue'
import './styles/index.css'

export default defineClientConfig({
  rootComponents: [SeoRouteHeading],
  enhance({ app, router }) {
    app.component('AffiliateLink', AffiliateLink)
    // GitHub Pages cannot redirect query strings at the HTTP layer. Normalize
    // legacy links during SPA navigation; initial loads redirect in the template.
    router.beforeEach(to => {
      if (!['/', '/en/', '/blog/', '/en/blog/'].includes(to.path) || !('p' in to.query)) return
      const n = Number(to.query.p)
      const base = to.path.startsWith('/en/') ? '/en/' : '/'
      const query = { ...to.query }
      delete query.p
      return { path: Number.isSafeInteger(n) && n > 1 ? `${base}page/${n}/` : base, query, hash: to.hash, replace: true }
    })
    // These components only occur on the airport landing page. Keeping them out
    // of the global entry prevents their data and styles from delaying every page.
    app.component('AirportDetailList', defineAsyncComponent(() => import('./components/AirportDetailList.vue')))
    app.component('AirportGuideGrid', defineAsyncComponent(() => import('./components/AirportGuideGrid.vue')))
    app.component('AirportList', defineAsyncComponent(() => import('./components/AirportList.vue')))
    app.component('AirportPlanTable', defineAsyncComponent(() => import('./components/AirportPlanTable.vue')))
    app.component('AirportRankingTable', defineAsyncComponent(() => import('./components/AirportRankingTable.vue')))
    app.component('AdBoardDemo', defineAsyncComponent(() => import('./components/AdBoardDemo.vue')))
    app.component('AirportRiskList', defineAsyncComponent(() => import('./components/AirportRiskList.vue')))
    app.component('ClaudeEnvCheck', defineAsyncComponent(() => import('./components/ClaudeEnvCheck.vue')))
  },
})
