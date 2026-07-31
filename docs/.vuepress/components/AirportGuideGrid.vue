<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from 'vuepress/client'
import { airportGuides } from '../data/airports'

const lang = useLang()
const isEnglish = computed(() => lang.value?.startsWith('en'))
const sectionLabel = computed(() => isEnglish.value ? 'Proxy-service selection advice' : '机场选购建议')
const guides = computed(() => isEnglish.value
  ? [
      {
        title: 'First purchase',
        description: 'Prefer monthly billing or a trial. Avoid annual, multi-year, or lifetime plans until the service has passed your own tests.',
      },
      {
        title: 'Stability',
        description: 'Check what IEPL, IPLC, or BGP labels actually mean, then review evening-peak tests and the provider history.',
      },
      {
        title: 'Client flexibility',
        description: 'Prefer a universal subscription compatible with the clients you already trust, and confirm router support before paying.',
      },
      {
        title: 'Provider risk',
        description: 'Search this site for closure records and confirm that the website, subscriptions, tickets, and support channels still work.',
      },
      {
        title: 'Price',
        description: 'Compare traffic, multipliers, device limits, speed caps, and reset dates instead of looking only at the headline price.',
      },
    ]
  : airportGuides,
)
</script>

<template>
  <section class="airport-guide-grid" :aria-label="sectionLabel">
    <article v-for="item in guides" :key="item.title">
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
    </article>
  </section>
</template>

<style scoped>
.airport-guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 14px;
  margin: 1.2rem 0 2rem;
}

.airport-guide-grid article {
  padding: 14px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.airport-guide-grid h3 {
  margin: 0;
  font-size: 16px;
  line-height: 1.35;
}

.airport-guide-grid p {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.68;
}
</style>
