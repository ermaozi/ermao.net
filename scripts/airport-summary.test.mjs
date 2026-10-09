import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { runInNewContext } from 'node:vm'
import test from 'node:test'

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const evaluate = (source, names) => runInNewContext(`${stripTypeScriptTypes(source)
  .replace(/^import .*$/gm, '').replace(/^export /gm, '')}\n;({ ${names.join(', ')} })`)
const { airportSources, airportRanking, airportNewListings } = evaluate(read('docs/.vuepress/data/airports.ts'), [
  'airportSources', 'airportRanking', 'airportNewListings',
])
const { localizeAirportPrice, localizeAirportSource } = evaluate(read('docs/.vuepress/data/airports-i18n.ts'), [
  'localizeAirportPrice', 'localizeAirportSource',
])

test('Every summary stays concise without hiding price uncertainty or annual commitments', () => {
  for (const item of airportSources) {
    assert.ok(item.minPlanText.length <= 18, `${item.name}: ${item.minPlanText}`)
    assert.doesNotMatch(item.minPlanText, /[；;]/, `${item.name} combines plans in a compact summary`)
  }
  for (const id of ['xsus', '唯兔云']) {
    const item = airportSources.find(item => item.id === id)
    assert.equal(item.minPlanText, '现价待核实')
    assert.equal(localizeAirportSource(item).minPlanText, 'Price unverified')
    assert.match(item.description, /10元168GB|79.9元、每月45GB/)
    assert.match(localizeAirportSource(item).description, /CNY 10.*168 GB|CNY 79.90.*45 GB/)
  }
  assert.equal(airportSources.find(item => item.id === 'shenxing').minPlanText, '96元/年 60GB/月')
  assert.equal(airportSources.find(item => item.id === 'liulianyun').minPlanText, '24元 140GB/月')
  assert.equal(airportSources.find(item => item.id === 'yunjiexian').minPlanText, '22元 150GB/月')
})

test('English compact prices retain a separator between price and traffic', () => {
  assert.equal(localizeAirportPrice('22元120GB/月'), 'CNY 22 120GB/month')
  assert.equal(localizeAirportPrice('8 元60g/月(年付)'), 'CNY 8 60GB/month(annual)')
  assert.equal(localizeAirportPrice('15元 128G/月'), 'CNY 15 128GB/month')
  assert.equal(localizeAirportPrice('96元/年 60GB/月'), 'CNY 96/year 60GB/month')
})

test('Display positions include new entries while source sales ranks remain unchanged', () => {
  assert.deepEqual(Array.from(airportRanking, item => item.rank), Array.from({ length: 68 }, (_, i) => i + 1))
  const listing = airportNewListings.find(item => item.id === 'yunjiexian')
  assert.equal(listing.rank, undefined)
  assert.equal([...airportRanking, ...airportNewListings].findIndex(item => item.id === 'yunjiexian') + 1, 69)
  for (const name of ['AirportRankingTable', 'AirportDetailList']) {
    const source = read(`docs/.vuepress/components/${name}.vue`)
    assert.match(source, /v-for="\(item, index\) in airports"/)
    assert.match(source, /\{\{ index \+ 1 \}\}/)
    assert.doesNotMatch(source, /v-if="item.rank !== undefined"/)
  }
  assert.match(read('docs/blog/机场推荐/vpn.md'), /圆形数字仅为列表序号/)
})

test('Table columns keep their original widths and text can wrap without truncation', () => {
  const source = read('docs/.vuepress/components/AirportRankingTable.vue')
  for (const [name, width] of Object.entries({ name: 23, link: 8, bool: 10, plan: 24, short: 7, change: 11 })) {
    assert.match(source, new RegExp(`\\.airport-ranking-col-${name} \\{\\s+width: ${width}%;`))
  }
  assert.doesNotMatch(source, /text-overflow:\s*ellipsis|line-clamp|word-break:\s*keep-all/)
  assert.match(source, /class="airport-ranking-provider"/)
  assert.match(source, /universalShort: 'Sub\.'/)
  assert.match(source, /<th :title="labels.universal">\{\{ labels.universalShort \}\}<\/th>/)
  assert.match(read('docs/.vuepress/components/AirportPlanTable.vue'), /class="plan-name-content"/)
  assert.match(read('docs/.vuepress/components/AirportList.vue'), /\.airport-card-head \{[^}]*flex-wrap: wrap;/s)
  assert.match(read('docs/.vuepress/styles/index.css'), /\.vp-doc-container \.vp-doc-meta > p \{[^}]*flex-wrap: wrap;/s)
})
