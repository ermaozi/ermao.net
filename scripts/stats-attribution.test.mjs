import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import { canonicalizeStatsPath } from '../docs/.vuepress/plugins/stats/client/stats-path.js'

const source = await readFile(new URL('../docs/.vuepress/plugins/stats/client/config.js', import.meta.url), 'utf8')
const views = []
let afterEach
const router = {
  isReady: () => Promise.resolve(),
  afterEach: handler => { afterEach = handler },
}
const window = { location: { origin: 'https://www.ermao.net', pathname: '/blog/freeappleid/', search: '' } }
const context = {
  defineClientConfig: config => config,
  useRouter: () => router,
  PageViews: {}, PopularPostsRoot: {}, StatsLayout: {}, FullStatsLayout: {},
  canonicalizeStatsPath, URL, Date, JSON,
  __STATS_WORKER_URL__: '/api/stats',
  document: { referrer: 'https://www.google.com/' },
  window,
  navigator: { userAgent: 'test', language: 'zh-CN' },
  fetch: (_url, options) => { views.push(JSON.parse(options.body)); return Promise.resolve() },
}
runInNewContext(source.replace(/^import .*$/gm, '').replace('export default ', 'globalThis.config = '), context)
context.config.setup()

// Initial navigation has no matched source route; keep the external referrer.
const initial = { path: '/', fullPath: '/', matched: [] }
const apple = { path: '/blog/freeappleid/', fullPath: '/blog/freeappleid/', matched: [{}] }
afterEach(apple, initial)
await Promise.resolve()
assert.equal(views.length, 1)
assert.equal(views[0].referrer, 'https://www.google.com/')

const vpn = { path: '/posts/vpn/', fullPath: '/posts/vpn/#ios-subscription', matched: [{}] }
afterEach(vpn, apple)
assert.equal(views.length, 2)
assert.equal(views[1].path, '/posts/vpn/')
assert.equal(views[1].referrer, 'https://www.ermao.net/blog/freeappleid/')
afterEach({ ...vpn, fullPath: '/posts/vpn/#airport-comparison' }, vpn)
assert.equal(views.length, 2)

const tutorial = { path: '/en/article/z747kgjd/', fullPath: '/en/article/z747kgjd/', matched: [{}] }
afterEach(tutorial, vpn)
assert.equal(views.length, 3)
assert.equal(views[2].path, '/article/z747kgjd/')
assert.equal(views[2].referrer, 'https://www.ermao.net/posts/vpn/')

console.log('统计来源检查通过：外部首访、站内导流、锚点去重和双语路径。')
