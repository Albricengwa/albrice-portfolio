import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { DEFAULT_DATA } from '../data/defaults'

const PortfolioContext = createContext(null)
const STORAGE_KEY = 'albrice-portfolio-data'

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults so new fields are always present
      return {
        ...DEFAULT_DATA,
        ...parsed,
        profile: { ...DEFAULT_DATA.profile, ...parsed.profile },
      }
    }
  } catch {
    // corrupted — fall back
  }
  return DEFAULT_DATA
}

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(loadData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const updateProfile = useCallback((fields) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, ...fields } }))
  }, [])

  const updateSection = useCallback((section, items) => {
    setData((prev) => ({ ...prev, [section]: items }))
  }, [])

  const addItem = useCallback((section, item) => {
    setData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), { ...item, id: String(Date.now()) }],
    }))
  }, [])

  const updateItem = useCallback((section, id, fields) => {
    setData((prev) => ({
      ...prev,
      [section]: (prev[section] || []).map((x) => (x.id === id ? { ...x, ...fields } : x)),
    }))
  }, [])

  const removeItem = useCallback((section, id) => {
    setData((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter((x) => x.id !== id),
    }))
  }, [])

  const resetAll = useCallback(() => {
    setData(DEFAULT_DATA)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const updatePin = useCallback((newPin) => {
    setData((prev) => ({ ...prev, adminPin: newPin }))
  }, [])

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateProfile,
        updateSection,
        addItem,
        updateItem,
        removeItem,
        resetAll,
        updatePin,
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
