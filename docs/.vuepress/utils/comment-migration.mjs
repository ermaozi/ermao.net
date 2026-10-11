// Public identifiers only. No credentials or copied comment content belongs here.
export const SOURCE = { repo: 'ermaozi/ermao.net', repoId: 'R_kgDOL4rZSQ', categoryId: 'DIC_kwDOL4rZSc4CiGyu' }
export const TARGET = { repo: 'ermaozi/ermao-comments', repoId: 'R_kgDOVEXqqw', categoryId: 'DIC_kwDOVEXqq84DHiRr' }
export const REGISTRY = 'https://raw.githubusercontent.com/ermaozi/ermao-comments/main/comment-migration.json'
export const pathnameTerm = path => path.length < 2 ? 'index' : path.substring(1).replace(/\.\w+$/, '')
export const numberFrom = (discussion, repo) => {
  const prefix = `https://github.com/${repo}/discussions/`
  if (!discussion?.url?.startsWith(prefix)) return null
  const value = discussion.url.slice(prefix.length)
  return /^[1-9]\d*$/.test(value) ? Number(value) : null
}
export const hasAnchor = (discussion, anchor) => !anchor || discussion?.comments?.some(comment =>
  comment.url?.endsWith(`#discussioncomment-${anchor}`))
export async function readDiscussion(repo, params, signal) {
  const url = new URL('https://giscus.app/api/discussions')
  url.search = new URLSearchParams({ repo, first: '100', ...params }).toString()
  const response = await fetch(url, { signal, credentials: 'omit' })
  if (response.status === 404) return null
  const data = await response.json()
  // GitHub's numbered lookup reports a moved discussion as GraphQL NOT_FOUND;
  // Giscus currently exposes that exact error as HTTP 500, unlike search's 404.
  if (response.status === 500 && /^[1-9]\d*$/.test(params.number ?? '') &&
      data.error === `Could not resolve to a Discussion with the number of ${params.number}.`) return null
  if (!response.ok) throw new Error(`Comments unavailable (${response.status})`)
  if (!data.discussion) throw new Error('Invalid comments response')
  return data.discussion
}
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
// Never fall back to a different historical duplicate or create a replacement
// thread when a known discussion is between repositories/search indexes.
export async function resolveComment(term, entry, targets = {}, read = readDiscussion, signal) {
  const numbered = (repo, number) => ({ ...repo, mapping: 'number', term: String(number) })
  const exact = targets[entry?.source]
  if (entry && Number.isSafeInteger(exact) && exact > 0) {
    const discussion = await read(TARGET.repo, { number: String(exact) }, signal)
    if (numberFrom(discussion, TARGET.repo) === exact && hasAnchor(discussion, entry.anchor)) return numbered(TARGET, exact)
  }
  const old = await read(SOURCE.repo, entry
    ? { number: String(entry.source), first: '1' }
    : { term, strict: 'true', first: '1' }, signal)
  const oldNumber = numberFrom(old, SOURCE.repo)
  if (oldNumber && (!entry || oldNumber === entry.source)) return numbered(SOURCE, oldNumber)
  const moved = await read(TARGET.repo, { term, strict: 'true' }, signal)
  const newNumber = numberFrom(moved, TARGET.repo)
  if (newNumber && hasAnchor(moved, entry?.anchor)) return numbered(TARGET, newNumber)
  if (entry || moved) return null
  // New articles create comments in the dedicated public repository.
  return { ...TARGET, mapping: 'pathname', term }
}
