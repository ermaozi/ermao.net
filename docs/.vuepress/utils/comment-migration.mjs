// Public identifiers only. No credentials or copied comment content belongs here.
export const SOURCE = { repo: 'ermaozi/ermao.net', repoId: 'R_kgDOL4rZSQ', categoryId: 'DIC_kwDOL4rZSc4CiGyu' }
export const TARGET = { repo: 'ermaozi/ermao-comments', repoId: 'R_kgDOVEXqqw', categoryId: 'DIC_kwDOVEXqq84DHiRr' }
export const REGISTRY = 'https://raw.githubusercontent.com/ermaozi/ermao-comments/main/comment-migration.json'
export const pathnameTerm = path => path.length < 2 ? 'index' : path.substring(1).replace(/\.\w+$/, '')
export async function readRegistry(signal) {
  const controller = new AbortController()
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort, { once: true })
  if (signal?.aborted) controller.abort()
  const timer = setTimeout(abort, 3000)
  try {
    const response = await fetch(`${REGISTRY}?v=${Math.floor(Date.now() / 30000)}`, { signal: controller.signal, credentials: 'omit' })
    if (!response.ok) return {}
    const data = await response.json()
    return data.version === 1 && data.targets && typeof data.targets === 'object' ? data.targets : {}
  } catch { return {} } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
  }
}
// Only the server-side audit may publish old → new numbers. Giscus's API
// accepts requests from its own origin, so browser code must use its iframe.
export function selectComment(term, entry, targets = {}) {
  const number = entry && targets[entry.source]
  const target = Number.isSafeInteger(number) && number > 0
  if (entry) return {
    ...(target ? TARGET : SOURCE),
    mapping: 'number', term: String(target ? number : entry.source),
  }
  return { ...TARGET, mapping: 'pathname', term }
}
