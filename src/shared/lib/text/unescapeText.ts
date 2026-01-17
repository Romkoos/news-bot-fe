const TELEGRAM_MARKDOWN_V2_ESCAPABLE = '_*[]()~`>#+-=|{}.!'

function escapeForCharClass(value: string): string {
  // Escape only what matters inside a char class.
  // - '\' must be escaped
  // - ']' must be escaped
  // - '-' must be escaped (unless first/last, but we keep it simple)
  return value.replace(/\\/g, '\\\\').replace(/]/g, '\\]').replace(/-/g, '\\-')
}

const TELEGRAM_MARKDOWN_V2_ESCAPED_CHARS = new RegExp(
  String.raw`\\([${escapeForCharClass(TELEGRAM_MARKDOWN_V2_ESCAPABLE)}])`,
  'g',
)

function decodeDoubleEscapes(value: string): string {
  // Convert common double-escaped sequences from the backend into real characters.
  // Examples:
  // - "\\n" -> "\n"
  // - "\\u003c" -> "<"
  return value
    .replaceAll('\\\\r', '\r')
    .replaceAll('\\\\n', '\n')
    .replaceAll('\\\\t', '\t')
    .replaceAll('\\r', '\r')
    .replaceAll('\\n', '\n')
    .replaceAll('\\t', '\t')
    .replace(/\\\\u([0-9a-fA-F]{4})/g, (_, hex: string) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    )
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    )
}

function unescapeTelegramMarkdownV2(value: string): string {
  /**
   * Telegram MarkdownV2 uses backslash to escape special characters.
   * We remove those backslashes so text is readable.
   *
   * https://core.telegram.org/bots/api#markdownv2-style
   */
  // Handle `\\!` -> `!` (double-backslash from backend), and also `\!` -> `!` (single).
  const withoutDouble = value.replace(/\\\\(.)/g, '$1')
  return withoutDouble.replace(TELEGRAM_MARKDOWN_V2_ESCAPED_CHARS, '$1')
}

/**
 * Unescapes a string that contains JSON-like escaping (e.g. `\\n`, `\\t`, `\\uXXXX`),
 * converting it into a human-readable string.
 *
 * This function is intended for rendering plain text. It does not interpret HTML.
 */
export function unescapeText(value: string): string {
  const decoded = decodeDoubleEscapes(value)
  return unescapeTelegramMarkdownV2(decoded)
}
