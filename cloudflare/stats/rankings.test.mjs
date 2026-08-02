import assert from 'node:assert/strict'
import { test } from 'node:test'
import { DatabaseSync } from 'node:sqlite'
import handler from './worker.js'

class D1Database {
  constructor(db) {
    this.db = db
    this.queryCount = 0
    this.queries = []
  }

  prepare(sql) {
    const owner = this
    const db = this.db
    let values = []
    return {
      bind(...params) {
        values = params
        return this
      },
      async all() {
        owner.queryCount++
        owner.queries.push({ sql, values: [...values] })
        return { results: db.prepare(sql).all(...values) }
      }
    }
  }
}

test('rankings return the top 15 and popular excludes non-articles', async () => {
  const db = new DatabaseSync(':memory:')
  db.exec(`
    CREATE TABLE views (path TEXT, ts INTEGER);
    CREATE TABLE article_like_counts (path TEXT, count INTEGER, updated_at INTEGER);
  `)

  const now = Date.now()
  const addView = db.prepare('INSERT INTO views (path, ts) VALUES (?, ?)')
  const addLikes = db.prepare('INSERT INTO article_like_counts VALUES (?, ?, ?)')
  for (let rank = 1; rank <= 20; rank++) {
    const path = `/article/post-${rank}/`
    for (let count = 0; count < rank; count++) addView.run(path, now)
    addLikes.run(path, rank, now)
  }
  for (let count = 0; count < 50; count++) addView.run('/', now)
  for (let count = 0; count < 40; count++) addView.run('/stats/', now)

  const env = { VIEWS_DB: new D1Database(db) }
  const ctx = { waitUntil() {} }
  const popular = await handler.fetch(new Request('https://www.ermao.net/api/stats/popular'), env, ctx).then(response => response.json())
  const likes = await handler.fetch(new Request('https://www.ermao.net/api/stats/likes/top?limit=15'), env, ctx).then(response => response.json())

  assert.equal(popular.length, 15)
  assert.equal(likes.length, 15)
  assert.equal(popular[0].path, '/article/post-20/')
  assert.ok(popular.every(item => item.path.startsWith('/article/')))
})

test('engagement batches multiple article counters into one D1 query', async () => {
  const db = new DatabaseSync(':memory:')
  db.exec(`
    CREATE TABLE page_counts (path TEXT PRIMARY KEY, count INTEGER);
    CREATE TABLE article_like_counts (path TEXT PRIMARY KEY, count INTEGER, updated_at INTEGER);
    CREATE TABLE article_likes (
      path TEXT,
      visitor_hash TEXT,
      like_day TEXT,
      UNIQUE(path, visitor_hash, like_day)
    );
    INSERT INTO page_counts VALUES ('/article/one/', 3), ('/en/article/one/', 4), ('/article/two/', 5);
    INSERT INTO article_like_counts VALUES ('/article/one/', 2, 0), ('/article/two/', 1, 0);
  `)

  const d1 = new D1Database(db)
  const response = await handler.fetch(new Request('https://www.ermao.net/api/stats/engagement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://www.ermao.net',
      'X-Ermao-Visitor': '123456789012345678901234'
    },
    body: JSON.stringify({ paths: ['/article/one/', '/article/two/'] })
  }), {
    VIEWS_DB: d1,
    LIKE_ID_SECRET: '12345678901234567890123456789012'
  }, { waitUntil() {} })
  const data = await response.json()

  assert.equal(response.status, 200)
  assert.equal(d1.queryCount, 1)
  assert.deepEqual(data.items.map(item => [item.path, item.views, item.count]), [
    ['/article/one/', 7, 2],
    ['/article/two/', 5, 1]
  ])
})

test('historical stats keep daily buckets and fill gaps in one D1 query', async () => {
  const db = new DatabaseSync(':memory:')
  db.exec(`
    CREATE TABLE views (
      path TEXT,
      ts INTEGER,
      country TEXT,
      browser TEXT,
      ua TEXT,
      ref TEXT
    );
    CREATE INDEX idx_views_ts ON views(ts);
    CREATE TABLE daily_stats (
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      count INTEGER DEFAULT 0,
      PRIMARY KEY (date, type, name)
    );
  `)

  const dayStart = Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate()
  )
  const secondAggregatedDay = new Date(dayStart - 3 * 86400000).toISOString().slice(0, 10)
  const aggregatedDay = new Date(dayStart - 2 * 86400000).toISOString().slice(0, 10)
  const insertView = db.prepare('INSERT INTO views VALUES (?, ?, ?, ?, ?, ?)')
  for (let index = 0; index < 3; index++) {
    insertView.run('/article/aggregated/', dayStart - 2 * 86400000 + index, 'US', 'Chrome', '', 'direct')
  }
  for (let index = 0; index < 2; index++) {
    insertView.run('/article/missing/', dayStart - 86400000 + index, 'JP', 'Firefox', '', 'direct')
  }
  insertView.run('/article/today/', dayStart + 1, 'SG', 'Safari', '', 'direct')

  const insertDaily = db.prepare('INSERT INTO daily_stats VALUES (?, ?, ?, ?)')
  insertDaily.run(secondAggregatedDay, 'path', '/article/older/', 4)
  insertDaily.run(secondAggregatedDay, 'country', 'DE', 4)
  insertDaily.run(secondAggregatedDay, 'browser', 'Edge', 4)
  insertDaily.run(secondAggregatedDay, 'ref', 'direct', 4)
  insertDaily.run(secondAggregatedDay, 'total', 'total', 4)
  insertDaily.run(aggregatedDay, 'path', '/article/aggregated/', 3)
  insertDaily.run(aggregatedDay, 'country', 'US', 3)
  insertDaily.run(aggregatedDay, 'browser', 'Chrome', 3)
  insertDaily.run(aggregatedDay, 'ref', 'direct', 3)
  insertDaily.run(aggregatedDay, 'total', 'total', 3)

  const d1 = new D1Database(db)
  const response = await handler.fetch(
    new Request('https://www.ermao.net/stats/api?period=7d'),
    { VIEWS_DB: d1 },
    { waitUntil() {} }
  )
  const data = await response.json()

  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'private, no-store')
  assert.equal(data.total, 10)
  assert.equal(data.meta.source, 'hybrid')
  assert.equal(d1.queryCount, 1)
  const series = new Map(data.timeSeries.map(item => [item.label, item.count]))
  assert.equal(series.get(secondAggregatedDay), 4)
  assert.equal(series.get(aggregatedDay), 3)
  const plan = db.prepare(`EXPLAIN QUERY PLAN ${d1.queries[0].sql}`).all(...d1.queries[0].values)
  assert.ok(plan.some(row => String(row.detail).includes('idx_views_ts')))
})

test('private reports use the protected route without exposing legacy or alternate hosts', async () => {
  const ctx = { waitUntil() {} }
  const privateResponse = await handler.fetch(
    new Request('https://www.ermao.net/stats/api?period=24h'),
    {},
    ctx
  )
  const legacyResponse = await handler.fetch(
    new Request('https://www.ermao.net/api/stats?period=24h'),
    {},
    ctx
  )
  const alternateHostResponse = await handler.fetch(
    new Request('https://views.ermao.net/stats/api?period=24h'),
    {},
    ctx
  )
  const legacyWorkerResponse = await handler.fetch(
    new Request('https://views.ermao.net/stats?period=24h'),
    {},
    ctx
  )
  const writeResponse = await handler.fetch(
    new Request('https://www.ermao.net/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/article/example/' })
    }),
    {},
    ctx
  )

  assert.equal(privateResponse.status, 500)
  assert.equal(legacyResponse.status, 404)
  assert.equal(alternateHostResponse.status, 404)
  assert.equal(legacyWorkerResponse.status, 404)
  assert.equal(writeResponse.status, 500)
})
