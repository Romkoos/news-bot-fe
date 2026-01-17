import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Card, Descriptions, Drawer, Tag, Typography } from 'antd'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { DigestDto } from '../types'

import styles from './DigestCard.module.css'

import { formatDateTime, unescapeText, parseMarkdownLinks } from 'shared/lib'

export interface DigestCardProps {
  readonly item: DigestDto
}

export function DigestCard(props: DigestCardProps): ReactElement {
  const { item } = props
  const { t } = useTranslation()
  const [detailsOpen, setDetailsOpen] = useState(false)

  const dash = t('common.notAvailable')
  const digestText = unescapeText(item.digest_text)
  const digestTokens = parseMarkdownLinks(digestText)

  const createdAt = formatDateTime(item.created_at) ?? dash
  const updatedAt = formatDateTime(item.updated_at) ?? dash
  const publishedAt = formatDateTime(item.published_at) ?? dash

  return (
    <Card
      className={styles.card}
      size="small"
      extra={
        <Button
          type="text"
          icon={<InfoCircleOutlined />}
          onClick={() => setDetailsOpen(true)}
          aria-label={t('digest.actions.info')}
        />
      }
      title={
        <span className={styles.meta}>
          {item.is_published === 1 ? (
            <Tag color="green">{t('digest.status.published')}</Tag>
          ) : (
            <Tag>{t('digest.status.draft')}</Tag>
          )}
        </span>
      }
    >
      <Typography.Paragraph className={styles.text}>
        {digestTokens.map((token, idx) => {
          if (token.kind === 'link') {
            return (
              <a
                key={`${token.href}-${idx}`}
                href={token.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                {token.text}
              </a>
            )
          }
          return <span key={idx}>{token.text}</span>
        })}
      </Typography.Paragraph>

      <Drawer
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        placement="bottom"
        height="70%"
        title={t('digest.details.title')}
        extra={
          <Button onClick={() => setDetailsOpen(false)} type="text">
            {t('common.close')}
          </Button>
        }
      >
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label={t('digest.details.fields.id')}>{item.id}</Descriptions.Item>
          <Descriptions.Item label={t('digest.details.fields.createdAt')}>
            <Typography.Text code>{createdAt}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('digest.details.fields.updatedAt')}>
            <Typography.Text code>{updatedAt}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('digest.details.fields.publishedAt')}>
            <Typography.Text code>{publishedAt}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('digest.details.fields.llmModel')}>
            <Typography.Text code>{item.llm_model ?? dash}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('digest.details.fields.sourceItemIdsJson')}>
            <Typography.Text code>{item.source_item_ids_json}</Typography.Text>
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </Card>
  )
}
