// Verify the built site's shared comparison components without contacting third parties.
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const { request } = require('node:http')
const { mkdirSync, writeFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { chromium } = require('playwright')

const port = 4174
const base = `http://127.0.0.1:${port}`
const output = resolve('artifacts/airport-summary')
const delay = ms => new Promise(done => setTimeout(done, ms))
// A HEAD probe avoids leaving a large HTML response unread in Node's fetch parser.
const ready = () => new Promise((resolve, reject) => {
  const req = request(base, { method: 'HEAD' }, res => {
    res.resume()
    res.statusCode === 200 ? resolve() : reject(new Error(`Preview HTTP ${res.statusCode}`))
  })
  req.on('error', reject)
  req.setTimeout(2000, () => req.destroy(new Error('Preview readiness timeout')))
  req.end()
})

async function main() {
  mkdirSync(output, { recursive: true })
  const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', 'docs/.vuepress/dist'], { stdio: 'ignore' })
  let browser
  const results = []
  try {
    for (let i = 0; ; i++) {
      try { await ready(); break }
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
              pageOverflowElements: [...document.querySelectorAll('body *')].filter(element => {
                const rect = element.getBoundingClientRect()
                const style = getComputedStyle(element)
                return rect.width && style.display !== 'none' && style.visibility !== 'hidden' && (rect.right > innerWidth + 2 || rect.left < -2)
              }).slice(-30).map(element => ({ tag: element.tagName, class: element.className, text: element.textContent.trim().slice(0, 80), rect: { left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right } })),
              numbers: [...document.querySelectorAll('.airport-ranking-rank')].map(element => Number(element.textContent)),
              detailNumbers: [...document.querySelectorAll('.airport-detail-rank')].map(element => Number(element.textContent)),
            }
          })
          results.push({ language, width, kind, ...result })
          if (result.documentOverflow || result.errors.length) {
            await page.screenshot({ path: resolve(output, `${language}-${kind}-${width}-failure.png`) })
          }
          assert.equal(await page.locator('a[href="https://t.me/ermaov1"]').count(), 0, 'Unverified Telegram link must not render')
          if (kind === 'comparison') {
            const superbiu = page.locator('.airport-detail-item').filter({ has: page.locator('#superbiu') })
            assert.match(await superbiu.locator('.airport-detail-meta').innerText(), language === 'en' ? /Price unverified/ : /现价待核实/)
            assert.match(await superbiu.locator('.airport-plan-history').innerText(), /2026-02-24/)
            assert.match(await superbiu.locator('.airport-plan-history').innerText(), language === 'en' ? /Current prices and availability are unverified/ : /现价与是否仍在售待核实/)
            assert.equal(await superbiu.locator('.airport-plan-table thead th').nth(1).innerText(), language === 'en' ? 'Historical price' : '历史价')
            assert.equal(await superbiu.locator('.airport-plan-table tbody tr').count(), 4)
            if (width === 390 || width === 1440) await superbiu.screenshot({ path: resolve(output, `${language}-superbiu-history-${width}.png`) })
            const expected = Array.from({ length: language === 'zh' ? 69 : 68 }, (_, i) => i + 1)
            assert.deepEqual(result.numbers, expected, `${language}/${width}: missing list number`)
            assert.deepEqual(result.detailNumbers, expected, `${language}/${width}: detail numbers disagree`)
            if (language === 'zh') {
              const row = page.locator('.airport-ranking-table tbody tr').filter({ has: page.locator('a[href="#yunjiexian"]') })
              assert.equal(await row.locator('.airport-ranking-rank').innerText(), '69')
              await row.locator('a[href="#yunjiexian"]').click()
              await page.locator('#yunjiexian').waitFor()
              assert.match(await page.locator('#yunjiexian').innerText(), /69\s*云界线/)
              const planCounts = await page.evaluate(() => Object.fromEntries(
                ['xsus', '网际快车', 'superbiu', 'runway', 'sogo云'].map(id => {
                  const section = document.getElementById(id).closest('article')
                  const rows = [...section.querySelectorAll('.airport-plan-table tbody tr')]
                  return [id, rows.filter(row => row.cells[3].textContent.includes('不限时流量包')).length]
                }),
              ))
              assert.deepEqual(planCounts, { xsus: 4, 网际快车: 3, superbiu: 4, runway: 1, sogo云: 4 })
              for (const [id, text] of [['极连云', '96元/年 60GB/月'], ['光速云', '99元/年 59GB/月']]) {
                const annual = page.locator('.airport-ranking-table tbody tr').filter({ has: page.locator(`a[href="#${id}"]`) })
                assert.equal(await annual.locator('.airport-ranking-plan').innerText(), text)
              }
              if (width === 1440) await row.screenshot({ path: resolve(output, 'yunjiexian-number.png') })
              if (width === 390) await row.screenshot({ path: resolve(output, 'yunjiexian-mobile.png') })
              if (width === 1440) {
                for (const id of ['xsus', 'shenxing', 'liulianyun', '极连云', '光速云']) {
                  await page.locator('.airport-ranking-table tbody tr').filter({ has: page.locator(`a[href="#${id}"]`) }).screenshot({ path: resolve(output, `${id}-compact-plan.png`) })
                }
              }
            }
          }
          if (width === 390 || width === 1440) {
            await page.locator(kind === 'comparison' ? '.airport-ranking-wrap' : '.airport-card-grid').evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: 'instant' }))
            await page.evaluate(() => { document.documentElement.classList.remove('dark'); document.documentElement.setAttribute('data-theme', 'light') })
            await page.waitForTimeout(600)
            await page.screenshot({ path: resolve(output, `${language}-${kind}-${width}-light.png`) })
            await page.evaluate(() => { document.documentElement.classList.add('dark'); document.documentElement.setAttribute('data-theme', 'dark') })
            await page.waitForTimeout(600)
            await page.screenshot({ path: resolve(output, `${language}-${kind}-${width}-dark.png`) })
          }
        }
        await page.close()
      }
    }
    // Existing guides should take readers straight to the comparison table.
    for (const width of [390, 1440]) {
      for (const [slug, label] of [['choose-good-airport', 'selection'], ['0gematwc', 'desktop'], ['eh8f4n86', 'android']]) {
        const page = await browser.newPage({ viewport: { width, height: 900 } })
        await page.route('**/*', route => route.request().url().startsWith(`${base}/`) ? route.continue() : route.abort())
        await page.goto(`${base}/article/${slug}/`, { waitUntil: 'networkidle' })
        const link = page.locator('a[href="/posts/vpn/#airport-comparison"]').first()
        await link.scrollIntoViewIfNeeded()
        assert.match(await link.innerText(), /套餐.*风险/)
        if (label === 'selection') {
          const text = await page.locator('.vp-doc').innerText()
          assert.match(text, /不代表每家都经过一周实测/)
          assert.match(text, /三天自测只能反映这段时间的体验/)
          assert.doesNotMatch(text, /至少7天实测|至少由我试用一周|规避\s*90%\s*的风险|时间是检验稳定性的唯一标准/)
        } else {
          assert.match(await link.innerText(), /订阅兼容性/)
        }
        const sourceOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2)
        assert.equal(sourceOverflow, false, `${label}/${width}: source page overflows`)
        await page.screenshot({ path: resolve(output, `guide-${label}-${width}.png`) })
        await link.click()
        await page.waitForURL(`${base}/posts/vpn/#airport-comparison`)
        await page.locator('#airport-comparison').waitFor()
        await page.locator('.airport-ranking-table').waitFor()
        await page.waitForFunction(() => {
          const top = document.getElementById('airport-comparison').getBoundingClientRect().top
          return top >= 0 && top < innerHeight / 2
        })
        const documentOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2)
        results.push({ language: 'zh', width, kind: `guide-${label}`, errors: [], documentOverflow })
        await page.goBack({ waitUntil: 'networkidle' })
        await page.waitForURL(`${base}/article/${slug}/`)
        await page.locator('a[href="/posts/vpn/#airport-comparison"]').waitFor()
        assert.equal(await page.locator('a[href="/posts/vpn/#airport-comparison"]').count(), 1)
        await page.close()
      }
    }
    const failed = results.filter(result => result.documentOverflow || result.errors.length)
    assert.deepEqual(failed.map(({ numbers, detailNumbers, ...result }) => result), [], 'Comparison components must not overflow at any tested width')
    console.log(`Airport UI: ${results.length} built-page cases passed (320–1440px, Chinese/English); numbered list/detail anchors and guide navigation verified.`)
  } finally {
    writeFileSync(resolve(output, 'results.json'), JSON.stringify(results, null, 2))
    await browser?.close()
    server.kill()
  }
}

main().catch(error => { console.error(error); process.exitCode = 1 })
