import { Card, Space, Typography } from 'antd'
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageSelectContainer } from 'features/language'
import { ThemeToggleContainer } from 'features/theme'

export function SettingsPage(): ReactElement {
  const { t } = useTranslation()

  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        {t('nav.settings')}
      </Typography.Title>

      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Card size="small" title={t('settings.theme')}>
          <ThemeToggleContainer />
        </Card>

        <Card size="small" title={t('settings.language')}>
          <LanguageSelectContainer />
        </Card>
      </Space>
    </div>
  )
}
