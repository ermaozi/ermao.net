const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const { chromium } = require('playwright')
const base = 'http://127.0.0.1:4178'
const sourceRepo = 'ermaozi/ermao.net'
const targetRepo = 'ermaozi/ermao-comments'
async function main() {
  const server = spawn('python3', ['-m', 'http.server', '4178', '--bind', '127.0.0.1', '--directory', 'docs/.vuepress/dist'], { stdio: 'ignore' })
  let browser
  try {
    for (let n = 0; n < 40; n++) {
      try { if ((await fetch(base)).ok) break } catch {}
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    browser = await chromium.launch({ headless: true, ...(process.env.COMMENT_TEST_CHROMIUM ? { executablePath: process.env.COMMENT_TEST_CHROMIUM } : {}) })
    for (const mode of ['source-general', 'transferred', 'wrong-duplicate', 'registry-unavailable', 'retry-after-transfer']) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
      const errors = []
      let transferred = false
      page.on('pageerror', error => errors.push(error.message))
      await page.route('**/*', async route => {
        const url = new URL(route.request().url())
        if (url.origin === base) return route.continue()
        if (url.hostname === 'raw.githubusercontent.com') return mode === 'registry-unavailable' ? route.fulfill({status:503, body:'Unavailable'}) : route.fulfill({ json: { version: 1, targets: (mode === 'transferred' || transferred) ? { 21: 80 } : { 3: 2 } } })
        if (url.hostname === 'giscus.app' && url.pathname === '/api/discussions') throw new Error('Host page must not call the Giscus API across origins')
        if (url.hostname === 'giscus.app') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body>Test comment iframe' + (mode === 'retry-after-transfer' && !transferred ? '<script>parent.postMessage({giscus:{error:"Discussion not found"}},"*")</script>' : '') + '</body></html>' })
        return route.abort()
      })
      await page.goto(base + '/posts/vpn/')
      await page.locator('#comment').scrollIntoViewIfNeeded()
      await page.locator('giscus-widget').waitFor()
      const state = await page.locator('giscus-widget').evaluate(el => ({ repo: el.repo, term: el.term, mapping: el.mapping, categoryId: el.categoryId, src: el.shadowRoot.querySelector('iframe')?.src }))
      assert.equal(state.repo, mode === 'transferred' ? targetRepo : sourceRepo)
      assert.equal(state.term, mode === 'transferred' ? '80' : '21')
      assert.equal(state.mapping, 'number')
      assert.equal(new URL(state.src).searchParams.get('number'), state.term)
      assert.ok(state.categoryId.startsWith('DIC_'))
      if (mode === 'retry-after-transfer') {
        const retry = page.getByRole('button', { name: '重新加载评论' })
        await retry.waitFor()
        transferred = true
        await retry.click()
        await page.waitForFunction(() => document.querySelector('giscus-widget')?.repo === 'ermaozi/ermao-comments')
        const newTerm = await page.locator('giscus-widget').evaluate(el => el.term)
        assert.equal(newTerm, '80')
      }
      assert.deepEqual(errors, [])
      await page.close()
      console.log('PASS browser', mode)
    }
  } finally {
    if (browser) await browser.close()
    server.kill()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
