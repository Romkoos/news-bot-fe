/**
 * Public API for the `features/language` slice.
 *
 * This feature will provide:
 * - UI controls for switching language (RU/EN).
 * - Model/state persisted to localStorage.
 */
export { LanguageSelectContainer } from './ui/LanguageSelect.container'
export { useLanguageStore } from './model'
export type { LanguageState } from './model'
