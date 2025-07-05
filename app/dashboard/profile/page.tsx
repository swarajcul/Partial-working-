"use client"

import { useEffect } from "react";
import { useRouter, redirect } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { UniversalProfilePage } from "@/components/dashboard/universal-profile-page";
import { hasPermission, UserRole, rolePermissions } from "@/lib/role-config";
import { addLog } from "@/lib/log-service";

// A simple loading placeholder
const LoadingPlaceholder = ({ message }: { message: string }) => (
  <div className="flex h-screen w-full items-center justify-center">
    <p>{message}</p>
  </div>
);

export default function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  // Log current state whenever it changes - useful for seeing what this page receives
  useEffect(() => {
    addLog(
      "[ProfilePage] State Updated - AuthLoading:", authLoading,
      "User ID:", user?.id || 'null',
      "Profile:", profile ? JSON.stringify(profile) : 'null'
    );
  }, [authLoading, user, profile]);

  if (authLoading) {
    addLog("[ProfilePage] Render: Auth is loading (session check).");
    return <LoadingPlaceholder message="Loading authentication..." />;
  }

  if (!user) {
    addLog("[ProfilePage] Render: No user found. Triggering redirect to /auth/login.");
    // In client components, useEffect is safer for programmatic navigation post-render to avoid errors during render.
    // However, DashboardLayout should already handle this. If this page is reached directly without a user,
    // redirecting via useEffect is a common pattern.
    useEffect(() => {
      router.push("/auth/login");
    }, [router]);
    return <LoadingPlaceholder message="Redirecting to login..." />;
  }

  if (!profile) {
    addLog("[ProfilePage] Render: Profile is null (still being fetched by AuthProvider or fetch errored and set to null).");
    return <LoadingPlaceholder message="Loading profile data..." />;
  }

  if (typeof profile === 'object' && profile.status === 'NO_PROFILE') {
    addLog("[ProfilePage] Render: Profile status is NO_PROFILE. Triggering redirect to /onboarding.");
    useEffect(() => {
      router.push("/onboarding");
    }, [router]);
    return <LoadingPlaceholder message="Profile not found. Redirecting to onboarding..." />;
  }

  // At this point, profile should be a valid loaded profile object from the database.
  // It should have an `id` and a `role`.
  const userAppRole = profile.role as UserRole;
  addLog("[ProfilePage] Render: Profile object seems valid. User app role from profile:", userAppRole);

  // Validate that userAppRole is a recognized role string before using it as a key.
  if (!userAppRole || typeof userAppRole !== 'string' || !rolePermissions.hasOwnProperty(userAppRole)) {
      addLog("[ProfilePage] Render: Invalid or missing role in profile object. Role found:", userAppRole, ". Redirecting to dashboard.");
      useEffect(() => { router.push("/dashboard"); }, [router]);
      return <LoadingPlaceholder message="Invalid user role. Redirecting..." />;
  }

  // Now, check permission using the validated userAppRole
  if (!hasPermission(userAppRole, "canViewProfile")) {
    addLog("[ProfilePage] Render: Permission denied for canViewProfile. Role:", userAppRole, ". Redirecting to dashboard.");
    useEffect(() => { router.push("/dashboard"); }, [router]);
    return <LoadingPlaceholder message="Access Denied. Redirecting..." />;
  }

  addLog("[ProfilePage] Render: Permission granted for canViewProfile. Role:", userAppRole, ". Rendering UniversalProfilePage.");
  return <UniversalProfilePage />;
}
