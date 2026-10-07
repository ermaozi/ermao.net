import assert from 'node:assert/strict'
import test from 'node:test'
import buildRevisionPlugin, { resolveBuildRevision } from '../docs/.vuepress/plugins/build-revision.ts'
const SHA = '6add12d63e379b7d84c1bf3b3cfb0a6c0c25f9f0'
test('CI commit is authoritative and normalized', () => {
  assert.equal(resolveBuildRevision({ GITHUB_SHA: SHA.toUpperCase() }, () => { throw new Error('must not run git') }), SHA)
})
test('invalid CI revision fails instead of weakening the gate', () => {
  assert.throws(() => resolveBuildRevision({ GITHUB_SHA: 'main' }), /Invalid GITHUB_SHA/)
})
test('local Git checkout uses its exact commit', () => {
  assert.equal(resolveBuildRevision({}, () => `${SHA}\n`), SHA)
})
test('downloaded source is not identified as a production release', () => {
  assert.equal(resolveBuildRevision({}, () => { throw new Error('no .git') }), 'local-development')
  assert.equal(resolveBuildRevision({}, () => 'not-a-sha'), 'local-development')
})
test('every page gets exactly one revision while existing metadata is preserved', () => {
  const canonical = ['link', { rel: 'canonical', href: 'https://www.ermao.net/' }]
  const page = { frontmatter: { head: [canonical, ['meta', { name: 'ermao:build-revision', content: 'old' }]] } }
  const plugin = buildRevisionPlugin(SHA)
  plugin.extendsPage(page)
  plugin.extendsPage(page)
  assert.deepEqual(page.frontmatter.head, [canonical, ['meta', { name: 'ermao:build-revision', content: SHA }]])
  const empty = { frontmatter: {} }
  plugin.extendsPage(empty)
  assert.equal(empty.frontmatter.head[0][1].content, SHA)
})
