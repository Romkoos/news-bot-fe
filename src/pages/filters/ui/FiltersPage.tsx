import { Typography } from 'antd'
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export function FiltersPage(): ReactElement {
  const { t } = useTranslation()

  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        {t('nav.filters')}
      </Typography.Title>

      <Typography.Paragraph type="secondary">{t('placeholders.comingSoon')}</Typography.Paragraph>
    </div>
  )
}
