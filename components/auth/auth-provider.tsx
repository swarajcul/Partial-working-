"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import { addLog } from "@/lib/log-service" // Import addLog

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
    addLog("[AuthProvider] Initializing session effect");
    const getSession = async () => {
      addLog("[AuthProvider] getSession: Fetching session...");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      addLog("[AuthProvider] getSession: Fetched session:", session);
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      addLog("[AuthProvider] getSession: User set to:", currentUser);
      setLoading(false);
      addLog("[AuthProvider] getSession: Loading set to false.");
    }

    getSession();

    // Listen for auth changes
    addLog("[AuthProvider] Setting up onAuthStateChange listener");
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      addLog("[AuthProvider] onAuthStateChange: Event triggered:", _event);
      addLog("[AuthProvider] onAuthStateChange: New session:", session);

      const currentUser = session?.user ?? null;

      // If the user has changed, or if logging in (and profile isn't already loaded for this new user state),
      // or if logging out, reset profile to ensure it's re-fetched or cleared.
      // The `profile` check for SIGNED_IN helps if onAuthStateChange fires multiple times rapidly for SIGNED_IN
      // and profile fetch has already started for the new user.
      if (user?.id !== currentUser?.id || (_event === 'SIGNED_IN' && (!profile || profile.id !== currentUser?.id)) || _event === 'SIGNED_OUT') {
        addLog("[AuthProvider] onAuthStateChange: User changed or specific auth event occurred, resetting profile to null.");
        setProfile(null);
      }

      setSession(session);
      setUser(currentUser); // This will trigger the profile useEffect if currentUser is not null and profile became null
      addLog("[AuthProvider] onAuthStateChange: User set to:", currentUser);
      setLoading(false);
      addLog("[AuthProvider] onAuthStateChange: Loading set to false.");
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Fetch user profile once logged in
  useEffect(() => {
    addLog(`[AuthProvider] Profile effect triggered. User: ${user ? user.id : 'null'}, Profile: ${profile ? JSON.stringify(profile) : 'null'}`);
    if (user && !profile) { // Only fetch if user exists and profile is not yet set (or is null)
      addLog(`[AuthProvider] User ${user.id} exists and no profile loaded yet. Fetching profile.`);
      const fetchProfile = async () => {
        addLog(`[AuthProvider] fetchProfile: Fetching for user ID: ${user.id}`);
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

        if (error) {
          addLog("[AuthProvider] fetchProfile: Error fetching profile:", error);
          setProfile(null);
          addLog("[AuthProvider] fetchProfile: Profile set to null due to error.");
        } else if (!data) {
          addLog(`[AuthProvider] fetchProfile: No profile data found for user ${user.id}.`);
          setProfile({ status: 'NO_PROFILE' });
          addLog("[AuthProvider] fetchProfile: Profile set to { status: 'NO_PROFILE' }.");
        } else {
          addLog("[AuthProvider] fetchProfile: Profile data found:", data);
          setProfile(data);
          addLog("[AuthProvider] fetchProfile: Profile set with fetched data.");
        }
      }
      fetchProfile();
    } else if (user && profile) {
      addLog(`[AuthProvider] Profile effect: User ${user.id} exists and profile is already loaded.`);
    } else if (!user) {
      addLog("[AuthProvider] Profile effect: No user, ensuring profile is null.");
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
