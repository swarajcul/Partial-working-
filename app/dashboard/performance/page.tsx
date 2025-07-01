"use client"

import { EnhancedPerformanceModule } from "@/components/dashboard/enhanced-performance-module"
import { useAuth } from "@/components/auth/auth-provider"

export default function PerformancePage() {
  const { user } = useAuth()

  if (user?.role === "player") {
    return <EnhancedPerformanceModule />
  }

  return <EnhancedPerformanceModule />
}
