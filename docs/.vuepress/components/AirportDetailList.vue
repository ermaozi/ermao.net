<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from 'vuepress/client'
import { airportRanking, type AirportBoolean } from '../data/airports'
import { localizeAirportRecord } from '../data/airports-i18n'
import AirportPlanTable from './AirportPlanTable.vue'

const lang = useLang()
const isEnglish = computed(() => lang.value?.startsWith('en'))
const airports = computed(() =>
  airportRanking.map(item => isEnglish.value ? localizeAirportRecord(item) : item),
)

const boolText = (value: AirportBoolean) => {
  if (value === true) return isEnglish.value ? 'Yes' : '是'
  if (value === false) return isEnglish.value ? 'No' : '否'
  return isEnglish.value ? 'Unknown' : '待补'
}

const localizedHref = (href?: string) =>
  href && isEnglish.value && href.startsWith('/') && !href.startsWith('/en/')
    ? `/en${href}`
    : href

const labels = computed(() => isEnglish.value
  ? {
      section: 'Provider summaries and plan prices',
      meta: 'Provider details',
      official: 'Official site',
      minimum: 'Lowest listed plan',
      universal: 'Standard subscription',
      nonExpiring: 'Non-expiring plan',
      group: 'Telegram group',
      review: 'Full review',
    }
  : {
      section: '机场详细简介与套餐价格',
      meta: '机场基础信息',
      official: '官网地址',
      minimum: '最低订阅',
      universal: '通用订阅',
      nonExpiring: '不限时',
      group: 'TG 群组',
      review: '详细评测',
    },
)
</script>

<template>
  <section class="airport-detail-list" :aria-label="labels.section">
    <article v-for="item in airports" :key="item.id" class="airport-detail-item">
      <h3 :id="item.id">
        <span class="airport-detail-rank">{{ item.rank }}</span>
        {{ item.name }}
      </h3>

      <div class="airport-detail-meta" :aria-label="labels.meta">
        <a
          :href="item.officialHref"
          target="_blank"
          rel="sponsored nofollow noopener"
        >{{ labels.official }}</a>
        <span>{{ labels.minimum }}: {{ item.minPlanText }}</span>
        <span>{{ labels.universal }}: {{ boolText(item.universalSubscription) }}</span>
        <span>{{ labels.nonExpiring }}: {{ boolText(item.hasOneTimePackage) }}</span>
        <a
          v-if="item.telegramHref"
          :href="item.telegramHref"
          target="_blank"
          rel="nofollow noopener"
        >{{ labels.group }}</a>
        <a v-if="item.reviewHref" :href="localizedHref(item.reviewHref)">{{ labels.review }}</a>
      </div>

      <p class="airport-detail-description">
        {{ item.description }}
      </p>

      <AirportPlanTable :airport-id="item.id" />
    </article>
  </section>
</template>

<style scoped>
.airport-detail-list {
  display: grid;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  gap: 28px;
  margin: 1rem 0 2rem;
}

.airport-detail-item {
  max-width: 100%;
  min-width: 0;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--vp-c-border);
}

.airport-detail-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.airport-detail-item h3 {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  margin-top: 0;
  overflow-wrap: anywhere;
  scroll-margin-top: calc(var(--vp-nav-height, 64px) + 18px);
}

.airport-detail-rank {
  display: inline-flex;
  width: 28px;
  height: 28px;
  flex: none;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-size: 13px;
  font-weight: 700;
}

.airport-detail-meta {
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  min-width: 0;
  gap: 8px;
  margin: 8px 0 12px;
}

.airport-detail-meta a,
.airport-detail-meta span {
  display: inline-flex;
  max-width: 100%;
  min-width: 0;
  min-height: 28px;
  align-items: center;
  padding: 2px 9px;
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  font-size: 13px;
  line-height: 1.4;
  text-decoration: none;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.airport-detail-meta a {
  color: var(--vp-c-brand-1);
  font-weight: 700;
}

.airport-detail-description {
  color: var(--vp-c-text-2);
  line-height: 1.75;
  overflow-wrap: anywhere;
  word-break: break-word;
}

@media (max-width: 719px) {
  .airport-detail-list {
    gap: 22px;
  }

  .airport-detail-item {
    padding-bottom: 22px;
  }

  .airport-detail-item h3 {
    align-items: flex-start;
  }
}
</style>
