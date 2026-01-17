import type { DigestDto } from '../types'

import { fetchJson } from 'shared/api'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isDigestDto(value: unknown): value is DigestDto {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'number' &&
    typeof value.created_at === 'string' &&
    typeof value.updated_at === 'string' &&
    typeof value.digest_text === 'string' &&
    (value.is_published === 0 || value.is_published === 1) &&
    typeof value.source_item_ids_json === 'string' &&
    (typeof value.llm_model === 'string' || value.llm_model === null) &&
    (typeof value.published_at === 'string' || value.published_at === null)
  )
}

function parseDigestList(payload: unknown): DigestDto[] {
  if (!Array.isArray(payload)) {
    throw new Error('Unexpected digests response: expected an array.')
  }

  const items: DigestDto[] = []
  for (const item of payload) {
    if (!isDigestDto(item)) {
      throw new Error('Unexpected digests response: invalid item shape.')
    }
    items.push(item)
  }

  return items
}

/**
 * Fetch digests list from the backend.
 *
 * Side effects:
 * - Network request.
 */
export async function fetchDigests(signal?: AbortSignal): Promise<DigestDto[]> {
  const data = await fetchJson<unknown>('/digests', { signal })
  return parseDigestList(data)
}
