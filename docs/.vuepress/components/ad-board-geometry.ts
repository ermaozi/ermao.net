export interface NoteRect {
  left: number
  right: number
  top: number
  bottom: number
}

const intersectWithTarget = (target: NoteRect, overlay: NoteRect): NoteRect | null => {
  const intersection = {
    left: Math.max(target.left, overlay.left),
    right: Math.min(target.right, overlay.right),
    top: Math.max(target.top, overlay.top),
    bottom: Math.min(target.bottom, overlay.bottom),
  }

  return intersection.right > intersection.left && intersection.bottom > intersection.top
    ? intersection
    : null
}

// Exact union coverage for axis-aligned note rectangles. Every vertical slice
// of the old note must be covered from top to bottom by higher-z notes.
export const isFullyCovered = (target: NoteRect, overlays: NoteRect[]) => {
  const intersections = overlays
    .map(overlay => intersectWithTarget(target, overlay))
    .filter((rect): rect is NoteRect => rect !== null)

  if (intersections.length === 0) return false

  const xBreaks = [...new Set([
    target.left,
    target.right,
    ...intersections.flatMap(rect => [rect.left, rect.right]),
  ])].sort((a, b) => a - b)

  const epsilon = 0.5

  for (let index = 0; index < xBreaks.length - 1; index += 1) {
    const fromX = xBreaks[index]
    const toX = xBreaks[index + 1]
    if (toX - fromX <= epsilon) continue

    const midpoint = (fromX + toX) / 2
    const verticalIntervals = intersections
      .filter(rect => rect.left <= midpoint && rect.right >= midpoint)
      .map(rect => [rect.top, rect.bottom] as const)
      .sort((a, b) => a[0] - b[0])

    let coveredUntil = target.top

    for (const [top, bottom] of verticalIntervals) {
      if (top > coveredUntil + epsilon) break
      coveredUntil = Math.max(coveredUntil, bottom)
      if (coveredUntil >= target.bottom - epsilon) break
    }

    if (coveredUntil < target.bottom - epsilon) return false
  }

  return true
}
