import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
const files = ['docs/blog/翻墙工具/免费AppleID账号.md', 'docs/en/blog/access-tools/免费AppleID账号.md']
for (const file of files) {
  const source = readFileSync(file, 'utf8')
  const definition = source.slice(source.indexOf('const isAccountOfferStatus ='), source.indexOf('const accounts ='))
  const isOffer = vm.runInNewContext(definition + '\nisAccountOfferStatus')
  test(`${file}: only exact placeholder states become offers`, () => {
    for (const s of ['该地区账号不足', ' 请购买 VIP 通道获取 ', '请购买ｖｉｐ通道获取', '该地区\n账号不足']) assert.equal(isOffer(s), true)
    for (const s of ['fixture@example.invalid', '', null, undefined, '该地区账号不足@example.invalid', '请购买VIP通道获取更多', '加载中', '请求失败']) assert.equal(isOffer(s), false)
    assert.match(source, /v-for="\(acc, index\) in availableAccounts"/)
    assert.match(source, /accounts.value.filter\(acc => !isAccountOfferStatus\(acc.email\)\)/)
    assert.match(source, /href="https:\/\/hxlacc.com\/\?aff=76RSGSX9" target="_blank" rel="sponsored nofollow noopener" aria-label=/)
    assert.match(source, /if \(isAccountOfferStatus\(acc.email\)\) return/)
    assert.match(source, /copy\(acc.email, acc, 'email'\)[\s\S]*copy\(acc.password, acc, 'password'\)/)
  })
}
