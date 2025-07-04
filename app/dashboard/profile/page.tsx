"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { redirect } from "next/navigation"
import { UniversalProfilePage } from "@/components/dashboard/universal-profile-page"
import { hasPermission } from "@/lib/role-config"

export default function ProfilePage() {
  const { user } = useAuth()

  // Allow all authenticated users with profile permissions
  if (!user || !hasPermission(user.role as any, "canViewProfile")) {
    redirect("/dashboard")
  }

  return <UniversalProfilePage />
}
