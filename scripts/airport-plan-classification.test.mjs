import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { stripTypeScriptTypes } from 'node:module'
import { runInNewContext } from 'node:vm'
import test from 'node:test'
const read = name => fs.readFileSync(new URL(`../${name}`, import.meta.url), 'utf8')
const plain = value => JSON.parse(JSON.stringify(value))
const evaluate = (source, names, scope = {}) => runInNewContext(`${stripTypeScriptTypes(source).replace(/^import .*$/gm, '').replace(/^export /gm, '')}\n;({ ${names.join(', ')} })`, scope)
const helpers = evaluate(read('scripts/airports/plan-tables.ts'), ['extractPlanTables', 'plansFromTable', 'isOneTimePlan'])
const { extractPlanTables, plansFromTable, isOneTimePlan } = helpers
const { airportSources, airportRecords } = evaluate(read('docs/.vuepress/data/airports.ts'), ['airportSources', 'airportRecords'])
const { localizeAirportRecord } = evaluate(read('docs/.vuepress/data/airports-i18n.ts'), ['localizeAirportRecord'])
const { selectorSourceDates } = evaluate(read('docs/.vuepress/data/selector-source-dates.ts'), ['selectorSourceDates'])
const { monthlyCny, selectorAirports } = evaluate(read('docs/.vuepress/data/connection-selector.ts'), ['monthlyCny', 'selectorAirports'], { airportRecords, selectorSourceDates })
const table = (name = '备用包', price = '¥20', traffic = '100GB', feature = '普通节点') => `| 套餐名称 | 价格 | 流量 | 特点 |\n|---|---|---|---|\n| ${name} | ${price} | ${traffic} | ${feature} |`
const parse = text => plain(extractPlanTables(text).flatMap(plansFromTable))

test('Explicit section, traffic, billing and feature evidence classify non-expiring plans', () => {
  for (const source of [`## 不限时流量包\n${table()}`, `## 套餐\n${table('普通包', '¥20', '100GB，不限时不过期')}`, `## 套餐\n${table('普通包', '¥20', '100GB', '不限时间，用完为止')}`, `## 套餐\n${table('普通包', '¥20/一次性')}`]) assert.equal(parse(source)[0].oneTime, true)
  assert.equal(isOneTimePlan({ billingCycle: '一次性' }), true)
})

test('Unlimited speed/devices and mixed or negated mentions are not expiry evidence', () => {
  for (const features of [['不限速，不限设备，不限流量'], ['永久住宅IP，永久技术支持'], ['不支持不限时套餐'], ['非一次性套餐'], ['不保证不限时'], ['不承诺不限时'], ['类型：月付 / 季度 / 半年 / 一年 / 一次性']]) assert.equal(isOneTimePlan({ name: '普通套餐', features }), false)
  assert.equal(parse(`## 月付与不限时套餐\n${table()}`)[0].oneTime, undefined)
  assert.equal(parse(`## 不限时流量包\n${table('月付套餐', '¥10/月')}`)[0].oneTime, undefined)
  assert.equal(isOneTimePlan({ name: '月付套餐', priceText: '¥10/月', billingCycle: '一次性付款' }), false)
  for (const billingCycle of ['一年', '季度', '30天', '一次性付款（有效期30天）']) assert.equal(isOneTimePlan({ name: '普通套餐', priceText: '¥100', billingCycle, features: ['不限时流量包'] }), false)
  assert.equal(isOneTimePlan({ name: '年付包', priceText: '¥88 / 一年', features: ['月付 / 一次性'] }), false)
})

test('Heading scope respects nesting, all heading depths and adjacent table endings', () => {
  const source = `## 不限时流量包\n##### 普通档位\n${table()}\n## 周期套餐\n###### 普通档位\n${table('普通月包', '¥10/月')}\n## 其他套餐\n${table('待确认套餐')}`
  assert.deepEqual(parse(source).map(plan => Boolean(plan.oneTime)), [true, false, false])
  const siblings = `## 套餐\n### 不限时流量包\n${table()}\n### 周期套餐\n${table('普通套餐')}`
  assert.deepEqual(parse(siblings).map(plan => Boolean(plan.oneTime)), [true, false])
})

test('All 16 affected source rows receive both type and flag and stay out of monthly selectors', () => {
  const expected = { xsus: ['188GB', '240GB', '400GB', '1024GB'], 网际快车: ['20GB，不限时不过期', '200GB，不限时不过期', '1980GB，不限时不过期'], superbiu: ['120GB', '240GB', '380GB', '880GB'], runway: ['150G'], sogo云: ['100GB', '250GB', '500GB', '1000GB'] }
  for (const [id, traffics] of Object.entries(expected)) {
    const airport = airportRecords.find(item => item.id === id)
    assert.ok(airport)
    const plans = airport.plans.filter(plan => plan.oneTime)
    assert.deepEqual(Array.from(plans, plan => plan.traffic), traffics, id)
    for (const plan of plans) { assert.equal(plan.type, '不限时流量包'); assert.equal(monthlyCny(plan), undefined) }
    for (const plan of localizeAirportRecord(airport).plans.filter(plan => plan.oneTime)) assert.equal(plan.type, 'one-time traffic pack')
  }
  assert.equal(airportRecords.find(item => item.id === 'xsus').plans.filter(plan => !plan.oneTime).length, 4)
  assert.equal(airportRecords.find(item => item.id === '网际快车').plans.filter(plan => !plan.oneTime).length, 2)
  assert.ok(!selectorAirports.some(item => item.id === '网际快车'))
  for (const airport of selectorAirports) for (const { plan } of airport.comparablePlans) assert.ok(!plan.oneTime)
})

test('Annual summaries distinguish monthly data from yearly billing and remain concise', () => {
  for (const [id, amount, traffic] of [['极连云', 96, 60], ['光速云', 99, 59]]) {
    const item = airportRecords.find(item => item.id === id)
    assert.equal(item.minPlanText, `${amount}元/年 ${traffic}GB/月`)
    assert.ok(item.minPlanText.length <= 18)
    assert.ok(item.plans.some(plan => plan.priceText === `¥${amount}/年` && plan.traffic === `${traffic}GB/月`))
    assert.match(item.description, /资料记录/)
    assert.match(item.description, /一次支付全年费用/)
  }
})

test('The whole generated catalog is reproducible from the complete article set', () => {
  let output
  evaluate(read('scripts/airports/sync-plans.ts'), ['catalog'], { fs: { ...fs, writeFileSync: (file, value) => { output = value } }, path, process, console: { log() {} }, airportSources, ...helpers })
  assert.equal(output, read('docs/.vuepress/data/airports.ts'))
})
