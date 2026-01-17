import type { ReactElement } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { parseSourceItemIdsJson } from '../lib/parseSourceItemIdsJson'
import { useBodyScrollLock } from '../lib/useBodyScrollLock'
import { useNewsItemsByIds } from '../model/useNewsItemsByIds'

import { DigestDetailsDrawer } from './DigestDetailsDrawer'

import type { DigestDto } from 'entities/digest'
import { formatDateTime } from 'shared/lib'

export interface DigestDetailsDrawerContainerProps {
  readonly open: boolean
  readonly digest: DigestDto | null
  readonly onClose: () => void
}

export function DigestDetailsDrawerContainer(
  props: DigestDetailsDrawerContainerProps,
): ReactElement {
  const { open, digest, onClose } = props
  const { t } = useTranslation()

  useBodyScrollLock(open)

  const dash = t('common.notAvailable')

  const publishedAt = useMemo(() => {
    if (digest === null) {
      return dash
    }
    return formatDateTime(digest.published_at) ?? dash
  }, [dash, digest])

  const modelName = useMemo(() => {
    if (digest === null) {
      return dash
    }
    return digest.llm_model ?? dash
  }, [dash, digest])

  const idsResult = useMemo(() => {
    if (digest === null) {
      return { ok: true as const, ids: [] as const }
    }
    return parseSourceItemIdsJson(digest.source_item_ids_json)
  }, [digest])

  const ids = useMemo(() => {
    return idsResult.ok ? idsResult.ids : ([] as const)
  }, [idsResult])

  const shouldFetch = open && digest !== null && idsResult.ok
  const { status, items, error, refetch } = useNewsItemsByIds({ ids, enabled: shouldFetch })

  const mergedError = useMemo(() => {
    if (!idsResult.ok) {
      return idsResult.error
    }
    return error
  }, [error, idsResult])

  const effectiveStatus = useMemo(() => {
    if (!idsResult.ok) {
      return 'error' as const
    }
    return status
  }, [idsResult, status])

  return (
    <DigestDetailsDrawer
      open={open}
      digest={digest}
      onClose={onClose}
      digestPublishedAt={publishedAt}
      digestModelName={modelName}
      itemsStatus={effectiveStatus}
      items={items}
      itemsError={mergedError}
      onRetry={refetch}
    />
  )
}
