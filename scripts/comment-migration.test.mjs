import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolveComment, readDiscussion, pathnameTerm, SOURCE, TARGET } from '../docs/.vuepress/utils/comment-migration.mjs'
const routes = JSON.parse(readFileSync(new URL('../docs/.vuepress/data/comment-routes.json', import.meta.url)))
const discussion = (repo, number, anchor) => ({ url: `https://github.com/${repo}/discussions/${number}`, comments: anchor ? [{ url: `https://github.com/${repo}/discussions/${number}#discussioncomment-${anchor}` }] : [] })
test('all 70 baseline paths use the actual primary; duplicate VPN and scam threads stay separate', () => {
  assert.equal(Object.keys(routes).length, 70)
  assert.equal(routes['posts/vpn/'].source, 21)
  assert.equal(routes['scamvpn/jichang-paolu-huizong/'].source, 207)
  assert.equal(pathnameTerm('/posts/vpn/'), 'posts/vpn/')
  assert.equal(pathnameTerm('/'), 'index')
  assert.equal(pathnameTerm('/article/example.html'), 'article/example')
})
test('source General still loads by number, ignoring the changing category', async () => {
  const calls = []
  const result = await resolveComment('posts/vpn/', routes['posts/vpn/'], {}, async (repo, query) => {
    calls.push(query)
    return discussion(repo, 21)
  })
  assert.equal(result.repo, SOURCE.repo)
  assert.equal(result.term, '21')
  assert.equal(result.mapping, 'number')
  assert.deepEqual(calls, [{ number: '21', first: '1' }])
})
test('pilot target #2 cannot replace the primary VPN thread', async () => {
  const result = await resolveComment('posts/vpn/', routes['posts/vpn/'], {}, async repo => repo === SOURCE.repo ? null : discussion(repo, 2, 10894502))
  assert.equal(result, null)
})
test('a native move is found before registry publication, including General', async () => {
  const entry = routes['posts/vpn/']
  const result = await resolveComment('posts/vpn/', entry, {}, async repo => repo === SOURCE.repo ? null : discussion(repo, 80, entry.anchor))
  assert.equal(result.repo, TARGET.repo)
  assert.equal(result.term, '80')
})
test('verified exact registry mapping wins even when strict search returns a duplicate', async () => {
  const entry = routes['posts/vpn/']
  const result = await resolveComment('posts/vpn/', entry, { 21: 80 }, async (repo, query) => {
    assert.equal(query.number, '80')
    return discussion(repo, 80, entry.anchor)
  })
  assert.equal(result.term, '80')
})
test('missing known thread never permits creating a replacement', async () => {
  assert.equal(await resolveComment('posts/vpn/', routes['posts/vpn/'], {}, async () => null), null)
})
test('network errors do not masquerade as an absent source thread', async () => {
  await assert.rejects(resolveComment('posts/vpn/', routes['posts/vpn/'], {}, async () => { throw new Error('429') }), /429/)
})
test('new article first checks for late source comments, otherwise creates in target', async () => {
  let result = await resolveComment('new/', undefined, {}, async repo => repo === SOURCE.repo ? discussion(repo, 300) : null)
  assert.equal(result.repo, SOURCE.repo)
  assert.equal(result.term, '300')
  result = await resolveComment('new/', undefined, {}, async () => null)
  assert.equal(result.repo, TARGET.repo)
  assert.equal(result.mapping, 'pathname')
})

test('only the observed numbered NOT_FOUND error is treated as a move', async () => {
  const fetchBefore = globalThis.fetch
  try {
    globalThis.fetch = async () => new Response(JSON.stringify({ error: 'Could not resolve to a Discussion with the number of 3.' }), { status: 500 })
    assert.equal(await readDiscussion(SOURCE.repo, { number: '3' }), null)
    await assert.rejects(readDiscussion(SOURCE.repo, { number: '21' }), /500/)
    globalThis.fetch = async () => new Response(JSON.stringify({ error: 'Bad credentials' }), { status: 500 })
    await assert.rejects(readDiscussion(SOURCE.repo, { number: '3' }), /500/)
  } finally { globalThis.fetch = fetchBefore }
})
