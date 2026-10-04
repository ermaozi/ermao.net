import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import handler from '../cloudflare/stats/worker.js'
import { validToolEvent } from '../data/tool-events.js'

const request = (body, headers = {}) => new Request('https://www.ermao.net/api/stats/events', {
  method: 'POST', headers: { Origin: 'https://www.ermao.net', 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body),
})
const valid = { surface: 'vpn', event: 'selector_click' }

test('event route persists only UTC daily fixed counters, including repeated requests', async () => {
  const db = new DatabaseSync(':memory:')
  db.exec(await readFile(new URL('../cloudflare/stats/tool-events.sql', import.meta.url), 'utf8'))
  const env = { VIEWS_DB: { prepare: sql => ({ bind: (...args) => ({ run: () => db.prepare(sql).run(...args) }) }) } }
  for (let i = 0; i < 2; i++) assert.equal((await handler.fetch(request(valid, { Cookie: 'secret', Referer: 'https://www.ermao.net/?token=secret', 'CF-Connecting-IP': '1.2.3.4' }), env, {})).status, 204)
  const rows = db.prepare('SELECT * FROM tool_event_daily').all()
  assert.deepEqual(JSON.parse(JSON.stringify(rows)), [{ day: new Date().toISOString().slice(0, 10), ...valid, count: 2 }])
  assert.equal((await handler.fetch(new Request('https://www.ermao.net/api/stats/events'), env, {})).status, 405)
  db.close()
})

test('rejects arbitrary fields, event names, origins, large bodies and unavailable storage', async () => {
  assert.equal((await handler.fetch(request(valid), {}, {})).status, 503)
  for (const body of [{ ...valid, url: '?token=secret' }, { ...valid, event: 'user-search' }, { surface: '__proto__', event: 'x' }, null, []]) {
    assert.equal((await handler.fetch(request(body), {}, {})).status, 400)
  }
  assert.equal((await handler.fetch(request(valid, { Origin: 'https://evil.test' }), {}, {})).status, 403)
  assert.equal((await handler.fetch(request({ ...valid, input: 'a'.repeat(300) }), {}, {})).status, 413)
  assert.equal((await handler.fetch(request(valid, { 'Content-Type': 'text/plain' }), {}, {})).status, 415)
  assert.equal((await handler.fetch(request(valid, { DNT: '1' }), {}, {})).status, 204)
})

test('browser delegation omits identifiers, dedupes clicks, supports change and cleanup, suppresses previews', async () => {
  const source = await readFile(new URL('../docs/.vuepress/utils/tool-analytics.js', import.meta.url), 'utf8')
  const listeners = new Map(), calls = []
  class Element {
    constructor(event) { this.event = event }
    closest() { return this }
    matches() { return false }
    getAttribute(name) { return name === 'data-tool-event' ? this.event : 'selector' }
  }
  const context = {
    validToolEvent, URL, Element, Date, JSON,
    window: { location: { hostname: 'www.ermao.net', origin: 'https://www.ermao.net' } }, navigator: {},
    __STATS_WORKER_URL__: '/api/stats',
    document: { addEventListener: (type, fn) => listeners.set(type, fn), removeEventListener: type => listeners.delete(type) },
    fetch: (...args) => { calls.push(args); return Promise.resolve() },
  }
  runInNewContext(source.replace(/^import .*$/gm, '').replace('export function ', 'function ') + '\nglobalThis.install = installToolAnalytics', context)
  const stop = context.install()
  const secondStop = context.install()
  secondStop()
  assert.equal(listeners.size, 3)
  const click = { target: new Element('tutorial_click'), type: 'click' }
  listeners.get('click')(click)
  listeners.get('click')(click)
  assert.equal(calls.length, 1)
  const [url, options] = calls[0]
  assert.equal(url, 'https://www.ermao.net/api/stats/events')
  assert.deepEqual(JSON.parse(options.body), { surface: 'selector', event: 'tutorial_click' })
  assert.equal(options.credentials, 'omit'); assert.equal(options.referrerPolicy, 'no-referrer')
  listeners.get('click')({ target: new Element('filter_change'), type: 'click' })
  assert.equal(calls.length, 1)
  listeners.get('change')({ target: new Element('filter_change'), type: 'change' })
  assert.equal(calls.length, 2)
  // Browser keyboard activation and modifier/new-tab activation dispatch clicks.
  listeners.get('click')({ target: new Element('provider_click'), type: 'click', detail: 0 })
  assert.equal(calls.length, 3)
  listeners.get('auxclick')({ target: new Element('compare_click'), type: 'auxclick', button: 1 })
  assert.equal(calls.length, 4)
  listeners.get('auxclick')({ target: new Element('reset'), type: 'auxclick', button: 2 })
  assert.equal(calls.length, 4)
  listeners.get('click')({ target: new Element('tutorial_click'), type: 'click', ctrlKey: true })
  assert.equal(calls.length, 5)
  context.fetch = () => Promise.reject(new Error('offline'))
  listeners.get('click')({ target: new Element('reset'), type: 'click' })
  await Promise.resolve()
  stop(); assert.equal(listeners.size, 0)
  // The real VuePress bundle receives a string containing literal quote marks.
  context.__STATS_WORKER_URL__ = '"/api/stats"'
  context.fetch = (...args) => { calls.push(args); return Promise.resolve() }
  const stopQuoted = context.install()
  listeners.get('click')(click)
  assert.equal(calls.at(-1)[0], 'https://www.ermao.net/api/stats/events')
  assert.equal(calls.length, 6)
  stopQuoted()
  context.window.location.hostname = 'localhost'; context.install(); assert.equal(listeners.size, 0)
  context.window.location.hostname = 'www.ermao.net'; context.navigator.globalPrivacyControl = true
  context.install(); assert.equal(listeners.size, 0)
})
