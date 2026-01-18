import type { LlmConfig } from '../types'

import { fetchJson } from 'shared/api'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isLlmConfig(value: unknown): value is LlmConfig {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.model === 'string' &&
    typeof value.instructions === 'string' &&
    typeof value.updatedAt === 'string'
  )
}

function parseLlmConfig(payload: unknown): LlmConfig {
  if (!isLlmConfig(payload)) {
    throw new Error('Unexpected llm-config response: invalid shape.')
  }

  return payload
}

/**
 * Fetches the current LLM configuration from the backend.
 *
 * Side effects:
 * - Network request.
 */
export async function getLlmConfig(signal?: AbortSignal): Promise<LlmConfig> {
  /**
   * Use a relative path so:
   * - dev can rely on Vite proxy (`/llm-config` -> backend `/api/llm-config`) and avoid CORS
   * - prod builds an absolute URL using `getApiBaseUrl()` inside `fetchJson`
   */
  const data = await fetchJson<unknown>('/llm-config', { signal })
  return parseLlmConfig(data)
}

export interface UpdateLlmConfigPayload {
  readonly model: string
  readonly instructions: string
}

/**
 * Updates the current LLM configuration.
 *
 * The backend responds with the updated config object, where `updatedAt`
 * is set to “now” (ISO string) at update time.
 *
 * Side effects:
 * - Network request.
 */
export async function updateLlmConfig(
  payload: UpdateLlmConfigPayload,
  signal?: AbortSignal,
): Promise<LlmConfig> {
  const data = await fetchJson<unknown>('/llm-config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })
  return parseLlmConfig(data)
}
