import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import type { Plugin } from 'vuepress'
import { readImageDimensions, type ImageDimensions } from '../../../scripts/lib/imageDimensions.js'

const imageRoot = path.resolve(process.cwd(), 'docs')
const dimensionManifest = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'docs/.vuepress/data/image-dimensions.json'), 'utf8'),
) as Record<string, [number, number]>
const generatedWeeklySvg = /^https:\/\/image\.ermao\.net\/images\/(?:en\/)?blog\/weekly-news-[^/]+\/[^/]+\.svg(?:[?#].*)?$/i

const collectImages = (directory: string, result = new Map<string, ImageDimensions | null>()) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      collectImages(file, result)
    }
    else if (/\.(?:png|jpe?g)$/i.test(entry.name)) {
      const dimensions = readImageDimensions(fs.readFileSync(file))
      if (!dimensions) continue
      const key = entry.name.toLowerCase()
      const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 6)
      // Only use a basename fallback when it is unambiguous.
      result.set(key, result.has(key) ? null : dimensions)
      // R2 filenames include this content hash, so dimensions remain available
      // after the uploader replaces local Markdown URLs with CDN URLs.
      result.set(hash, dimensions)
    }
  }
  return result
}

const dimensionsByBasename = collectImages(imageRoot)

const imagePerformancePlugin = (): Plugin => ({
  name: 'ermao-image-performance',
  extendsMarkdown: (md) => {
    const original = md.renderer.rules.image
      ?? ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options))

    md.renderer.rules.image = (tokens, index, options, env, self) => {
      const token = tokens[index]
      const src = token.attrGet('src') ?? ''
      const normalizedSrc = src.split(/[?#]/)[0]
      const basename = decodeURIComponent(src.split(/[?#]/)[0].split('/').pop() ?? '').toLowerCase()
      const contentHash = basename.match(/-([a-f0-9]{6})\.[^.]+$/)?.[1]
      const storedDimensions = dimensionManifest[normalizedSrc]
      const dimensions = storedDimensions
        ? { width: storedDimensions[0], height: storedDimensions[1] }
        : dimensionsByBasename.get(basename)
        ?? (contentHash ? dimensionsByBasename.get(contentHash) : undefined)
        ?? (generatedWeeklySvg.test(src) ? { width: 1600, height: 900 } : undefined)

      if (dimensions) {
        token.attrSet('width', String(dimensions.width))
        token.attrSet('height', String(dimensions.height))
      }
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
