/**
 * Public API for the `entities/digest` slice.
 *
 * This entity will own:
 * - Types/DTOs for digests.
 * - Generic digest fetching API.
 * - Entity store (cache + status) used by pages/features.
 * - Entity UI (presentational components).
 */
export * from './api'
export * from './model'
export * from './types'
export * from './ui'
