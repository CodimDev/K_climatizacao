import React, { createContext, useContext, useState, useEffect } from 'react'

type ThemeContextValue = {
  theme: string
  setTheme: React.Dispatch<React.SetStateAction<string>>
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: (_: React.SetStateAction<string>) => {},
  toggleTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

import { getThemePreference, setThemePreference } from '@/services/preferences'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getThemePreference()
    }
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }

    setThemePreference(theme)
  }, [theme])

  // Load theme on mount
  useEffect(() => {
    const savedTheme = getThemePreference()
    setTheme(savedTheme)
  }, [])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
