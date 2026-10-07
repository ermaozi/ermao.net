import { execFileSync } from 'node:child_process'
import type { Page } from 'vuepress/core'

// A content timestamp is not a release identifier: unchanged articles survive
// multiple releases, including stale CDN HTML. CI supplies the exact commit.
export const resolveBuildRevision = (
  env: NodeJS.ProcessEnv = process.env,
  readGit: () => string = () => execFileSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
  }).trim(),
): string => {
  const ciRevision = env.GITHUB_SHA?.trim()
  if (ciRevision) {
    if (!/^[a-f\d]{40}$/i.test(ciRevision)) throw new Error('Invalid GITHUB_SHA')
    return ciRevision.toLowerCase()
  }
  try {
    const revision = readGit().trim()
    if (/^[a-f\d]{40}$/i.test(revision)) return revision.toLowerCase()
  }
  catch { /* A downloaded source tree can still be previewed locally. */ }
  return 'local-development'
}

export default (revision = resolveBuildRevision()) => ({
  name: 'ermao-build-revision',
  extendsPage: (page: Page) => {
    page.frontmatter.head = (page.frontmatter.head ?? []).filter(
      item => !(item[0] === 'meta' && item[1]?.name === 'ermao:build-revision'),
    )
    page.frontmatter.head.push(['meta', { name: 'ermao:build-revision', content: revision }])
  },
})
