"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import { addLog } from "@/lib/log-service"

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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Effect for session handling (runs once on mount)
  useEffect(() => {
    addLog("[AuthProvider] Session effect: Initializing (mount).");
    let isMounted = true;

    const getInitialSession = async () => {
      addLog("[AuthProvider] getInitialSession: Fetching current session...");
      const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (sessionError) {
        addLog("[AuthProvider] getInitialSession: Error fetching session:", sessionError.message);
      }
      addLog("[AuthProvider] getInitialSession: Fetched session:", initialSession ? initialSession.user.id : 'null');
      setSession(initialSession);
      const initialSupabaseUser = initialSession?.user ?? null;
      setUser(initialSupabaseUser);
      addLog("[AuthProvider] getInitialSession: User initially set to:", initialSupabaseUser?.id || 'null');

      if (!initialSupabaseUser) {
        setProfile(null);
        addLog("[AuthProvider] getInitialSession: No initial user, profile state set to null.");
      }
      setLoading(false);
      addLog("[AuthProvider] getInitialSession: Initial auth loading complete.");
    };

    getInitialSession();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!isMounted) return;
      addLog("[AuthProvider] onAuthStateChange: Event:", event, "New session user ID:", newSession?.user?.id || 'null');

      const newSupabaseUser = newSession?.user ?? null;
      const previousUserId = user?.id; // Read previous user state captured by this closure

      setSession(newSession);
      setUser(newSupabaseUser); // This state update is crucial
      setLoading(false);
      addLog("[AuthProvider] onAuthStateChange: User state updated to:", newSupabaseUser?.id || 'null', ". Loading set to: false.");

      // If the user ID has changed (e.g. from null to an ID, from one ID to another, or from an ID to null)
      // then reset the profile state to null to ensure the profile useEffect refetches.
      if (previousUserId !== newSupabaseUser?.id) {
        addLog(`[AuthProvider] onAuthStateChange: User ID changed (from ${previousUserId || 'null'} to ${newSupabaseUser?.id || 'null'}). Resetting profile to null.`);
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      addLog("[AuthProvider] Unmounting: Unsubscribing auth listener.");
      authSubscription?.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // This effect should run only once to set up listeners and initial state. `user` inside onAuthStateChange is from closure.

  // Effect for profile fetching
  useEffect(() => {
    const userId = user?.id;
    const profileIsNull = profile === null;
    addLog(`[AuthProvider] Profile effect: Triggered. User ID: ${userId || 'null'}. Profile is null: ${profileIsNull}`);

    if (userId && profileIsNull) {
      addLog(`[AuthProvider] Profile effect: User ${userId} present and profile is null. Initiating fetch.`);
      let isActive = true;

      const fetchUserProfile = async () => {
        addLog(`[AuthProvider] fetchUserProfile: Fetching for user ID: ${userId}`);
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

        if (!isActive) {
          addLog(`[AuthProvider] fetchUserProfile: Component unmounted or user changed before fetch completed for ${userId}. Aborting setProfile.`);
          return;
        }

        if (error) {
          addLog("[AuthProvider] fetchUserProfile: Error fetching profile:", error.message, error.details, error.hint);
          setProfile(null);
        } else if (!data) {
          addLog(`[AuthProvider] fetchUserProfile: No profile data found for user ${userId}. Setting profile to NO_PROFILE status.`);
          setProfile({ status: 'NO_PROFILE' });
        } else {
          addLog("[AuthProvider] fetchUserProfile: Profile data found for user ${userId}:", data);
          setProfile(data);
        }
      };

      fetchUserProfile();
      return () => {
        addLog(`[AuthProvider] Profile effect: Cleanup for user ID ${userId}. Setting isActive to false.`);
        isActive = false;
      };
    } else if (!userId && profile !== null) { // User logged out, clear profile
        addLog(`[AuthProvider] Profile effect: No user. Clearing profile.`);
        setProfile(null);
    }
  }, [user?.id, profile]); // Re-run if user.id changes, or if profile changes (e.g. from an object back to null)


  const permissions = useMemo(() => {
    addLog("[AuthProvider] Computing permissions. Profile:", profile);
    if (!profile || (typeof profile === 'object' && profile.status === 'NO_PROFILE')) {
      return {
        canViewProfile: false,
        canEditProfile: false,
        isAdmin: false,
      };
    }
    return {
      canViewProfile: !!profile,
      canEditProfile: profile?.role === "admin" || profile?.role === "manager",
      isAdmin: profile?.role === "admin",
    };
  }, [profile]);

  const value: AuthContextType = {
    session,
    user,
    profile,
    loading,
    signOut: async () => {
      addLog("[AuthProvider] signOut called.");
      // setProfile(null); // Let onAuthStateChange handle profile reset on SIGNED_OUT
      // setUser(null);     // Let onAuthStateChange handle user reset
      // setSession(null);  // Let onAuthStateChange handle session reset
      await supabase.auth.signOut();
      // router.push("/auth/login"); // Let pages redirect based on auth state
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
