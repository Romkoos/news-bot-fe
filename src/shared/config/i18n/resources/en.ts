export const en = {
  common: {
    appName: 'News Bot',
    loading: 'Loading…',
    error: 'Something went wrong.',
    retry: 'Retry',
    empty: 'Nothing here yet.',
    close: 'Close',
    notAvailable: '—',
  },
  nav: {
    dashboard: 'Dashboard',
    filters: 'Filters',
    settings: 'Settings',
    menu: 'Menu',
  },
  settings: {
    theme: 'Theme',
    language: 'Language',
    languages: {
      en: 'English',
      ru: 'Russian',
    },
  },
  digest: {
    status: {
      published: 'Published',
      draft: 'Draft',
    },
    fields: {
      status: 'Status',
      digestText: 'Digest',
      createdAt: 'Created at',
      publishedAt: 'Published at',
    },
    actions: {
      info: 'Info',
    },
    details: {
      title: 'Digest details',
      fields: {
        id: 'ID',
        createdAt: 'Created at',
        updatedAt: 'Updated at',
        publishedAt: 'Published at',
        llmModel: 'LLM model',
        sourceItemIdsJson: 'Source item IDs',
      },
    },
  },
  placeholders: {
    comingSoon: 'Coming soon.',
  },
} as const
