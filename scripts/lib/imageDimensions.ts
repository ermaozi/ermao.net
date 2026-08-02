export type ImageDimensions = { width: number; height: number }

export const readImageDimensions = (buffer: Buffer): ImageDimensions | undefined => {
  if (buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
  }

  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2
    while (offset + 8 < buffer.length) {
      if (buffer[offset] !== 0xff) break
      const marker = buffer[offset + 1]
      const size = buffer.readUInt16BE(offset + 2)
      if ((marker >= 0xc0 && marker <= 0xc3)
        || (marker >= 0xc5 && marker <= 0xc7)
        || (marker >= 0xc9 && marker <= 0xcb)
        || (marker >= 0xcd && marker <= 0xcf)) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) }
      }
      if (size < 2) break
      offset += 2 + size
    }
  }

  const svg = buffer.toString('utf8', 0, Math.min(buffer.length, 131072)).match(/<svg\b[^>]*>/i)?.[0]
  if (!svg) return undefined

  const width = Number(svg.match(/\bwidth=["']([\d.]+)/i)?.[1])
  const height = Number(svg.match(/\bheight=["']([\d.]+)/i)?.[1])
  if (width > 0 && height > 0) return { width, height }

  const viewBox = svg.match(/\bviewBox=["']([^"']+)["']/i)?.[1]
    ?.trim().split(/[ ,]+/).map(Number)
  if (viewBox?.length === 4 && viewBox[2] > 0 && viewBox[3] > 0) {
    return { width: viewBox[2], height: viewBox[3] }
  }
}
