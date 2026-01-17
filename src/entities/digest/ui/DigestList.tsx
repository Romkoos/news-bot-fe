import { Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import type { DigestDto } from '../types'

import styles from './DigestList.module.css'

import { formatDateTime, unescapeText, parseMarkdownLinks } from 'shared/lib'

export interface DigestListProps {
  readonly items: readonly DigestDto[]
}

export function DigestList(props: DigestListProps): ReactElement {
  const { items } = props
  const { t } = useTranslation()

  const columns: ColumnsType<DigestDto> = [
    {
      title: t('digest.fields.status'),
      dataIndex: 'is_published',
      key: 'status',
      width: 120,
      render: (value: DigestDto['is_published']) =>
        value === 1 ? (
          <Tag color="green">{t('digest.status.published')}</Tag>
        ) : (
          <Tag>{t('digest.status.draft')}</Tag>
        ),
    },
    {
      title: t('digest.fields.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 220,
      render: (value: DigestDto['created_at']) => (
        <Typography.Text code>{formatDateTime(value) ?? t('common.notAvailable')}</Typography.Text>
      ),
    },
    {
      title: t('digest.fields.publishedAt'),
      dataIndex: 'published_at',
      key: 'published_at',
      width: 220,
      render: (value: DigestDto['published_at']) =>
        value ? (
          <Typography.Text code>
            {formatDateTime(value) ?? t('common.notAvailable')}
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">{t('common.notAvailable')}</Typography.Text>
        ),
    },
    {
      title: t('digest.fields.digestText'),
      dataIndex: 'digest_text',
      key: 'digest_text',
      render: (value: DigestDto['digest_text']) => (
        <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 6, expandable: false }}>
          {parseMarkdownLinks(unescapeText(value)).map((token, idx) => {
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
      ),
    },
  ]

  return (
    <div className={styles.root}>
      <Table
        rowKey="id"
        pagination={false}
        dataSource={[...items]}
        columns={columns}
        size="middle"
      />
    </div>
  )
}
