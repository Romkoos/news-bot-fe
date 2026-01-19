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
      provider: 'Провайдер',
      model: 'Модель',
      instructions: 'Инструкции',
      updatedAt: 'Обновлено',
    },
    actions: {
      addProvider: 'Добавить провайдера',
      addModel: 'Добавить модель',
      delete: 'Удалить',
      confirm: 'Подтвердить',
      cancel: 'Отмена',
      save: 'Сохранить',
    },
    placeholders: {
      providerSelect: 'Выберите провайдера',
      providerName: 'Название провайдера',
      providerAlias: 'Алиас провайдера',
      modelSelect: 'Выберите модель',
      modelName: 'Название модели',
    },
    validation: {
      modelRequired: 'Выберите модель.',
      instructionsRequired: 'Введите инструкции.',
    },
    confirmations: {
      providerDelete: 'Удалить провайдера и все его модели?',
      modelDelete: 'Удалить эту модель?',
    },
    messages: {
      saved: 'Сохранено.',
      saveFailed: 'Не удалось сохранить.',
      providerCreateInvalid: 'Введите название и алиас провайдера.',
      providerCreated: 'Провайдер создан.',
      providerCreateFailed: 'Не удалось создать провайдера.',
      providerDeleted: 'Провайдер удалён.',
      providerDeleteFailed: 'Не удалось удалить провайдера.',
      modelCreateInvalid: 'Введите название модели.',
      modelCreated: 'Модель создана.',
      modelCreateFailed: 'Не удалось создать модель.',
      modelDeleted: 'Модель удалена.',
      modelDeleteFailed: 'Не удалось удалить модель.',
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
