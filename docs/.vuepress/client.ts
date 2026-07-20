import { defineClientConfig } from 'vuepress/client'
import './styles/index.css'
import AirportDetailList from './components/AirportDetailList.vue'
import AirportGuideGrid from './components/AirportGuideGrid.vue'
import AirportList from './components/AirportList.vue'
import AirportPlanTable from './components/AirportPlanTable.vue'
import AirportRankingTable from './components/AirportRankingTable.vue'
import AirportRiskList from './components/AirportRiskList.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('AirportDetailList', AirportDetailList)
    app.component('AirportGuideGrid', AirportGuideGrid)
    app.component('AirportList', AirportList)
    app.component('AirportPlanTable', AirportPlanTable)
    app.component('AirportRankingTable', AirportRankingTable)
    app.component('AirportRiskList', AirportRiskList)
  },
})
