import { create } from 'zustand'

import type { LlmDto } from 'entities/llm'
import { createLlm, deleteLlm, getLlms } from 'entities/llm'
import type { LlmModelDto } from 'entities/llm-model'
import { createLlmModel, deleteLlmModel, getModelsByLlmId } from 'entities/llm-model'

export type LlmManagementStatus = 'idle' | 'loading' | 'success' | 'error'

export interface LlmManagementStore {
  readonly llms: LlmDto[]
  readonly llmsStatus: LlmManagementStatus
  readonly llmsError: string | null

  /**
   * The “default” provider id (first item in `llms`, if present).
   *
   * UI and consumers should treat this provider as non-changeable.
   */
  readonly defaultLlmId: number | null

  readonly selectedLlmId: number | null

  readonly models: LlmModelDto[]
  readonly modelsStatus: LlmManagementStatus
  readonly modelsError: string | null

  readonly selectedModelId: number | null

  readonly isMutating: boolean
  readonly mutationError: string | null

  /**
   * Loads the list of LLM providers.
   *
   * Side effects:
   * - Network request.
   * - Cancels the previous providers request, if still in-flight.
   */
  readonly loadLlms: (params?: { readonly force?: boolean }) => Promise<void>

  /**
   * Selects an LLM provider and (when `llmId` is not null) loads its models.
   *
   * Side effects:
   * - Network request.
   * - Cancels the previous models request, if still in-flight.
   */
  readonly selectLlm: (llmId: number | null) => Promise<void>

  /**
   * Selects a model (no network).
   */
  readonly selectModel: (modelId: number | null) => void

  /**
   * Creates a new LLM provider and reloads the providers list.
   *
   * Side effects:
   * - Network request.
   */
  readonly addLlm: (payload: { readonly name: string; readonly alias: string }) => Promise<LlmDto>

  /**
   * Deletes an LLM provider and all models linked to it (cascade delete).
   *
   * Side effects:
   * - Network requests (models delete, then provider delete).
   */
  readonly deleteLlmCascade: (llmId: number) => Promise<void>

  /**
   * Creates a model linked to the currently selected LLM provider and reloads models.
   *
   * Side effects:
   * - Network request.
   */
  readonly addModel: (payload: { readonly name: string }) => Promise<LlmModelDto>

  /**
   * Deletes a model and reloads models for the selected LLM provider.
   *
   * Side effects:
   * - Network request.
   */
  readonly deleteModel: (modelId: number) => Promise<void>
}

const STALE_TIME_MS = 30_000

let activeLlmsAbortController: AbortController | null = null
let activeModelsAbortController: AbortController | null = null

let lastLlmsLoadedAtMs: number | null = null
const lastModelsLoadedAtByLlmId = new Map<number, number>()

function errorToMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error'
}

export const useLlmManagementStore = create<LlmManagementStore>((set, get) => ({
  llms: [],
  llmsStatus: 'idle',
  llmsError: null,
  defaultLlmId: null,
  selectedLlmId: null,
  models: [],
  modelsStatus: 'idle',
  modelsError: null,
  selectedModelId: null,
  isMutating: false,
  mutationError: null,
  loadLlms: async (params) => {
    const { force = false } = params ?? {}

    const isFresh =
      lastLlmsLoadedAtMs !== null &&
      Date.now() - lastLlmsLoadedAtMs < STALE_TIME_MS &&
      get().llmsStatus === 'success'
    if (!force && isFresh) {
      return
    }

    if (activeLlmsAbortController) {
      activeLlmsAbortController.abort()
    }
    activeLlmsAbortController = new AbortController()
    const requestSignal = activeLlmsAbortController.signal

    set({ llmsStatus: 'loading', llmsError: null })
    try {
      const llms = await getLlms(requestSignal)
      if (requestSignal.aborted) {
        return
      }

      const defaultLlmId = llms.length > 0 ? (llms[0]?.id ?? null) : null
      lastLlmsLoadedAtMs = Date.now()
      set({ llms, llmsStatus: 'success', llmsError: null, defaultLlmId })

      // Enforce “default provider = first in list” and keep it non-changeable.
      // This also means that if backend ordering changes, the default provider changes accordingly.
      await get().selectLlm(defaultLlmId)
    } catch (error) {
      if (requestSignal.aborted) {
        return
      }
      set({ llmsStatus: 'error', llmsError: errorToMessage(error) })
    }
  },
  selectLlm: async (llmId) => {
    const defaultLlmId = get().defaultLlmId
    const enforcedId = defaultLlmId ?? llmId
    // When default provider exists, disallow switching away from it (including clearing).
    const nextId = defaultLlmId !== null ? defaultLlmId : enforcedId

    set({
      selectedLlmId: nextId,
      models: [],
      modelsStatus: nextId === null ? 'idle' : 'loading',
      modelsError: null,
      selectedModelId: null,
    })

    if (nextId === null) {
      return
    }

    const lastLoadedAt = lastModelsLoadedAtByLlmId.get(nextId) ?? null
    const isFresh =
      lastLoadedAt !== null &&
      Date.now() - lastLoadedAt < STALE_TIME_MS &&
      get().modelsStatus === 'success' &&
      get().selectedLlmId === nextId
    if (isFresh) {
      return
    }

    if (activeModelsAbortController) {
      activeModelsAbortController.abort()
    }
    activeModelsAbortController = new AbortController()
    const requestSignal = activeModelsAbortController.signal

    set({ modelsStatus: 'loading', modelsError: null })
    try {
      const models = await getModelsByLlmId(nextId, requestSignal)
      if (requestSignal.aborted) {
        return
      }

      // Guard against race: selection changed while request was in flight.
      if (get().selectedLlmId !== nextId) {
        return
      }

      lastModelsLoadedAtByLlmId.set(nextId, Date.now())
      set({ models, modelsStatus: 'success', modelsError: null })
    } catch (error) {
      if (requestSignal.aborted) {
        return
      }
      set({ modelsStatus: 'error', modelsError: errorToMessage(error) })
    }
  },
  selectModel: (modelId) => {
    set({ selectedModelId: modelId })
  },
  addLlm: async ({ name, alias }) => {
    set({ isMutating: true, mutationError: null })
    try {
      const created = await createLlm({ name, alias })
      await get().loadLlms({ force: true })
      set({ isMutating: false, mutationError: null })
      return created
    } catch (error) {
      const message = errorToMessage(error)
      set({ isMutating: false, mutationError: message })
      throw error instanceof Error ? error : new Error(message)
    }
  },
  deleteLlmCascade: async (llmId) => {
    set({ isMutating: true, mutationError: null })
    try {
      const models = await getModelsByLlmId(llmId)
      for (const model of models) {
        await deleteLlmModel(model.id)
      }

      await deleteLlm(llmId)

      // If we deleted the currently selected provider, clear selection.
      if (get().selectedLlmId === llmId) {
        await get().selectLlm(null)
      }

      await get().loadLlms({ force: true })
      set({ isMutating: false, mutationError: null })
    } catch (error) {
      const message = errorToMessage(error)
      set({ isMutating: false, mutationError: message })
      throw error instanceof Error ? error : new Error(message)
    }
  },
  addModel: async ({ name }) => {
    const llmId = get().selectedLlmId
    if (llmId === null) {
      const error = new Error('Cannot create a model without a selected LLM provider.')
      set({ mutationError: error.message })
      throw error
    }

    set({ isMutating: true, mutationError: null })
    try {
      const created = await createLlmModel({ llmId, name })
      // Reload models for the same provider.
      lastModelsLoadedAtByLlmId.delete(llmId)
      await get().selectLlm(llmId)
      set({ isMutating: false, mutationError: null })
      return created
    } catch (error) {
      const message = errorToMessage(error)
      set({ isMutating: false, mutationError: message })
      throw error instanceof Error ? error : new Error(message)
    }
  },
  deleteModel: async (modelId) => {
    const llmId = get().selectedLlmId
    if (llmId === null) {
      return
    }

    set({ isMutating: true, mutationError: null })
    try {
      await deleteLlmModel(modelId)
      if (get().selectedModelId === modelId) {
        set({ selectedModelId: null })
      }
      lastModelsLoadedAtByLlmId.delete(llmId)
      await get().selectLlm(llmId)
      set({ isMutating: false, mutationError: null })
    } catch (error) {
      const message = errorToMessage(error)
      set({ isMutating: false, mutationError: message })
      throw error instanceof Error ? error : new Error(message)
    }
  },
}))
