import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { useLanguageStore } from '../model'

import { LanguageSelect } from './LanguageSelect'

export function LanguageSelectContainer(): ReactElement {
  const { t } = useTranslation()

  const language = useLanguageStore((s) => s.language)
  const setLanguage = useLanguageStore((s) => s.setLanguage)

  const options = [
    { value: 'en', label: t('settings.languages.en') },
    { value: 'ru', label: t('settings.languages.ru') },
  ] as const

  return (
    <LanguageSelect
      ariaLabel={t('settings.language')}
      language={language}
      options={options}
      onChange={setLanguage}
    />
  )
}
