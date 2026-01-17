export const SupportedLanguages = ['en', 'ru'] as const

export type SupportedLanguage = (typeof SupportedLanguages)[number]
