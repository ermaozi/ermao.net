import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { globSync } from 'glob'
import matter from 'gray-matter'
import { airportRecords } from '../../docs/.vuepress/data/airports'
import { monthlyCny, trafficGb, selectorAirports } from '../../docs/.vuepress/data/connection-selector'

assert.equal(monthlyCny({ text: '', priceText: '¥120/年' }), undefined)
assert.equal(monthlyCny({ text: '', priceText: '¥10/月', features: ['不限时间，用完为止'] }), undefined)
assert.equal(monthlyCny({ text: '', priceText: '¥10/月', currency: 'USD' }), undefined)
assert.equal(monthlyCny({ text: '', priceText: '20元 / 月' }), 20)
assert.equal(trafficGb({ text: '', traffic: '不限流量' }), undefined)
assert.equal(trafficGb({ text: '', traffic: '每日60GB，共1800GB' }), undefined)
assert.equal(trafficGb({ text: '', traffic: '1TB' }), 1024)
const xsus = airportRecords.find(item => item.id === 'xsus')!
assert.equal(monthlyCny(xsus.plans.find(plan => plan.traffic === '188GB')!), undefined)
const express = airportRecords.find(item => item.id === '网际快车')!
assert.equal(trafficGb(express.plans.find(plan => plan.traffic?.startsWith('20GB'))!), undefined)
assert.ok(!selectorAirports.some(item => item.id === '网际快车'))

const sources = new Map<string, { content: string; date?: string }>()
for (const path of globSync('docs/blog/机场推荐/**/*.md').sort()) {
  const { data, content } = matter(readFileSync(path, 'utf8'))
  if (data.permalink) sources.set(data.permalink, { content, date: data.updateTime ? String(data.updateTime).split(' ')[0].replaceAll('/', '-') : undefined })
}
for (const airport of selectorAirports) {
  const source = sources.get(airport.reviewHref!)
  assert.ok(source, `Missing source: ${airport.name}`)
  assert.equal(airport.sourceDate, source.date, `Source date mismatch: ${airport.name}`)
  for (const { plan, price, traffic } of airport.comparablePlans) {
    assert.ok(price > 0 && traffic > 0)
    assert.ok(source.content.includes(plan.priceText!), `Source price mismatch: ${airport.name}: ${plan.priceText}`)
    assert.ok(source.content.includes(plan.traffic!), `Source traffic mismatch: ${airport.name}: ${plan.traffic}`)
  }
}
console.log(`Selector: ${selectorAirports.length} providers checked against source prices, traffic and dates; ambiguity exclusions passed.`)
