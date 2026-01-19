import type { ReactElement } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { DigestDto } from '../types'

import { DigestCard } from './DigestCard'
import styles from './DigestCardList.module.css'

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
   * How many additional cards to mount on each "near bottom" intersection.
   *
   * @default 6
   */
  readonly batchSize?: number
  /**
   * IntersectionObserver root margin used to mount cards slightly before they
   * become visible (when the list bottom approaches the viewport).
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
  const batchSize = lazyRendering?.batchSize ?? 6
  const rootMargin = lazyRendering?.rootMargin ?? '200px 0px'

  const canUseObserver = useMemo(() => {
    return typeof window !== 'undefined' && 'IntersectionObserver' in window
  }, [])

  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null)
  const [visibleCount, setVisibleCount] = useState<number>(() => initialRenderCount)

  const setSentinelRef = useCallback((node: HTMLDivElement | null): void => {
    setSentinel(node)
  }, [])

  const renderedItems = useMemo(() => {
    if (!isLazy || !canUseObserver) {
      return items
    }
    return items.slice(0, Math.max(0, Math.min(visibleCount, items.length)))
  }, [canUseObserver, isLazy, items, visibleCount])

  const shouldObserveMore = isLazy && canUseObserver && renderedItems.length < items.length

  useEffect(() => {
    if (!shouldObserveMore) {
      return
    }

    if (!sentinel) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) {
          return
        }

        // Disconnect to avoid repeated rapid-fire triggers; effect will reattach if needed.
        observer.disconnect()

        setVisibleCount((current) => {
          const next = current + batchSize
          return next >= items.length ? items.length : next
        })
      },
      { rootMargin },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [batchSize, items.length, rootMargin, sentinel, shouldObserveMore])

  return (
    <div className={styles.wrapper}>
      <div className={styles.root}>
        {renderedItems.map((item) => (
          <DigestCard key={item.id} item={item} onInfoClick={onInfoClick} />
        ))}
      </div>

      {shouldObserveMore ? <div ref={setSentinelRef} className={styles.sentinel} /> : null}
    </div>
  )
}
