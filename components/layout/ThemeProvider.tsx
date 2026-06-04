'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => {},
})

export function ThemeProvider({
  children,
  defaultTheme = 'light',
}: {
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  // Всегда светлая тема, игнорируем defaultTheme
  const [theme, setTheme] = useState<Theme>('light')

  // При монтировании ничего не читаем из localStorage, всегда light
  useEffect(() => {
    // Ничего не делаем, оставляем 'light'
    // Можно оставить пустой или вообще удалить этот useEffect
  }, [])

  // Обновляем класс <html> и localStorage (но класс dark никогда не добавится)
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark') // гарантированно удаляем dark
    localStorage.setItem('theme', theme)
  }, [theme])

  // Следим за системными изменениями не нужно
  // useEffect(() => { ... mediaQuery ... }, []) — можно удалить или закомментировать

  // toggleTheme больше не нужен, но оставим для совместимости
  const toggleTheme = () => {
    // Ничего не делаем, тема всегда светлая
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)