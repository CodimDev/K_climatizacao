import React, { createContext, useContext, useState, useEffect } from 'react'

type ThemeContextValue = {
  theme: string
  setTheme: React.Dispatch<React.SetStateAction<string>>
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: (_: React.SetStateAction<string>) => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark'
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

    localStorage.setItem('theme', theme)
  }, [theme])

  // Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
