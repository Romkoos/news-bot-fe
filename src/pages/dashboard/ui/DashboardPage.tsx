import { Alert, Button, Empty, Spin, Typography } from 'antd'
import type { ReactElement } from 'react'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useDigestStore } from 'entities/digest'
import { DigestListWithDetails } from 'widgets/digest-list-with-details'

export function DashboardPage(): ReactElement {
  const { t } = useTranslation()

  const items = useDigestStore((s) => s.items)
  const status = useDigestStore((s) => s.status)
  const error = useDigestStore((s) => s.error)
  const loadDigests = useDigestStore((s) => s.loadDigests)

  useEffect(() => {
    void loadDigests()
  }, [loadDigests])

  const isInitialLoading = status === 'loading' && items.length === 0
  const isEmpty = status === 'success' && items.length === 0
  const isError = status === 'error'

  const handleRetry = useMemo(() => {
    return () => void loadDigests({ force: true })
  }, [loadDigests])

  if (isInitialLoading) {
    return <Spin tip={t('common.loading')} />
  }

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        message={t('common.error')}
        description={error ?? undefined}
        action={
          <Button onClick={handleRetry} type="primary">
            {t('common.retry')}
          </Button>
        }
      />
    )
  }

  if (isEmpty) {
    return <Empty description={t('common.empty')} />
  }

  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        {t('nav.dashboard')}
      </Typography.Title>

      <DigestListWithDetails items={items} />
    </div>
  )
}
