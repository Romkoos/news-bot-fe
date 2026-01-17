export interface ParseSourceItemIdsJsonResultOk {
  readonly ok: true
  readonly ids: readonly number[]
}

export interface ParseSourceItemIdsJsonResultError {
  readonly ok: false
  readonly error: string
}

export type ParseSourceItemIdsJsonResult =
  | ParseSourceItemIdsJsonResultOk
  | ParseSourceItemIdsJsonResultError

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

/**
 * Parse digest `source_item_ids_json` into a number array.
 *
 * The backend stores IDs as a JSON string (e.g. `"[110,111,112]"`), so we must parse and validate
 * it before building a request.
 */
export function parseSourceItemIdsJson(sourceItemIdsJson: string): ParseSourceItemIdsJsonResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(sourceItemIdsJson)
  } catch {
    return { ok: false, error: 'Invalid JSON.' }
  }

  if (!Array.isArray(parsed)) {
    return { ok: false, error: 'Expected a JSON array.' }
  }

  const ids: number[] = []
  for (const value of parsed) {
    if (!isFiniteNumber(value) || !Number.isInteger(value)) {
      return { ok: false, error: 'Expected an array of integers.' }
    }
    ids.push(value)
  }

  return { ok: true, ids }
}
