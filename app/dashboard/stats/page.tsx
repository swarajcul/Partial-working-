"use client"

import { AnalyticsModule } from "@/components/dashboard/analytics-module"
import { PlayerAnalyticsModule } from "@/components/dashboard/player-analytics-module"
import { useAuth } from "@/components/auth/auth-provider"

export default function StatsPage() {
  const { user } = useAuth()

  if (user?.role === "player") {
    return <PlayerAnalyticsModule />
  }

  return <AnalyticsModule />
}
