// Local-only UI regression; synthetic account data, never live credentials.
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const { mkdirSync, writeFileSync } = require('node:fs')
const { chromium } = require('playwright')
const base = 'http://127.0.0.1:4178'
const out = 'artifacts/audience-task-paths'
async function main() {
  mkdirSync(out, { recursive: true })
  const server = spawn('python3', ['-m', 'http.server', '4178', '--bind', '127.0.0.1', '--directory', 'docs/.vuepress/dist'], { stdio: 'ignore' })
  let browser
  const evidence = []
  try {
    for (let i = 0; ; i++) {
      try { assert.equal((await fetch(base, { method: 'HEAD' })).status, 200); break }
      catch (e) { if (i > 30) throw e; await new Promise(r => setTimeout(r, 200)) }
    }
    browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) })
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      let requests = 0
      await page.route('**/*', async route => {
        const url = route.request().url()
        if (url === 'https://api.ermao.net/get_apple_id') {
          requests++
          await new Promise(r => setTimeout(r, 150))
          return route.fulfill({ status: requests === 1 ? 503 : 200, contentType: 'application/json', body: JSON.stringify({ accounts: [{ region: '测试区', email: 'fixture@example.invalid', password: 'synthetic-only' }], updated_at: '测试数据' }) })
        }
        return url.startsWith(base + '/') ? route.continue() : route.abort()
      })
      await page.goto(base + '/blog/freeappleid/', { waitUntil: 'networkidle' })
      await page.locator('.account-error').waitFor()
      const refresh = page.locator('.refresh-btn')
      assert((await refresh.boundingBox()).height >= 44)
      await refresh.click()
      await refresh.evaluate(el => { el.click(); el.click() })
      await page.locator('.copy-btn').first().waitFor()
      assert.equal(requests, 2, 'refresh should not duplicate an in-flight request')
      const copy = page.locator('.copy-btn').first()
      assert((await copy.boundingBox()).height >= 44)
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('test denial')) } })
        document.execCommand = () => false
      })
      let dialogText = ''
      page.once('dialog', async dialog => { dialogText = dialog.message(); await dialog.dismiss() })
      await copy.click()
      await page.waitForFunction(() => !document.querySelector('textarea'))
      assert.equal(dialogText, '复制失败，请手动复制')
      assert.equal(await copy.innerText(), '复制账号')
      await page.evaluate(() => { navigator.clipboard.writeText = async () => {} })
      await copy.click()
      await page.waitForFunction(() => document.querySelector('.copy-btn').textContent.includes('已复制'))
      await copy.click()
      await page.screenshot({ path: `${out}/apple-${width}.png` })
      await page.goto(base + '/article/oh8wwokl/', { waitUntil: 'networkidle' })
      const nav = page.getByRole('navigation', { name: '免费订阅使用步骤' })
      await nav.scrollIntoViewIfNeeded()
      await page.screenshot({ path: `${out}/subscription-${width}.png` })
      for (const name of ['Clash 地址', 'V2Ray 地址', '导入教程', '连接排错']) {
        const a = nav.getByRole('link', { name, exact: true })
        assert((await a.boundingBox()).height >= 44)
        const target = await a.getAttribute('href')
        await a.click()
        await page.waitForURL(url => decodeURIComponent(url.hash) === target)
        const id = decodeURIComponent(await page.evaluate(() => location.hash.slice(1)))
        assert(await page.locator(`[id="${id}"]`).count())
        await a.click() // same anchor must remain stable
        assert.equal(decodeURIComponent(await page.evaluate(() => location.hash.slice(1))), id)
      }
      await page.goBack()
      // The theme may replace same-page anchor history. Either prior anchor or
      // the article's unfragmented entry remains a valid return destination.
      assert.equal(new URL(page.url()).pathname, '/article/oh8wwokl/')
      await page.goForward()
      await page.waitForURL(url => decodeURIComponent(url.hash) === '#如何判断免费节点是否可用')
      assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2)))
      await page.goto(base + '/posts/vpn/', { waitUntil: 'networkidle' })
      assert(await page.locator('#airport-comparison').count())
      assert(await page.locator('#ios-subscription').count())
      await page.screenshot({ path: `${out}/vpn-${width}.png` })
      evidence.push({ width, refreshRecovery: true, copyFalseAndSuccess: true, repeatedClicks: true, anchorsAndHistory: true })
      await page.close()
    }
    writeFileSync(`${out}/result.json`, JSON.stringify(evidence, null, 2))
    console.log(JSON.stringify(evidence))
  } finally { await browser?.close(); server.kill() }
}
main().catch(e => { console.error(e); process.exitCode = 1 })
