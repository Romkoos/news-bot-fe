import { create } from 'zustand'

import { getLlmConfig, updateLlmConfig } from '../api'
import type { LlmConfig } from '../types'

import type { LlmConfigStatus } from './types'

export interface LlmConfigStore {
  readonly item: LlmConfig | null
  readonly status: LlmConfigStatus
  readonly error: string | null

  readonly isSaving: boolean
  readonly saveError: string | null

  /**
   * Loads the current LLM config.
   *
   * Side effects:
   * - Network request.
   * - Cancels the previous load request, if still in-flight.
   */
  readonly load: (params?: { readonly force?: boolean }) => Promise<void>

  /**
   * Updates the LLM config on the backend.
   *
   * Side effects:
   * - Network request.
   * - Cancels the previous save request, if still in-flight.
   */
  readonly save: (payload: {
    readonly model: string
    readonly instructions: string
  }) => Promise<void>
}

const STALE_TIME_MS = 30_000

let activeLoadAbortController: AbortController | null = null
let activeSaveAbortController: AbortController | null = null

export const useLlmConfigStore = create<LlmConfigStore>((set, get) => ({
  item: null,
  status: 'idle',
  error: null,
  isSaving: false,
  saveError: null,
  load: async (params) => {
    const { force = false } = params ?? {}

    const { status, item } = get()
    const isFresh =
      item !== null &&
      typeof item.updatedAt === 'string' &&
      Date.now() - new Date(item.updatedAt).getTime() < STALE_TIME_MS

    if (!force && status === 'success' && isFresh) {
      return
    }

    if (activeLoadAbortController) {
      activeLoadAbortController.abort()
    }

    activeLoadAbortController = new AbortController()
    const requestSignal = activeLoadAbortController.signal

    set({ status: 'loading', error: null })

    try {
      const loaded = await getLlmConfig(requestSignal)
      if (requestSignal.aborted) {
        return
      }

      set({ item: loaded, status: 'success', error: null })
    } catch (error) {
      if (requestSignal.aborted) {
        return
      }

      const message = error instanceof Error ? error.message : 'Unknown error'
      set({ status: 'error', error: message })
    }
  },
  save: async (payload) => {
    if (activeSaveAbortController) {
      activeSaveAbortController.abort()
    }

    activeSaveAbortController = new AbortController()
    const requestSignal = activeSaveAbortController.signal

    set({ isSaving: true, saveError: null })

    try {
      const updated = await updateLlmConfig(payload, requestSignal)
      if (requestSignal.aborted) {
        return
      }

      set({ item: updated, isSaving: false, saveError: null })
    } catch (error) {
      if (requestSignal.aborted) {
        return
      }

      const message = error instanceof Error ? error.message : 'Unknown error'
      set({ isSaving: false, saveError: message })
      throw error instanceof Error ? error : new Error(message)
    }
  },
}))
