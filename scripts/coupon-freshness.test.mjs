import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const zh = read('docs/blog/机场推荐/2026/机场推荐光速云.md')
const en = read('docs/en/blog/proxy-reviews/2026/机场推荐光速云.md')
test('Guangsu historic coupon is qualified in metadata, FAQ JSON-LD and visible content', () => {
  assert.match(zh.match(/^description: (.+)$/m)[1], /已到原定截止日期.*当前优惠待商家确认/)
  const faq = JSON.parse(zh.slice(zh.indexOf('      {'), zh.indexOf('\n---', zh.indexOf('      {'))).trim())
  assert.match(faq.mainEntity[0].acceptedAnswer.text, /2026年1月31日23:59截止.*该日期已过.*需向商家核实/)
  assert.match(zh, /历史优惠记录/)
  assert.match(zh, /原定截止时间.*2026\/01\/31 23:59，该日期已过/)
  assert.match(zh, /尚未核实商家是否延期或另有活动，不保证优惠码仍可用/)
  assert.doesNotMatch(zh, /使用优惠码ok88可享8折|输入 `ok88` 享受8折/)
  assert.match(en, /An extension or replacement offer has not been verified/)
  assert.doesNotMatch(en, /Treat `ok88` as expired/)
})
test('Editorial fixes do not present a new merchant verification date', () => {
  assert.match(zh, /^updateTime: 2026\/02\/24 10:00:00$/m)
  assert.match(en, /^updateTime: 2026\/02\/24 10:00:00$/m)
  assert.match(read('docs/.vuepress/data/selector-source-dates.ts'), /['"]\/blog\/guangsuyun\/['"]: ['"]2026-02-24['"]/)
})
