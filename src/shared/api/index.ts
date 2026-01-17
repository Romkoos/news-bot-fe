/**
 * Public API for the `shared/api` slice.
 *
 * Shared API helpers are transport-level (fetch wrappers, error mapping) and must remain
 * domain-agnostic.
 */
export type { FetchJsonOptions } from './fetchJson'
export { fetchJson } from './fetchJson'
export { getApiBaseUrl } from './env'
export { ApiError, HttpError } from './errors'
export type { ApiErrorKind } from './errors'
