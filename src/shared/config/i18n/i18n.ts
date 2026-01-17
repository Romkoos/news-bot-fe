import i18next, { type i18n } from 'i18next'
import { initReactI18next } from 'react-i18next'

import { resources } from './resources'
import { getStoredLanguage } from './storage'
import type { SupportedLanguage } from './types'

export const defaultLanguage: SupportedLanguage = 'en'

export const i18nInstance: i18n = i18next.createInstance()

let initialized = false

export async function initI18n(): Promise<i18n> {
  if (initialized) {
    return i18nInstance
  }

  const language = getStoredLanguage() ?? defaultLanguage

  await i18nInstance.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: defaultLanguage,
    supportedLngs: ['en', 'ru'],
    interpolation: { escapeValue: false },
    react: {
      /**
       * Avoid forcing Suspense while the app bootstraps i18n.
       * We initialize i18n asynchronously at startup, but we don't want UI to crash or require Suspense.
       */
      useSuspense: false,
    },
  })

  initialized = true
  return i18nInstance
}
