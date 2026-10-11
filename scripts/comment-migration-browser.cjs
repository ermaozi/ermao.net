const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const { chromium } = require('playwright')
const base = 'http://127.0.0.1:4178'
const sourceRepo = 'ermaozi/ermao.net'
const targetRepo = 'ermaozi/ermao-comments'
const routes = require('../docs/.vuepress/data/comment-routes.json')
const discussion = (repo, number, anchor) => ({ discussion: { url: `https://github.com/${repo}/discussions/${number}`, comments: [{ url: `https://github.com/${repo}/discussions/${number}#discussioncomment-${anchor}` }] } })
async function main() {
  const server = spawn('python3', ['-m', 'http.server', '4178', '--bind', '127.0.0.1', '--directory', 'docs/.vuepress/dist'], { stdio: 'ignore' })
  let browser
  try {
    for (let n = 0; n < 40; n++) {
      try { if ((await fetch(base)).ok) break } catch {}
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    browser = await chromium.launch({ headless: true, ...(process.env.COMMENT_TEST_CHROMIUM ? { executablePath: process.env.COMMENT_TEST_CHROMIUM } : {}) })
    for (const mode of ['source-general', 'transferred', 'wrong-duplicate', 'registry', 'network-error']) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.route('**/*', async route => {
        const url = new URL(route.request().url())
        if (url.origin === base) return route.continue()
        if (url.hostname === 'raw.githubusercontent.com') return route.fulfill({ json: { version: 1, targets: mode === 'registry' ? { 21: 80 } : {} } })
        if (url.hostname === 'giscus.app' && url.pathname === '/api/discussions') {
          assert.equal(route.request().method(), 'GET')
          if (mode === 'network-error') return route.fulfill({ status: 429, json: { error: 'Rate limited' } })
          const repo = url.searchParams.get('repo')
          if (repo === sourceRepo) {
            assert.equal(url.searchParams.get('number'), '21')
            assert.equal(url.searchParams.has('category'), false)
            return mode === 'source-general' ? route.fulfill({ json: discussion(repo, 21, routes['posts/vpn/'].anchor) }) : route.fulfill({ status: 500, json: { error: 'Could not resolve to a Discussion with the number of 21.' } })
          }
          const wrong = mode === 'wrong-duplicate'
          return route.fulfill({ json: discussion(repo, wrong ? 2 : 80, wrong ? 10894502 : routes['posts/vpn/'].anchor) })
        }
        if (url.hostname === 'giscus.app') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body>Test comment iframe</body></html>' })
        return route.abort()
      })
      await page.goto(base + '/posts/vpn/')
      await page.locator('#comment').scrollIntoViewIfNeeded()
      if (['wrong-duplicate', 'network-error'].includes(mode)) {
        await page.getByRole('button', { name: '重新加载评论' }).waitFor()
        assert.equal(await page.locator('giscus-widget').count(), 0, 'must not create substitute thread')
      } else {
        await page.locator('giscus-widget').waitFor()
        const state = await page.locator('giscus-widget').evaluate(el => ({ repo: el.repo, term: el.term, mapping: el.mapping, categoryId: el.categoryId, src: el.shadowRoot.querySelector('iframe')?.src }))
        assert.equal(state.repo, mode === 'source-general' ? sourceRepo : targetRepo)
        assert.equal(state.term, mode === 'source-general' ? '21' : '80')
        assert.equal(state.mapping, 'number')
        assert.equal(new URL(state.src).searchParams.get('number'), state.term)
        assert.ok(state.categoryId.startsWith('DIC_'))
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
