import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { fetchNewsItemsByIds } from '../api/newsItemsApi'
import type { NewsItemDto } from '../api/types'

import type { LoadStatus, NewsItemPreview } from './types'

function mapDtoToPreview(dto: NewsItemDto): NewsItemPreview {
  return {
    id: dto.id,
    source: dto.source,
    rawText: dto.raw_text,
  }
}

export interface UseNewsItemsByIdsParams {
  readonly ids: readonly number[]
  readonly enabled: boolean
}

export interface UseNewsItemsByIdsResult {
  readonly status: LoadStatus
  readonly items: readonly NewsItemPreview[]
  readonly error: string | null
  readonly refetch: () => void
}

/**
 * Fetches news items by IDs with abort-on-change/unmount behavior.
 */
export function useNewsItemsByIds(params: UseNewsItemsByIdsParams): UseNewsItemsByIdsResult {
  const { ids, enabled } = params

  const [status, setStatus] = useState<LoadStatus>('idle')
  const [items, setItems] = useState<readonly NewsItemPreview[]>([])
  const [error, setError] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const refetch = useCallback((): void => {
    setReloadKey((v) => v + 1)
  }, [])

  useEffect(() => {
    if (!enabled) {
      abortRef.current?.abort()
      abortRef.current = null
      return
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      return
    }

    const controller = new AbortController()
    abortRef.current = controller

    void (async () => {
      setStatus('loading')
      setError(null)

      try {
        const dtos = await fetchNewsItemsByIds({ ids, signal: controller.signal })
        setItems(dtos.map(mapDtoToPreview))
        setStatus('success')
      } catch (e) {
        if (controller.signal.aborted) {
          return
        }
        setStatus('error')
        setError(e instanceof Error ? e.message : 'Unknown error.')
      }
    })()

    return () => {
      controller.abort()
    }
  }, [enabled, ids, reloadKey])

  const effective = useMemo(() => {
    if (!enabled) {
      return { status: 'idle' as const, items: [] as const, error: null }
    }
    return { status, items, error }
  }, [enabled, error, items, status])

  return { ...effective, refetch }
}
