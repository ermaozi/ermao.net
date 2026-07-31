/**
 * ermao.net advertising board Worker
 *
 * Required bindings:
 *   DB                      D1 database binding
 *   VISITOR_HASH_SECRET     Secret with at least 32 random characters
 *   TURNSTILE_SECRET        Turnstile widget secret key
 *
 * Optional variables:
 *   ALLOWED_ORIGINS         Comma-separated origins. Defaults to ermao.net.
 *   SITE_URL                Return URL used by the external-link warning page.
 *
 * Routes:
 *   GET  /api/board/notes
 *   POST /api/board/notes                 JSON: { "content": "...", "turnstileToken": "..." }
 *   POST /api/board/notes/:id/like
 *   GET  /api/board/out?url=https%3A%2F%2Fexample.com
 */

const API_PREFIX = '/api/board'
const MAX_CONTENT_LENGTH = 100
const MAX_JSON_BYTES = 4096
const MAX_TURNSTILE_TOKEN_LENGTH = 2048
const MAX_NOTES = 50
const NOTE_WIDTH = 22
const NOTE_HEIGHT = 32
const DAILY_TIME_ZONE = 'Asia/Shanghai'
const DAILY_LEDGER_RETENTION_DAYS = 35
const TURNSTILE_ACTION = 'ad_board_post'
const TURNSTILE_SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const TURNSTILE_TIMEOUT_MS = 8000
const NOTE_COLORS = Object.freeze([
  'butter',
  'mint',
  'blush',
  'sky',
  'lilac',
  'sand',
  'sage',
  'mauve',
  'slate',
  'apricot',
])
const DEFAULT_ALLOWED_ORIGINS = Object.freeze([
  'https://www.ermao.net',
  'https://ermao.net',
])
const URL_PATTERN = /\b(?:https?:\/\/|www\.)[^\s<>"'，。！？；：）】》]+|(?<![@\w])(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})(?::\d{2,5})?(?:\/[^\s<>"'，。！？；：）】》]*)?/giu
const TRAILING_URL_PUNCTUATION = /[),.!?;:\]}>，。！？；：）】》]+$/u
const encoder = new TextEncoder()

class HttpError extends Error {
  constructor(status, code, message, details = undefined) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const pathname = normalizePath(url.pathname)
    const corsHeaders = getCorsHeaders(request, env)

    try {
      if (request.method === 'OPTIONS') {
        assertAllowedOrigin(request, env)
        return new Response(null, {
          status: 204,
          headers: {
            ...corsHeaders,
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
          },
        })
      }

      if (pathname === `${API_PREFIX}/out`) {
        if (request.method !== 'GET') throw methodNotAllowed('GET')
        return renderExternalLinkWarning(url, env)
      }

      if (pathname === `${API_PREFIX}/notes`) {
        assertEnvironment(env)

        if (request.method === 'GET') {
          assertReadableOrigin(request, env)
          return await listNotes(request, env, corsHeaders)
        }

        if (request.method === 'POST') {
          assertAllowedOrigin(request, env)
          return await createNote(request, env, corsHeaders)
        }

        throw methodNotAllowed('GET, POST')
      }

      const likeMatch = pathname.match(/^\/api\/board\/notes\/([0-9a-f-]{36})\/like$/i)
      if (likeMatch) {
        assertEnvironment(env)
        if (request.method !== 'POST') throw methodNotAllowed('POST')
        assertAllowedOrigin(request, env)
        return await likeNote(request, env, likeMatch[1].toLowerCase(), corsHeaders)
      }

      throw new HttpError(404, 'NOT_FOUND', '接口不存在。')
    } catch (error) {
      return errorResponse(error, corsHeaders)
    }
  },
}

async function listNotes(request, env, corsHeaders) {
  const visitorHash = await getVisitorHash(request, env)
  const query = await env.DB.prepare(`
    SELECT
      n.id,
      n.content,
      n.color,
      n.x,
      n.y,
      n.layer,
      n.likes_count,
      n.has_links,
      n.created_at,
      EXISTS(
        SELECT 1
        FROM ad_board_likes AS l
        WHERE l.note_id = n.id AND l.visitor_hash = ?1
      ) AS liked_by_me
    FROM ad_board_notes AS n
    ORDER BY n.layer DESC
    LIMIT 50
  `).bind(visitorHash).all()

  const requestOrigin = new URL(request.url).origin
  const notes = (query.results ?? []).map(row => toPublicNote(row, requestOrigin))

  return jsonResponse({
    ok: true,
    data: {
      notes,
      rules: {
        maxContentLength: MAX_CONTENT_LENGTH,
        maxNotes: MAX_NOTES,
        onePostPerDay: true,
        dailyTimeZone: DAILY_TIME_ZONE,
        oneLikePerNote: true,
        likesCanBeRemoved: false,
      },
    },
  }, 200, corsHeaders)
}

async function createNote(request, env, corsHeaders) {
  const body = await readJsonBody(request)
  const content = normalizeContent(body.content)
  const turnstileToken = normalizeTurnstileToken(body.turnstileToken)
  const visitorHash = await getVisitorHash(request, env)
  const now = new Date()
  const nowIso = now.toISOString()
  const postDate = formatDay(now)
  const retentionCutoff = formatDay(new Date(now.getTime() - DAILY_LEDGER_RETENTION_DAYS * 86400000))

  const existingDailyPost = await env.DB.prepare(`
    SELECT note_id
    FROM ad_board_daily_posts
    WHERE visitor_hash = ?1 AND post_date = ?2
    LIMIT 1
  `).bind(visitorHash, postDate).first()

  if (existingDailyPost) {
    throw new HttpError(
      429,
      'DAILY_POST_LIMIT',
      `每位访客每天只能发表一张便签，以 ${DAILY_TIME_ZONE} 自然日计算。`,
    )
  }

  await verifyTurnstile(request, env, turnstileToken)

  const positionRows = await env.DB.prepare(`
    SELECT x, y
    FROM ad_board_notes
    ORDER BY layer DESC
    LIMIT 50
  `).all()
  const position = pickOpenPosition(positionRows.results ?? [])
  const id = crypto.randomUUID()
  const color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)]
  const hasLinks = extractUrls(content).length > 0 ? 1 : 0

  try {
    await env.DB.batch([
      env.DB.prepare(`
        DELETE FROM ad_board_daily_posts
        WHERE post_date < ?1
      `).bind(retentionCutoff),
      env.DB.prepare(`
        INSERT INTO ad_board_daily_posts (
          visitor_hash, post_date, note_id, created_at
        ) VALUES (?1, ?2, ?3, ?4)
      `).bind(visitorHash, postDate, id, nowIso),
      env.DB.prepare(`
        UPDATE ad_board_state
        SET next_layer = next_layer + 1, updated_at = ?1
        WHERE singleton = 1
      `).bind(nowIso),
      env.DB.prepare(`
        INSERT INTO ad_board_notes (
          id, content, color, x, y, layer, likes_count,
          has_links, created_at, updated_at
        ) VALUES (
          ?1, ?2, ?3, ?4, ?5,
          (SELECT next_layer FROM ad_board_state WHERE singleton = 1),
          0, ?6, ?7, ?7
        )
      `).bind(id, content, color, position.x, position.y, hasLinks, nowIso),
    ])
  } catch (error) {
    if (isUniqueConstraint(error, 'ad_board_daily_posts')) {
      throw new HttpError(
        429,
        'DAILY_POST_LIMIT',
        `每位访客每天只能发表一张便签，以 ${DAILY_TIME_ZONE} 自然日计算。`,
      )
    }
    throw error
  }

  const cleanup = await cleanupBoard(env)
  const row = await selectNoteForVisitor(env, id, visitorHash)
  if (!row) throw new HttpError(500, 'NOTE_CREATE_FAILED', '便签写入后未能读取。')

  return jsonResponse({
    ok: true,
    data: {
      note: toPublicNote(row, new URL(request.url).origin),
      cleanup,
    },
  }, 201, corsHeaders)
}

async function likeNote(request, env, noteId, corsHeaders) {
  const visitorHash = await getVisitorHash(request, env)
  const existingNote = await env.DB.prepare(`
    SELECT id
    FROM ad_board_notes
    WHERE id = ?1
    LIMIT 1
  `).bind(noteId).first()

  if (!existingNote) throw new HttpError(404, 'NOTE_NOT_FOUND', '这张便签不存在或已经被清理。')

  const nowIso = new Date().toISOString()

  try {
    await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO ad_board_likes (note_id, visitor_hash, created_at)
        VALUES (?1, ?2, ?3)
      `).bind(noteId, visitorHash, nowIso),
      env.DB.prepare(`
        UPDATE ad_board_state
        SET next_layer = next_layer + 1, updated_at = ?1
        WHERE singleton = 1
      `).bind(nowIso),
      env.DB.prepare(`
        UPDATE ad_board_notes
        SET
          likes_count = likes_count + 1,
          layer = (SELECT next_layer FROM ad_board_state WHERE singleton = 1),
          updated_at = ?1
        WHERE id = ?2
      `).bind(nowIso, noteId),
    ])
  } catch (error) {
    if (isUniqueConstraint(error, 'ad_board_likes')) {
      throw new HttpError(409, 'ALREADY_LIKED', '同一张便签只能点赞一次，且点赞后不能取消。')
    }
    if (isForeignKeyConstraint(error)) {
      throw new HttpError(404, 'NOTE_NOT_FOUND', '这张便签不存在或已经被清理。')
    }
    throw error
  }

  const cleanup = await cleanupBoard(env)
  const row = await selectNoteForVisitor(env, noteId, visitorHash)
  if (!row) throw new HttpError(404, 'NOTE_NOT_FOUND', '这张便签已经被清理。')

  return jsonResponse({
    ok: true,
    data: {
      note: toPublicNote(row, new URL(request.url).origin),
      cleanup,
    },
  }, 200, corsHeaders)
}

async function selectNoteForVisitor(env, noteId, visitorHash) {
  return await env.DB.prepare(`
    SELECT
      n.id,
      n.content,
      n.color,
      n.x,
      n.y,
      n.layer,
      n.likes_count,
      n.has_links,
      n.created_at,
      EXISTS(
        SELECT 1
        FROM ad_board_likes AS l
        WHERE l.note_id = n.id AND l.visitor_hash = ?2
      ) AS liked_by_me
    FROM ad_board_notes AS n
    WHERE n.id = ?1
    LIMIT 1
  `).bind(noteId, visitorHash).first()
}

async function cleanupBoard(env) {
  const result = await env.DB.prepare(`
    SELECT id, x, y, layer
    FROM ad_board_notes
    ORDER BY layer ASC
    LIMIT 100
  `).all()
  const rows = result.results ?? []
  const coveredIds = new Set()

  for (const targetNote of rows) {
    const target = noteRect(targetNote)
    const overlays = rows
      .filter(candidate => Number(candidate.layer) > Number(targetNote.layer))
      .map(noteRect)

    if (isFullyCovered(target, overlays)) coveredIds.add(String(targetNote.id))
  }

  const survivors = rows.filter(row => !coveredIds.has(String(row.id)))
  const overflowCount = Math.max(0, survivors.length - MAX_NOTES)
  const overflowIds = survivors
    .slice(0, overflowCount)
    .map(row => String(row.id))
  const idsToDelete = [...new Set([...coveredIds, ...overflowIds])]

  if (idsToDelete.length > 0) {
    const placeholders = idsToDelete.map((_, index) => `?${index + 1}`).join(', ')
    await env.DB.prepare(`
      DELETE FROM ad_board_notes
      WHERE id IN (${placeholders})
    `).bind(...idsToDelete).run()
  }

  return {
    covered: coveredIds.size,
    overflow: overflowIds.length,
  }
}

function noteRect(note) {
  const left = Number(note.x)
  const top = Number(note.y)
  return {
    left,
    right: left + NOTE_WIDTH,
    top,
    bottom: top + NOTE_HEIGHT,
  }
}

function isFullyCovered(target, overlays) {
  const intersections = overlays
    .map(overlay => intersectRects(target, overlay))
    .filter(Boolean)

  if (intersections.length === 0) return false

  const xBreaks = [...new Set([
    target.left,
    target.right,
    ...intersections.flatMap(rect => [rect.left, rect.right]),
  ])].sort((a, b) => a - b)
  const epsilon = 0.0001

  for (let index = 0; index < xBreaks.length - 1; index += 1) {
    const fromX = xBreaks[index]
    const toX = xBreaks[index + 1]
    if (toX - fromX <= epsilon) continue

    const midpoint = (fromX + toX) / 2
    const intervals = intersections
      .filter(rect => rect.left <= midpoint && rect.right >= midpoint)
      .map(rect => [rect.top, rect.bottom])
      .sort((a, b) => a[0] - b[0])
    let coveredUntil = target.top

    for (const [top, bottom] of intervals) {
      if (top > coveredUntil + epsilon) break
      coveredUntil = Math.max(coveredUntil, bottom)
      if (coveredUntil >= target.bottom - epsilon) break
    }

    if (coveredUntil < target.bottom - epsilon) return false
  }

  return true
}

function intersectRects(target, overlay) {
  const intersection = {
    left: Math.max(target.left, overlay.left),
    right: Math.min(target.right, overlay.right),
    top: Math.max(target.top, overlay.top),
    bottom: Math.min(target.bottom, overlay.bottom),
  }

  return intersection.right > intersection.left && intersection.bottom > intersection.top
    ? intersection
    : null
}

function pickOpenPosition(existingNotes) {
  const availableWidth = 100 - NOTE_WIDTH
  const availableHeight = 100 - NOTE_HEIGHT

  if (existingNotes.length === 0) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 0.1
    return {
      x: roundPosition(availableWidth * (0.5 + Math.cos(angle) * radius)),
      y: roundPosition(availableHeight * (0.5 + Math.sin(angle) * radius)),
    }
  }

  const existingRects = existingNotes.map(noteRect)
  const progress = Math.min(1, existingRects.length / 16)
  const spread = 0.72 + progress * 0.28
  const boardDiagonal = Math.hypot(100, 100)
  let best = { x: availableWidth / 2, y: availableHeight / 2, score: -Infinity }

  for (let index = 0; index < 72; index += 1) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.sqrt(Math.random()) * spread
    const x = clamp(availableWidth * (0.5 + Math.cos(angle) * radius * 0.5), 0, availableWidth)
    const y = clamp(availableHeight * (0.5 + Math.sin(angle) * radius * 0.5), 0, availableHeight)
    const candidate = {
      left: x,
      right: x + NOTE_WIDTH,
      top: y,
      bottom: y + NOTE_HEIGHT,
    }
    let overlapArea = 0
    let nearestGap = Infinity

    for (const existing of existingRects) {
      const overlapWidth = Math.max(
        0,
        Math.min(candidate.right, existing.right) - Math.max(candidate.left, existing.left),
      )
      const overlapHeight = Math.max(
        0,
        Math.min(candidate.bottom, existing.bottom) - Math.max(candidate.top, existing.top),
      )
      overlapArea += overlapWidth * overlapHeight

      const gapX = Math.max(existing.left - candidate.right, candidate.left - existing.right, 0)
      const gapY = Math.max(existing.top - candidate.bottom, candidate.top - existing.bottom, 0)
      nearestGap = Math.min(nearestGap, Math.hypot(gapX, gapY))
    }

    const overlapRatio = overlapArea / (NOTE_WIDTH * NOTE_HEIGHT)
    const score = (nearestGap / boardDiagonal) * 100 - overlapRatio * 1000 + Math.random() * 0.05
    if (score > best.score) best = { x, y, score }
  }

  return {
    x: roundPosition(best.x),
    y: roundPosition(best.y),
  }
}

function toPublicNote(row, requestOrigin) {
  return {
    id: String(row.id),
    content: String(row.content),
    color: String(row.color),
    x: Number(row.x),
    y: Number(row.y),
    layer: Number(row.layer),
    likes: Number(row.likes_count),
    likedByMe: Boolean(row.liked_by_me),
    hasLinks: Boolean(row.has_links),
    links: extractUrls(String(row.content)).map(link => ({
      text: link.text,
      url: link.url,
      warningUrl: `${requestOrigin}${API_PREFIX}/out?url=${encodeURIComponent(link.url)}`,
    })),
    createdAt: String(row.created_at),
  }
}

function extractUrls(content) {
  const links = []
  const seen = new Set()

  for (const match of content.matchAll(URL_PATTERN)) {
    const text = match[0].replace(TRAILING_URL_PUNCTUATION, '')
    const candidate = /^https?:\/\//iu.test(text) ? text : `https://${text}`

    try {
      const parsed = new URL(candidate)
      if (!['http:', 'https:'].includes(parsed.protocol)) continue
      const normalized = parsed.href
      if (normalized.length > 2048 || seen.has(normalized)) continue
      seen.add(normalized)
      links.push({ text, url: normalized })
    } catch {
      // Ignore malformed URL-like text and keep it as ordinary note content.
    }
  }

  return links
}

function renderExternalLinkWarning(requestUrl, env) {
  const rawUrl = requestUrl.searchParams.get('url') ?? ''
  let target

  try {
    target = new URL(rawUrl)
    if (!['http:', 'https:'].includes(target.protocol) || target.href.length > 2048) {
      throw new Error('unsupported URL')
    }
  } catch {
    return htmlResponse(
      '<!doctype html><meta charset="utf-8"><title>链接无效</title><p>目标网址无效或不受支持。</p>',
      400,
    )
  }

  const siteUrl = getSiteUrl(env)
  const safeTarget = escapeHtml(target.href)
  const safeHost = escapeHtml(target.hostname)
  const safeSiteUrl = escapeHtml(siteUrl)
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>即将访问外部网站</title>
  <style>
    :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
    body { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #f5f7f8; color: #24313a; }
    main { box-sizing: border-box; width: min(92vw, 620px); padding: 30px; border: 1px solid #dce3e6; border-radius: 16px; background: #fff; box-shadow: 0 18px 50px rgb(23 52 65 / 10%); }
    .tag { color: #336f87; font-size: 12px; font-weight: 750; letter-spacing: .08em; }
    h1 { margin: 8px 0 12px; font-size: 25px; }
    p { color: #5c6970; line-height: 1.7; }
    code { display: block; margin: 18px 0; padding: 12px; overflow-wrap: anywhere; border-radius: 9px; background: #f1f4f5; color: #344850; }
    .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
    a { padding: 10px 15px; border-radius: 9px; text-decoration: none; font-weight: 700; }
    .continue { background: #336f87; color: #fff; }
    .back { border: 1px solid #d4dde1; color: #49616b; }
    @media (prefers-color-scheme: dark) {
      body { background: #171a1c; color: #e7ecee; }
      main { border-color: #343d41; background: #212629; }
      p { color: #aeb9be; }
      code { background: #171b1d; color: #c7d1d5; }
      .back { border-color: #465158; color: #c1cbd0; }
    }
  </style>
</head>
<body>
  <main>
    <span class="tag">外部链接风险提示</span>
    <h1>你将离开二毛广告板</h1>
    <p>该网址由用户发布，本站没有验证其真实性、安全性或内容。请勿在陌生页面输入密码、验证码、银行卡或其他敏感信息。</p>
    <p>目标域名：<strong>${safeHost}</strong></p>
    <code>${safeTarget}</code>
    <div class="actions">
      <a class="continue" href="${safeTarget}" rel="nofollow ugc noreferrer">了解风险，继续访问</a>
      <a class="back" href="${safeSiteUrl}">返回广告板</a>
    </div>
  </main>
</body>
</html>`

  return htmlResponse(html, 200)
}

async function readJsonBody(request) {
  const contentType = request.headers.get('Content-Type') ?? ''
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE', '请求必须使用 application/json。')
  }

  const declaredLength = Number(request.headers.get('Content-Length') ?? 0)
  if (Number.isFinite(declaredLength) && declaredLength > MAX_JSON_BYTES) {
    throw new HttpError(413, 'BODY_TOO_LARGE', '请求内容过大。')
  }

  const text = await request.text()
  if (encoder.encode(text).byteLength > MAX_JSON_BYTES) {
    throw new HttpError(413, 'BODY_TOO_LARGE', '请求内容过大。')
  }

  try {
    const body = JSON.parse(text)
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('invalid object')
    return body
  } catch {
    throw new HttpError(400, 'INVALID_JSON', '请求 JSON 格式无效。')
  }
}

function normalizeContent(input) {
  if (typeof input !== 'string') {
    throw new HttpError(400, 'INVALID_CONTENT', '便签内容必须是字符串。')
  }

  const content = input.replace(/\r\n?/g, '\n').trim()
  const length = Array.from(content).length

  if (length === 0) throw new HttpError(400, 'EMPTY_CONTENT', '便签内容不能为空。')
  if (length > MAX_CONTENT_LENGTH) {
    throw new HttpError(400, 'CONTENT_TOO_LONG', `便签内容不能超过 ${MAX_CONTENT_LENGTH} 字。`)
  }
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(content)) {
    throw new HttpError(400, 'INVALID_CONTENT', '便签内容包含不支持的控制字符。')
  }

  return content
}

function normalizeTurnstileToken(input) {
  if (typeof input !== 'string') {
    throw new HttpError(400, 'TURNSTILE_REQUIRED', '请先完成人机验证。')
  }

  const token = input.trim()
  if (token.length === 0 || token.length > MAX_TURNSTILE_TOKEN_LENGTH) {
    throw new HttpError(400, 'TURNSTILE_REQUIRED', '请重新完成人机验证。')
  }

  return token
}

async function verifyTurnstile(request, env, token) {
  const form = new URLSearchParams({
    secret: env.TURNSTILE_SECRET,
    response: token,
    idempotency_key: crypto.randomUUID(),
  })
  const remoteIp = request.headers.get('CF-Connecting-IP')
  if (remoteIp) form.set('remoteip', remoteIp)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TURNSTILE_TIMEOUT_MS)
  let response
  let result

  try {
    response = await fetch(TURNSTILE_SITEVERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form,
      signal: controller.signal,
    })
    result = await response.json()
  } catch (error) {
    console.warn('turnstile siteverify unavailable', error?.name ?? 'unknown')
    throw new HttpError(
      503,
      'TURNSTILE_UNAVAILABLE',
      '人机验证服务暂时不可用，请稍后重试。',
    )
  } finally {
    clearTimeout(timeout)
  }

  const allowedHostnames = getAllowedHostnames(env)
  const valid = response.ok
    && result?.success === true
    && result.action === TURNSTILE_ACTION
    && allowedHostnames.has(result.hostname)

  if (!valid) {
    console.warn('turnstile verification failed', {
      status: response.status,
      errors: Array.isArray(result?.['error-codes']) ? result['error-codes'] : [],
      action: result?.action ?? null,
      hostname: result?.hostname ?? null,
    })
    throw new HttpError(403, 'TURNSTILE_FAILED', '人机验证未通过，请重新验证。')
  }
}

async function getVisitorHash(request, env) {
  const ip = request.headers.get('CF-Connecting-IP')
  if (!ip) {
    throw new HttpError(503, 'IDENTITY_UNAVAILABLE', '无法识别访客来源，请通过 Cloudflare 代理访问。')
  }

  const userAgent = (request.headers.get('User-Agent') ?? '-').slice(0, 512)
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(env.VISITOR_HASH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`ermao-ad-board-v1\n${ip}\n${userAgent}`),
  )

  return [...new Uint8Array(signature)]
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

function formatDay(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: DAILY_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function assertEnvironment(env) {
  if (!env.DB || typeof env.DB.prepare !== 'function') {
    throw new HttpError(500, 'DB_BINDING_MISSING', 'Worker 缺少名为 DB 的 D1 绑定。')
  }
  if (typeof env.VISITOR_HASH_SECRET !== 'string' || env.VISITOR_HASH_SECRET.length < 32) {
    throw new HttpError(500, 'HASH_SECRET_MISSING', '请配置至少 32 位的 VISITOR_HASH_SECRET。')
  }
  if (typeof env.TURNSTILE_SECRET !== 'string' || env.TURNSTILE_SECRET.length === 0) {
    throw new HttpError(500, 'TURNSTILE_SECRET_MISSING', '请配置 TURNSTILE_SECRET。')
  }
}

function assertReadableOrigin(request, env) {
  const origin = request.headers.get('Origin')
  if (origin && !getAllowedOrigins(env).has(origin)) {
    throw new HttpError(403, 'ORIGIN_NOT_ALLOWED', '请求来源不在允许列表中。')
  }
}

function assertAllowedOrigin(request, env) {
  const origin = request.headers.get('Origin')
  if (!origin || !getAllowedOrigins(env).has(origin)) {
    throw new HttpError(403, 'ORIGIN_NOT_ALLOWED', '请求来源不在允许列表中。')
  }
}

function getAllowedOrigins(env) {
  const configured = typeof env.ALLOWED_ORIGINS === 'string'
    ? env.ALLOWED_ORIGINS.split(',').map(value => value.trim()).filter(Boolean)
    : []
  return new Set(configured.length > 0 ? configured : DEFAULT_ALLOWED_ORIGINS)
}

function getAllowedHostnames(env) {
  const hostnames = new Set()

  for (const origin of getAllowedOrigins(env)) {
    try {
      hostnames.add(new URL(origin).hostname)
    } catch {
      // Invalid configured origins are ignored here and rejected by origin checks.
    }
  }

  return hostnames
}

function getCorsHeaders(request, env) {
  const origin = request.headers.get('Origin')
  const headers = {
    Vary: 'Origin',
  }
  if (origin && getAllowedOrigins(env).has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }
  return headers
}

function getSiteUrl(env) {
  const candidate = typeof env.SITE_URL === 'string'
    ? env.SITE_URL
    : 'https://www.ermao.net/ad-board/'

  try {
    const parsed = new URL(candidate)
    return ['http:', 'https:'].includes(parsed.protocol)
      ? parsed.href
      : 'https://www.ermao.net/ad-board/'
  } catch {
    return 'https://www.ermao.net/ad-board/'
  }
}

function jsonResponse(payload, status, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...extraHeaders,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

function htmlResponse(html, status) {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
  })
}

function errorResponse(error, corsHeaders) {
  if (error instanceof HttpError) {
    const headers = { ...corsHeaders }
    if (error.status === 405 && error.details?.allow) headers.Allow = error.details.allow
    if (error.status === 429) headers['Retry-After'] = secondsUntilNextShanghaiDay()

    return jsonResponse({
      ok: false,
      error: {
        code: error.code,
        message: error.message,
      },
    }, error.status, headers)
  }

  console.error('ad-board worker error', error?.name, error?.message)
  return jsonResponse({
    ok: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: '服务器暂时无法处理请求。',
    },
  }, 500, corsHeaders)
}

function secondsUntilNextShanghaiDay() {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: DAILY_TIME_ZONE,
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(now)
  const values = Object.fromEntries(parts.map(part => [part.type, Number(part.value)]))
  const elapsed = values.hour * 3600 + values.minute * 60 + values.second
  return String(Math.max(1, 86400 - elapsed))
}

function methodNotAllowed(allow) {
  return new HttpError(405, 'METHOD_NOT_ALLOWED', '请求方法不受支持。', { allow })
}

function isUniqueConstraint(error, tableName) {
  const message = String(error?.message ?? error)
  return message.includes('UNIQUE constraint failed') && message.includes(tableName)
}

function isForeignKeyConstraint(error) {
  return String(error?.message ?? error).includes('FOREIGN KEY constraint failed')
}

function normalizePath(pathname) {
  if (pathname === '/') return pathname
  return pathname.replace(/\/+$/, '')
}

function roundPosition(value) {
  return Math.round(value * 10000) / 10000
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
