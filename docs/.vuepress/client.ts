import { defineAsyncComponent } from 'vue'
import { defineClientConfig } from 'vuepress/client'
import SeoRouteHeading from './components/SeoRouteHeading.vue'
import './styles/index.css'

export default defineClientConfig({
  rootComponents: [SeoRouteHeading],
  enhance({ app }) {
    // These components only occur on the airport landing page. Keeping them out
    // of the global entry prevents their data and styles from delaying every page.
    app.component('AirportDetailList', defineAsyncComponent(() => import('./components/AirportDetailList.vue')))
    app.component('AirportGuideGrid', defineAsyncComponent(() => import('./components/AirportGuideGrid.vue')))
    app.component('AirportList', defineAsyncComponent(() => import('./components/AirportList.vue')))
    app.component('AirportPlanTable', defineAsyncComponent(() => import('./components/AirportPlanTable.vue')))
    app.component('AirportRankingTable', defineAsyncComponent(() => import('./components/AirportRankingTable.vue')))
    app.component('AirportRiskList', defineAsyncComponent(() => import('./components/AirportRiskList.vue')))
  },
})
