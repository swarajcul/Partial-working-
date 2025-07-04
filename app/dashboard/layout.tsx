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
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardSidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
