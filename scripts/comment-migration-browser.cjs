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
      try { const response = await fetch(base); await response.arrayBuffer(); if (response.ok) break } catch {}
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
        if (url.hostname === 'giscus.app') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body>Test comment iframe' + (mode === 'retry-after-transfer' && !transferred ? '<script>parent.postMessage({giscus:{error:"Discussion not found"}},"http://127.0.0.1:4178")</script>' : '') + '</body></html>' })
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
    for (const width of [320, 390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.route('**/*', route => {
        const url = new URL(route.request().url())
        if (url.origin === base) return route.continue()
        if (url.hostname === 'raw.githubusercontent.com') return route.fulfill({ json: { version: 1, targets: { 205: 39 } } })
        if (url.hostname === 'giscus.app' && url.pathname === '/api/discussions') throw new Error('No discussion creation or API calls are allowed in this test')
        if (url.hostname === 'giscus.app') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body>0 comments · 0 reactions <button>Sign in with GitHub</button><textarea aria-label="Draft"></textarea></body></html>' })
        return route.abort()
      })
      const retry = page.locator('#comment button')
      const widget = page.locator('giscus-widget')
      const draft = page.frameLocator('giscus-widget iframe').getByRole('textbox', { name: 'Draft' })
      const send = async error => {
        await page.frameLocator('giscus-widget iframe').locator('body').evaluate((_, error) => parent.postMessage({ giscus: { error } }, '*'), error)
        await page.waitForTimeout(100)
      }
      await page.goto(base + '/en/blog/clashmi/')
      await page.locator('#comment').scrollIntoViewIfNeeded()
      await draft.fill('Keep this unsent draft')
      assert.equal(await widget.evaluate(el => el.mapping), 'pathname')
      await send('Discussion not found')
      assert.equal(await retry.count(), 0)
      assert.equal(await draft.inputValue(), 'Keep this unsent draft')
      assert.equal(await page.frameLocator('giscus-widget iframe').getByRole('button', { name: 'Sign in with GitHub' }).count(), 1)
      // True errors remain actionable; an empty result must not clear them.
      for (const error of ['API rate limit exceeded', 'Network Error', 'Bad credentials', 'Discussion not found: permission denied']) {
        await send(error)
        assert.equal(await retry.count(), 1)
      }
      await send('Discussion not found')
      assert.equal(await retry.count(), 1)
      assert.equal(await draft.inputValue(), 'Keep this unsent draft')
      const failedWidget = await widget.elementHandle()
      await retry.click()
      await page.waitForFunction(el => !el.isConnected, failedWidget)
      await draft.waitFor()
      await page.waitForFunction(() => !document.querySelector('#comment button'))
      await send('Discussion not found')
      assert.equal(await retry.count(), 0)
      // Exercise VuePress's actual locale router link, not a full document reload.
      await page.evaluate(() => { window.__spaMarker = 'kept'; window.__oldCommentFrame = document.querySelector('giscus-widget').shadowRoot.querySelector('iframe').contentWindow })
      const englishWidget = await widget.elementHandle()
      await page.locator('a[href="/blog/clashmi/"]').first().evaluate(el => el.click())
      await page.waitForURL(base + '/blog/clashmi/')
      await page.waitForFunction(el => !el.isConnected, englishWidget)
      await page.locator('#comment').scrollIntoViewIfNeeded()
      await draft.waitFor()
      assert.equal(await page.evaluate(() => window.__spaMarker), 'kept')
      assert.deepEqual(await widget.evaluate(el => [el.mapping, el.term]), ['number', '39'])
      await page.evaluate(() => window.dispatchEvent(new MessageEvent('message', { origin: 'https://giscus.app', source: window.__oldCommentFrame, data: { giscus: { error: 'Network Error' } } })))
      assert.equal(await retry.count(), 0)
      await send('Discussion not found')
      assert.equal(await retry.count(), 1)
      const chineseWidget = await widget.elementHandle()
      await page.locator('a[href="/en/blog/clashmi/"]').first().evaluate(el => el.click())
      await page.waitForURL(base + '/en/blog/clashmi/')
      await page.waitForFunction(el => !el.isConnected, chineseWidget)
      await page.locator('#comment').scrollIntoViewIfNeeded()
      await draft.waitFor()
      assert.equal(await widget.evaluate(el => el.mapping), 'pathname')
      await send('Discussion not found')
      assert.equal(await retry.count(), 0)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
      assert.deepEqual(errors, [])
      await page.close()
      console.log('PASS browser empty/real-error/number/SPA', width)
    }
  } finally {
    if (browser) await browser.close()
    server.kill()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
