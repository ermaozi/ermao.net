import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { runInNewContext } from 'node:vm'
import test from 'node:test'
const read = name => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8')
const evaluate = (source, names, scope = {}) => runInNewContext(`${stripTypeScriptTypes(source).replace(/^import .*$/gm, '').replace(/^export /gm, '')}\n;({ ${names.join(', ')} })`, scope)
const { airportRecords } = evaluate(read('docs/.vuepress/data/airports.ts'), ['airportRecords'])
const { localizeAirportRecord } = evaluate(read('docs/.vuepress/data/airports-i18n.ts'), ['localizeAirportRecord'])
const { selectorSourceDates } = evaluate(read('docs/.vuepress/data/selector-source-dates.ts'), ['selectorSourceDates'])
const selector = records => evaluate(read('docs/.vuepress/data/connection-selector.ts'), ['selectorAirports'], { airportRecords: records, selectorSourceDates }).selectorAirports
const plain = value => JSON.parse(JSON.stringify(value))

test('The unverified Ermao Cloud Telegram handle is withdrawn without guessing another field', () => {
  const airport = airportRecords.find(item => item.id === '二猫云')
  assert.equal(airport.telegramHref, '')
  assert.equal(airport.officialHref, 'https://v01.2maoyunaff.cc/#/register?code=6n2UaV1A')
  assert.equal(airport.minPlanText, '16元 100G/月')
  assert.equal(airport.hasOneTimePackage, true)
})

test('SuperBiu retains historical plans but makes current pricing and availability unknown', () => {
  const airport = airportRecords.find(item => item.id === 'superbiu')
  assert.equal(airport.minPlanText, '现价待核实')
  assert.equal(airport.historicalPlansAsOf, '2026-02-24')
  assert.equal(airport.hasOneTimePackage, 'unknown')
  assert.match(airport.description, /商家说明.*未实测/)
  assert.doesNotMatch(airport.description, /14 元|14元|当前套餐包括/)
  assert.equal(airport.officialHref, 'https://biubiux.online/#/register?code=BasmsULb')
  assert.deepEqual(plain(airport.plans.map(({ priceText, traffic, oneTime, type }) => ({ priceText, traffic, oneTime, type }))), [
    { priceText: '¥40', traffic: '120GB', oneTime: true, type: '不限时流量包' },
    { priceText: '¥79', traffic: '240GB', oneTime: true, type: '不限时流量包' },
    { priceText: '¥128', traffic: '380GB', oneTime: true, type: '不限时流量包' },
    { priceText: '¥238', traffic: '880GB', oneTime: true, type: '不限时流量包' },
  ])
  const english = localizeAirportRecord(airport)
  assert.equal(english.minPlanText, 'Price unverified')
  assert.equal(english.historicalPlansAsOf, '2026-02-24')
  assert.match(english.description, /Current prices and availability remain unverified/)
})

test('Historical monthly prices cannot enter the selector and only the screenshot-backed XXYun monthly tiers join current results', () => {
  const results = selector(airportRecords)
  assert.equal(results.length, 28)
  assert.deepEqual(plain(results.find(item => item.id === 'xxyun').comparablePlans.map(({ price, traffic }) => [price, traffic])), [[9.99, 100], [19.9, 300], [39.9, 1000]])
  assert.equal(results.reduce((total, item) => total + item.comparablePlans.length, 0), 98)
  assert.ok(!results.some(item => item.id === 'superbiu' || item.id === 'xsus'))
  const monthly = { id: 'example', name: 'Example', reviewHref: '/blog/example/', plans: [{ name: 'Small', text: 'Small', priceText: '¥11/月', traffic: '50GB' }] }
  assert.equal(selector([monthly]).length, 1)
  assert.equal(selector([{ ...monthly, historicalPlansAsOf: '2026-02-24' }]).length, 0)
})

test('XSUS retains its four monthly and four one-time historical entries without current availability claims', () => {
  const airport = airportRecords.find(item => item.id === 'xsus')
  const english = localizeAirportRecord(airport)
  for (const entry of [airport, english]) {
    assert.equal(entry.historicalPlansAsOf, '2026-02-24')
    assert.equal(entry.hasOneTimePackage, 'unknown')
    assert.equal(entry.officialHref, 'https://xsus.cloud/register?code=xJFcT1Dw')
    assert.equal(entry.plans.length, 8)
    assert.equal(entry.plans.filter(plan => plan.oneTime).length, 4)
    assert.ok(entry.plans.every(plan => plan.purchaseHref === entry.officialHref))
  }
  assert.ok(!(airport.tags ?? []).includes('不限时'))
  assert.doesNotMatch(airport.plans.flatMap(plan => plan.features ?? []).join(' '), /带宽保证|Netflix\/Disney保证/)
})

test('Historical prices receive visible bilingual table labels without changing column widths', () => {
  const component = read('docs/.vuepress/components/AirportPlanTable.vue')
  assert.match(component, /historicalPlansAsOf \? 'Historical price' : 'Price'/)
  assert.match(component, /historicalPlansAsOf \? '历史价' : '价格'/)
  assert.match(component, /Current prices and availability are unverified/)
  assert.match(component, /现价与是否仍在售待核实/)
  assert.match(component, /v-if="airport.historicalPlansAsOf" class="airport-plan-history"/)
})

test('Both articles match FAQ schema to visible answers and preserve source and purchase links', () => {
  for (const path of ['docs/blog/机场推荐/2026/机场推荐superbiu.md', 'docs/en/blog/proxy-reviews/2026/机场推荐superbiu.md']) {
    const source = read(path)
    const [, frontmatter, body] = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    const faq = JSON.parse(frontmatter.slice(frontmatter.indexOf('      {')))
    assert.equal(faq.mainEntity.length, 4)
    for (const question of faq.mainEntity) {
      assert.ok(body.includes(question.name))
      assert.ok(body.includes(question.acceptedAnswer.text))
    }
    for (const id of ['469', '473', '482']) assert.ok(body.includes(`https://t.me/biubiugroup/${id}`))
    assert.match(source, /2026-02-24/)
    assert.match(source, /updateTime: 2026\/10\/09 /)
    assert.match(source, /https:\/\/biubiux\.online\/#\/register\?code=BasmsULb/)
    const meta = frontmatter.match(/^(?:title|description):.*$/gm).join('\n')
    assert.doesNotMatch(meta, /11元|14元|CNY 11|CNY 14|IPLC/)
  }
})

test('Dageyun labels seven preserved plans as historical without adding selector candidates', () => {
  const airport = airportRecords.find(item => item.id === '大哥云')
  assert.equal(airport.rank, 9)
  assert.equal(airport.minPlanText, '现价待核实')
  assert.equal(airport.historicalPlansAsOf, '2026-02-24')
  assert.match(airport.description, /历史价目.*结算页/)
  assert.doesNotMatch(airport.description, /免费试用|8K|流畅|解锁|IPLC/)
  assert.equal(airport.officialHref, 'https://ermao.666glc.com/#/register?code=peAVAa8D')
  assert.equal(airport.plans.length, 7)
  assert.deepEqual(plain(airport.plans.map(p => p.priceText)), ['¥19.90', '¥29.90', '¥69.00', '¥88.00', '¥199.00', '¥299.00', '¥699.00'])
  assert.ok(airport.plans.every(p => p.purchaseHref === airport.officialHref))
  assert.ok(!selector(airportRecords).some(item => item.id === '大哥云'))
  const english = localizeAirportRecord(airport)
  assert.equal(english.minPlanText, 'Price unverified')
  assert.match(english.description, /historical records.*2026-02-24/)
  assert.doesNotMatch(english.description, /lists plans from|free trial|8K|smooth/i)
})
