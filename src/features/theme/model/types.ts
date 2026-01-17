export const Themes = ['light', 'dark'] as const

export type Theme = (typeof Themes)[number]

export interface ThemeState {
  readonly theme: Theme
  readonly setTheme: (theme: Theme) => void
  readonly toggleTheme: () => void
}
