// Verify the built site's shared comparison components without contacting third parties.
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const { mkdirSync, writeFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { chromium } = require('playwright')

const port = 4174
const base = `http://127.0.0.1:${port}`
const output = resolve('artifacts/airport-summary')
const delay = ms => new Promise(done => setTimeout(done, ms))

async function main() {
  mkdirSync(output, { recursive: true })
  const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', 'docs/.vuepress/dist'], { stdio: 'ignore' })
  let browser
  const results = []
  try {
    for (let i = 0; ; i++) {
      try { assert.equal((await fetch(base)).status, 200); break }
      catch (error) { if (i === 30) throw error; await delay(200) }
    }
    browser = await chromium.launch({ headless: true })
    for (const language of ['zh', 'en']) {
      for (const width of [320, 390, 719, 720, 960, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 900 } })
        await page.route('**/*', route => route.request().url().startsWith(`${base}/`) ? route.continue() : route.abort())
        for (const kind of ['comparison', 'cards']) {
          const path = `${language === 'en' ? '/en' : ''}/${kind === 'comparison' ? 'posts/vpn/' : 'airport/'}`
          await page.goto(`${base}${path}`, { waitUntil: 'networkidle' })
          await page.locator(kind === 'comparison' ? '.airport-ranking-table' : '.airport-card-grid').waitFor()
          const result = await page.evaluate(() => {
            const errors = []
            const inside = (rect, box) => rect.left >= box.left - 2 && rect.right <= box.right + 2
            const selectors = '.airport-ranking-table td,.airport-ranking-table th,.airport-plan-table td,.airport-plan-table th,.airport-price,.airport-card h3,.airport-detail-meta>*'
            for (const element of document.querySelectorAll(selectors)) {
              const box = element.getBoundingClientRect()
              if (!box.width) continue
              if (element.scrollWidth > element.clientWidth + 2) errors.push({ type: 'element-overflow', text: element.textContent.trim().slice(0, 80) })
              const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
              let node
              while ((node = walker.nextNode())) {
                if (!node.textContent.trim()) continue
                const range = document.createRange()
                range.selectNodeContents(node)
                if ([...range.getClientRects()].some(rect => !inside(rect, box))) errors.push({ type: 'text-outside-cell', text: node.textContent.trim().slice(0, 80) })
              }
            }
            for (const cell of document.querySelectorAll('.airport-ranking-name,.plan-name,td[data-label="周期/类型"],td[data-label="Billing/type"]')) {
              if (getComputedStyle(cell).display === 'grid' && cell.children.length !== 1) errors.push({ type: 'mobile-value-split', text: cell.textContent.trim().slice(0, 80) })
            }
            for (const card of document.querySelectorAll('.airport-card')) {
              const box = card.getBoundingClientRect()
              for (const element of card.querySelectorAll('.airport-price,h3')) {
                if (!inside(element.getBoundingClientRect(), box)) errors.push({ type: 'card-overflow', text: element.textContent.trim().slice(0, 80) })
              }
            }
            return {
              errors,
              documentOverflow: document.documentElement.scrollWidth > innerWidth + 2,
              numbers: [...document.querySelectorAll('.airport-ranking-rank')].map(element => Number(element.textContent)),
              detailNumbers: [...document.querySelectorAll('.airport-detail-rank')].map(element => Number(element.textContent)),
            }
          })
          results.push({ language, width, kind, ...result })
          if (kind === 'comparison') {
            const expected = Array.from({ length: language === 'zh' ? 69 : 68 }, (_, i) => i + 1)
            assert.deepEqual(result.numbers, expected, `${language}/${width}: missing list number`)
            assert.deepEqual(result.detailNumbers, expected, `${language}/${width}: detail numbers disagree`)
            if (language === 'zh') {
              const row = page.locator('.airport-ranking-table tbody tr').filter({ has: page.locator('a[href="#yunjiexian"]') })
              assert.equal(await row.locator('.airport-ranking-rank').innerText(), '69')
              await row.locator('a[href="#yunjiexian"]').click()
              await page.locator('#yunjiexian').waitFor()
              assert.match(await page.locator('#yunjiexian').innerText(), /69\s*云界线/)
              if (width === 1440) await row.screenshot({ path: resolve(output, 'yunjiexian-number.png') })
            }
          }
          if (width === 390 || width === 1440) {
            await page.locator(kind === 'comparison' ? '.airport-ranking-wrap' : '.airport-card-grid').scrollIntoViewIfNeeded()
            await page.evaluate(() => document.documentElement.classList.remove('dark'))
            await page.screenshot({ path: resolve(output, `${language}-${kind}-${width}-light.png`) })
            await page.evaluate(() => document.documentElement.classList.add('dark'))
            await page.screenshot({ path: resolve(output, `${language}-${kind}-${width}-dark.png`) })
          }
        }
        await page.close()
      }
    }
    const failed = results.filter(result => result.documentOverflow || result.errors.length)
    assert.deepEqual(failed, [], 'Comparison components must not overflow at any tested width')
    console.log(`Airport UI: ${results.length} built-page cases passed (320–1440px, Chinese/English); numbered list/detail anchors verified.`)
  } finally {
    writeFileSync(resolve(output, 'results.json'), JSON.stringify(results, null, 2))
    await browser?.close()
    server.kill()
  }
}

main().catch(error => { console.error(error); process.exitCode = 1 })
