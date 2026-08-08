import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const root = new URL('../', import.meta.url)

test('async account pools reserve their loading space', async () => {
  for (const path of [
    'docs/blog/翻墙工具/免费AppleID账号.md',
    'docs/en/blog/access-tools/免费AppleID账号.md',
  ]) {
    const source = await readFile(new URL(path, root), 'utf8')
    assert.match(source, /class="account-pool"[^>]+:aria-busy="loading"/)
    assert.match(source, /class="account-grid account-grid-skeleton"/)
    assert.match(source, /\.account-pool\s*{[^}]*min-height: 100vh/s)
  }
})

test('popular rankings mount only after data is ready', async () => {
  const source = await readFile(
    new URL('docs/.vuepress/plugins/stats/client/components/PopularPosts.vue', root),
    'utf8',
  )
  assert.match(source, /v-if="canShow && popularHasLoaded"/)
  assert.match(source, /const selectTab = async/)
  assert.doesNotMatch(source, /<div v-if="loading"/)
  assert.doesNotMatch(source, /catch \(e\) \{\s*(popular|liked)Posts\.value = \[\]/)
})

test('engagement errors remain announced without changing layout', async () => {
  const source = await readFile(
    new URL('docs/.vuepress/plugins/stats/client/components/ArticleLikeButton.vue', root),
    'utf8',
  )
  assert.match(source, /class="like-error" role="status"/)
  assert.match(source, /\.like-error\s*{[^}]*position: absolute[^}]*clip-path: inset\(50%\)/s)
})

test('post pages reserve the client-discovered local navigation row', async () => {
  const source = await readFile(new URL('docs/.vuepress/styles/index.css', root), 'utf8')
  assert.match(source, /max-width: 959px[\s\S]*margin-top: 49px/)
  assert.match(source, /min-width: 960px[\s\S]*max-width: 1119px[\s\S]*margin-top: 48px/)
})
