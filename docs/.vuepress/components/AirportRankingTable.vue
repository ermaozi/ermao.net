<script setup lang="ts">
import { airportRanking, type AirportBoolean } from '../data/airports'

const boolText = (value: AirportBoolean) => {
  if (value === true) return '✔'
  if (value === false) return '✘'
  return '待补'
}

const boolClass = (value: AirportBoolean) => ({
  'is-yes': value === true,
  'is-no': value === false,
  'is-unknown': value === 'unknown',
})

const changeClass = (value?: string) => ({
  'is-up': value?.startsWith('↑'),
  'is-down': value?.startsWith('↓'),
  'is-new': value === '新上',
})
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
          <th>机场名称</th>
          <th>官网</th>
          <th>通用订阅</th>
          <th>最便宜订阅</th>
          <th>不限时</th>
          <th>群组</th>
          <th>详情</th>
          <th>变化</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in airportRanking" :key="item.id">
          <td class="airport-ranking-name" data-label="机场名称">
            <span class="airport-ranking-rank">{{ item.rank }}</span>
            <a :href="`#${item.id}`">{{ item.name }}</a>
          </td>
          <td class="airport-ranking-link" data-label="官网">
            <a
              :href="item.officialHref"
              target="_blank"
              rel="sponsored nofollow noopener"
            >官网</a>
          </td>
          <td class="airport-ranking-center" data-label="通用订阅">
            <span class="airport-ranking-bool" :class="boolClass(item.universalSubscription)">
              {{ boolText(item.universalSubscription) }}
            </span>
          </td>
          <td class="airport-ranking-plan" data-label="最便宜订阅">
            {{ item.minPlanText }}
          </td>
          <td class="airport-ranking-center" data-label="不限时">
            <span class="airport-ranking-bool" :class="boolClass(item.hasOneTimePackage)">
              {{ boolText(item.hasOneTimePackage) }}
            </span>
          </td>
          <td class="airport-ranking-link" data-label="群组">
            <a
              v-if="item.telegramHref"
              :href="item.telegramHref"
              target="_blank"
              rel="nofollow noopener"
            >TG</a>
            <span v-else class="airport-ranking-muted">暂无</span>
          </td>
          <td class="airport-ranking-link" data-label="详情">
            <a v-if="item.reviewHref" :href="item.reviewHref">前往</a>
            <span v-else class="airport-ranking-muted">暂无</span>
          </td>
          <td data-label="变化">
            <span class="airport-ranking-change" :class="changeClass(item.rankChangeLabel)">
              {{ item.rankChangeLabel || '-' }}
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
