/**
 * Public API for the `features/theme` slice.
 *
 * This feature will provide:
 * - UI controls for switching theme (light/dark).
 * - Model/state persisted to localStorage.
 */
export { ThemeToggleContainer } from './ui/ThemeToggle.container'
export { Themes, themeStorageKeys, useThemeStore } from './model'
export type { Theme, ThemeState } from './model'
