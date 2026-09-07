import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { DEFAULT_DATA } from '../data/defaults'

const PortfolioContext = createContext(null)
const STORAGE_KEY = 'albrice-portfolio-data'

function mergeWithDefaults(parsed) {
  return {
    ...DEFAULT_DATA,
    ...parsed,
    profile: { ...DEFAULT_DATA.profile, ...(parsed?.profile || {}) },
  }
}

function loadLocal() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return mergeWithDefaults(JSON.parse(stored))
  } catch {
    // corrupted — fall back
  }
  return DEFAULT_DATA
}

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(loadLocal)
  const [remoteStatus, setRemoteStatus] = useState('loading') // loading | live | offline
  const sessionPinRef = useRef(null)

  // Pull the live, shared copy on load so every visitor — and every device
  // the admin edits from — sees the same content, not just what's cached
  // in this one browser's localStorage.
  useEffect(() => {
    let cancelled = false
    fetch('/api/content', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((remote) => {
        if (cancelled) return
        if (remote) {
          const merged = mergeWithDefaults(remote)
          setData(merged)
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)) } catch {}
        }
        setRemoteStatus('live')
      })
      .catch(() => { if (!cancelled) setRemoteStatus('offline') })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
  }, [data])

  // Publishes the full data blob to the live site so the change is visible
  // to every visitor immediately. No-ops quietly if not logged into the
  // admin portal, or if the API isn't reachable (e.g. plain `vite dev`).
  const publish = useCallback(async (nextData, pin = sessionPinRef.current) => {
    if (!pin) return { ok: false, reason: 'not-authenticated' }
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, data: nextData }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        return { ok: false, reason: body.error || `HTTP ${res.status}` }
      }
      return { ok: true }
    } catch {
      return { ok: false, reason: 'offline' }
    }
  }, [])

  // Called by the admin login form once the PIN matches locally, so
  // subsequent saves can authenticate against the server too.
  const login = useCallback((pin) => { sessionPinRef.current = pin }, [])

  const mutate = useCallback((updater) => {
    // Snapshot the pin *before* any ref mutation a caller might do right
    // after calling mutate() (see updatePin, which rotates the session pin
    // once the old one has already authenticated this save).
    const authPin = sessionPinRef.current
    let result
    setData((prev) => {
      const next = updater(prev)
      result = next
      return next
    })
    // Returns a promise so admin UI can await the real publish result
    // instead of optimistically claiming success.
    return new Promise((resolve) => {
      queueMicrotask(async () => {
        resolve(result ? await publish(result, authPin) : { ok: false, reason: 'no-op' })
      })
    })
  }, [publish])

  const updateProfile = useCallback((fields) => {
    return mutate((prev) => ({ ...prev, profile: { ...prev.profile, ...fields } }))
  }, [mutate])

  const updateSection = useCallback((section, items) => {
    return mutate((prev) => ({ ...prev, [section]: items }))
  }, [mutate])

  const addItem = useCallback((section, item) => {
    return mutate((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), { ...item, id: String(Date.now()) }],
    }))
  }, [mutate])

  const updateItem = useCallback((section, id, fields) => {
    return mutate((prev) => ({
      ...prev,
      [section]: (prev[section] || []).map((x) => (x.id === id ? { ...x, ...fields } : x)),
    }))
  }, [mutate])

  const removeItem = useCallback((section, id) => {
    return mutate((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter((x) => x.id !== id),
    }))
  }, [mutate])

  const resetAll = useCallback(() => {
    setData(DEFAULT_DATA)
    localStorage.removeItem(STORAGE_KEY)
    return publish(DEFAULT_DATA)
  }, [publish])

  const updatePin = useCallback((newPin) => {
    const result = mutate((prev) => ({ ...prev, adminPin: newPin }))
    sessionPinRef.current = newPin
    return result
  }, [mutate])

  return (
    <PortfolioContext.Provider
      value={{
        data,
        remoteStatus,
        updateProfile,
        updateSection,
        addItem,
        updateItem,
        removeItem,
        resetAll,
        updatePin,
        login,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be inside PortfolioProvider')
  return ctx
}
