<template>
  <div class="stats-container">
    <h1>网站数据</h1>
    <br><br>
    <div class="controls">
      <button 
        v-for="p in periods" 
        :key="p.value" 
        :class="{ active: currentPeriod === p.value }"
        @click="fetchStats(p.value)"
      >
        {{ p.label }}
      </button>
    </div>

    <div v-if="loading" class="loading">Loading stats...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="stats-content">
      <div class="summary-card">
        <div class="big-number">{{ stats.total }}</div>
      </div>

      <div class="card chart-card">
          <h3>Visits Over Time</h3>
          <div class="chart-container line-chart-height">
              <Line v-if="lineChartData" :data="lineChartData" :options="lineOptions" />
          </div>
      </div>
      <br>
      <div class="grid">
        <div class="card">
            <h3>页面访问</h3>
            <div class="chart-container bar-chart-height">
                <Bar v-if="pagesChartData" :data="pagesChartData" :options="barOptions" />
            </div>
        </div>

        <div class="card">
          <h3>国家 / 地区</h3>
          <div class="chart-container pie-container">
             <Doughnut v-if="countryChartData" :data="countryChartData" :options="pieOptions" />
          </div>
        </div>

        <div class="card">
            <h3>终端</h3>
            <div class="chart-container pie-container">
                 <Doughnut v-if="uaChartData" :data="uaChartData" :options="pieOptions" />
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
// @ts-ignore
import { pageMap } from '@stats/page-map'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
)

// Assume access to __STATS_WORKER_URL__ from define
let workerUrl = __STATS_WORKER_URL__
if (typeof workerUrl === 'string' && workerUrl.startsWith('"') && workerUrl.endsWith('"')) {
    workerUrl = workerUrl.slice(1, -1)
}
const stats = ref({ total: 0, pages: [], countries: [], uas: [], timeSeries: [] })
const loading = ref(false)
const error = ref(null)
const currentPeriod = ref('24h')
const router = useRouter()
const routeMap = ref(new Map())

const periods = [
  { label: '24 小时', value: '24h' },
  { label: '7 天', value: '7d' },
  { label: '30 天', value: '30d' },
  { label: '1 年', value: '1y' }
]

// --- Helpers ---

const getPageTitle = (path) => {
    if (!path) return 'Unknown'
    
    // 1. Try exact match from imported map
    if (pageMap && pageMap[path]) return pageMap[path]

    // 2. Try decoded
    let decoded = path
    try { decoded = decodeURI(path) } catch (e) {}
    if (pageMap && pageMap[decoded]) return pageMap[decoded]
    
    // 3. Try removing .html or trailing slash
    const cleanPath = decoded.replace(/(\.html|\/)$/, '')
    if (pageMap && pageMap[cleanPath]) return pageMap[cleanPath]
    
    // 4. Try adding .html or /
    if (pageMap && pageMap[cleanPath + '.html']) return pageMap[cleanPath + '.html']
    if (pageMap && pageMap[cleanPath + '/']) return pageMap[cleanPath + '/']

    // Fallback to routeMap built from router (client side only pages?)
    if (routeMap.value.has(path)) return routeMap.value.get(path)

    return decoded || path
}

const getCountryName = (code) => {
    if (!code || code === 'Unknown' || code === 'XX') return '未知地区';
    try {
        const regionNames = new Intl.DisplayNames(['zh-Hans'], {type: 'region'});
        return regionNames.of(code) || code;
    } catch (e) {
        return code;
    }
}

const buildRouteMap = () => {
   const routes = router.getRoutes()
    for (const route of routes) {
        if (route.meta && route.meta.title) {
            routeMap.value.set(route.path, route.meta.title)
        }
    }
}

// --- Chart Data Computeds ---

const lineChartData = computed(() => {
    const rawData = stats.value.timeSeries || [];
    const period = currentPeriod.value;
    
    // Generate buckets
    const buckets = [];
    const now = new Date();
    
    if (period === '24h') {
        for (let i = 23; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 3600 * 1000);
            const label = d.toISOString().slice(0, 13).replace('T', ' ') + ':00';
            const displayLabel = d.getHours() + ':00';
            buckets.push({ label, displayLabel, value: 0 });
        }
    } else if (period === '7d' || period === '30d') {
        const days = period === '7d' ? 7 : 30;
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
            const label = d.toISOString().slice(0, 10);
            const displayLabel = (d.getMonth() + 1) + '-' + d.getDate();
            buckets.push({ label, displayLabel, value: 0 });
        }
    } else if (period === '1y') {
         for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = d.toISOString().slice(0, 7);
             const displayLabel = d.getFullYear() + '-' + (d.getMonth() + 1);
            buckets.push({ label, displayLabel, value: 0 });
        }
    }

    // Fill data
    const dataMap = new Map(rawData.map(d => [d.label, d.count]));
    buckets.forEach(b => {
        if (dataMap.has(b.label)) b.value = dataMap.get(b.label);
    });

    return {
        labels: buckets.map(b => b.displayLabel),
        datasets: [{
            label: 'Visits',
            backgroundColor: 'rgba(62, 175, 124, 0.2)',
            borderColor: '#3eaf7c',
            pointBackgroundColor: '#3eaf7c',
            data: buckets.map(b => b.value),
            fill: true,
            tension: 0.4
        }]
    }
})

const pagesChartData = computed(() => {
    const pages = (stats.value.pages || []).slice(0, 15); // Top 20
    return {
        labels: pages.map(p => {
            const title = getPageTitle(p.path)
            return title.length > 20 ? title.substring(0, 15) + '...' : title
        }),
        datasets: [{
            label: 'Views',
            backgroundColor: '#3eaf7c',
            data: pages.map(p => p.count),
            barPercentage: 0.6
        }]
    }
})

const countryChartData = computed(() => {
    const countries = (stats.value.countries || []).slice(0, 10);
    const colors = ['#3eaf7c', '#3498db', '#f1c40f', '#e74c3c', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#2ecc71', '#95a5a6'];
    return {
        labels: countries.map(c => getCountryName(c.country)),
        datasets: [{
            backgroundColor: colors,
            data: countries.map(c => c.count),
            hoverOffset: 8,
            borderRadius: 5,
            borderWidth: 1
        }]
    }
})

const uaChartData = computed(() => {
    const uas = stats.value.uas || [];
    const colors = ['#e74c3c', '#8e44ad', '#3498db', '#16a085', '#f39c12', '#d35400', '#2c3e50', '#7f8c8d'];
    return {
        labels: uas.map(u => u.ua),
        datasets: [{
            backgroundColor: colors,
            data: uas.map(u => u.count),
            hoverOffset: 8,
            borderRadius: 5,
            borderWidth: 1
        }]
    }
})

// --- Chart Options ---

const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        datalabels: { display: false }
    },
    scales: {
        y: { 
            beginAtZero: true,
            grid: { color: '#f0f0f0' }
        },
        x: {
            grid: { display: false }
        }
    }
}

const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    onClick: (e, elements) => {
        if (elements && elements.length > 0) {
            const index = elements[0].index;
            const pages = (stats.value.pages || []).slice(0, 15);
            if (pages[index] && pages[index].path) {
                window.open(pages[index].path, '_blank');
            }
        }
    },
    plugins: {
        legend: { display: false },
        datalabels: {
            anchor: 'end',
            align: 'end',
            color: '#888',
            font: { weight: 'bold' }
        }
    },
    scales: {
        x: { 
            beginAtZero: true 
        },
        y: {
            grid: { display: false }
        }
    }
}

const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
        legend: {
            position: 'right',
            labels: {
                boxWidth: 12,
                font: { size: 12 }
            }
        },
        datalabels: {
            color: '#fff',
            textAlign: 'center',
            font: { weight: 'bold' },
            formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => {
                    sum += data;
                });
                if (sum === 0) return '';
                let percentage = (value * 100 / sum).toFixed(1) + "%";
                if (value < 5) return ''; 
                return `${percentage}\n${value}`;
            }
        }
    }
}

// --- Fetch ---

const fetchStats = async (period) => {
  if (!workerUrl) {
    error.value = 'Worker URL not configured'
    return
  }
  
  loading.value = true
  currentPeriod.value = period
  error.value = null
  
  try {
    const res = await fetch(`${workerUrl}/stats?period=${period}`)
    
    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
         const text = await res.text()
         throw new Error(`Worker returned non-JSON response. Status: ${res.status}`)
    }

    if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status} ${res.statusText}`)
    
    const data = await res.json()
    stats.value = data
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  buildRouteMap()
  fetchStats('24h')
})
</script>

<style scoped>
.stats-container {
  padding: 2rem;
  max-width: 100%;
  margin: 0 auto;
}

.controls {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
}

button.active {
  background: #3eaf7c;
  color: white;
  border-color: #3eaf7c;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.card {
  border: 1px solid #eee;
  padding: 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.full-width {
    grid-column: 1 / -1;
}

.summary-card {
  margin-bottom: 2rem;
  text-align: center;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.big-number {
  font-size: 3rem;
  font-weight: bold;
  color: #3eaf7c;
}

.chart-container {
    position: relative;
    width: 100%;
}

.line-chart-height {
    height: 450px;
}

.bar-chart-height {
    height: 500px;
}

.pie-container {
    height: 300px;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: red;
}
</style>
