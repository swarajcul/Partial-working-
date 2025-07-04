"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

// Extend the AuthContextType to include permissions
type AuthContextType = {
  session: Session | null
  user: User | null
  profile: any | null
  loading: boolean
  signOut: () => Promise<void>
  permissions: {
    canViewProfile: boolean
    canEditProfile: boolean
    isAdmin: boolean
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Fetch session on load
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Fetch user profile once logged in
  useEffect(() => {
    if (user && !profile) {
      const fetchProfile = async () => {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching profile:", error);
          setProfile(null); // Explicitly set to null on error
        } else if (!data) {
          console.log(`No profile found for user ${user.id}. Redirecting to onboarding or setting default.`);
          setProfile({ status: 'NO_PROFILE' }); // Special status for no profile
        } else {
          setProfile(data);
        }
      }
      fetchProfile()
    } else if (!user) {
      setProfile(null)
    }
  }, [user?.id]) // Changed dependency from [user, profile] to [user?.id]

  // Handle logout
  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  // Define permissions based on profile
  const permissions = {
    canViewProfile: !!profile,
    canEditProfile: profile?.role === "admin" || profile?.role === "manager",
    isAdmin: profile?.role === "admin",
  }

  // Context value to be shared
  const value: AuthContextType = {
    session,
    user,
    profile,
    loading,
    signOut,
    permissions,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to access auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
