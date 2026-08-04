import type { Plugin } from 'vuepress'

const imageWidths = [480, 768, 1080, 1440]

const addResponsiveImageAttrs = (token: any) => {
  const src = token.attrGet('src')
  const originalWidth = Number(token.attrGet('width'))
  if (!src?.startsWith('https://image.ermao.net/')
    || src.includes('/cdn-cgi/image/')
    || !/\.(?:avif|jpe?g|png|webp)(?:\?|$)/i.test(src)
    || !Number.isFinite(originalWidth)
    || originalWidth <= imageWidths[0]) return

  const source = new URL(src)
  const widths = imageWidths.filter(width => width < originalWidth)
  const resized = widths.map(width =>
    `https://image.ermao.net/cdn-cgi/image/width=${width}%2Cformat=auto${source.pathname}${source.search} ${width}w`,
  )

  token.attrSet('srcset', [...resized, `${src} ${originalWidth}w`].join(', '))
  token.attrSet('sizes', '(max-width: 768px) calc(100vw - 32px), 770px')
}

const imagePerformancePlugin = (): Plugin => ({
  name: 'ermao-image-performance',
  extendsMarkdown: (md) => {
    const original = md.renderer.rules.image
      ?? ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options))

    md.renderer.rules.image = (tokens, index, options, env, self) => {
      const token = tokens[index]
      token.attrSet('decoding', 'async')
      addResponsiveImageAttrs(token)

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
