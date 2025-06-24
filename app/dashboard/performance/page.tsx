"use client"

import { PerformanceModule } from "@/components/dashboard/performance-module"
import { PlayerPerformanceModule } from "@/components/dashboard/player-performance-module"
import { useAuth } from "@/components/auth/auth-provider"

export default function PerformancePage() {
  const { user } = useAuth()

  if (user?.role === "player") {
    return <PlayerPerformanceModule />
  }

  return <PerformanceModule />
}
