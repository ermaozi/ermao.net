<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from 'vuepress/client'
import { airportRisks } from '../data/airports'

const lang = useLang()
const isEnglish = computed(() => lang.value?.startsWith('en'))
const sectionLabel = computed(() => isEnglish.value ? 'Proxy-service risk alerts' : '机场风险预警')
const detailsLabel = computed(() => isEnglish.value ? 'View risk alert' : '查看风险预警')
const risks = computed(() => isEnglish.value
  ? airportRisks.map(item => ({
      ...item,
      name: item.name === '隐云' ? 'Yinyun' : 'Proxy service',
      status: 'High-risk watch',
      description: 'Yinyun shares an operator with Naiyun, CAC, and OKAC. Related services have shown multiple failures. Stop new purchases and renewals and read the full risk notice.',
    }))
  : airportRisks,
)
const localizedHref = (href: string) =>
  isEnglish.value && href.startsWith('/') && !href.startsWith('/en/')
    ? `/en${href}`
    : href
</script>

<template>
  <section class="airport-risk-grid" :aria-label="sectionLabel">
    <article v-for="item in risks" :key="item.name" class="airport-risk-card">
      <div class="airport-risk-label">
        {{ item.status }}
      </div>
      <h3>
        <a :href="localizedHref(item.href)">{{ item.name }}</a>
      </h3>
      <p>{{ item.description }}</p>
      <a class="airport-risk-link" :href="localizedHref(item.href)">{{ detailsLabel }}</a>
    </article>
  </section>
</template>

<style scoped>
.airport-risk-grid {
  display: grid;
  gap: 14px;
  margin: 1.2rem 0 2rem;
}

.airport-risk-card {
  padding: 16px;
  border: 1px solid rgba(234, 88, 12, 0.38);
  border-radius: 8px;
  background: rgba(251, 146, 60, 0.08);
  background: color-mix(in srgb, var(--vp-c-bg) 88%, #f97316);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.airport-risk-label {
  display: inline-flex;
  margin-bottom: 10px;
  padding: 2px 8px;
  border: 1px solid rgba(234, 88, 12, 0.34);
  border-radius: 999px;
  color: #c2410c;
  background: rgba(251, 146, 60, 0.12);
  font-size: 12px;
  line-height: 1.5;
}

.airport-risk-card h3 {
  margin: 0;
  line-height: 1.35;
}

.airport-risk-card h3 a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.airport-risk-card p {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.68;
}

.airport-risk-link {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  margin-top: 14px;
  padding: 0 14px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
}

.airport-risk-link:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-1);
}
</style>
