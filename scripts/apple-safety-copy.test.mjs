import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
const read = name => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8')
const links = source => new Set([...source.matchAll(/\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g)].map(match => new URL(match[1]).href))
const zhFree = read('docs/blog/翻墙工具/免费AppleID账号.md')
const enFree = read('docs/en/blog/access-tools/免费AppleID账号.md')
const zhAsspp = read('docs/blog/翻墙工具/AppleID管理工具Asspp.md')
const enAsspp = read('docs/en/blog/access-tools/AppleID管理工具Asspp.md')
test('Asspp and account-recovery advice keeps ownership and unofficial-interface limits', () => {
  for (const source of [zhFree, enFree]) {
    assert.ok(links(source).has('https://github.com/Lakr233/Asspp#-special-notice'))
    assert.ok(links(source).has('https://support.apple.com/en-us/102640'))
  }
  assert.match(zhFree, /不能保证免验证、连接稳定或账号持续可用/)
  assert.match(zhFree, /以上恢复操作仅适用于你自己的账户/)
  assert.match(zhFree, /“媒体与购买项目”账户被停用/)
  assert.doesNotMatch(zhFree, /彻底解决账号验证|这是由于账号在短时间内/)
  assert.match(enFree, /Recovery applies only to an account you own/)
  assert.match(enFree, /unofficial communication method may stop working/)
})
test('Mac installation distinguishes source checks from malware and damaged-app warnings', () => {
  for (const source of [zhAsspp, enAsspp]) {
    assert.ok(links(source).has('https://github.com/Lakr233/Asspp/releases'))
    assert.ok(links(source).has('https://support.apple.com/en-us/102445'))
  }
  assert.match(zhAsspp, /无法确认来源或完整性时停止安装/)
  assert.match(zhAsspp, /“将损坏你的电脑”、恶意软件或“已损坏”/)
  assert.match(zhAsspp, /停止安装，不要绕过告警/)
  assert.doesNotMatch(zhAsspp, /不是 Asspp 有问题|所有非 App Store 下载的应用都会遇到/)
  assert.match(enAsspp, /Do not bypass the warning/)
  assert.match(zhAsspp, /针对的是这一激活锁后果，不代表没有账号被封/)
  assert.doesNotMatch(zhAsspp, /目前还没出现过账号被封/)
  assert.match(enAsspp, /refers to that Activation Lock outcome/)
})

test('Official source assertions match full link targets rather than URL substrings', () => {
  const fake = '[misleading](https://example.com/https://support.apple.com/en-us/102640)'
  assert.equal(links(fake).has('https://support.apple.com/en-us/102640'), false)
})
