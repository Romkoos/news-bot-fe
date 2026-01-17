import { getApiBaseUrl } from './env'
import { ApiError, HttpError } from './errors'

export interface FetchJsonOptions {
  /**
   * Override API base URL.
   *
   * By default, it is derived from `import.meta.env.API_BASE_URL`/`VITE_API_BASE_URL`.
   */
  readonly baseUrl?: string
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

export async function fetchJson<T>(
  input: string,
  init?: RequestInit,
  options?: FetchJsonOptions,
): Promise<T> {
  /**
   * CORS note (dev):
   * - Browsers block cross-origin requests unless the backend enables CORS.
   * - For local development, we use Vite's dev proxy (see `vite.config.ts`) by default,
   *   so the request is same-origin (`/digests`) and Vite forwards it to the backend.
   *
   * Production (or any non-dev build) uses `getApiBaseUrl()` (from `.env`) to build an absolute URL.
   */
  const baseUrl = options?.baseUrl ?? (import.meta.env.DEV ? '' : getApiBaseUrl())
  const url = input.startsWith('http')
    ? input
    : `${baseUrl}${input.startsWith('/') ? '' : '/'}${input}`

  let response: Response
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.headers ?? {}),
      },
    })
  } catch (error) {
    if (isAbortError(error)) {
      throw new ApiError('Abort', `Request aborted for ${url}`, error)
    }

    throw new ApiError('Network', `Network error for ${url}`, error)
  }

  if (!response.ok) {
    let responseText: string | undefined
    try {
      responseText = await response.text()
    } catch {
      // ignore
    }

    throw new HttpError({ status: response.status, url, responseText })
  }

  try {
    return (await response.json()) as T
  } catch (error) {
    throw new ApiError('Parse', `Failed to parse JSON for ${url}`, error)
  }
}
