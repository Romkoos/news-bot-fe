import type { NewsItemDto } from './types'

import { fetchJson, getApiBaseUrl } from 'shared/api'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNewsItemDto(value: unknown): value is NewsItemDto {
  if (!isRecord(value)) {
    return false
  }

  const mediaType = value.media_type
  return (
    typeof value.id === 'number' &&
    typeof value.source === 'string' &&
    typeof value.raw_text === 'string' &&
    (typeof value.published_at === 'string' || value.published_at === null) &&
    typeof value.scraped_at === 'string' &&
    (value.processed === 0 || value.processed === 1) &&
    (mediaType === 'video' || mediaType === 'image' || mediaType === null) &&
    (typeof value.media_url === 'string' || value.media_url === null)
  )
}

function parseNewsItems(payload: unknown): NewsItemDto[] {
  if (!Array.isArray(payload)) {
    throw new Error('Unexpected news items response: expected an array.')
  }

  const items: NewsItemDto[] = []
  for (const item of payload) {
    if (!isNewsItemDto(item)) {
      throw new Error('Unexpected news items response: invalid item shape.')
    }
    items.push(item)
  }

  return items
}

export interface FetchNewsItemsByIdsParams {
  readonly ids: readonly number[]
  readonly signal?: AbortSignal
}

/**
 * Fetch news items by IDs.
 *
 * Side effects:
 * - Network request.
 */
export async function fetchNewsItemsByIds(
  params: FetchNewsItemsByIdsParams,
): Promise<readonly NewsItemDto[]> {
  const { ids, signal } = params

  if (ids.length === 0) {
    return []
  }

  // Keep the query simple and deterministic: `ids=110,111,112`.
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}/news-items/by-ids?ids=${ids.join(',')}`
  const data = await fetchJson<unknown>(url, { signal })
  return parseNewsItems(data)
}
