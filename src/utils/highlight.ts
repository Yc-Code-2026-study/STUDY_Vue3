/**
 * 把一段文本按关键词切成片段，命中部分标记 hit。
 * 用文本节点渲染而非 v-html，避免帖子原文里的 HTML 被当作代码执行。
 */
export function splitKeyword(
  text: string,
  keyword: string
): { text: string; hit: boolean }[] {
  const kw = keyword.trim()
  if (!kw || !text) return [{ text, hit: false }]

  const segments: { text: string; hit: boolean }[] = []
  const lowerText = text.toLowerCase()
  const lowerKw = kw.toLowerCase()
  let cursor = 0

  while (cursor < text.length) {
    const idx = lowerText.indexOf(lowerKw, cursor)
    if (idx === -1) {
      segments.push({ text: text.slice(cursor), hit: false })
      break
    }
    if (idx > cursor) {
      segments.push({ text: text.slice(cursor, idx), hit: false })
    }
    segments.push({ text: text.slice(idx, idx + kw.length), hit: true })
    cursor = idx + kw.length
  }

  return segments
}
