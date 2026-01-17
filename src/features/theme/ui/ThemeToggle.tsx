import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Switch } from 'antd'
import type { ReactElement } from 'react'

import type { Theme } from '../model'

export interface ThemeToggleProps {
  readonly theme: Theme
  readonly ariaLabel: string
  readonly onToggle: () => void
}

export function ThemeToggle(props: ThemeToggleProps): ReactElement {
  const { theme, onToggle, ariaLabel } = props

  return (
    <Switch
      aria-label={ariaLabel}
      checked={theme === 'dark'}
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
      onChange={onToggle}
    />
  )
}
