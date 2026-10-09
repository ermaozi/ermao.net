import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const guide = read('docs/blog/文档/如何选择机场.md')

test('Selection guide distinguishes sources and retained self-testing from site-wide claims', () => {
  assert.match(guide, /不代表每家都经过一周实测/)
  assert.match(guide, /以对应文章列出的记录为准/)
  assert.match(guide, /资料整理或初步体验/)
  assert.match(guide, /\]\(\/review-methodology\/\)/)
  assert.doesNotMatch(guide, /至少7天实测|至少由我试用一周|规避\s*90%\s*的风险|时间是检验稳定性的唯一标准|保证访问国内网站|属于正常拥堵|说明该机场超售严重/)
  for (const section of ['三天评估法', '第一阶段：连通性与延迟', '第二阶段：速度与流媒体体验', '第三阶段：晚高峰稳定性']) assert.ok(guide.includes(section))
  assert.match(guide, /三天自测只能反映这段时间的体验/)
  assert.match(guide, /href="\/posts\/vpn\/#airport-comparison"/)
})

test('Existing desktop and Android links reach comparison with subscription context', () => {
  for (const filename of ['windows下载安装clash.md', 'Android手机使用clash.md']) {
    const source = read(`docs/blog/翻墙工具/${filename}`)
    assert.equal((source.match(/\]\(\/posts\/vpn\/#airport-comparison\)/g) || []).length, 1)
    assert.match(source, /对比机场套餐与风险，并核对 Clash(?: Meta)? 订阅兼容性/)
    assert.doesNotMatch(source, /\]\((?:https:\/\/www\.ermao\.net)?\/posts\/vpn\)/)
  }
  const ios = read('docs/blog/翻墙工具/Shadowrocket新手使用教程.md')
  assert.match(ios, /\/posts\/vpn\/#ios-subscription/)
})
