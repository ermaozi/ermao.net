import { canonicalizeStatsPath } from './stats-path.js'

const VISITOR_STORAGE_KEY = 'ermao_like_visitor_v1'
const statusRequests = new Map()

let inMemoryVisitorId = ''

export const resolveWorkerUrl = () => {
  // @ts-ignore
  let workerUrl = __STATS_WORKER_URL__
  if (typeof workerUrl === 'string' && workerUrl.startsWith('"') && workerUrl.endsWith('"')) {
    workerUrl = workerUrl.slice(1, -1)
  }
  return typeof workerUrl === 'string' ? workerUrl.replace(/\/+$/, '') : ''
}

const createVisitorId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replaceAll('-', '')
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(24)
    crypto.getRandomValues(bytes)
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
}

const getVisitorId = () => {
  if (inMemoryVisitorId) return inMemoryVisitorId
  if (typeof window === 'undefined') return ''

  try {
    const saved = window.localStorage.getItem(VISITOR_STORAGE_KEY)
    if (saved && /^[A-Za-z0-9_-]{20,128}$/.test(saved)) {
      inMemoryVisitorId = saved
      return saved
    }
  } catch {
    // A module-scoped identifier still keeps the current session usable.
  }

  inMemoryVisitorId = createVisitorId()
  try {
    window.localStorage.setItem(VISITOR_STORAGE_KEY, inMemoryVisitorId)
  } catch {
    // Storage can be disabled in privacy-focused browsers.
  }
  return inMemoryVisitorId
}

const getHeaders = (includeContentType = false) => {
  const headers = {
    'X-Ermao-Visitor': getVisitorId()
  }
  if (includeContentType) headers['Content-Type'] = 'application/json'
  return headers
}

const parseResponse = async (response) => {
  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new Error(data?.error || '点赞服务请求失败')
    error.status = response.status
    throw error
  }
  return data
}

export const getLikeStatus = (path, force = false) => {
  path = canonicalizeStatsPath(path)
  const workerUrl = resolveWorkerUrl()
  if (!workerUrl || !path) return Promise.reject(new Error('点赞服务地址未配置'))
  if (!force && statusRequests.has(path)) return statusRequests.get(path)

  const request = fetch(
    `${workerUrl}/api/likes/status?path=${encodeURIComponent(path)}`,
    {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
      cache: 'no-store'
    }
  )
    .then(parseResponse)
    .catch((error) => {
      statusRequests.delete(path)
      throw error
    })

  statusRequests.set(path, request)
  return request
}

const updateLike = async (path, method) => {
  path = canonicalizeStatsPath(path)
  const workerUrl = resolveWorkerUrl()
  if (!workerUrl || !path) throw new Error('点赞服务地址未配置')

  const response = await fetch(`${workerUrl}/api/likes`, {
    method,
    headers: getHeaders(true),
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify({ path })
  })
  const data = await parseResponse(response)
  statusRequests.set(path, Promise.resolve(data))

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ermao:like-updated', { detail: data }))
  }
  return data
}

export const submitLike = (path) => updateLike(path, 'POST')

export const removeLike = (path) => updateLike(path, 'DELETE')
