export const ru = {
  common: {
    appName: 'News Bot',
    loading: 'Загрузка…',
    error: 'Произошла ошибка.',
    retry: 'Повторить',
    empty: 'Пока ничего нет.',
    close: 'Закрыть',
    notAvailable: '—',
  },
  nav: {
    dashboard: 'Дашборд',
    filters: 'Фильтры',
    llm: 'LLM',
    settings: 'Настройки',
    menu: 'Меню',
  },
  llmConfig: {
    title: 'Настройки LLM',
    fields: {
      model: 'Модель',
      instructions: 'Инструкции',
      updatedAt: 'Обновлено',
    },
    actions: {
      save: 'Сохранить',
    },
    validation: {
      modelRequired: 'Выберите модель.',
      instructionsRequired: 'Введите инструкции.',
    },
    messages: {
      saved: 'Сохранено.',
      saveFailed: 'Не удалось сохранить.',
    },
  },
  settings: {
    theme: 'Тема',
    language: 'Язык',
    languages: {
      en: 'Английский',
      ru: 'Русский',
    },
  },
  digest: {
    status: {
      published: 'Опубликовано',
      draft: 'Черновик',
    },
    fields: {
      status: 'Статус',
      digestText: 'Дайджест',
      createdAt: 'Создано',
      publishedAt: 'Опубликовано',
    },
    actions: {
      info: 'Инфо',
    },
    details: {
      title: 'Детали дайджеста',
      sections: {
        sourceItems: 'Материалы',
      },
      fields: {
        id: 'ID',
        createdAt: 'Создано',
        updatedAt: 'Обновлено',
        publishedAt: 'Опубликовано',
        llmModel: 'LLM модель',
        sourceItemIdsJson: 'ID материалов',
      },
    },
  },
  placeholders: {
    comingSoon: 'Скоро будет.',
  },
} as const
