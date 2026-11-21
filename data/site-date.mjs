// Dates without an explicit timezone are editorial Asia/Shanghai wall time.
// Validate components before Date construction: JavaScript silently rolls invalid days.
export const parseSiteDateTime = (value) => {
  // Some build consumers already provide a Date; the source audit keeps YAML strings.
  if (value instanceof Date) return new Date(value.getTime())
  if (typeof value !== 'string') return new Date(Number.NaN)
  const text = value.trim()
  const local = /^(\d{4})([/-])(\d{1,2})\2(\d{1,2})[ T](\d{1,2}):(\d{1,2}):(\d{1,2})$/.exec(text)
  const iso = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/.exec(text)
  if (!local && !iso) return new Date(Number.NaN)
  const parts = local ? [local[1], local[3], local[4], local[5], local[6], local[7]] : iso.slice(1, 7)
  const [year, month, day, hour, minute, second] = parts.map(Number)
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const zone = local ? '+08:00' : iso[8]
  if (month < 1 || month > 12 || day < 1 || day > days[month - 1]
      || hour > 23 || minute > 59 || second > 59
      || (zone !== 'Z' && (Number(zone.slice(1, 3)) > 23 || Number(zone.slice(4)) > 59))) {
    return new Date(Number.NaN)
  }
  const [y, mo, d, h, mi, s] = parts.map((part, index) => part.padStart(index === 0 ? 4 : 2, '0'))
  const fraction = iso?.[7] ? `.${iso[7]}` : ''
  return new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}${fraction}${zone}`)
}

export const toIsoDate = (value) => {
  const date = parseSiteDateTime(value)
  return Number.isNaN(+date) ? undefined : date.toISOString()
}

export const validateSiteDates = (frontmatter, now = new Date()) => {
  const issues = []
  const dates = {}
  for (const [field, label] of [['createTime', 'create'], ['updateTime', 'update']]) {
    if (frontmatter[field] === undefined || frontmatter[field] === null) continue
    const date = parseSiteDateTime(frontmatter[field])
    dates[field] = date
    if (Number.isNaN(+date)) issues.push({ type: `invalid-${label}-time`, message: String(frontmatter[field]) })
    else if (date > now) issues.push({ type: `future-${label}-time`, message: String(frontmatter[field]) })
  }
  if (dates.updateTime < dates.createTime) {
    issues.push({ type: 'update-before-create-time', message: 'updateTime precedes createTime' })
  }
  return issues
}
