const { chromium } = require('playwright')
const assert = require('node:assert/strict')
const fs = require('node:fs')
;(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] })
  const context = await browser.newContext()
  const events = []
  // Every browser request is intercepted: production-origin simulation cannot write production.
  await context.route('**/*', async route => {
    const req = route.request(), url = new URL(req.url())
    if (url.pathname.startsWith('/api/stats')) {
      if (url.pathname === '/api/stats/events') {
        events.push({ body: req.postDataJSON(), headers: await req.allHeaders(), url: req.url() })
        await route.fulfill({ status: 503, body: '' }) // failure must not block navigation
      } else await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
      return
    }
    if (url.hostname !== 'www.ermao.net') { await route.abort(); return }
    const response = await context.request.get(`http://localhost:4173${url.pathname}${url.search}`)
    await route.fulfill({ response })
  })
  try {
    const page = await context.newPage()
    await page.goto('https://www.ermao.net/posts/vpn/', { waitUntil: 'networkidle' })
    const cta = page.getByRole('link', { name: '按需求选择套餐 ↓' })
    await cta.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(150)
    assert.equal(events.length, 1)
    assert.deepEqual(events[0].body, { surface: 'vpn', event: 'selector_click' })
    assert.equal(events[0].url, 'https://www.ermao.net/api/stats/events')
    assert.equal(events[0].headers.referer, undefined)
    assert.equal(events[0].headers.cookie, undefined)
    const tutorial = page.locator('#connection-selector .client-guides a').first()
    await tutorial.click({ modifiers: ['Control'] }); await page.waitForTimeout(150)
    assert.equal(events.filter(e => e.body.event === 'tutorial_click').length, 1)
    await page.waitForTimeout(850)
    await tutorial.click({ button: 'middle' }); await page.waitForTimeout(150)
    assert.equal(events.filter(e => e.body.event === 'tutorial_click').length, 2)
    await page.getByRole('link', { name: '已有订阅？开始排错 →' }).click()
    await page.waitForURL('**/connection-help/')
    assert(events.some(e => e.body.event === 'troubleshooter_click'))
    for (const e of events) assert.deepEqual(Object.keys(e.body).sort(), ['event', 'surface'])
    fs.writeFileSync('artifacts/ux-20261003/analytics-browser.json', JSON.stringify({ passed: true, checks: ['compiled endpoint normalization', 'keyboard activation', 'ctrl and middle new tab exactly once', '503 does not block navigation', 'no Referer or Cookie', 'strict two-field payload', 'all network intercepted; zero production writes'], events: events.map(e => e.body) }, null, 2))
    console.log('PASS compiled analytics: keyboard, new tabs, privacy, failure navigation; all requests intercepted')
  } finally { await context.unrouteAll({ behavior: 'wait' }); await browser.close() }
})().catch(e => { console.error(e); process.exitCode = 1 })
