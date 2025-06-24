"use client"

import type React from "react"

import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth/login")
        return
      }

      if (!user.role) {
        router.push("/onboarding")
        return
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purple-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!user.role) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-purple-950 flex w-full">
        <DashboardSidebar />
        <SidebarInset className="flex-1 bg-purple-950">
          <main className="p-6 bg-purple-950 min-h-screen">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
