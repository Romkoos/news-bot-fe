function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

/**
 * Formats a date/time string to `HH:mm dd.mm.yyyy`.
 *
 * - Returns `null` when input is `null`/`undefined`/invalid.
 * - Uses local timezone (browser).
 */
export function formatDateTime(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  const hours = pad2(date.getHours())
  const minutes = pad2(date.getMinutes())
  const day = pad2(date.getDate())
  const month = pad2(date.getMonth() + 1)
  const year = String(date.getFullYear())

  return `${hours}:${minutes} ${day}.${month}.${year}`
}
