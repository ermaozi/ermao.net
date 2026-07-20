<script setup lang="ts">
import { computed } from 'vue'
import { airportRecords, type AirportPlan } from '../data/airports'

const props = defineProps<{
  airportId: string
}>()

const airport = computed(() =>
  airportRecords.find(item => item.id === props.airportId || item.name === props.airportId),
)

const plans = computed(() => airport.value?.plans ?? [])

const planPrice = (plan: AirportPlan) => {
  if (plan.priceText) return plan.priceText
  if (typeof plan.price === 'number') {
    const currency = plan.currency === 'USD' ? '$' : '¥'
    return `${currency}${plan.price}${plan.period ? `/${plan.period}` : ''}`
  }
  return '以官网为准'
}

const cleanFeature = (value: string) =>
  value
    .replace(/^.+?[：:]/, '')
    .replace(/保证|支持|提供|适合/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const splitFeature = (value: string) =>
  cleanFeature(value)
    .split(/[，,；;。]/)
    .map(item => item.trim())
    .filter(Boolean)

const trimLabel = (value: string) => (value.length > 16 ? `${value.slice(0, 16)}...` : value)

const planMeta = (plan: AirportPlan) => {
  const items = [plan.audience, ...(plan.features ?? []).flatMap(splitFeature)]
    .filter((item): item is string => Boolean(item))
    .filter(item => !/以官网|取决于节点|购买|续费|手动重置/.test(item))

  const uniqueItems = [...new Set(items.map(trimLabel))]
  return uniqueItems.slice(0, 2).join('；') || plan.type || '以官网为准'
}
</script>

<template>
  <div v-if="airport && plans.length > 0" class="airport-plan-wrap">
    <table class="airport-plan-table">
      <thead>
        <tr>
          <th>套餐</th>
          <th>价格</th>
          <th>流量</th>
          <th>周期/类型</th>
          <th>特点</th>
          <th>购买</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="plan in plans"
          :key="plan.name || plan.text"
          :class="{ 'is-recommended': plan.recommended }"
        >
          <td class="plan-name" data-label="套餐">
            <strong>{{ plan.name || plan.text }}</strong>
            <span v-if="plan.recommended" class="plan-badge">推荐</span>
          </td>
          <td data-label="价格">{{ planPrice(plan) }}</td>
          <td data-label="流量">{{ plan.traffic || '以官网为准' }}</td>
          <td data-label="周期/类型">
            <span>{{ plan.billingCycle || '以官网为准' }}</span>
            <small v-if="plan.type">{{ plan.type }}</small>
          </td>
          <td class="plan-meta" data-label="特点">
            {{ planMeta(plan) }}
          </td>
          <td data-label="购买">
            <a
              :href="plan.purchaseHref || airport.officialHref"
              target="_blank"
              rel="sponsored nofollow noopener"
            >购买</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <p v-else class="airport-plan-empty">
    套餐价格待补充，购买前请以官网结算页为准。
  </p>
</template>

<style scoped>
.airport-plan-wrap {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow: visible;
  margin: 1rem 0 1.6rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
}

.airport-plan-table {
  display: table;
  width: 100%;
  min-width: 0;
  margin: 0;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: fixed;
  white-space: normal;
}

.airport-plan-table th,
.airport-plan-table td {
  padding: 10px 12px;
  border: 0;
  border-bottom: 1px solid var(--vp-c-border);
  vertical-align: middle;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.airport-plan-table thead th {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  font-weight: 700;
  text-align: left;
  white-space: normal;
}

.airport-plan-table tbody tr:last-child td {
  border-bottom: 0;
}

.airport-plan-table tbody tr.is-recommended {
  background: color-mix(in srgb, var(--vp-c-brand-soft) 52%, transparent);
}

.plan-name {
  white-space: normal;
}

.plan-name strong {
  display: inline-block;
  margin-right: 6px;
  max-width: 100%;
  overflow-wrap: anywhere;
}

.plan-badge {
  display: inline-flex;
  padding: 1px 7px;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.6;
}

.plan-meta {
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.airport-plan-table small {
  display: block;
  margin-top: 2px;
  color: var(--vp-c-text-3);
}

.airport-plan-empty {
  color: var(--vp-c-text-2);
  overflow-wrap: anywhere;
  word-break: break-word;
}

@media (max-width: 719px) {
  .airport-plan-table {
    font-size: 13px;
  }

  .airport-plan-table,
  .airport-plan-table tbody,
  .airport-plan-table tr,
  .airport-plan-table td {
    display: block;
    width: 100%;
  }

  .airport-plan-table thead {
    display: none;
  }

  .airport-plan-table tr {
    padding: 10px 0;
    border-bottom: 1px solid var(--vp-c-border);
  }

  .airport-plan-table tr:last-child {
    border-bottom: 0;
  }

  .airport-plan-table td {
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr);
    gap: 10px;
    padding: 5px 10px;
    border-bottom: 0;
  }

  .airport-plan-table td::before {
    color: var(--vp-c-text-3);
    content: attr(data-label);
    font-size: 12px;
    font-weight: 700;
  }
}
</style>
