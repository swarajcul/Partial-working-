"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase-client"
import type { AuthSession, User as SupabaseUser } from "@supabase/supabase-js"
import type { UserRole } from "@/lib/role-config"

export type UserProfile = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar_url?: string
}

type AuthContextType = {
  session: AuthSession | null
  user: UserProfile | null
  signOut: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSessionAndProfile = async (supabaseUser: SupabaseUser | null) => {
      if (supabaseUser) {
        const { data: userProfile, error } = await supabase
          .from("users")
          .select("id, name, email, role, avatar_url")
          .eq("id", supabaseUser.id)
          .single()

        if (error) {
          console.error("Error fetching user profile:", error)
          setUser(null)
        } else {
          setUser(userProfile as UserProfile)
        }
      } else {
        setUser(null)
      }
    }

    // Run once on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      await fetchSessionAndProfile(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      await fetchSessionAndProfile(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setIsLoading(false)
  }

  const value = {
    session,
    user,
    signOut,
    isLoading,
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
