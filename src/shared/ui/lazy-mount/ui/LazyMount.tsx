import type { ReactElement, ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import styles from './LazyMount.module.css'

export interface LazyMountProps {
  /**
   * The content that should be mounted lazily.
   */
  readonly children: ReactNode
  /**
   * If `true`, children are mounted immediately and the observer is not used.
   *
   * This is useful for ensuring above-the-fold content is always rendered.
   */
  readonly eager?: boolean
  /**
   * IntersectionObserver `rootMargin`.
   *
   * Increase this to mount content slightly before it scrolls into view.
   * Example: `'200px 0px'`.
   *
   * @default '200px 0px'
   */
  readonly rootMargin?: string
}

/**
 * Lazily mounts children once the wrapper enters the viewport.
 *
 * Notes:
 * - If `IntersectionObserver` is unavailable, it falls back to eager mounting.
 * - This component is DOM-only and is intended for client-side rendering.
 */
export function LazyMount(props: LazyMountProps): ReactElement {
  const { children, eager = false, rootMargin = '200px 0px' } = props

  const canUseObserver = useMemo(() => {
    return typeof window !== 'undefined' && 'IntersectionObserver' in window
  }, [])

  const [node, setNode] = useState<HTMLDivElement | null>(null)
  const [isMounted, setIsMounted] = useState<boolean>(() => eager || !canUseObserver)

  const setRef = useCallback((el: HTMLDivElement | null): void => {
    setNode(el)
  }, [])

  useEffect(() => {
    if (eager || isMounted) {
      return
    }

    if (!canUseObserver) {
      return
    }

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setIsMounted(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [canUseObserver, eager, isMounted, node, rootMargin])

  return (
    <div ref={setRef} className={styles.root}>
      {eager || isMounted ? children : null}
    </div>
  )
}
