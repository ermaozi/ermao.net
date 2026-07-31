const STATS_ORIGIN = 'https://www.ermao.net'

export const canonicalizeStatsPath = (rawPath) => {
  if (typeof rawPath !== 'string' || !rawPath) return ''

  let path
  try {
    path = new URL(rawPath, STATS_ORIGIN).pathname
  }
  catch {
    path = rawPath.split(/[?#]/, 1)[0]
  }

  path = path.replace(/\/{2,}/g, '/')
  if (path === '/en' || path === '/en/') return '/'
  if (path.startsWith('/en/')) path = path.slice(3)

  return path || '/'
}

export const localizeStatsPath = (rawPath, isEnglish) => {
  const path = canonicalizeStatsPath(rawPath)
  if (!path || !isEnglish) return path
  return path === '/' ? '/en/' : `/en${path}`
}
