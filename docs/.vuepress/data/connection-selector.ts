import { airportRecords, type AirportPlan } from './airports'
import { selectorSourceDates } from './selector-source-dates'

// Accept only an explicit, single CNY monthly price; never annualized prices,
// discounts, ranges, unknown currencies or one-time packages.
export function monthlyCny(plan: AirportPlan): number | undefined {
  if (plan.oneTime || (plan.currency && plan.currency !== 'CNY')) return undefined
  if (/不限时|一次性|年付|季付|半年|终身|流量包/.test([plan.type, plan.period, plan.billingCycle, plan.text, ...(plan.features ?? [])].join(' '))) return undefined
  const value = plan.priceText?.trim() ?? ''
  const match = value.match(/^(?:[¥￥]\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*元)\s*\/\s*月$/)
  return match ? Number(match[1] ?? match[2]) : undefined
}

export function trafficGb(plan: AirportPlan): number | undefined {
  const match = plan.traffic?.trim().match(/^(\d+(?:\.\d+)?)\s*(GB|TB)(?:\s*\/\s*月)?$/i)
  return match ? Number(match[1]) * (match[2].toUpperCase() === 'TB' ? 1024 : 1) : undefined
}

export const selectorAirports = airportRecords.flatMap(airport => {
  if (!airport.reviewHref || airport.historicalPlansAsOf) return []
  // 2026-10-03 source comparison: these fallback catalog prices/traffic cannot
  // be matched verbatim to their linked review. Keep them out until reconciled.
  if (airport.id === 'danke' || airport.id === '迅达') return []
  const plans = airport.plans.flatMap(plan => {
    const price = monthlyCny(plan)
    const traffic = trafficGb(plan)
    return price !== undefined && traffic !== undefined ? [{ plan, price, traffic }] : []
  }).sort((a, b) => a.price - b.price || a.traffic - b.traffic)
  return plans.length ? [{ ...airport, comparablePlans: plans, sourceDate: selectorSourceDates[airport.reviewHref] }] : []
})

export const clientGuides = {
  desktop: [{ name: 'Clash Verge · Windows / macOS / Linux', href: '/article/0gematwc/' }],
  android: [{ name: 'Clash Meta for Android', href: '/article/eh8f4n86/' }],
  ios: [
    { name: 'Shadowrocket · iPhone / iPad', href: '/article/z747kgjd/' },
    { name: 'Clash Mi · iPhone / iPad', href: '/blog/clashmi/' },
  ],
}
