"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode, useRef } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import { addLog } from "@/lib/log-service"
import { type UserRole, type RolePermissions, rolePermissions } from "@/lib/role-config" // Import RolePermissions and rolePermissions

// Updated AuthContextType
type AuthContextType = {
  session: Session | null
  user: User | null
  profile: any | null
  loading: boolean
  signOut: () => Promise<void>
  permissions: RolePermissions // Use the comprehensive RolePermissions type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper to create a default (all false) permissions object
const getDefaultPermissions = (): RolePermissions => {
  const permissions: Partial<RolePermissions> = {};
  // Assuming 'player' role exists and can be used to get all permission keys
  const sampleRoleKey = (Object.keys(rolePermissions)[0] as UserRole | undefined) || 'player';
  if (rolePermissions[sampleRoleKey]) {
    for (const key in rolePermissions[sampleRoleKey]) {
      (permissions as any)[key] = false;
    }
  }
  return permissions as RolePermissions;
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const previousUserIdRef = useRef<string | undefined | null>(null);

  useEffect(() => {
    addLog("[AuthProvider] Session effect: Initializing (mount).");
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!isMounted) return;
      addLog("[AuthProvider] Initial session fetched:", initialSession ? initialSession.user.id : 'null');
      const initialSupabaseUser = initialSession?.user ?? null;

      setSession(initialSession);
      setUser(initialSupabaseUser);
      setLoading(false);
      addLog("[AuthProvider] Initial session/user set. Loading false.", "Initial User:", initialSupabaseUser?.id);

      if (!initialSupabaseUser) {
        setProfile(null);
        addLog("[AuthProvider] Initial session: No initial user, profile state set to null.");
      }
      previousUserIdRef.current = initialSupabaseUser?.id;
    });

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!isMounted) return;
      addLog("[AuthProvider] onAuthStateChange: Event:", event, "New session user ID:", newSession?.user?.id || 'null');

      const newSupabaseUser = newSession?.user ?? null;

      setSession(newSession);
      setUser(newSupabaseUser);
      setLoading(false);
      addLog("[AuthProvider] onAuthStateChange: User updated to:", newSupabaseUser?.id || 'null', ". Loading set to false.");

      if (previousUserIdRef.current !== newSupabaseUser?.id) {
        addLog(`[AuthProvider] onAuthStateChange: User ID changed (from ${previousUserIdRef.current || 'null'} to ${newSupabaseUser?.id || 'null'}). Resetting profile to null.`);
        setProfile(null);
      }
      previousUserIdRef.current = newSupabaseUser?.id;
    });

    return () => {
      isMounted = false;
      addLog("[AuthProvider] Unmounting: Unsubscribing auth listener.");
      authSubscription?.unsubscribe();
    };
  }, []);

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
    } else if (!userId && profile !== null) {
        addLog(`[AuthProvider] Profile effect: No user. Clearing profile.`);
        setProfile(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, profile === null]); // Re-run if user.id changes OR if profile becomes null

  const permissions = useMemo(() => {
    addLog("[AuthProvider] Computing permissions. Profile:", profile);
    if (!profile || typeof profile !== 'object' || profile.status === 'NO_PROFILE' || !profile.role) {
      addLog("[AuthProvider] Profile not ready or no role, returning default (all false) permissions.");
      return getDefaultPermissions();
    }

    const userAppRole = profile.role as UserRole;
    if (rolePermissions[userAppRole]) {
      addLog("[AuthProvider] Profile role found:", userAppRole, ". Applying permissions from role-config.");
      return rolePermissions[userAppRole];
    } else {
      addLog("[AuthProvider] Unknown role in profile:", userAppRole, ". Returning default (all false) permissions.");
      return getDefaultPermissions();
    }
  }, [profile]);

  const value: AuthContextType = {
    session,
    user,
    profile,
    loading,
    signOut: async () => {
      addLog("[AuthProvider] signOut called.");
      await supabase.auth.signOut();
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
