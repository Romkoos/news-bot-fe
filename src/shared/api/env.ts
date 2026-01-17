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
  const fromEnv =
    (import.meta.env.API_BASE_URL as string | undefined) ??
    (import.meta.env.VITE_API_BASE_URL as string | undefined)

  /**
   * Dev default:
   * - If no env var is set, prefer the current origin. This keeps requests absolute while still
   *   allowing the Vite dev proxy to handle CORS-sensitive endpoints.
   */
  const raw = fromEnv ?? (import.meta.env.DEV ? window.location.origin : DEFAULT_API_BASE_URL)

  try {
    // Validate format early.

    new URL(raw)
  } catch {
    return import.meta.env.DEV ? window.location.origin : DEFAULT_API_BASE_URL
  }

  return normalizeBaseUrl(raw)
}
