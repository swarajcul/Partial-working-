"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authService, type User } from "@/lib/auth-service"
import { isDevelopmentMode } from "@/lib/aws-config"
import { toast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string, role?: string) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
  switchRole: (role: string) => void
  isDev: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isDev = isDevelopmentMode()

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await authService.login(email, password)
      if (response.success && response.user) {
        setUser(response.user)
        toast({
          title: "Welcome back!",
          description: `Logged in as ${response.user.name}`,
        })
        return true
      } else {
        toast({
          title: "Login Failed",
          description: response.error || "Invalid credentials",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string, role = "player"): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await authService.signup(email, password, name, role)
      if (response.success && response.user) {
        setUser(response.user)
        toast({
          title: "Account Created",
          description: `Welcome ${response.user.name}!`,
        })
        return true
      } else {
        toast({
          title: "Signup Failed",
          description: response.error || "Failed to create account",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Signup Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const switchRole = (role: string): void => {
    if (isDev && user) {
      authService.switchRole(role)
      setUser({ ...user, role })
      toast({
        title: "Role Switched",
        description: `Now testing as ${role}`,
      })
    }
  }

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user,
    switchRole,
    isDev,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
