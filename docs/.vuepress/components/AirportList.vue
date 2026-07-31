<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from 'vuepress/client'
import { airportSources } from '../data/airports'
import { localizeAirportSource } from '../data/airports-i18n'

const lang = useLang()
const isEnglish = computed(() => lang.value?.startsWith('en'))
const airports = computed(() =>
  airportSources
    .filter(item => item.image && item.reviewHref)
    .map(item => isEnglish.value ? localizeAirportSource(item) : item),
)
const localizedHref = (href?: string) =>
  href && isEnglish.value && href.startsWith('/') && !href.startsWith('/en/')
    ? `/en${href}`
    : href
const labels = computed(() => isEnglish.value
  ? {
      section: 'Featured proxy-service reviews',
      features: 'Provider features',
      official: 'Official site',
      review: 'Review',
    }
  : {
      section: '热门机场推荐列表',
      features: '机场特点',
      official: '官网',
      review: '评测',
    },
)
</script>

<template>
  <section class="airport-card-grid" :aria-label="labels.section">
    <article v-for="item in airports" :key="item.name" class="airport-card">
      <a
        class="airport-card-cover"
        :href="localizedHref(item.reviewHref)"
        :aria-label="isEnglish ? `View the ${item.name} review` : `查看 ${item.name} 评测`"
      >
        <img
          :src="item.image"
          :alt="item.imageAlt || (isEnglish ? `${item.name} proxy-service review screenshot` : `${item.name} 机场推荐评测截图`)"
          loading="lazy"
        >
      </a>
      <div class="airport-card-body">
        <div class="airport-card-head">
          <h3>
            <a :href="localizedHref(item.reviewHref)">{{ item.name }}</a>
          </h3>
          <span class="airport-price">{{ item.minPlanText }}</span>
        </div>
        <p>{{ item.description }}</p>
        <div class="airport-tags" :aria-label="labels.features">
          <span v-for="tag in item.tags ?? []" :key="tag">{{ tag }}</span>
        </div>
        <div class="airport-actions">
          <a
            class="airport-action-primary"
            :href="item.officialHref"
            target="_blank"
            rel="sponsored nofollow noopener"
          >{{ labels.official }}</a>
          <a class="airport-action-secondary" :href="localizedHref(item.reviewHref)">{{ labels.review }}</a>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
.airport-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: 18px;
  margin: 1.4rem 0 2.2rem;
}

.airport-card {
  display: flex;
  min-width: 0;
  overflow: hidden;
  flex-direction: column;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.airport-card:hover {
  border-color: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.1);
}

.airport-card-cover {
  display: block;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: var(--vp-c-bg-soft);
}

.airport-card-cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
}

.airport-card:hover .airport-card-cover img {
  transform: scale(1.035);
}

.airport-card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 14px;
}

.airport-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.airport-card h3 {
  margin: 0;
  font-size: 18px;
  line-height: 1.35;
}

.airport-card h3 a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.airport-card p {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.68;
}

.airport-price {
  flex: none;
  padding: 3px 8px;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
  white-space: nowrap;
}

.airport-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.airport-tags span {
  padding: 2px 7px;
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  font-size: 12px;
  line-height: 1.5;
}

.airport-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: auto;
  padding-top: 14px;
}

.airport-action-primary,
.airport-action-secondary {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
  text-decoration: none;
}

.airport-action-primary {
  color: #fff;
  background: var(--vp-c-brand-1);
}

.airport-action-primary:hover {
  background: var(--vp-c-brand-2);
}

.airport-action-secondary {
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.airport-action-secondary:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-1);
}

@media (max-width: 719px) {
  .airport-card-grid {
    gap: 14px;
  }

  .airport-card-body {
    padding: 12px;
  }

  .airport-card h3 {
    font-size: 17px;
  }

  .airport-actions {
    grid-template-columns: 1fr;
  }
}
</style>
