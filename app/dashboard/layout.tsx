"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import {DashboardSidebar} from "@/components/dashboard/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, profile } = useAuth() // Added profile
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  const router = useRouter() // Ensure router is available

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  // If loading session, or no user
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading authentication...</p>
      </div>
    )
  }

  // If profile is not loaded yet (still null after user is loaded)
  if (!profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading profile...</p> {/* More specific loading message */}
      </div>
    )
  }

  // If profile fetch resulted in NO_PROFILE status
  if (profile && (profile as any).status === 'NO_PROFILE') {
    // Redirect to an onboarding page or show a specific message
    // Assuming an onboarding page exists or will be created at /onboarding
    router.push("/onboarding");
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Redirecting to onboarding...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardSidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
