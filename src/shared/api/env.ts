// const DEFAULT_API_BASE_URL = 'http://35.237.12.130/api'
const DEFAULT_API_BASE_URL = 'http://localhost:3000/api'

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, '')
}

/**
 * Returns API base URL from Vite env vars.
 *
 * Supports:
 * - `API_BASE_URL` (enabled via `vite.config.ts` `envPrefix`)
 * - `VITE_API_BASE_URL` (standard Vite prefix)
 *
 * Falls back to a default for local dev if env var is missing.
 */
export function getApiBaseUrl(): string {
  const fromEnv =
    (import.meta.env.API_BASE_URL as string | undefined) ??
    (import.meta.env.VITE_API_BASE_URL as string | undefined)

  /**
   * Default:
   * - If no env var is set, use the compiled-in default API base URL.
   *
   * Note: this intentionally does NOT fall back to `window.location.origin` in dev.
   * The API base URL must point to the backend (and include `/api` after normalization).
   */
  const raw = fromEnv ?? DEFAULT_API_BASE_URL

  try {
    // Validate format early.

    new URL(raw)
  } catch {
    return import.meta.env.DEV ? window.location.origin : DEFAULT_API_BASE_URL
  }

  return normalizeBaseUrl(raw)
}
