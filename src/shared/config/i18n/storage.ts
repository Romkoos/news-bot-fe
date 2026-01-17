import type { SupportedLanguage } from './types'
import { SupportedLanguages } from './types'

import { getStoredString, setStoredString } from 'shared/lib'

export const i18nStorageKeys = {
  language: 'news-bot.language',
} as const

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return (SupportedLanguages as readonly string[]).includes(value)
}

export function getStoredLanguage(): SupportedLanguage | null {
  const raw = getStoredString(i18nStorageKeys.language)
  if (!raw) {
    return null
  }

  return isSupportedLanguage(raw) ? raw : null
}

export function setStoredLanguage(language: SupportedLanguage): void {
  setStoredString(i18nStorageKeys.language, language)
}
