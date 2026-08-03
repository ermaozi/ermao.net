import type { Plugin } from 'vuepress'

const imagePerformancePlugin = (): Plugin => ({
  name: 'ermao-image-performance',
  extendsMarkdown: (md) => {
    const original = md.renderer.rules.image
      ?? ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options))

    md.renderer.rules.image = (tokens, index, options, env, self) => {
      const token = tokens[index]
      token.attrSet('decoding', 'async')

      // The first article image is the most likely LCP candidate. Do not leave it
      // behind the lazy-load threshold; all later images retain lazy loading.
      const state = env as { __ermaoImageCount?: number }
      const imageIndex = state.__ermaoImageCount ?? 0
      state.__ermaoImageCount = imageIndex + 1
      if (imageIndex === 0) {
        token.attrSet('loading', 'eager')
        token.attrSet('fetchpriority', 'high')
      }
      else {
        token.attrSet('loading', 'lazy')
      }

      return original(tokens, index, options, env, self)
    }
  },
})

export default imagePerformancePlugin
