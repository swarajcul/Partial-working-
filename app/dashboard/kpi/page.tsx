"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { redirect } from "next/navigation"
import { KPIDashboard } from "@/components/dashboard/kpi-dashboard"
import { hasPermission } from "@/lib/role-config"

export default function KPIPage() {
  const { user } = useAuth()

  // Only allow users with KPI permissions to access this page
  if (!user || !hasPermission(user.role as any, "canViewKPIs")) {
    redirect("/dashboard")
  }

  return <KPIDashboard />
}
