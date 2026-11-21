import { parseSiteFrontmatter } from './site-frontmatter.mjs'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { execFileSync } from 'node:child_process'
import { parseSiteDateTime, toIsoDate, validateSiteDates } from '../data/site-date.mjs'

test('Shanghai local dates and explicit ISO offsets represent the same instant', () => {
  for (const value of ['2026/11/21 13:25:22', '2026-11-21 13:25:22', '2026-11-21T13:25:22+08:00', '2026-11-21T05:25:22Z', '2026-11-21T00:25:22-05:00']) {
    assert.equal(toIsoDate(value), '2026-11-21T05:25:22.000Z', value)
    assert.equal(+parseSiteDateTime(value), Date.parse('2026-11-21T05:25:22Z'))
  }
  assert.equal(toIsoDate(new Date('2026-11-21T13:25:22+08:00')), '2026-11-21T05:25:22.000Z')
  assert.equal(toIsoDate('2024/2/29 1:2:3'), '2024-02-28T17:02:03.000Z')
  assert.equal(toIsoDate('2026-11-21T05:25:22.123Z'), '2026-11-21T05:25:22.123Z')
})

test('Reject calendar rollover, invalid time/offset and ambiguous input', () => {
  for (const value of ['', null, undefined, '2025/2/29 12:00:00', '2026/4/31 12:00:00', '2026/0/1 12:00:00', '2026/13/1 12:00:00', '2026/1/0 12:00:00', '2026/1/1 24:00:00', '2026/1/1 12:60:00', '2026/1/1 12:00:60', '2026-11-21T12:00:00+24:00', '2026-11-21T12:00:00+08:60', 'November 21 2026', '2026-11-21']) {
    assert(Number.isNaN(+parseSiteDateTime(value)), String(value))
    assert.equal(toIsoDate(value), undefined, String(value))
  }
})

test('JSON-LD normalization is independent of build machine timezone', () => {
  const code = "import {toIsoDate} from './data/site-date.mjs'; console.log(toIsoDate('2026/11/21 13:25:22'))"
  for (const TZ of ['UTC', 'Asia/Shanghai', 'America/New_York']) {
    assert.equal(execFileSync(process.execPath, ['--input-type=module', '-e', code], {env: {...process.env, TZ}, encoding: 'utf8'}).trim(), '2026-11-21T05:25:22.000Z')
  }
})

test('Audit rejects future, invalid and reversed dates using normalized instants', () => {
  const now = new Date('2026-11-22T00:00:00Z')
  const valid = {createTime: '2026/11/21 13:25:22', updateTime: '2026-11-21T05:25:22Z'}
  assert.deepEqual(validateSiteDates(valid, now), [])
  assert.deepEqual(validateSiteDates({}, now), [])
  for (const [values, type] of [
    [{...valid, createTime: '2026/2/30 12:00:00'}, 'invalid-create-time'],
    [{...valid, updateTime: 'bad'}, 'invalid-update-time'],
    [{createTime: '2026-11-23T00:00:00Z'}, 'future-create-time'],
    [{...valid, updateTime: '2026-11-23T00:00:00Z'}, 'future-update-time'],
    [{...valid, updateTime: '2026-11-21T05:25:21Z'}, 'update-before-create-time'],
  ]) assert(validateSiteDates(values, now).some(issue => issue.type === type), type)
})

test('YAML preserves unquoted ISO dates for strict validation without changing other safe types', () => {
  const good = parseSiteFrontmatter('---\ncreateTime: 2026-11-21T13:25:22+08:00\nupdateTime: "2026-11-21T05:25:22Z"\ndate: 2026-07-28\nenabled: true\norder: 7\ntags: [one, two]\n---\nbody')
  assert.equal(good.data.createTime, '2026-11-21T13:25:22+08:00')
  assert.equal(toIsoDate(good.data.createTime), '2026-11-21T05:25:22.000Z')
  assert.deepEqual(validateSiteDates(good.data, new Date('2026-11-22T00:00:00Z')), [])
  assert.equal(good.data.date.toISOString(), '2026-07-28T00:00:00.000Z')
  assert.equal(good.data.enabled, true)
  assert.equal(good.data.order, 7)
  assert.deepEqual(good.data.tags, ['one', 'two'])
  assert.equal(good.content.trim(), 'body')
  const bad = parseSiteFrontmatter('---\ncreateTime: 2026-02-30T12:00:00+08:00\n---\n')
  assert.equal(bad.data.createTime, '2026-02-30T12:00:00+08:00')
  assert.equal(validateSiteDates(bad.data)[0].type, 'invalid-create-time')
})
