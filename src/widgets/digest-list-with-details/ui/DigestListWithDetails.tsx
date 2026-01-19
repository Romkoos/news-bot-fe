import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'

import styles from './DigestListWithDetails.module.css'

import type { DigestDto, DigestCardListProps } from 'entities/digest'
import { DigestCardList } from 'entities/digest'
import { DigestDetailsDrawerContainer } from 'features/digest-details'

export interface DigestListWithDetailsProps {
  readonly items: readonly DigestDto[]
  /**
   * Optional performance config for the underlying digest card list.
   *
   * This is passed through to `entities/digest` and should be controlled by
   * route-level composition.
   */
  readonly cardListLazyRendering?: DigestCardListProps['lazyRendering']
}

export function DigestListWithDetails(props: DigestListWithDetailsProps): ReactElement {
  const { cardListLazyRendering, items } = props

  const [selected, setSelected] = useState<DigestDto | null>(null)
  const [open, setOpen] = useState(false)

  const handleInfoClick = useCallback((item: DigestDto): void => {
    setSelected(item)
    setOpen(true)
  }, [])

  const handleClose = useCallback((): void => {
    setOpen(false)
  }, [])

  return (
    <div className={styles.root}>
      <DigestCardList
        items={items}
        onInfoClick={handleInfoClick}
        lazyRendering={cardListLazyRendering}
      />
      <DigestDetailsDrawerContainer open={open} digest={selected} onClose={handleClose} />
    </div>
  )
}
