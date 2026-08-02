/**
 * Claude 环境自检 - Cloudflare Worker
 *
 * 推荐部署方式：
 * 1. 将本文件作为 ES Module Worker 部署。
 * 2. 给 Worker 绑定路由：https://www.ermao.net/api/claude-env-check*
 * 3. 可选：设置 Secret `PROXYCHECK_API_KEY`，用于补充 VPN、代理、Tor、
 *    住宅/机房类型和 0-100 风险分。
 *
 * 未设置 PROXYCHECK_API_KEY 时，接口仍会返回 Cloudflare 原生提供的出口 IP、
 * 国家、地区、城市、时区、经纬度、邮编、ASN 和网络组织。
 *
 * 本接口只检测发起请求的当前出口 IP，不接受任意 IP 查询参数。
 */

const API_PATHS = new Set([
  '/api/claude-env-check',
  '/api/claude-env-check/',
])

const ALLOWED_ORIGINS = new Set([
  'https://www.ermao.net',
  'https://ermao.net',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
])

const DATACENTER_PATTERN = /\b(?:cloud|hosting|host|server|datacenter|data center|vps|colo|colocation|amazon|google|microsoft|azure|digitalocean|linode|akamai|ovh|hetzner|cloudflare|oracle|alibaba|tencent)\b/i
const RISK_CACHE_SECONDS = 15 * 60
const UPSTREAM_TIMEOUT_MS = 4500

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (!API_PATHS.has(url.pathname)) {
      return jsonResponse(request, { error: 'Not found' }, 404)
    }

    const origin = request.headers.get('Origin')
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return jsonResponse(request, { error: 'Origin not allowed' }, 403)
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: responseHeaders(request),
      })
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return jsonResponse(request, { error: 'Method not allowed' }, 405, {
        Allow: 'GET, HEAD, OPTIONS',
      })
    }

    const cf = request.cf ?? {}
    const ip = cleanString(request.headers.get('CF-Connecting-IP'))

    let risk = null
    let riskStatus = 'not-configured'
    let riskMessage

    if (ip && env.PROXYCHECK_API_KEY) {
      try {
        risk = await getIpRisk(ip, env.PROXYCHECK_API_KEY, ctx)
        riskStatus = 'ready'
      }
      catch {
        riskStatus = 'unavailable'
        riskMessage = 'IP 风险服务暂时不可用'
      }
    }
    else if (env.PROXYCHECK_API_KEY && !ip) {
      riskStatus = 'unavailable'
      riskMessage = 'Cloudflare 未提供客户端 IP'
    }

    const asOrganization = risk?.organization
      ?? cleanString(cf.asOrganization)
    const connectionType = risk?.connectionType ?? null
    const isDatacenter = risk
      ? (risk.datacenter ?? matchesDatacenter(connectionType))
      : null
    const isSuspectedDatacenter = isDatacenter === true
      ? false
      : asOrganization
        ? DATACENTER_PATTERN.test(asOrganization)
        : null
    const isResidential = risk
      ? (risk.residential ?? matchesResidential(connectionType))
      : null
    const isProxy = risk?.proxy ?? null
    const isVpn = risk?.vpn ?? null
    const isTor = risk?.tor ?? null
    const isMobile = risk?.mobile ?? null

    const body = {
      ip,
      countryCode: risk?.countryCode ?? cleanString(cf.country),
      region: risk?.region ?? cleanString(cf.region),
      regionCode: cleanString(cf.regionCode),
      city: risk?.city ?? cleanString(cf.city),
      timezone: risk?.timezone ?? cleanString(cf.timezone),
      latitude: risk?.latitude ?? finiteNumber(cf.latitude),
      longitude: risk?.longitude ?? finiteNumber(cf.longitude),
      postalCode: risk?.postalCode ?? cleanString(cf.postalCode),
      asn: risk?.asn ?? finiteNumber(cf.asn),
      asOrganization,
      fraudScore: risk?.fraudScore ?? null,
      connectionType,
      ipType: determineIpType({
        isResidential,
        isDatacenter,
        isSuspectedDatacenter,
        isProxy,
        isVpn,
        isTor,
        isMobile,
      }),
      isResidential,
      isDatacenter,
      isSuspectedDatacenter,
      isProxy,
      isVpn,
      isTor,
      isMobile,
      riskStatus,
      ...(riskMessage ? { riskMessage } : {}),
    }

    if (request.method === 'HEAD') {
      return new Response(null, {
        status: 200,
        headers: responseHeaders(request),
      })
    }

    return jsonResponse(request, body)
  },
}

async function getIpRisk(ip, apiKey, ctx) {
  const cacheKey = await createRiskCacheKey(ip, apiKey)
  const cacheRequest = new Request(cacheKey, { method: 'GET' })
  const cached = await caches.default.match(cacheRequest)

  if (cached) {
    return cached.json()
  }

  const upstreamUrl = new URL(
    `https://proxycheck.io/v3/${encodeURIComponent(ip)}`,
  )
  upstreamUrl.searchParams.set('key', apiKey)
  upstreamUrl.searchParams.set('short', '1')
  upstreamUrl.searchParams.set('p', '0')
  upstreamUrl.searchParams.set('tag', '0')
  upstreamUrl.searchParams.set('ver', '24-June-2026')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

  let response
  try {
    response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    })
  }
  finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    throw new Error(`IP risk upstream returned ${response.status}`)
  }

  const payload = await response.json()
  if (payload?.status !== 'ok' && payload?.status !== 'warning') {
    throw new Error('IP risk upstream rejected the request')
  }

  const network = isRecord(payload.network) ? payload.network : {}
  const location = isRecord(payload.location) ? payload.location : {}
  const detections = isRecord(payload.detections) ? payload.detections : {}
  const connectionType = cleanString(network.type)
  const hostingDetection = nullableBoolean(detections.hosting)

  const normalized = {
    fraudScore: boundedScore(detections.risk),
    proxy: nullableBoolean(detections.proxy),
    vpn: nullableBoolean(detections.vpn),
    tor: nullableBoolean(detections.tor),
    mobile: connectionType
      ? /^wireless$/i.test(connectionType)
      : null,
    datacenter: hostingDetection === true
      ? true
      : connectionType
        ? matchesDatacenter(connectionType)
        : hostingDetection,
    residential: connectionType
      ? matchesResidential(connectionType)
      : null,
    connectionType,
    asn: asnNumber(network.asn),
    organization: cleanString(network.organisation)
      ?? cleanString(network.provider),
    countryCode: cleanString(location.country_code),
    region: cleanString(location.region_name),
    city: cleanString(location.city_name),
    timezone: cleanString(location.timezone),
    latitude: finiteNumber(location.latitude),
    longitude: finiteNumber(location.longitude),
    postalCode: cleanString(location.postal_code),
  }

  const cacheResponse = new Response(JSON.stringify(normalized), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${RISK_CACHE_SECONDS}`,
    },
  })

  ctx.waitUntil(caches.default.put(cacheRequest, cacheResponse))
  return normalized
}

async function createRiskCacheKey(ip, apiKey) {
  const input = new TextEncoder().encode(`${apiKey}:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', input)
  const hash = Array.from(new Uint8Array(digest), byte =>
    byte.toString(16).padStart(2, '0'),
  ).join('')

  return `https://risk-cache.ermao.net/proxycheck-v3/${hash}`
}

function responseHeaders(request, extraHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    Vary: 'Origin',
    ...extraHeaders,
  }

  const origin = request.headers.get('Origin')
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Accept, Content-Type'
    headers['Access-Control-Max-Age'] = '86400'
  }

  return headers
}

function jsonResponse(request, body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(request, extraHeaders),
  })
}

function cleanString(value) {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  if (!normalized || normalized.toUpperCase() === 'N/A') return null
  return normalized
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function finiteNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function asnNumber(value) {
  if (typeof value === 'string') {
    return finiteNumber(value.replace(/^AS/i, ''))
  }

  return finiteNumber(value)
}

function boundedScore(value) {
  const number = finiteNumber(value)
  if (number === null) return null
  return Math.max(0, Math.min(100, Math.round(number)))
}

function nullableBoolean(value) {
  return typeof value === 'boolean' ? value : null
}

function matchesResidential(connectionType) {
  return typeof connectionType === 'string'
    ? /\bresidential\b/i.test(connectionType)
    : false
}

function matchesDatacenter(connectionType) {
  return typeof connectionType === 'string'
    ? /\b(?:data\s*center|datacenter|hosting|corporate)\b/i.test(connectionType)
    : false
}

function determineIpType({
  isResidential,
  isDatacenter,
  isSuspectedDatacenter,
  isProxy,
  isVpn,
  isTor,
  isMobile,
}) {
  if (isProxy || isVpn || isTor) return 'proxy'
  if (isResidential) return 'residential'
  if (isDatacenter) return 'datacenter'
  if (isSuspectedDatacenter) return 'suspected_datacenter'
  if (isMobile) return 'mobile'
  return 'unknown'
}
