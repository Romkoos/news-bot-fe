import { create } from 'zustand'

import { fetchDigests } from '../api'
import type { DigestDto } from '../types'

import type { DigestStatus } from './types'

export interface DigestStore {
  readonly items: readonly DigestDto[]
  readonly status: DigestStatus
  readonly error: string | null
  readonly lastLoadedAt: number | null

  /**
   * Loads digests into the entity cache.
   *
   * Side effects:
   * - Network request.
   * - Cancels the previous request, if still in-flight.
   */
  readonly loadDigests: (params?: { readonly force?: boolean }) => Promise<void>
}

const STALE_TIME_MS = 30_000

let activeAbortController: AbortController | null = null

export const useDigestStore = create<DigestStore>((set, get) => ({
  items: [],
  status: 'idle',
  error: null,
  lastLoadedAt: null,
  loadDigests: async (params) => {
    const { force = false } = params ?? {}
    const { lastLoadedAt, status } = get()

    if (!force && status === 'success' && lastLoadedAt !== null) {
      const isFresh = Date.now() - lastLoadedAt < STALE_TIME_MS
      if (isFresh) {
        return
      }
    }

    if (activeAbortController) {
      activeAbortController.abort()
    }

    activeAbortController = new AbortController()
    const requestSignal = activeAbortController.signal

    set({ status: 'loading', error: null })

    try {
      const items = await fetchDigests(requestSignal)
      if (requestSignal.aborted) {
        return
      }

      set({ items, status: 'success', error: null, lastLoadedAt: Date.now() })
    } catch (error) {
      if (requestSignal.aborted) {
        return
      }

      const message = error instanceof Error ? error.message : 'Unknown error'
      set({ status: 'error', error: message })
    }
  },
}))
