export type MarkdownLinkToken =
  | {
      readonly kind: 'text'
      readonly text: string
    }
  | {
      readonly kind: 'link'
      readonly text: string
      readonly href: string
    }

function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Parses markdown-style links of shape `[label](https://example.com)` into tokens.
 *
 * - Preserves all non-link text as `text` tokens.
 * - Converts only http/https URLs; everything else stays as text.
 */
export function parseMarkdownLinks(input: string): readonly MarkdownLinkToken[] {
  const tokens: MarkdownLinkToken[] = []

  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(input)) !== null) {
    const [full, label, hrefRaw] = match
    const start = match.index
    const end = start + full.length

    if (start > lastIndex) {
      tokens.push({ kind: 'text', text: input.slice(lastIndex, start) })
    }

    const href = hrefRaw.trim()
    if (isSafeHttpUrl(href)) {
      tokens.push({ kind: 'link', text: label, href })
    } else {
      tokens.push({ kind: 'text', text: full })
    }

    lastIndex = end
  }

  if (lastIndex < input.length) {
    tokens.push({ kind: 'text', text: input.slice(lastIndex) })
  }

  return tokens
}
