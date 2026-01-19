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
    llm: 'LLM',
    settings: 'Settings',
    menu: 'Menu',
  },
  llmConfig: {
    title: 'LLM config',
    fields: {
      provider: 'Provider',
      model: 'Model',
      instructions: 'Instructions',
      updatedAt: 'Updated at',
    },
    actions: {
      addProvider: 'Add provider',
      addModel: 'Add model',
      delete: 'Delete',
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
    },
    placeholders: {
      providerSelect: 'Select a provider',
      providerName: 'Provider name',
      providerAlias: 'Provider alias',
      modelSelect: 'Select a model',
      modelName: 'Model name',
    },
    validation: {
      modelRequired: 'Please select a model.',
      instructionsRequired: 'Please enter instructions.',
    },
    confirmations: {
      providerDelete: 'Delete this provider and all its models?',
      modelDelete: 'Delete this model?',
    },
    messages: {
      saved: 'Saved.',
      saveFailed: 'Failed to save.',
      providerCreateInvalid: 'Please enter provider name and alias.',
      providerCreated: 'Provider created.',
      providerCreateFailed: 'Failed to create provider.',
      providerDeleted: 'Provider deleted.',
      providerDeleteFailed: 'Failed to delete provider.',
      modelCreateInvalid: 'Please enter a model name.',
      modelCreated: 'Model created.',
      modelCreateFailed: 'Failed to create model.',
      modelDeleted: 'Model deleted.',
      modelDeleteFailed: 'Failed to delete model.',
    },
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
      sections: {
        sourceItems: 'Source items',
      },
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
