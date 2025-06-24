"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { UserRole } from "@/lib/role-config"

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "coach" | "analyst" | "player" | null
  team?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  // Role testing features
  switchRole: (role: UserRole) => void
  resetRole: () => void
  isRoleTesting: boolean
  originalRole: UserRole | null
  // Dev mode
  toggleDevMode: () => void
  isDevMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRoleTesting, setIsRoleTesting] = useState(false)
  const [originalRole, setOriginalRole] = useState<UserRole | null>(null)
  const [isDevMode, setIsDevMode] = useState(false)

  useEffect(() => {
    // Check for existing session with longer expiry
    const savedUser = localStorage.getItem("user")
    const sessionExpiry = localStorage.getItem("sessionExpiry")

    // Check for dev mode
    const devMode = localStorage.getItem("devMode")
    if (devMode === "true") {
      setIsDevMode(true)
    }

    if (savedUser && sessionExpiry) {
      const now = new Date().getTime()
      const expiry = Number.parseInt(sessionExpiry)

      if (now < expiry) {
        let parsedUser = JSON.parse(savedUser)

        // Check for role testing state
        const testingRole = sessionStorage.getItem("testingRole")
        const storedOriginalRole = sessionStorage.getItem("originalRole")

        if (testingRole && storedOriginalRole) {
          setIsRoleTesting(true)
          setOriginalRole(storedOriginalRole as UserRole)
          parsedUser = { ...parsedUser, role: testingRole }
        }

        setUser(parsedUser)
      } else {
        // Session expired, clear storage
        localStorage.removeItem("user")
        localStorage.removeItem("sessionExpiry")
        sessionStorage.removeItem("testingRole")
        sessionStorage.removeItem("originalRole")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Handle test admin credentials
    if (email === "test123@admin" && password === "Password123") {
      const testAdmin: User = {
        id: "test-admin-1",
        name: "Test Admin",
        email: "test123@admin",
        role: "admin",
        team: undefined,
      }
      setUser(testAdmin)

      // Set session to expire in 24 hours
      const expiry = new Date().getTime() + 24 * 60 * 60 * 1000
      localStorage.setItem("user", JSON.stringify(testAdmin))
      localStorage.setItem("sessionExpiry", expiry.toString())
      return
    }

    // Handle Google OAuth
    if (password === "google-oauth") {
      const googleUser: User = {
        id: "google-1",
        name: "Google User",
        email: email,
        role: "admin",
        team: undefined,
      }
      setUser(googleUser)

      const expiry = new Date().getTime() + 24 * 60 * 60 * 1000
      localStorage.setItem("user", JSON.stringify(googleUser))
      localStorage.setItem("sessionExpiry", expiry.toString())
      return
    }

    // Mock login for other credentials
    const mockUser: User = {
      id: "1",
      name: email.split("@")[0],
      email,
      role: email.includes("admin") ? "admin" : "player",
      team: email.includes("admin") ? undefined : "Rebellion",
    }

    setUser(mockUser)
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000
    localStorage.setItem("user", JSON.stringify(mockUser))
    localStorage.setItem("sessionExpiry", expiry.toString())
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("sessionExpiry")
  }

  const switchRole = (role: UserRole) => {
    if (!user) return

    // Store original role if not already testing
    if (!isRoleTesting) {
      setOriginalRole(user.role as UserRole)
      setIsRoleTesting(true)
    }

    // Update user role
    const updatedUser = { ...user, role }
    setUser(updatedUser)

    // Store in session storage (not localStorage to avoid persistence)
    sessionStorage.setItem("testingRole", role)
    sessionStorage.setItem("originalRole", originalRole || user.role || "")
  }

  const resetRole = () => {
    if (!user || !originalRole) return

    // Restore original role
    const updatedUser = { ...user, role: originalRole }
    setUser(updatedUser)

    // Clear testing state
    setIsRoleTesting(false)
    setOriginalRole(null)

    // Clear session storage
    sessionStorage.removeItem("testingRole")
    sessionStorage.removeItem("originalRole")
  }

  const toggleDevMode = () => {
    setIsDevMode(!isDevMode)
    localStorage.setItem("devMode", (!isDevMode).toString())
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        switchRole,
        resetRole,
        isRoleTesting,
        originalRole,
        toggleDevMode,
        isDevMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
