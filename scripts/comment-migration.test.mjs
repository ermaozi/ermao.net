import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { selectComment, pathnameTerm, SOURCE, TARGET } from '../docs/.vuepress/utils/comment-migration.mjs'
const routes = JSON.parse(readFileSync(new URL('../docs/.vuepress/data/comment-routes.json', import.meta.url)))
test('all baseline paths retain their measured primary, including both duplicate paths', () => {
  assert.equal(Object.keys(routes).length, 70)
  assert.equal(routes['posts/vpn/'].source, 21)
  assert.equal(routes['scamvpn/jichang-paolu-huizong/'].source, 207)
  assert.equal(pathnameTerm('/posts/vpn/'), 'posts/vpn/')
  assert.equal(pathnameTerm('/'), 'index')
})
test('General category changes do not alter the exact source number', () => {
  const result = selectComment('posts/vpn/', routes['posts/vpn/'])
  assert.equal(result.repo, SOURCE.repo)
  assert.equal(result.term, '21')
  assert.equal(result.mapping, 'number')
})
test('historical pilot #3 → #2 cannot replace the primary VPN thread', () => {
  const result = selectComment('posts/vpn/', routes['posts/vpn/'], { 3: 2 })
  assert.equal(result.repo, SOURCE.repo)
  assert.equal(result.term, '21')
})
test('the audited exact target number survives other transferred duplicates', () => {
  const result = selectComment('posts/vpn/', routes['posts/vpn/'], { 3: 2, 21: 80, 9: 81 })
  assert.equal(result.repo, TARGET.repo)
  assert.equal(result.term, '80')
  assert.equal(result.mapping, 'number')
})
test('invalid registry entries never permit creating a substitute discussion', () => {
  for (const target of [null, -1, 0, 2.5, '2', {}, Number.MAX_SAFE_INTEGER+1]) {
    const result = selectComment('posts/vpn/', routes['posts/vpn/'], { 21: target })
    assert.equal(result.repo, SOURCE.repo)
    assert.equal(result.term, '21')
    assert.equal(result.mapping, 'number')
  }
})
test('new articles use the dedicated public repository and original pathname mapping', () => {
  const result = selectComment('new/', undefined)
  assert.equal(result.repo, TARGET.repo)
  assert.equal(result.mapping, 'pathname')
})
test('site code never fetches the same-origin-only Giscus API directly', () => {
  const module = readFileSync(new URL('../docs/.vuepress/utils/comment-migration.mjs', import.meta.url), 'utf8')
  assert.ok(!module.includes('https://giscus.app/api/'))
})
