import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import test from 'node:test'
const paths = ['docs/blog/翻墙工具/免费AppleID账号.md', 'docs/en/blog/access-tools/免费AppleID账号.md']

for (const path of paths) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8')
  const script = source.split('<script setup>')[1].split('</script>')[0].replace(/^import .*$/gm, '')
  const create = fetch => {
    let timeout
    let cleared = false
    let unmount
    const state = { ref: value => ({ value }), onMounted: () => {}, onBeforeUnmount: callback => { unmount = callback }, fetch, AbortController,
      setTimeout: (callback, delay) => { assert.equal(delay, 15000); timeout = callback; return 42 },
      clearTimeout: id => { assert.equal(id, 42); cleared = true }, console: { error: () => {} },
    }
    runInNewContext(script + '\nthis.api = { fetchData, accounts, loading, error, updateTime };', state)
    return { ...state.api, expire: () => timeout(), cleared: () => cleared, unmount: () => unmount() }
  }
  test(`${path}: ordinary empty result completes without exposing any test credentials`, async () => {
    const api = create(async (_url, { signal }) => { assert.ok(signal); return { ok: true, json: async () => ({ accounts: [], updated_at: 'fixture timestamp' }) } })
    await api.fetchData()
    assert.equal(api.loading.value, false)
    assert.equal(api.error.value, '')
    assert.equal(api.accounts.value.length, 0)
    assert.ok(api.cleared())
    assert.match(source, /v-else-if="accounts.length === 0"/)
  })
  test(`${path}: timeout ends the spinner and allows a retry`, async () => {
    const api = create((_url, { signal }) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(Object.assign(new Error('timeout'), { name: 'AbortError' })))))
    const pending = api.fetchData()
    api.expire()
    await pending
    assert.equal(api.loading.value, false)
    assert.match(api.error.value, /超时|timed out/)
    assert.ok(api.cleared())
  })
  test(`${path}: concurrent refreshes share one active request and cannot overwrite newer state`, async () => {
    let calls = 0, resolve
    const api = create(() => { calls++; return new Promise(done => { resolve = done }) })
    const first = api.fetchData()
    await api.fetchData()
    assert.equal(calls, 1)
    resolve({ ok: true, json: async () => ({ accounts: [], updated_at: 'first response' }) })
    await first
    assert.equal(api.updateTime.value, 'first response')
    const retry = api.fetchData()
    assert.equal(calls, 2)
    resolve({ ok: true, json: async () => ({ accounts: [], updated_at: 'retry response' }) })
    await retry
    assert.equal(api.updateTime.value, 'retry response')
  })
  test(`${path}: unmount aborts the request and late responses cannot write state`, async () => {
    let resolve, signal
    const api = create((_url, options) => { signal = options.signal; return new Promise(done => { resolve = done }) })
    const pending = api.fetchData()
    api.unmount()
    assert.equal(signal.aborted, true)
    resolve({ ok: true, json: async () => ({ accounts: [], updated_at: 'late response' }) })
    await pending
    assert.equal(api.updateTime.value, '')
    assert.equal(api.error.value, '')
    assert.equal(api.loading.value, true)
    assert.ok(api.cleared())
    await api.fetchData()
    assert.equal(api.updateTime.value, '')
  })
  test(`${path}: malformed/HTTP-error responses fail safely`, async () => {
    for (const response of [{ ok: false }, { ok: true, json: async () => ({ accounts: 'invalid' }) }, { ok: true, json: async () => ({ accounts: [null] }) }, { ok: true, json: async () => ({ accounts: [{ region: null }] }) }, { ok: true, json: async () => ({ accounts: [{}] }) }, { ok: true, json: async () => ({ accounts: [], updated_at: {} }) }]) {
      const api = create(async () => response)
      await api.fetchData()
      assert.equal(api.loading.value, false)
      assert.ok(api.error.value)
      assert.ok(api.cleared())
    }
  })
}
test('Chinese account-list anchor is preserved and region labels do not promise availability', async () => {
  const source = await readFile(new URL('../docs/blog/翻墙工具/免费AppleID账号.md', import.meta.url), 'utf8')
  assert.match(source, /\{#最新免费外区-apple-id-账号池-实时更新\}/)
  assert.match(source, /标签颜色只区分地区，不代表账号通过了登录检测/)
  assert.doesNotMatch(source, /使用另一个绿色可用状态的账号/)
})
test('Shadowrocket reinstall advice protects local configuration and purchase access', async () => {
  const source = await readFile(new URL('../docs/blog/翻墙工具/Shadowrocket新手使用教程.md', import.meta.url), 'utf8')
  assert.match(source, /不要立即卸载。先导出订阅与配置/)
  assert.match(source, /确认自己的账户能够重新下载/)
})
