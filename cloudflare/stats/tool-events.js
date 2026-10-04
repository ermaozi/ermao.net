import { validToolEvent } from '../../data/tool-events.js'

export async function handleToolEvent(request, env) {
  const headers = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' }
  const reply = (status, error) => new Response(error ? JSON.stringify({ error }) : null, { status, headers })
  if (request.method !== 'POST') return reply(405, 'Method not allowed')
  if (!['https://ermao.net', 'https://www.ermao.net'].includes(request.headers.get('Origin'))) return reply(403, 'Origin not allowed')
  if (request.headers.get('DNT') === '1' || request.headers.get('Sec-GPC') === '1') return reply(204)
  if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) return reply(415, 'JSON required')
  if (Number(request.headers.get('Content-Length')) > 256) return reply(413, 'Body too large')
  let data
  try {
    // Bound streaming input even when Content-Length is absent.
    const reader = request.body?.getReader()
    if (!reader) return reply(400, 'Invalid event')
    const chunks = []
    let size = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 256) { await reader.cancel(); return reply(413, 'Body too large') }
      chunks.push(value)
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
    data = JSON.parse(new TextDecoder().decode(bytes))
  } catch { return reply(400, 'Invalid event') }
  if (!validToolEvent(data)) return reply(400, 'Invalid event')
  if (!env.VIEWS_DB) return reply(503, 'Event storage not configured')
  try {
    await env.VIEWS_DB.prepare(`INSERT INTO tool_event_daily (day, surface, event, count)
      VALUES (?, ?, ?, 1) ON CONFLICT(day, surface, event) DO UPDATE SET count = count + 1`)
      .bind(new Date().toISOString().slice(0, 10), data.surface, data.event).run()
    return reply(204)
  } catch { return reply(503, 'Event storage not configured') }
}
