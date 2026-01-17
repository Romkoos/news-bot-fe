import type { ReactElement } from 'react'

import type { DigestDto } from '../types'

import { DigestCard } from './DigestCard'
import styles from './DigestCardList.module.css'

export interface DigestCardListProps {
  readonly items: readonly DigestDto[]
}

export function DigestCardList(props: DigestCardListProps): ReactElement {
  const { items } = props

  return (
    <div className={styles.root}>
      {items.map((item) => (
        <DigestCard key={item.id} item={item} />
      ))}
    </div>
  )
}
