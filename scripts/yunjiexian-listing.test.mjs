import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { runInNewContext } from 'node:vm'
import test from 'node:test'

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const evaluate = (source, names, globals = {}) => {
  const js = stripTypeScriptTypes(source).replace(/^import .*$/gm, '').replace(/^export /gm, '')
  return runInNewContext(`${js}\n;({ ${names.join(', ')} })`, globals)
}
const data = evaluate(read('docs/.vuepress/data/airports.ts'), [
  'airportRecords', 'airportRanking', 'airportNewListings',
])
const { selectorSourceDates } = evaluate(read('docs/.vuepress/data/selector-source-dates.ts'), ['selectorSourceDates'])
const selector = evaluate(read('docs/.vuepress/data/connection-selector.ts'), [
  'monthlyCny', 'selectorAirports',
], { airportRecords: data.airportRecords, selectorSourceDates })
const record = data.airportRecords.find(item => item.id === 'yunjiexian')
const article = read('docs/blog/机场推荐/2026/机场推荐云界线.md')
const json = value => JSON.parse(JSON.stringify(value))

test('Yunjiexian has one factual source record and an exact referral URL', () => {
  assert.equal(data.airportRecords.filter(item => item.id === 'yunjiexian').length, 1)
  assert.equal(record.name, '云界线')
  assert.equal(record.officialHref, 'https://ermaozi.yunjiexianaff.com/#/?code=hygdqyjF')
  assert.equal(record.reviewHref, '/blog/yunjiexian/')
  assert.equal(record.universalSubscription, true)
  assert.equal(record.hasOneTimePackage, true)
  assert.equal(record.telegramHref, '')
  assert.match(record.description, /提供方/)
  assert.match(record.description, /尚无本站独立实测/)
})

test('Six published plans keep the confirmed original prices, allowances and billing cycles', () => {
  assert.deepEqual(json(record.plans.map(({ priceText, traffic, billingCycle }) => ({ priceText, traffic, billingCycle }))), [
    { priceText: '¥22/月', traffic: '150GB/月', billingCycle: '月付' },
    { priceText: '¥40/月', traffic: '300GB/月', billingCycle: '月付' },
    { priceText: '¥66/月', traffic: '600GB/月', billingCycle: '月付' },
    { priceText: '¥96/年', traffic: '60GB/月', billingCycle: '年付，一次支付96元' },
    { priceText: '¥99/次', traffic: '80GB', billingCycle: '一次性，不限时' },
    { priceText: '¥199/次', traffic: '200GB', billingCycle: '一次性，不限时' },
  ])
  assert.deepEqual(json(record.plans.map(item => Boolean(item.oneTime))), [false, false, false, false, true, true])
  for (const plan of record.plans) {
    assert.ok(article.includes(`| ${plan.name} | ${plan.priceText} | ${plan.traffic} | ${plan.billingCycle} |`))
  }
})

test('The selector compares only the three genuine monthly plans', () => {
  const selected = selector.selectorAirports.find(item => item.id === 'yunjiexian')
  assert.deepEqual(json(selected.comparablePlans.map(item => [item.price, item.traffic])), [[22, 150], [40, 300], [66, 600]])
  assert.equal(selected.sourceDate, '2026-10-08')
  assert.equal(selector.monthlyCny(record.plans[3]), undefined)
  assert.equal(selector.monthlyCny(record.plans[4]), undefined)
  assert.equal(selector.monthlyCny(record.plans[5]), undefined)
  assert.match(article, /不能按8元单月购买/)
})

test('New listings have no fabricated sales rank and never pull in historical unranked entries', () => {
  assert.equal(record.rank, undefined)
  assert.equal(record.newListing, true)
  assert.ok(!data.airportRanking.some(item => item.id === record.id))
  assert.ok(data.airportNewListings.some(item => item.id === record.id))
  for (const item of data.airportNewListings) {
    assert.equal(item.newListing, true)
    assert.equal(item.rank, undefined)
  }
  for (const id of ['ccyz', '传送门']) {
    assert.ok(!data.airportNewListings.some(item => item.id === id))
  }
})

for (const component of ['AirportRankingTable', 'AirportDetailList']) {
  test(`${component} includes new listings only when the page explicitly opts in`, () => {
    const source = read(`docs/.vuepress/components/${component}.vue`).split('<script setup lang="ts">')[1].split('</script>')[0]
    for (const includeNewListings of [false, true]) {
      const result = evaluate(source, ['airports'], {
        computed: callback => ({ get value() { return callback() } }),
        defineProps: () => ({ includeNewListings }),
        useLang: () => ({ value: 'zh-CN' }),
        airportRanking: data.airportRanking,
        airportNewListings: data.airportNewListings,
        localizeAirportRecord: item => item,
      }).airports.value
      assert.deepEqual(json(result.slice(0, data.airportRanking.length).map(item => item.id)), json(data.airportRanking.map(item => item.id)))
      assert.equal(result.some(item => item.id === record.id), includeNewListings)
    }
  })
}

test('Only the Chinese comparison page opts in; existing English detail routes are untouched', () => {
  const chinese = read('docs/blog/机场推荐/vpn.md')
  const english = read('docs/en/blog/proxy-reviews/vpn.md')
  assert.match(chinese, /<AirportRankingTable include-new-listings \/>/)
  assert.match(chinese, /<AirportDetailList include-new-listings \/>/)
  assert.match(chinese, /新收录条目列在表末，暂不参与销量排名/)
  assert.doesNotMatch(english, /include-new-listings/)
  // AirportList requires an image. Keep this Chinese-only intake out of its shared bilingual cards.
  assert.equal(record.image, undefined)
})

test('The automatic first-order offer does not invent a coupon or discounted plan prices', () => {
  assert.match(article, /新客首单自动七折，无需优惠码/)
  assert.match(article, /适用套餐和计费周期尚未独立核实/)
  assert.doesNotMatch(article, /yjx888|¥15\.4|¥28\/月|¥46\.2|35%/i)
})

test('Provider evidence is bounded and its unmodified source image is lazy-loaded', () => {
  assert.match(article, /2026年9月23日16:16:53/)
  assert.match(article, /珠海联通9Gbps、32线程/)
  assert.match(article, /实际列出60个具名节点/)
  assert.match(article, /台湾花莲、新加坡克拉码头两条记录显示0速度/)
  assert.match(article, /不能直接当作Mbps引用/)
  assert.match(article, /不是本站实测/)
  assert.match(article, /原图顶部3行是测试订阅[\s\S]*不是出售套餐/)
  assert.match(article, /provider-speed-20260923\.png[^>]*loading="lazy"/)
  const speed = readFileSync(new URL('../docs/.vuepress/public/images/yunjiexian/provider-speed-20260923.png', import.meta.url))
  assert.equal(speed.subarray(1, 4).toString('ascii'), 'PNG')
  assert.match(article, /<AffiliateLink href="https:\/\/ermaozi\.yunjiexianaff\.com\/#\/\?code=hygdqyjF">/)
  assert.match(article, /\[推广披露\]\(\/affiliate-disclosure\/\)/)
})

test('The provided logo exists at the article URL and retains its explicit dimensions', () => {
  const logo = readFileSync(new URL('../docs/.vuepress/public/images/yunjiexian/logo.png', import.meta.url))
  assert.equal(logo.subarray(1, 4).toString('ascii'), 'PNG')
  assert.equal(logo.readUInt32BE(16), 1254)
  assert.equal(logo.readUInt32BE(20), 1254)
  assert.match(article, /=160x160\]\(\/images\/yunjiexian\/logo\.png\)/)
})
