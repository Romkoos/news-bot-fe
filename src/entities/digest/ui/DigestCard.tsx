import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Card, Tag, Typography } from 'antd'
import type { ReactElement } from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { DigestDto } from '../types'

import styles from './DigestCard.module.css'

import { parseMarkdownLinks, unescapeText } from 'shared/lib'

export interface DigestCardProps {
  readonly item: DigestDto
  /**
   * Called when the user clicks the info icon.
   *
   * This is intended to be wired by a higher layer (feature/widget) that owns
   * side effects and dialog state.
   */
  readonly onInfoClick?: (item: DigestDto) => void
}

export function DigestCard(props: DigestCardProps): ReactElement {
  const { item, onInfoClick } = props
  const { t } = useTranslation()

  const digestText = unescapeText(item.digest_text)
  const digestTokens = parseMarkdownLinks(digestText)

  const handleInfoClick = useCallback((): void => {
    onInfoClick?.(item)
  }, [item, onInfoClick])

  return (
    <Card
      className={styles.card}
      size="small"
      extra={
        <Button
          type="text"
          icon={<InfoCircleOutlined />}
          onClick={handleInfoClick}
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
    </Card>
  )
}
