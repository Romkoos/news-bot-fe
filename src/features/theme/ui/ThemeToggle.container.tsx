import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { useThemeStore } from '../model'

import { ThemeToggle } from './ThemeToggle'

export function ThemeToggleContainer(): ReactElement {
  const { t } = useTranslation()

  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return <ThemeToggle ariaLabel={t('settings.theme')} theme={theme} onToggle={toggleTheme} />
}
