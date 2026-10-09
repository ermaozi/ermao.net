import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const zh = read('docs/blog/翻墙工具/教你如何配置小火箭规则.md')
const en = read('docs/en/blog/access-tools/教你如何配置小火箭规则.md')
const upstream = 'https://github.com/Johnshall/Shadowrocket-ADBlock-Rules-Forever/blob/e2200b2369531a648eaf2b2db99cf9dd13ba4bbd/'

test('both guides distinguish the checked lazy profile from blacklist and ad-blocking variants', () => {
  for (const source of [zh, en]) {
    assert.ok(source.includes('FINAL,PROXY'))
    assert.ok(source.includes('lazy_group.conf'))
    assert.ok(source.includes(upstream + 'lazy_group.conf'))
    assert.ok(source.includes(upstream + 'readme.md'))
    assert.match(source, /34/)
  }
  assert.match(zh, /未启用广告拦截规则/)
  assert.match(zh, /未命中的请求默认走代理/)
  assert.match(en, /Unmatched requests therefore default to the proxy/)
  assert.match(en, /does not enable advertising-blocking rules/)
  assert.doesNotMatch(zh, /黑名单分流 \+ 广告过滤|国内外分流 \+ 广告过滤的全套方案|自动屏蔽 App 广告|广告域名在 DNS 解析阶段就被拦截/)
  assert.doesNotMatch(en, /Split routing plus advertising lists|blocks domains in its advertising and tracking lists|combined “lazy”/)
})

test('guides describe routing-mode activation, configuration updates and rollback limits', () => {
  assert.match(zh, /全局路由设为「配置」/)
  assert.match(zh, /订阅.*服务器节点更新/)
  assert.match(zh, /远程文件更新可能覆盖本地自定义修改/)
  assert.match(zh, /切回之前保留的配置/)
  assert.match(en, /Global Routing → Config/)
  assert.match(en, /Subscription.*updates for server nodes/)
  assert.match(en, /updating a remote configuration can overwrite them/)
  for (const source of [zh, en]) assert.ok(source.includes('https://github.com/LOWERTOP/Shadowrocket#自动更新'))
  assert.doesNotMatch(zh, /设置 → 订阅|规则永远保持最新/)
  assert.doesNotMatch(en, /Settings → Subscription|Update on Open.*new configuration/)
})

test('guides do not turn source review into security, performance or advertising guarantees', () => {
  assert.match(zh, /没有进行 iPhone 实机速度、广告拦截或账号风控测试/)
  assert.match(zh, /不等于流量泄漏/)
  assert.match(zh, /不能保证账号安全/)
  assert.doesNotMatch(zh, /所有流量都在裸奔|封号风险大幅降低|账号风险飙升|省了一半|适合 90% 的用户|秒开，和不开 VPN/)
  assert.match(en, /not an iPhone performance, ad-blocking, or account-risk test/)
  assert.match(en, /do not guarantee account safety/)
})

test('article identities, screenshot and existing commercial navigation remain intact', () => {
  assert.match(zh, /title: 小火箭规则怎么配？2026 Shadowrocket 分流规则设置与去广告教程/)
  assert.match(en, /title: Configure Shadowrocket Rules for Split Routing and Domain Blocking \(2026\)/)
  for (const [source, prefix] of [[zh, '/'], [en, '/en/']]) {
    assert.ok(source.includes(`permalink: ${prefix}blog/shadowrocket-rules-config/`))
    assert.ok(source.includes('createTime: 2026/02/28 13:55:39'))
    assert.ok(source.includes('updateTime: 2026/10/09 18:07:00'))
    assert.equal((source.match(/!\[/g) || []).length, 1)
    assert.ok(source.includes('https://image.ermao.net/images/blog/shadowrocket-rules-config/20260228_135641-134ec6.png'))
    for (const route of ['posts/vpn/', 'article/z747kgjd/', 'blog/freeappleid/', 'blog/asspp-download-guide/', 'blog/how-to-vpn-on-mobile/', 'blog/how-to-vpn-on-computer/']) {
      assert.ok(source.includes(`](${prefix}${route})`), route)
    }
    assert.ok(source.includes('https://johnshall.github.io/Shadowrocket-ADBlock-Rules-Forever/lazy_group.conf'))
  }
  assert.ok(en.includes('translationOf: /blog/shadowrocket-rules-config/'))
})
