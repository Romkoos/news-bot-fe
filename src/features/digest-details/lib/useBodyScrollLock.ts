import { useEffect } from 'react'

/**
 * Locks document body scrolling while `locked` is true.
 *
 * This is used as a safety net in addition to the scroll locking that Ant Design
 * applies for overlays, to guarantee the background page does not scroll when the
 * bottom sheet is open.
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) {
      return
    }

    const { body } = document
    const prevOverflow = body.style.overflow
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = prevOverflow
    }
  }, [locked])
}
