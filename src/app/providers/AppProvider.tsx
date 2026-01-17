import { ConfigProvider, theme as antdTheme } from 'antd'
import type { PropsWithChildren, ReactElement } from 'react'

import { useThemeStore } from 'features/theme'

export type AppProviderProps = PropsWithChildren

export function AppProvider(props: AppProviderProps): ReactElement {
  const { children } = props
  const theme = useThemeStore((s) => s.theme)

  const algorithm = theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm

  return <ConfigProvider theme={{ algorithm }}>{children}</ConfigProvider>
}
