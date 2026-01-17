const DEFAULT_API_BASE_URL = 'http://35.237.12.130/api'

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
  const raw =
    (import.meta.env.API_BASE_URL as string | undefined) ??
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    DEFAULT_API_BASE_URL

  try {
    // Validate format early.

    new URL(raw)
  } catch {
    return DEFAULT_API_BASE_URL
  }

  return normalizeBaseUrl(raw)
}
