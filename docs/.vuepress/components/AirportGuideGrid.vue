<script setup lang="ts">
import { airportGuides } from '../data/airports'
</script>

<template>
  <section class="airport-guide-grid" aria-label="机场选购建议">
    <article v-for="item in airportGuides" :key="item.title">
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
