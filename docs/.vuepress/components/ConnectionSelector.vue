<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { clientGuides, selectorAirports } from '../data/connection-selector'

const device = ref<keyof typeof clientGuides>('desktop')
const budget = ref(30)
const traffic = ref(100)
const selected = ref<string[]>([])
const comparing = ref(false)
const showAll = ref(false)
const compareButton = ref<HTMLButtonElement>()
const resetButton = ref<HTMLButtonElement>()
const compareHeading = ref<HTMLHeadingElement>()
const results = computed(() => selectorAirports.flatMap(airport => {
  const match = airport.comparablePlans.find(item => item.price <= budget.value && item.traffic >= traffic.value)
  return match ? [{ ...airport, match }] : []
}).sort((a, b) => a.match.price - b.match.price || a.name.localeCompare(b.name, 'zh-CN')))
const comparisons = computed(() => results.value.filter(item => selected.value.includes(item.id)))
const visibleResults = computed(() => showAll.value ? results.value : results.value.slice(0, 6))
function filtersChanged() {
  selected.value = []
  comparing.value = false
  showAll.value = false
}
function reset() {
  device.value = 'desktop'
  budget.value = 30
  traffic.value = 100
  filtersChanged()
}
function toggle(id: string) {
  selected.value = selected.value.includes(id) ? selected.value.filter(value => value !== id) : [...selected.value, id].slice(0, 3)
}
async function showComparison() {
  if (selected.value.length < 2) return
  comparing.value = true
  await nextTick()
  compareHeading.value?.focus()
}
async function back(clear = false) {
  comparing.value = false
  if (clear) selected.value = []
  await nextTick()
  ;(clear ? resetButton.value : compareButton.value)?.focus()
}
</script>

<template>
  <section id="connection-selector" class="connection-selector" aria-labelledby="selector-title" data-tool-surface="selector">
    <h2 id="selector-title">先选客户端，再比较月付套餐</h2>
    <p>按你的设备打开安装教程，再用月预算和流量缩小范围。结果按符合条件的套餐价格升序排列，不代表速度、稳定性或推荐排名。</p>
    <p class="source-note">工具整理：2026-10-03。套餐来自站内评测；各卡片显示来源编辑日期，非当日价格核验。仅纳入明确人民币月付价格与 GB / TB 流量的套餐，不使用优惠码、年付折算或缺失数据；实际付款与兼容格式请在购买前确认。</p>
    <div class="selector-filters">
      <label>使用设备<select v-model="device" data-tool-event="filter_change" @change="filtersChanged"><option value="desktop">Windows / macOS / Linux</option><option value="android">Android 手机 / 平板</option><option value="ios">iPhone / iPad</option></select></label>
      <label>月付预算上限<select v-model.number="budget" data-tool-event="filter_change" @change="filtersChanged"><option :value="10">10 元</option><option :value="30">30 元</option><option :value="60">60 元</option><option :value="100">100 元</option></select></label>
      <label>每月最低流量<select v-model.number="traffic" data-tool-event="filter_change" @change="filtersChanged"><option :value="50">50 GB</option><option :value="100">100 GB</option><option :value="300">300 GB</option><option :value="500">500 GB</option><option :value="2000">2000 GB</option></select></label>
    </div>
    <div class="client-guides">
      <strong>适合此设备的站内教程</strong>
      <a v-for="guide in clientGuides[device]" :key="guide.href" :href="guide.href" data-tool-event="tutorial_click">{{ guide.name }} 安装与导入 →</a>
      <small>设备只决定教程入口，不保证所有机场格式兼容。已有订阅可先按教程导入，无需重新购买。</small>
    </div>
    <div class="selector-toolbar">
      <p role="status" aria-live="polite">{{ results.length }} 家有符合条件的套餐 · 已选 {{ selected.length }} / 3 家</p>
      <button ref="compareButton" type="button" :disabled="selected.length < 2" data-tool-event="compare_click" @click="showComparison">比较已选（{{ selected.length }}）</button>
      <button ref="resetButton" type="button" data-tool-event="reset" @click="reset">重置筛选</button>
    </div>
    <div v-if="comparing" class="comparison" @keydown.esc="back()">
      <h3 ref="compareHeading" tabindex="-1">已选套餐对比</h3>
      <div class="selector-cards">
        <article v-for="item in comparisons" :key="item.id" class="selector-card">
          <h4>{{ item.name }}</h4><p>{{ item.match.plan.name || '来源所列套餐' }}</p>
          <dl><dt>月付价格</dt><dd>{{ item.match.plan.priceText }}</dd><dt>套餐流量</dt><dd>{{ item.match.plan.traffic }}</dd><dt>通用订阅记录</dt><dd>{{ item.universalSubscription === true ? '站内记录支持，仍需确认客户端格式' : item.universalSubscription === false ? '站内记录不支持' : '暂无资料，购买前确认' }}</dd></dl>
          <p class="source-note">来源编辑：{{ item.sourceDate || '未标注' }}</p>
          <a :href="item.reviewHref" data-tool-event="provider_click">查看 {{ item.name }} 套餐原文 →</a>
        </article>
      </div>
      <div class="selector-toolbar"><button type="button" data-tool-event="compare_click" @click="back()">返回筛选结果</button><button type="button" data-tool-event="reset" @click="back(true)">取消对比并清空选择</button></div>
    </div>
    <div v-else-if="results.length" class="selector-cards">
      <article v-for="item in visibleResults" :key="item.id" class="selector-card">
        <h3>{{ item.name }}</h3>
        <p class="plan-price">{{ item.match.plan.priceText }} · {{ item.match.plan.traffic }}</p>
        <p>{{ item.match.plan.name || '来源所列套餐' }}</p>
        <p class="source-note">来源编辑：{{ item.sourceDate || '未标注' }}；价格待购买前复核。</p>
        <a :href="item.reviewHref" data-tool-event="provider_click">查看 {{ item.name }} 套餐与风险 →</a>
        <button type="button" :aria-pressed="selected.includes(item.id)" :disabled="selected.length >= 3 && !selected.includes(item.id)" data-tool-event="compare_click" @click="toggle(item.id)">{{ selected.includes(item.id) ? '取消对比' : '加入对比' }} · {{ item.name }}</button>
      </article>
    </div>
    <p v-else class="empty-state" role="status">当前条件下没有资料完整的月付套餐。可提高预算、降低流量或重置筛选；这不表示市场上没有此类套餐。</p>
    <div v-if="!comparing && results.length > 6" class="selector-toolbar">
      <p role="status">当前显示 {{ visibleResults.length }} / {{ results.length }} 家。收起列表会保留已选项目。</p>
      <button type="button" :aria-expanded="showAll" @click="showAll = !showAll">{{ showAll ? '收起至前 6 家' : `显示全部 ${results.length} 家` }}</button>
    </div>
    <p class="source-note">需不限时、年付或其他币种？<a href="/airport/" data-tool-event="provider_click">查看完整机场目录</a>。<a href="/review-methodology/">查看评测方法</a> · <a href="/affiliate-disclosure/">推广关系说明</a>。</p>
  </section>
</template>

<style scoped>
.connection-selector { margin: 1.5rem 0; padding: clamp(14px, 3vw, 26px); border: 1px solid var(--vp-c-divider); border-radius: 16px; background: var(--vp-c-bg-soft); scroll-margin-top: 90px; }
.connection-selector h2 { margin-top: 0; }
.selector-filters, .selector-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr)); gap: 14px; }
.selector-filters label { display: flex; flex-direction: column; gap: 8px; font-weight: 600; }
.connection-selector select, .connection-selector button { min-height: 44px; border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 9px 12px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font: inherit; }
.connection-selector select { width: 100%; }
.connection-selector button { cursor: pointer; }
.connection-selector button:disabled { opacity: .5; cursor: not-allowed; }
.connection-selector button[aria-pressed="true"] { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.connection-selector :is(a, button, select):focus-visible, .comparison h3:focus-visible { outline: 3px solid var(--vp-c-brand-1); outline-offset: 3px; }
.client-guides { display: flex; flex-direction: column; gap: 8px; padding: 16px 0; }
.client-guides a, .selector-card > a { display: block; padding: 10px 0; }
.selector-toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin: 16px 0; }
.selector-toolbar p { flex: 1 1 100%; margin: 0; }
.selector-card { min-width: 0; padding: 16px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg); overflow-wrap: anywhere; }
.selector-card h3, .selector-card h4 { margin: 0 0 8px; }
.selector-card p { margin: 8px 0; }
.selector-card button { width: 100%; margin-top: 10px; }
.plan-price { font-size: 1.15rem; font-weight: 700; }
.source-note, .client-guides small { color: var(--vp-c-text-2); font-size: .88rem; line-height: 1.65; }
.selector-card dt { font-weight: 600; }.selector-card dd { margin: 0 0 12px; }
.empty-state { padding: 20px; border: 1px dashed var(--vp-c-divider); border-radius: 8px; }
</style>
