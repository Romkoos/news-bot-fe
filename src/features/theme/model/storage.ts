import type { Theme } from './types'
import { Themes } from './types'

import { getStoredString, setStoredString } from 'shared/lib'

export const themeStorageKeys = {
  theme: 'news-bot.theme',
} as const

function isTheme(value: string): value is Theme {
  return (Themes as readonly string[]).includes(value)
}

export function getStoredTheme(): Theme | null {
  const raw = getStoredString(themeStorageKeys.theme)
  if (!raw) {
    return null
  }

  return isTheme(raw) ? raw : null
}

export function setStoredTheme(theme: Theme): void {
  setStoredString(themeStorageKeys.theme, theme)
}
