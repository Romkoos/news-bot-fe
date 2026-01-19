import type { LlmDto } from '../types'

import { fetchJson } from 'shared/api'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isLlmDto(value: unknown): value is LlmDto {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.alias === 'string'
  )
}

function parseLlmList(payload: unknown): LlmDto[] {
  if (!Array.isArray(payload)) {
    throw new Error('Unexpected llms response: expected an array.')
  }

  const items: LlmDto[] = []
  for (const item of payload) {
    if (!isLlmDto(item)) {
      throw new Error('Unexpected llms response: invalid item shape.')
    }
    items.push(item)
  }

  return items
}

function parseLlm(payload: unknown): LlmDto {
  if (!isLlmDto(payload)) {
    throw new Error('Unexpected llm response: invalid shape.')
  }

  return payload
}

export interface CreateLlmPayload {
  readonly name: string
  readonly alias: string
}

export interface UpdateLlmPayload {
  readonly name: string
  readonly alias: string
}

/**
 * Fetches the list of LLM providers.
 *
 * Side effects:
 * - Network request.
 */
export async function getLlms(signal?: AbortSignal): Promise<LlmDto[]> {
  /**
   * Use a relative path so:
   * - dev can rely on Vite proxy (`/llms` -> backend `/api/llms`) and avoid CORS
   * - prod builds an absolute URL using `getApiBaseUrl()` inside `fetchJson`
   */
  const data = await fetchJson<unknown>('/llms', { signal })
  return parseLlmList(data)
}

/**
 * Creates a new LLM provider.
 *
 * Side effects:
 * - Network request.
 */
export async function createLlm(payload: CreateLlmPayload, signal?: AbortSignal): Promise<LlmDto> {
  const data = await fetchJson<unknown>('/llms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })
  return parseLlm(data)
}

/**
 * Updates an existing LLM provider.
 *
 * Side effects:
 * - Network request.
 */
export async function updateLlm(
  llmId: number,
  payload: UpdateLlmPayload,
  signal?: AbortSignal,
): Promise<LlmDto> {
  const data = await fetchJson<unknown>(`/llms/${llmId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })
  return parseLlm(data)
}

/**
 * Deletes an LLM provider.
 *
 * Side effects:
 * - Network request.
 */
export async function deleteLlm(llmId: number, signal?: AbortSignal): Promise<void> {
  await fetchJson<unknown>(`/llms/${llmId}`, { method: 'DELETE', signal })
}
