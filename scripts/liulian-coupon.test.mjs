import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { runInNewContext } from 'node:vm'
import test from 'node:test'

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const evaluate = (source, names) => {
  const js = stripTypeScriptTypes(source).replace(/^import .*$/gm, '').replace(/^export /gm, '')
  return runInNewContext(`${js}\n;({ ${names.join(', ')} })`)
}
const { airportRecords, airportSources } = evaluate(read('docs/.vuepress/data/airports.ts'), ['airportRecords', 'airportSources'])
const { localizeAirportRecord, localizeAirportSource } = evaluate(read('docs/.vuepress/data/airports-i18n.ts'), ['localizeAirportRecord', 'localizeAirportSource'])
const { selectorSourceDates } = evaluate(read('docs/.vuepress/data/selector-source-dates.ts'), ['selectorSourceDates'])
const record = airportRecords.find(item => item.id === 'liulianyun')
const source = airportSources.find(item => item.id === 'liulianyun')
const chinese = read('docs/blog/机场推荐/2026/机场推荐榴莲云.md')
const english = read('docs/en/blog/proxy-reviews/2026/机场推荐榴莲云.md')
const chineseIndex = read('docs/blog/文档/各大机场优惠券汇总.md').split('## 榴莲云机场优惠券\n')[1]?.split('\n## ')[0]
const englishIndex = read('docs/en/blog/guides/各大机场优惠券汇总.md').split('## Liulian Cloud\n')[1]?.split('\n## ')[0]
const referral = 'https://a01vipaff.liulianyunaff.com/#/?code=CqEkCAgo'
const json = value => JSON.parse(JSON.stringify(value))

test('Liulian coupon has the confirmed code, seven-tenths price and one-use limit in both articles and coupon indexes', () => {
  for (const content of [chinese, chineseIndex]) {
    assert.match(content, /`ll88`/)
    assert.match(content, /七折/)
    assert.match(content, /每个账号限用一次/)
    assert.match(content, /适用套餐、计费周期和截止时间尚未提供/)
  }
  for (const content of [english, englishIndex]) {
    assert.match(content, /`ll88`/)
    assert.match(content, /30% off, once per account/)
    assert.match(content, /Eligible plans, billing periods and an expiry date have not been supplied/)
  }
})

test('Coupon wording does not invent new-customer, first-order, all-plan or permanent-validity terms', () => {
  const chineseCoupon = chinese.split('\n\n').filter(text => text.includes('ll88')).join('\n')
  const englishCoupon = english.split('\n\n').filter(text => text.includes('ll88')).join('\n')
  for (const content of [chineseCoupon, chineseIndex, record.description]) {
    assert.doesNotMatch(content, /首单|新客|新用户|全场|所有套餐|永久有效/)
  }
  for (const content of [englishCoupon, englishIndex, localizeAirportRecord(record).description]) {
    assert.doesNotMatch(content, /first.order|new.customer|new.user|all plans|never expires|permanent/i)
  }
})

test('Generated summaries expose ll88 and its one-use limit in both languages', () => {
  assert.match(record.description, /优惠码 ll88 七折，每个账号限用一次/)
  assert.match(source.description, /优惠码 ll88 七折，每个账号限用一次/)
  for (const content of [localizeAirportRecord(record).description, localizeAirportSource(source).description]) {
    assert.match(content, /Code ll88 offers 30% off, once per account/)
  }
})

test('The original five plan prices and monthly allowances remain undiscounted', () => {
  assert.deepEqual(json(record.plans.map(({ priceText, traffic }) => ({ priceText, traffic }))), [
    { priceText: '¥96/年', traffic: '60GB/月' },
    { priceText: '¥24/月', traffic: '140GB/月' },
    { priceText: '¥40/月', traffic: '260GB/月' },
    { priceText: '¥60/月', traffic: '420GB/月' },
    { priceText: '¥100/月', traffic: '750GB/月' },
  ])
  assert.equal(record.minPlanText, '24元 140GB/月')
  assert.match(chinese, /以上金额为优惠前的套餐价格/)
  assert.match(english, /The table keeps prices before the coupon discount/)
  for (const plan of record.plans) {
    assert.ok(chinese.includes(`| ${plan.name} | ${plan.priceText} | ${plan.traffic} |`))
    assert.equal(plan.purchaseHref, referral)
  }
})

test('Existing article routes, purchase links and original image references are preserved', () => {
  assert.equal(record.reviewHref, '/blog/liulianyun/')
  assert.equal(record.officialHref, referral)
  assert.equal(record.rank, 18)
  assert.match(chinese, /^title: 2026 榴莲云机场推荐：24元140GB月付，96元年付小包与通用订阅$/m)
  assert.match(english, /^title: "2026 Liulian Cloud Review: CNY 24 for 140 GB Monthly and a CNY 96 Annual Plan"$/m)
  for (const content of [chinese, english, chineseIndex, englishIndex]) assert.ok(content.includes(referral))
  for (const content of [chinese, english]) {
    for (const image of ['20261002_145634-18a112.png', '20261002_145642-2b04b1.png']) {
      assert.ok(content.includes(`https://image.ermao.net/images/blog/liulianyun/${image}`))
    }
  }
  assert.match(chineseIndex, /\]\(\/blog\/liulianyun\/\)/)
  assert.match(englishIndex, /\]\(\/en\/blog\/liulianyun\/\)/)
})

test('The selector editorial date matches the updated bilingual source pages', () => {
  assert.equal(selectorSourceDates['/blog/liulianyun/'], '2026-10-08')
  for (const content of [chinese, english]) assert.match(content, /^updateTime: 2026\/10\/08 00:00:00$/m)
})

