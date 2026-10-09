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

test('Historical monthly prices cannot enter the selector and current results stay unchanged', () => {
  const results = selector(airportRecords)
  assert.equal(results.length, 27)
  assert.equal(results.reduce((total, item) => total + item.comparablePlans.length, 0), 94)
  assert.ok(!results.some(item => item.id === 'superbiu'))
  const monthly = { id: 'example', name: 'Example', reviewHref: '/blog/example/', plans: [{ name: 'Small', text: 'Small', priceText: '¥11/月', traffic: '50GB' }] }
  assert.equal(selector([monthly]).length, 1)
  assert.equal(selector([{ ...monthly, historicalPlansAsOf: '2026-02-24' }]).length, 0)
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
