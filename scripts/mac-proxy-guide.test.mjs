import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import matter from 'gray-matter'

const paths = {
  zh: 'docs/blog/翻墙工具/ClashVergeRev安装与使用指南.md',
  en: 'docs/en/blog/access-tools/ClashVergeRev安装与使用指南.md',
  vpnZh: 'docs/blog/机场推荐/vpn.md',
  vpnEn: 'docs/en/blog/proxy-reviews/vpn.md',
}
const pages = Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')]))
const urls = text => [...text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map(match => match[1])
const officialSources = [
  'https://www.clashverge.dev/install.html',
  'https://www.clashverge.dev/guide/term.html',
  'https://www.clashverge.dev/uninstall.html',
  'https://github.com/clash-verge-rev/clash-verge-rev/releases/tag/v2.5.8',
  'https://github.com/clash-verge-rev/clash-verge-rev/blob/v2.5.8/src/components/shared/proxy-control-switches.tsx',
  'https://support.apple.com/zh-cn/102445',
  'https://wiki.metacubex.one/config/inbound/tun/',
]

test('macOS guide identities, original dates, mirror URLs, and comparison navigation are preserved', () => {
  const zh = matter(pages.zh).data
  const en = matter(pages.en).data
  assert.equal(zh.title, 'macOS ClashVergeRev 安装与使用指南')
  assert.equal(zh.permalink, '/article/6vxkmmuh/')
  assert.equal(en.title, 'Install and Use Clash Verge Rev on macOS')
  assert.equal(en.permalink, '/en/article/6vxkmmuh/')
  assert.equal(en.translationOf, zh.permalink)
  assert.equal(en.lang, 'en-US')
  for (const data of [zh, en]) assert.equal(data.createTime, '2025/01/22 22:50:41')
  for (const source of [pages.zh, pages.en]) {
    for (const url of ['https://github.com/Clash-Verge-rev/clash-verge-rev/releases', 'https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Mac.x64.dmg', 'https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Mac.aarch64.dmg']) assert.ok(urls(source).includes(url), url)
  }
  assert.ok(urls(pages.zh).includes('https://www.ermao.net/posts/vpn'))
  assert.ok(urls(pages.en).includes('/en/posts/vpn/'))
})

test('both guides link the official evidence and distinguish mirrors from official releases', () => {
  for (const source of [pages.zh, pages.en]) for (const url of officialSources) assert.ok(urls(source).includes(url), url)
  assert.match(pages.zh, /macOS 12 及以上系统/)
  assert.match(pages.en, /macOS 12 or later/)
  assert.match(pages.zh, /镜像，不是上游官方发布渠道/)
  assert.match(pages.en, /mirrors, not upstream release channels/)
})

test('capture scope is distinct from outbound choice in both languages', () => {
  assert.match(pages.zh, /仅影响遵循 macOS 系统代理设置的应用/)
  assert.match(pages.en, /affects only apps that honor the macOS system proxy settings/)
  assert.match(pages.zh, /实际范围受路由和排除项等配置影响/)
  assert.match(pages.en, /Coverage depends on routes and exclusions/)
  assert.match(pages.zh, /独立开关，并非软件规定必须二选一/)
  assert.match(pages.en, /independent switches, not inherently mutually exclusive/)
  assert.match(pages.zh, /选择直连时仍为直连/)
  assert.match(pages.en, /a direct selection remains direct/)
  assert.doesNotMatch(pages.zh, /所有流量都通过代理|所有网络流量将通过|TUN 模式和系统代理模式不能同时启用/)
  assert.doesNotMatch(pages.en, /Sends all supported traffic through the proxy|The source guide advises choosing either/)
})

test('installation does not instruct bypassing security checks', () => {
  assert.match(pages.zh, /系统设置.*隐私与安全性/)
  assert.match(pages.en, /System Settings > Privacy & Security/)
  assert.match(pages.zh, /不要强行打开/)
  assert.match(pages.en, /do not force it open/)
  for (const source of [pages.zh, pages.en]) {
    assert.doesNotMatch(source, /(?:sudo\s+)?(?:spctl|xattr)\b|点击[“"]仍然打开|use \*\*Open Anyway\*\*|```(?:sh|bash|shell)/)
  }
})

test('uninstall backs up data and removes an installed service before removing the app', () => {
  const zh = pages.zh.split('## 6. 卸载')[1]
  const en = pages.en.split('## 6. Uninstall')[1]
  assert.match(zh, /仅把应用移到废纸篓不等于卸载服务/)
  assert.match(en, /moving the app to Trash alone does not uninstall it/)
  assert.match(zh, /先备份.*关闭系统代理和 TUN/)
  assert.match(en, /Back up subscriptions.*disable System Proxy and TUN/)
  assert.ok(zh.indexOf('uninstall-service') < zh.indexOf('移到废纸篓。先保留'))
  assert.ok(en.indexOf('uninstall-service') < en.indexOf('from **Applications** to **Trash**'))
  for (const text of [zh, en]) assert.doesNotMatch(text, /rm -rf|清空废纸篓|Empty the Trash/)
})

test('the DNS release note remains version- and symptom-specific', () => {
  for (const source of [pages.zh, pages.en]) assert.match(source, /114\.114\.114\.114/)
  assert.match(pages.zh, /这一修复不代表所有断网或 DNS 故障都有同一原因/)
  assert.match(pages.en, /This does not establish the cause of every connectivity or DNS failure/)
})

test('VPN guide global-mode claims have the same capture and encryption limitations', () => {
  assert.match(pages.vpnZh, /已被客户端接管的流量.*不会自动接管所有应用.*不保证全设备流量均已加密/)
  assert.match(pages.vpnEn, /captured traffic uses the selected global outbound.*does not automatically capture every app or guarantee encryption of all device traffic/)
  assert.doesNotMatch(pages.vpnZh, /所有流量走代理，适合需要全程加密的场景/)
  assert.doesNotMatch(pages.vpnEn, /Sends all supported traffic through the proxy/)
  assert.ok(urls(pages.vpnZh).includes('/article/6vxkmmuh/#_3-代理模式说明'))
  assert.ok(urls(pages.vpnEn).includes('/en/article/6vxkmmuh/#_3-proxy-modes'))
})
