"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import { addLog } from "@/lib/log-service" // Import addLog

// Extend the AuthContextType to include permissions
type AuthContextType = {
  session: Session | null
  user: User | null
  profile: any | null // This can be actual profile or { status: 'NO_PROFILE' }
  loading: boolean // True while session is being loaded
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

  // Effect for session handling
  useEffect(() => {
    addLog("[AuthProvider] Session effect: Initializing.");
    const getSession = async () => {
      addLog("[AuthProvider] getSession: Fetching current session...");
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      addLog("[AuthProvider] getSession: Fetched session:", currentSession);
      setSession(currentSession);
      const supabaseUser = currentSession?.user ?? null;
      setUser(supabaseUser);
      addLog("[AuthProvider] getSession: User initially set to:", supabaseUser);

      if (!supabaseUser) {
        setProfile(null); // Clear profile if no user from initial session
        addLog("[AuthProvider] getSession: No initial user, profile explicitly set to null.");
      }
      setLoading(false);
      addLog("[AuthProvider] getSession: Initial loading set to false.");
    }
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      addLog("[AuthProvider] onAuthStateChange: Event:", event, "New session:", newSession);
      const newSupabaseUser = newSession?.user ?? null;
      const previousUserId = user?.id; // Get user state from closure

      // If user ID has changed (e.g., login, logout, different user)
      // or if it's a SIGNED_IN event and the profile isn't loaded for *this* specific user yet.
      if (previousUserId !== newSupabaseUser?.id || event === 'SIGNED_OUT') {
        addLog(`[AuthProvider] onAuthStateChange: User ID changed (from ${previousUserId || 'null'} to ${newSupabaseUser?.id || 'null'}) or SIGNED_OUT. Resetting profile to null.`);
        setProfile(null);
      } else if (event === 'SIGNED_IN' && (!profile || (profile && typeof profile === 'object' && profile.id !== newSupabaseUser?.id))) {
        // This condition handles the case where SIGNED_IN event occurs,
        // and either profile is null, or it's an old profile object not matching the current user.
        addLog(`[AuthProvider] onAuthStateChange: SIGNED_IN event for user ${newSupabaseUser?.id}, current profile is for ${profile?.id || 'null'}. Resetting profile.`);
        setProfile(null);
      }

      setSession(newSession);
      setUser(newSupabaseUser); // This will trigger the profile useEffect if newSupabaseUser is not null and profile became null
      setLoading(false);
      addLog("[AuthProvider] onAuthStateChange: User updated to:", newSupabaseUser, "Loading set to false.");
    });

    return () => {
      addLog("[AuthProvider] Unsubscribing auth listener.");
      authListener.subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // user state is accessed via closure for previousUserId comparison

  // Effect for profile fetching
  useEffect(() => {
    const currentProfileStateDesc = profile === null ? 'null' : (profile?.status === 'NO_PROFILE' ? 'NO_PROFILE_OBJECT' : 'PROFILE_OBJECT_EXISTS');
    addLog(`[AuthProvider] Profile effect: Triggered. User ID: ${user?.id || 'null'}, Current profile state: ${currentProfileStateDesc}`);

    if (user && profile === null) { // Only fetch if user exists AND profile is explicitly null (needs fetching)
      addLog(`[AuthProvider] Profile effect: User ${user.id} present and profile is null. Attempting to fetch profile.`);
      const fetchUserProfile = async () => {
        addLog(`[AuthProvider] fetchUserProfile: Fetching for user ID: ${user.id}`);
        // Using .maybeSingle() is safer if a profile might not exist
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

        if (error) {
          addLog("[AuthProvider] fetchUserProfile: Error fetching profile:", error.message, error.details, error.hint);
          setProfile(null); // Keep profile null on error to allow potential retries or indicate loading failed in UI
        } else if (!data) {
          addLog(`[AuthProvider] fetchUserProfile: No profile data found for user ${user.id}. Setting profile to NO_PROFILE status.`);
          setProfile({ status: 'NO_PROFILE' });
        } else {
          addLog("[AuthProvider] fetchUserProfile: Profile data found:", data);
          setProfile(data);
        }
      };
      fetchUserProfile();
    } else if (!user) {
      addLog(`[AuthProvider] Profile effect: No user. Current profile state: ${currentProfileStateDesc}. Ensuring profile is null.`);
      if (profile !== null) { // If there's a user, but then user becomes null (logout)
        setProfile(null);
        addLog("[AuthProvider] Profile effect: User became null, profile explicitly set to null.");
      }
    } else if (user && profile !== null) {
        addLog(`[AuthProvider] Profile effect: User ${user.id} present and profile is already set (not null). No fetch needed.`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, profile === null]); // Re-run if user.id changes OR if profile's null-ness changes specifically.


  // Define permissions based on profile (memoized for stability)
  const permissions = useMemo(() => {
    addLog("[AuthProvider] Computing permissions. Profile:", profile);
    if (!profile || (typeof profile === 'object' && profile.status === 'NO_PROFILE')) {
      return {
        canViewProfile: false,
        canEditProfile: false,
        isAdmin: false,
      };
    }
    // Assuming profile is an object with a 'role' property if it's a valid profile
    return {
      canViewProfile: !!profile,
      canEditProfile: profile.role === "admin" || profile.role === "manager",
      isAdmin: profile.role === "admin",
    };
  }, [profile]);

  const value: AuthContextType = {
    session,
    user,
    profile,
    loading,
    signOut: async () => {
      addLog("[AuthProvider] signOut called.");
      await supabase.auth.signOut();
      // User, profile, session will be reset by onAuthStateChange
      // No need to router.push here, pages should react to user becoming null
    },
    permissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
