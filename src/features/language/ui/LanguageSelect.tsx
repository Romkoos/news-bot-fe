import { Select } from 'antd'
import type { ReactElement } from 'react'

import type { SupportedLanguage } from 'shared/config'

export interface LanguageSelectOption {
  readonly value: SupportedLanguage
  readonly label: string
}

export interface LanguageSelectProps {
  readonly language: SupportedLanguage
  readonly ariaLabel: string
  readonly options: readonly LanguageSelectOption[]
  readonly onChange: (language: SupportedLanguage) => void
}

export function LanguageSelect(props: LanguageSelectProps): ReactElement {
  const { language, options, onChange, ariaLabel } = props

  return (
    <Select
      aria-label={ariaLabel}
      value={language}
      options={options.map((o) => ({ value: o.value, label: o.label }))}
      style={{ minWidth: 140 }}
      onChange={onChange}
    />
  )
}
