import { Alert, Button, Card, Descriptions, Drawer, Empty, Spin, Typography } from 'antd'
import type { ReactElement } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { LoadStatus, NewsItemPreview } from '../model/types'

import styles from './DigestDetailsDrawer.module.css'

import type { DigestDto } from 'entities/digest'

export interface DigestDetailsDrawerProps {
  readonly open: boolean
  readonly digest: DigestDto | null
  readonly onClose: () => void
  readonly digestPublishedAt: string
  readonly digestModelName: string
  readonly itemsStatus: LoadStatus
  readonly items: readonly NewsItemPreview[]
  readonly itemsError: string | null
  readonly onRetry: () => void
}

export function DigestDetailsDrawer(props: DigestDetailsDrawerProps): ReactElement {
  const {
    open,
    digest,
    onClose,
    digestPublishedAt,
    digestModelName,
    itemsStatus,
    items,
    itemsError,
    onRetry,
  } = props

  const { t } = useTranslation()

  const title = useMemo(() => {
    return t('digest.details.title')
  }, [t])

  const isLoading = itemsStatus === 'loading'
  const isError = itemsStatus === 'error'
  const isSuccess = itemsStatus === 'success'
  const isEmpty = isSuccess && items.length === 0

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="bottom"
      height="66vh"
      title={title}
      extra={
        <Button onClick={onClose} type="text">
          {t('common.close')}
        </Button>
      }
    >
      {digest === null ? null : (
        <div className={styles.content}>
          <Descriptions size="small" column={1} bordered>
            <Descriptions.Item label={t('digest.details.fields.id')}>{digest.id}</Descriptions.Item>
            <Descriptions.Item label={t('digest.details.fields.publishedAt')}>
              <Typography.Text code>{digestPublishedAt}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label={t('digest.details.fields.llmModel')}>
              <Typography.Text code>{digestModelName}</Typography.Text>
            </Descriptions.Item>
          </Descriptions>

          {isLoading ? <Spin tip={t('common.loading')} /> : null}

          {isError ? (
            <Alert
              type="error"
              showIcon
              message={t('common.error')}
              description={itemsError ?? undefined}
              action={
                <Button onClick={onRetry} type="primary">
                  {t('common.retry')}
                </Button>
              }
            />
          ) : null}

          {isEmpty ? <Empty description={t('common.empty')} /> : null}

          {isSuccess && !isEmpty ? (
            <>
              <Typography.Text strong>{t('digest.details.sections.sourceItems')}</Typography.Text>
              <div className={styles.items}>
                {items.map((item) => {
                  return (
                    <Card key={item.id} size="small" className={styles.itemCard}>
                      <div className={styles.itemMetaRow}>
                        <Typography.Text className={styles.itemId} code>
                          {item.id}
                        </Typography.Text>
                        <Typography.Text className={styles.itemSource}>
                          {item.source}
                        </Typography.Text>
                      </div>
                      <Typography.Paragraph className={styles.itemText} dir="rtl">
                        {item.rawText}
                      </Typography.Paragraph>
                    </Card>
                  )
                })}
              </div>
            </>
          ) : null}
        </div>
      )}
    </Drawer>
  )
}
