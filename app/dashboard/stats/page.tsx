"use client"

import { EnhancedAnalyticsModule } from "@/components/dashboard/enhanced-analytics-module"
import { useAuth } from "@/components/auth/auth-provider"

export default function StatsPage() {
  const { user } = useAuth()

  if (user?.role === "player") {
    return <EnhancedAnalyticsModule />
  }

  return <EnhancedAnalyticsModule />
}
