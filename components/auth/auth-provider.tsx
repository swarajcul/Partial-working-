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
    console.log("[AuthProvider] Initializing session effect");
    const getSession = async () => {
      console.log("[AuthProvider] getSession: Fetching session...");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("[AuthProvider] getSession: Fetched session:", session);
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      console.log("[AuthProvider] getSession: User set to:", currentUser);
      setLoading(false);
      console.log("[AuthProvider] getSession: Loading set to false.");
    }

    getSession();

    // Listen for auth changes
    console.log("[AuthProvider] Setting up onAuthStateChange listener");
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("[AuthProvider] onAuthStateChange: Event triggered:", _event);
      console.log("[AuthProvider] onAuthStateChange: New session:", session);
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      console.log("[AuthProvider] onAuthStateChange: User set to:", currentUser);
      setLoading(false);
      console.log("[AuthProvider] onAuthStateChange: Loading set to false.");
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Fetch user profile once logged in
  useEffect(() => {
    console.log(`[AuthProvider] Profile effect triggered. User: ${user ? user.id : 'null'}, Profile: ${profile ? JSON.stringify(profile) : 'null'}`);
    if (user && !profile) { // Only fetch if user exists and profile is not yet set (or is null)
      console.log(`[AuthProvider] User ${user.id} exists and no profile loaded yet. Fetching profile.`);
      const fetchProfile = async () => {
        console.log(`[AuthProvider] fetchProfile: Fetching for user ID: ${user.id}`);
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

        if (error) {
          console.error("[AuthProvider] fetchProfile: Error fetching profile:", error);
          setProfile(null);
          console.log("[AuthProvider] fetchProfile: Profile set to null due to error.");
        } else if (!data) {
          console.log(`[AuthProvider] fetchProfile: No profile data found for user ${user.id}.`);
          setProfile({ status: 'NO_PROFILE' });
          console.log("[AuthProvider] fetchProfile: Profile set to { status: 'NO_PROFILE' }.");
        } else {
          console.log("[AuthProvider] fetchProfile: Profile data found:", data);
          setProfile(data);
          console.log("[AuthProvider] fetchProfile: Profile set with fetched data.");
        }
      }
      fetchProfile();
    } else if (user && profile) {
      console.log(`[AuthProvider] Profile effect: User ${user.id} exists and profile is already loaded.`);
    } else if (!user) {
      console.log("[AuthProvider] Profile effect: No user, ensuring profile is null.");
      setProfile(null);
    }
  }, [user?.id]); // Dependency on user?.id

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
