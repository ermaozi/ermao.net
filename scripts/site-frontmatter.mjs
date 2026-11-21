import { createRequire } from 'node:module'
import matter from 'gray-matter'

// Use gray-matter's own YAML version and safe types, except automatic timestamps.
// Otherwise YAML rolls e.g. February 30 forward before our strict date audit sees it.
const require = createRequire(import.meta.url)
const yaml = createRequire(require.resolve('gray-matter'))('js-yaml')
const schema = new yaml.Schema({
  implicit: yaml.DEFAULT_SAFE_SCHEMA.compiledImplicit.filter(type => type.tag !== 'tag:yaml.org,2002:timestamp'),
  explicit: yaml.DEFAULT_SAFE_SCHEMA.compiledExplicit,
})
export const parseSiteFrontmatter = raw => matter(raw, {
  engines: { yaml: text => {
    const data = yaml.safeLoad(text)
    const dates = yaml.safeLoad(text, { schema })
    // Preserve all other existing YAML field types and values.
    for (const field of ['createTime', 'updateTime']) {
      if (dates && Object.hasOwn(dates, field)) data[field] = dates[field]
    }
    return data
  } },
})
