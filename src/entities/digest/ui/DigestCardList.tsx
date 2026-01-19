import type { ReactElement } from 'react'

import type { DigestDto } from '../types'

import { DigestCard } from './DigestCard'
import styles from './DigestCardList.module.css'

import { LazyMount } from 'shared/ui'

export interface DigestCardListLazyRendering {
  /**
   * Enables lazy mounting for cards after `initialRenderCount`.
   *
   * If omitted, the list renders eagerly (default behavior).
   */
  readonly enabled: boolean
  /**
   * How many cards to render eagerly (mounted immediately).
   *
   * This is useful to guarantee above-the-fold content.
   *
   * @default 0
   */
  readonly initialRenderCount?: number
  /**
   * IntersectionObserver root margin used to mount cards slightly before they
   * become visible.
   *
   * @default '200px 0px'
   */
  readonly rootMargin?: string
}

export interface DigestCardListProps {
  readonly items: readonly DigestDto[]
  /**
   * Called when the user clicks the info icon on a digest card.
   *
   * This is intended to be wired by a higher layer (feature/widget) that owns
   * side effects and dialog state.
   */
  readonly onInfoClick?: (item: DigestDto) => void
  /**
   * Optional performance optimization.
   *
   * When enabled, cards after `initialRenderCount` are mounted only when they
   * approach the viewport.
   */
  readonly lazyRendering?: DigestCardListLazyRendering
}

export function DigestCardList(props: DigestCardListProps): ReactElement {
  const { items, lazyRendering, onInfoClick } = props

  const isLazy = lazyRendering?.enabled === true
  const initialRenderCount = lazyRendering?.initialRenderCount ?? 0
  const rootMargin = lazyRendering?.rootMargin

  return (
    <div className={styles.root}>
      {items.map((item, idx) => {
        if (!isLazy || idx < initialRenderCount) {
          return <DigestCard key={item.id} item={item} onInfoClick={onInfoClick} />
        }

        return (
          <LazyMount key={item.id} rootMargin={rootMargin}>
            <DigestCard item={item} onInfoClick={onInfoClick} />
          </LazyMount>
        )
      })}
    </div>
  )
}
