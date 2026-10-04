import { validToolEvent } from '../../../data/tool-events.js'

let installed = false

// Reuse the configured first-party stats endpoint. Local previews never transmit.
export function installToolAnalytics() {
  if (installed) return () => {}
  if (typeof window === 'undefined') return () => {}
  if (!['ermao.net', 'www.ermao.net'].includes(window.location.hostname)) return () => {}
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return () => {}
  let configured = typeof __STATS_WORKER_URL__ === 'string' ? __STATS_WORKER_URL__ : ''
  // VuePress can serialize the plugin's JSON-stringified define value again.
  // Match the existing stats client's normalization before constructing a URL.
  if (configured.startsWith('"') && configured.endsWith('"')) configured = configured.slice(1, -1)
  if (!configured) return () => {}
  let endpoint
  try {
    endpoint = new URL(`${configured.replace(/\/$/, '')}/events`, window.location.origin)
    if (endpoint.origin !== window.location.origin || endpoint.search || endpoint.hash) return () => {}
  } catch { return () => {} }
  installed = true
  let lastKey = ''
  let lastAt = 0
  const handle = (e) => {
    if (e.type === 'auxclick' && e.button !== 1) return
    const target = e.target instanceof Element ? e.target.closest('[data-tool-event]') : null
    if (!target || target.matches(':disabled,[aria-disabled="true"]')) return
    const event = target.getAttribute('data-tool-event')
    if ((event === 'filter_change') !== (e.type === 'change')) return
    const data = { surface: target.closest('[data-tool-surface]')?.getAttribute('data-tool-surface'), event }
    if (!validToolEvent(data)) return
    const key = `${data.surface}:${data.event}`
    const now = Date.now()
    if (lastKey === key && now - lastAt < 800) return
    lastKey = key
    lastAt = now
    // Omitting credentials/referrer prevents cookies and current-page parameters
    // reaching this event collector. Failures never interfere with navigation.
    void fetch(endpoint.href, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data), credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: true,
    }).catch(() => {})
  }
  document.addEventListener('click', handle)
  document.addEventListener('change', handle)
  document.addEventListener('auxclick', handle)
  return () => {
    document.removeEventListener('click', handle)
    document.removeEventListener('change', handle)
    document.removeEventListener('auxclick', handle)
    installed = false
  }
}
