import { canonicalizeStatsPath } from './stats-path.js'

const VISITOR_STORAGE_KEY = 'ermao_like_visitor_v1'
const statusRequests = new Map()
const pendingStatusRequests = new Map()

let statusBatchScheduled = false

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

const flushStatusBatch = async () => {
  statusBatchScheduled = false
  const batch = Array.from(pendingStatusRequests.entries()).slice(0, 20)
  batch.forEach(([path]) => pendingStatusRequests.delete(path))
  if (pendingStatusRequests.size > 0) {
    statusBatchScheduled = true
    queueMicrotask(flushStatusBatch)
  }

  const workerUrl = resolveWorkerUrl()
  try {
    const response = await fetch(`${workerUrl}/engagement`, {
      method: 'POST',
      headers: getHeaders(true),
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify({ paths: batch.map(([path]) => path) })
    })
    const data = await parseResponse(response)
    const items = new Map((data?.items || []).map(item => [item.path, item]))

    for (const [path, pending] of batch) {
      const item = items.get(path)
      if (item) pending.resolve(item)
      else pending.reject(new Error('文章统计数据缺失'))
    }
  } catch (error) {
    for (const [path, pending] of batch) {
      if (statusRequests.get(path) === pending.request) statusRequests.delete(path)
      pending.reject(error)
    }
  }
}

export const getEngagementStatus = (path, force = false) => {
  path = canonicalizeStatsPath(path)
  const workerUrl = resolveWorkerUrl()
  if (!workerUrl || !path) return Promise.reject(new Error('点赞服务地址未配置'))
  if (!force && statusRequests.has(path)) return statusRequests.get(path)

  let resolveRequest
  let rejectRequest
  const request = new Promise((resolve, reject) => {
    resolveRequest = resolve
    rejectRequest = reject
  })

  statusRequests.set(path, request)
  pendingStatusRequests.set(path, {
    request,
    resolve: resolveRequest,
    reject: rejectRequest
  })
  if (!statusBatchScheduled) {
    statusBatchScheduled = true
    queueMicrotask(flushStatusBatch)
  }
  return request
}

export const getLikeStatus = getEngagementStatus

const updateLike = async (path, method) => {
  path = canonicalizeStatsPath(path)
  const workerUrl = resolveWorkerUrl()
  if (!workerUrl || !path) throw new Error('点赞服务地址未配置')

  const cachedRequest = statusRequests.get(path)
  const response = await fetch(`${workerUrl}/likes`, {
    method,
    headers: getHeaders(true),
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify({ path })
  })
  const data = await parseResponse(response)
  const cached = await cachedRequest?.catch(() => null)
  const updated = { ...cached, ...data }
  statusRequests.set(path, Promise.resolve(updated))

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ermao:like-updated', { detail: updated }))
  }
  return updated
}

export const submitLike = (path) => updateLike(path, 'POST')

export const removeLike = (path) => updateLike(path, 'DELETE')
