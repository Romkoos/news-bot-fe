/**
 * Typed, safe wrappers around `localStorage`.
 *
 * - Never throws (swallows quota/security errors).
 * - Works in non-browser environments by becoming a no-op.
 */

export function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function getStoredString(key: string): string | null {
  const storage = getStorage()
  if (!storage) {
    return null
  }

  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

export function setStoredString(key: string, value: string): void {
  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    storage.setItem(key, value)
  } catch {
    // no-op
  }
}

export function removeStoredValue(key: string): void {
  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    storage.removeItem(key)
  } catch {
    // no-op
  }
}

export function getStoredJson<T>(key: string, parse: (value: unknown) => T | null): T | null {
  const raw = getStoredString(key)
  if (raw === null) {
    return null
  }

  try {
    return parse(JSON.parse(raw))
  } catch {
    return null
  }
}

export function setStoredJson(key: string, value: unknown): void {
  try {
    setStoredString(key, JSON.stringify(value))
  } catch {
    // no-op (cyclic value, etc.)
  }
}
