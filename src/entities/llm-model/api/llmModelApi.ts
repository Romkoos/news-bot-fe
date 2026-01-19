import type { LlmModelDto } from '../types'

import { fetchJson } from 'shared/api'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isLlmModelDto(value: unknown): value is LlmModelDto {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'number' &&
    typeof value.llm_id === 'number' &&
    typeof value.name === 'string'
  )
}

function parseLlmModelList(payload: unknown): LlmModelDto[] {
  if (!Array.isArray(payload)) {
    throw new Error('Unexpected llm-models response: expected an array.')
  }

  const items: LlmModelDto[] = []
  for (const item of payload) {
    if (!isLlmModelDto(item)) {
      throw new Error('Unexpected llm-models response: invalid item shape.')
    }
    items.push(item)
  }

  return items
}

function parseLlmModel(payload: unknown): LlmModelDto {
  if (!isLlmModelDto(payload)) {
    throw new Error('Unexpected llm-model response: invalid shape.')
  }

  return payload
}

export interface CreateLlmModelPayload {
  /**
   * Parent LLM provider id.
   *
   * Note: the backend expects `llmId` in the create payload (camelCase),
   * while responses use `llm_id` (snake_case) in `LlmModelDto`.
   */
  readonly llmId: number
  readonly name: string
}

export interface UpdateLlmModelPayload {
  readonly name: string
}

/**
 * Fetches models belonging to a specific LLM provider.
 *
 * Side effects:
 * - Network request.
 */
export async function getModelsByLlmId(
  llmId: number,
  signal?: AbortSignal,
): Promise<LlmModelDto[]> {
  /**
   * Use a relative path so:
   * - dev can rely on Vite proxy (`/llms/:id/models` -> backend `/api/llms/:id/models`) and avoid CORS
   * - prod builds an absolute URL using `getApiBaseUrl()` inside `fetchJson`
   */
  const data = await fetchJson<unknown>(`/llms/${llmId}/models`, { signal })
  return parseLlmModelList(data)
}

/**
 * Creates a new LLM model linked to an LLM provider.
 *
 * Side effects:
 * - Network request.
 */
export async function createLlmModel(
  payload: CreateLlmModelPayload,
  signal?: AbortSignal,
): Promise<LlmModelDto> {
  const data = await fetchJson<unknown>('/llm-models', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })
  return parseLlmModel(data)
}

/**
 * Updates an existing LLM model.
 *
 * Side effects:
 * - Network request.
 */
export async function updateLlmModel(
  modelId: number,
  payload: UpdateLlmModelPayload,
  signal?: AbortSignal,
): Promise<LlmModelDto> {
  const data = await fetchJson<unknown>(`/llm-models/${modelId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })
  return parseLlmModel(data)
}

/**
 * Deletes an LLM model.
 *
 * Side effects:
 * - Network request.
 */
export async function deleteLlmModel(modelId: number, signal?: AbortSignal): Promise<void> {
  await fetchJson<unknown>(`/llm-models/${modelId}`, { method: 'DELETE', signal })
}
