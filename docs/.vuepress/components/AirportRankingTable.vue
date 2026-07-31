<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from 'vuepress/client'
import { airportRanking, type AirportBoolean } from '../data/airports'
import { localizeAirportRecord } from '../data/airports-i18n'

const lang = useLang()
const isEnglish = computed(() => lang.value?.startsWith('en'))
const airports = computed(() =>
  airportRanking.map(item => isEnglish.value ? localizeAirportRecord(item) : item),
)

const boolText = (value: AirportBoolean) => {
  if (value === true) return '✔'
  if (value === false) return '✘'
  return isEnglish.value ? 'Unknown' : '待补'
}

const boolClass = (value: AirportBoolean) => ({
  'is-yes': value === true,
  'is-no': value === false,
  'is-unknown': value === 'unknown',
})

const changeClass = (value?: string) => ({
  'is-up': value?.startsWith('↑'),
  'is-down': value?.startsWith('↓'),
  'is-new': value === '新上' || value === 'New',
})

const changeText = (value?: string) =>
  isEnglish.value && value === '新上' ? 'New' : value || '-'

const localizedHref = (href?: string) =>
  href && isEnglish.value && href.startsWith('/') && !href.startsWith('/en/')
    ? `/en${href}`
    : href

const labels = computed(() => isEnglish.value
  ? {
      name: 'Provider',
      official: 'Website',
      universal: 'Standard subscription',
      minimum: 'Lowest listed plan',
      nonExpiring: 'Non-expiring',
      group: 'Group',
      details: 'Details',
      change: 'Change',
      none: 'None',
      visit: 'View',
    }
  : {
      name: '机场名称',
      official: '官网',
      universal: '通用订阅',
      minimum: '最便宜订阅',
      nonExpiring: '不限时',
      group: '群组',
      details: '详情',
      change: '变化',
      none: '暂无',
      visit: '前往',
    },
)
</script>

<template>
  <div class="airport-ranking-wrap">
    <table class="airport-ranking-table">
      <colgroup>
        <col class="airport-ranking-col-name">
        <col class="airport-ranking-col-link">
        <col class="airport-ranking-col-bool">
        <col class="airport-ranking-col-plan">
        <col class="airport-ranking-col-bool">
        <col class="airport-ranking-col-short">
        <col class="airport-ranking-col-short">
        <col class="airport-ranking-col-change">
      </colgroup>
      <thead>
        <tr>
          <th>{{ labels.name }}</th>
          <th>{{ labels.official }}</th>
          <th>{{ labels.universal }}</th>
          <th>{{ labels.minimum }}</th>
          <th>{{ labels.nonExpiring }}</th>
          <th>{{ labels.group }}</th>
          <th>{{ labels.details }}</th>
          <th>{{ labels.change }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in airports" :key="item.id">
          <td class="airport-ranking-name" :data-label="labels.name">
            <span class="airport-ranking-rank">{{ item.rank }}</span>
            <a :href="`#${item.id}`">{{ item.name }}</a>
          </td>
          <td class="airport-ranking-link" :data-label="labels.official">
            <a
              :href="item.officialHref"
              target="_blank"
              rel="sponsored nofollow noopener"
            >{{ labels.official }}</a>
          </td>
          <td class="airport-ranking-center" :data-label="labels.universal">
            <span class="airport-ranking-bool" :class="boolClass(item.universalSubscription)">
              {{ boolText(item.universalSubscription) }}
            </span>
          </td>
          <td class="airport-ranking-plan" :data-label="labels.minimum">
            {{ item.minPlanText }}
          </td>
          <td class="airport-ranking-center" :data-label="labels.nonExpiring">
            <span class="airport-ranking-bool" :class="boolClass(item.hasOneTimePackage)">
              {{ boolText(item.hasOneTimePackage) }}
            </span>
          </td>
          <td class="airport-ranking-link" :data-label="labels.group">
            <a
              v-if="item.telegramHref"
              :href="item.telegramHref"
              target="_blank"
              rel="nofollow noopener"
            >TG</a>
            <span v-else class="airport-ranking-muted">{{ labels.none }}</span>
          </td>
          <td class="airport-ranking-link" :data-label="labels.details">
            <a v-if="item.reviewHref" :href="localizedHref(item.reviewHref)">{{ labels.visit }}</a>
            <span v-else class="airport-ranking-muted">{{ labels.none }}</span>
          </td>
          <td :data-label="labels.change">
            <span class="airport-ranking-change" :class="changeClass(item.rankChangeLabel)">
              {{ changeText(item.rankChangeLabel) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.airport-ranking-wrap {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow: visible;
  margin: 1rem 0 1.8rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
}

.airport-ranking-table {
  display: table;
  width: 100%;
  min-width: 0;
  margin: 0;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: fixed;
  white-space: normal;
}

.airport-ranking-col-name {
  width: 23%;
}

.airport-ranking-col-link {
  width: 8%;
}

.airport-ranking-col-bool {
  width: 10%;
}

.airport-ranking-col-plan {
  width: 24%;
}

.airport-ranking-col-short {
  width: 7%;
}

.airport-ranking-col-change {
  width: 11%;
}

.airport-ranking-table th,
.airport-ranking-table td {
  padding: 9px 8px;
  border: 0;
  border-bottom: 1px solid var(--vp-c-border);
  vertical-align: middle;
  white-space: nowrap;
  overflow-wrap: normal;
  word-break: keep-all;
}

.airport-ranking-table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  font-weight: 700;
  text-align: left;
  white-space: nowrap;
}

.airport-ranking-table tbody tr:last-child td {
  border-bottom: 0;
}

.airport-ranking-name {
  white-space: nowrap;
}

.airport-ranking-rank {
  display: inline-flex;
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-size: 12px;
  font-weight: 700;
  vertical-align: middle;
}

.airport-ranking-center {
  text-align: center;
}

.airport-ranking-link {
  text-align: center;
}

.airport-ranking-plan {
  white-space: nowrap;
}

.airport-ranking-bool {
  font-weight: 700;
}

.airport-ranking-bool.is-yes {
  color: #16a34a;
}

.airport-ranking-bool.is-no {
  color: #dc2626;
}

.airport-ranking-bool.is-unknown,
.airport-ranking-muted {
  color: var(--vp-c-text-3);
}

.airport-ranking-change {
  color: var(--vp-c-text-2);
  font-weight: 700;
  white-space: nowrap;
}

.airport-ranking-change.is-up {
  color: #dc2626;
}

.airport-ranking-change.is-down {
  color: #16a34a;
}

.airport-ranking-change.is-new {
  color: #fff;
}

@media (max-width: 719px) {
  .airport-ranking-table {
    font-size: 13px;
  }

  .airport-ranking-table,
  .airport-ranking-table tbody,
  .airport-ranking-table tr,
  .airport-ranking-table td {
    display: block;
    width: 100%;
  }

  .airport-ranking-table thead {
    display: none;
  }

  .airport-ranking-table tr {
    padding: 10px 0;
    border-bottom: 1px solid var(--vp-c-border);
  }

  .airport-ranking-table tr:last-child {
    border-bottom: 0;
  }

  .airport-ranking-table td {
    display: grid;
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 10px;
    padding: 5px 10px;
    border-bottom: 0;
    text-align: left;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .airport-ranking-table td::before {
    color: var(--vp-c-text-3);
    content: attr(data-label);
    font-size: 12px;
    font-weight: 700;
  }

  .airport-ranking-center {
    text-align: left;
  }
}
</style>
