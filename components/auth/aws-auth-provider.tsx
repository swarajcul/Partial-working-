"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { AWSAuthService, type AuthUser } from "@/lib/aws-auth"
import { validateAWSConfig } from "@/lib/aws-config"
import type { UserRole } from "@/lib/role-config"

type AuthContextType = {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  signup: (
    email: string,
    password: string,
    name: string,
    role?: string,
  ) => Promise<{ userSub: string; codeDeliveryDetails: any }>
  confirmSignup: (email: string, code: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
  clearError: () => void
  // Role testing features (for development)
  switchRole: (role: UserRole) => void
  resetRole: () => void
  isRoleTesting: boolean
  originalRole: UserRole | null
  // Dev mode
  toggleDevMode: () => void
  isDevMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AWSAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRoleTesting, setIsRoleTesting] = useState(false)
  const [originalRole, setOriginalRole] = useState<UserRole | null>(null)
  const [isDevMode, setIsDevMode] = useState(false)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      // Validate AWS configuration
      validateAWSConfig()

      // Check for existing session
      const savedUser = localStorage.getItem("aws_user")
      const sessionExpiry = localStorage.getItem("aws_session_expiry")

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
          clearSession()
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error)
      setError("Authentication service initialization failed")
    } finally {
      setIsLoading(false)
    }
  }

  const clearSession = () => {
    localStorage.removeItem("aws_user")
    localStorage.removeItem("aws_session_expiry")
    sessionStorage.removeItem("testingRole")
    sessionStorage.removeItem("originalRole")
    setUser(null)
    setIsRoleTesting(false)
    setOriginalRole(null)
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const authUser = await AWSAuthService.login({ email, password })
      setUser(authUser)

      // Set session to expire in 24 hours
      const expiry = new Date().getTime() + 24 * 60 * 60 * 1000
      localStorage.setItem("aws_user", JSON.stringify(authUser))
      localStorage.setItem("aws_session_expiry", expiry.toString())
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string, role?: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await AWSAuthService.signup({ email, password, name, role })
      return result
    } catch (error) {
      setError(error instanceof Error ? error.message : "Signup failed")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const confirmSignup = async (email: string, code: string) => {
    try {
      setIsLoading(true)
      setError(null)

      await AWSAuthService.confirmSignup(email, code)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Email confirmation failed")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    clearSession()
  }

  const clearError = () => {
    setError(null)
  }

  const switchRole = (role: UserRole) => {
    if (!user || !isDevMode) return

    // Store original role if not already testing
    if (!isRoleTesting) {
      setOriginalRole(user.role as UserRole)
      setIsRoleTesting(true)
      sessionStorage.setItem("originalRole", user.role || "")
    }

    // Update user role
    const updatedUser = { ...user, role }
    setUser(updatedUser)

    // Store in session storage (not localStorage to avoid persistence)
    sessionStorage.setItem("testingRole", role)
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
        signup,
        confirmSignup,
        logout,
        isLoading,
        error,
        clearError,
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

export function useAWSAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAWSAuth must be used within an AWSAuthProvider")
  }
  return context
}
