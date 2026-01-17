/**
 * Public API for the `shared/config/i18n` segment.
 *
 * i18n initialization and configuration.
 */
export { defaultLanguage, i18nInstance, initI18n } from './i18n'
export {
  getStoredLanguage,
  i18nStorageKeys,
  isSupportedLanguage,
  setStoredLanguage,
} from './storage'
export { SupportedLanguages } from './types'
export type { SupportedLanguage } from './types'
