import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import matter from 'gray-matter'
const contracts = JSON.parse(readFileSync(new URL('./tutorial-access-fixtures.json', import.meta.url)))
for (const [route, c] of Object.entries(contracts)) {
  test(`${route}: corrected guidance preserves article identity, deep headings and commercial links`, () => {
    const source = readFileSync(new URL(`../${c.source}`, import.meta.url), 'utf8')
    const { data } = matter(source)
    assert.equal(data.permalink, route)
    assert.ok(source.includes(`title: ${c.title}`))
    assert.ok(source.includes(`createTime: ${c.createTime}`))
    assert.equal(data.updateTime, '2026/10/11 00:55:00')
    assert.deepEqual(source.match(/^#{2,6} .+$/gm), c.headings)
    for (const target of [...c.preservedLinks, ...c.sources]) assert.ok(source.includes(target), target)
    const plain = source.replaceAll('`', '').replace(/\s+/g, '')
    for (const text of c.required) assert.ok(plain.includes(text.replace(/\s+/g, '')), text)
    for (const text of c.forbidden) assert.ok(!plain.includes(text.replace(/\s+/g, '')), text)
    if (route.startsWith('/en/')) assert.equal(data.translationOf, route.replace('/en/', '/'))
  })
}
