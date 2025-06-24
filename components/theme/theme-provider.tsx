"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: "dark" | "light"
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  actualTheme: "dark",
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "raptors-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [actualTheme, setActualTheme] = useState<"dark" | "light">("dark")
  const [mounted, setMounted] = useState(false)

  // Stable setTheme function to prevent re-renders
  const handleSetTheme = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme)
      localStorage.setItem(storageKey, newTheme)
    },
    [storageKey],
  )

  // Initialize theme on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme
    if (stored && stored !== theme) {
      setTheme(stored)
    }
    setMounted(true)
  }, [storageKey, theme])

  // Apply theme to DOM
  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      setActualTheme(systemTheme)
    } else {
      root.classList.add(theme)
      setActualTheme(theme)
    }
  }, [theme, mounted])

  // System theme listener
  useEffect(() => {
    if (!mounted || theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      const systemTheme = mediaQuery.matches ? "dark" : "light"
      setActualTheme(systemTheme)

      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(systemTheme)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted])

  const value = {
    theme,
    setTheme: handleSetTheme,
    actualTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
