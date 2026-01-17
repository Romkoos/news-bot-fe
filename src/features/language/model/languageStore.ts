import { create } from 'zustand'

import type { SupportedLanguage } from 'shared/config'
import {
  defaultLanguage,
  getStoredLanguage,
  i18nInstance,
  initI18n,
  setStoredLanguage,
} from 'shared/config'

export interface LanguageState {
  readonly language: SupportedLanguage
  /**
   * Switches UI language and persists the selection.
   *
   * Side effects:
   * - Writes to localStorage.
   * - Triggers `i18next.changeLanguage()`.
   */
  readonly setLanguage: (language: SupportedLanguage) => void
}

function getInitialLanguage(): SupportedLanguage {
  return getStoredLanguage() ?? defaultLanguage
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: getInitialLanguage(),
  setLanguage: (language) => {
    setStoredLanguage(language)
    set({ language })

    void initI18n().then(() => i18nInstance.changeLanguage(language))
  },
}))
