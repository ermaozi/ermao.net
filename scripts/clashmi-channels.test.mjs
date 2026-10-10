import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const links = source => new Set([...source.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map(match => match[1]))
const pages = [
  { source: read('docs/blog/翻墙工具/ios_clashmi使用教程.md'), route: '/blog/clashmi/', mobile: 'iOS / iPadOS', faq: '### 6 无法下载或更新 Clash Mi', title: 'iOS Clash Mi 使用教程（2026最新版）：下载安装、订阅导入与常见问题' },
  { source: read('docs/en/blog/access-tools/ios_clashmi使用教程.md'), route: '/en/blog/clashmi/', mobile: 'iOS and iPadOS', faq: '### 6) Clash Mi cannot be downloaded or updated', title: "'Clash Mi for iOS: Installation, Subscription Import, and Troubleshooting (2026)'" },
]

for (const { source, route, mobile, faq, title } of pages) {
  test(`${route} assigns App Store and TestFlight to iPhone and iPad`, () => {
    const mobileSection = source.split(`### ${mobile}\n`)[1]?.split('\n### ')[0]
    assert.ok(mobileSection, 'Missing mobile installation section')
    assert.ok(links(mobileSection).has('https://apps.apple.com/us/app/clash-mi/id6744321968'))
    assert.ok(links(mobileSection).has('https://testflight.apple.com/join/bjHXktB3'))
    assert.doesNotMatch(mobileSection, /macOS|Mac 版|Apple-platform|苹果全家桶/)
  })

  test(`${route} has separate official macOS DMG installation and update instructions`, () => {
    for (const [heading, section] of [
      ['installation', source.split('### macOS\n')[1]?.split('\n### ')[0]],
      ['FAQ', source.split(faq + '\n')[1]?.split('\n### ')[0]?.split('#### macOS\n')[1]],
    ]) {
      assert.ok(section, `Missing macOS ${heading} section`)
      assert.match(section, /DMG/)
      assert.match(section, /macOS 12/)
      assert.ok(links(section).has('https://clashmi.app/download#macos'))
      assert.ok(links(section).has('https://clashmi.app/guide/macos'))
      assert.doesNotMatch(section, /Apple ID|App Store|TestFlight/)
    }
    const mobileFaq = source.split(faq + '\n')[1]?.split('\n### ')[0]?.split(`#### ${mobile}\n`)[1]?.split('\n#### ')[0]
    assert.ok(mobileFaq, 'Missing mobile FAQ section')
    assert.match(mobileFaq, /Apple ID/)
    assert.match(mobileFaq, /TestFlight/)
    assert.doesNotMatch(mobileFaq, /macOS/)
    assert.doesNotMatch(source, /### iOS \/ iPadOS \/ macOS|### iOS, iPadOS, and macOS|### 6 iOS\/macOS|### 6\) Clash Mi cannot be downloaded or updated on iOS or macOS/)
  })

  test(`${route} preserves article identity, historical screenshots and conversion links`, () => {
    assert.ok(source.includes(`title: ${title}\n`))
    assert.ok(source.includes(`permalink: ${route}\n`))
    assert.match(source, /createTime: 2026\/03\/05 10:34:23/)
    assert.match(source, /updateTime: 2026\/10\/09 /)
    const imageNames = ['20260305_103545-57abfa.png', '20260305_103743-3935fc.png', '20260305_103809-b1ab1b.png', '20260305_103816-7c1edf.png', '20260305_103836-d45527.png']
    const images = [...source.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1])
    assert.deepEqual(images, imageNames.map(name => `https://image.ermao.net/images/blog/clashmi/${name}`))
    const prefix = route.startsWith('/en/') ? '/en' : ''
    assert.ok(links(source).has(`${prefix}/posts/vpn/#ios-subscription`))
    assert.ok(links(source).has(`${prefix}/posts/vpn/`))
    assert.ok(source.includes(`href="${prefix}/blog/freeappleid/"`))
  })
}
