import type { ReactElement } from 'react'

import type { DigestDto } from '../types'

import { DigestCard } from './DigestCard'
import styles from './DigestCardList.module.css'

export interface DigestCardListProps {
  readonly items: readonly DigestDto[]
  /**
   * Called when the user clicks the info icon on a digest card.
   *
   * This is intended to be wired by a higher layer (feature/widget) that owns
   * side effects and dialog state.
   */
  readonly onInfoClick?: (item: DigestDto) => void
}

export function DigestCardList(props: DigestCardListProps): ReactElement {
  const { items, onInfoClick } = props

  return (
    <div className={styles.root}>
      {items.map((item) => (
        <DigestCard key={item.id} item={item} onInfoClick={onInfoClick} />
      ))}
    </div>
  )
}
