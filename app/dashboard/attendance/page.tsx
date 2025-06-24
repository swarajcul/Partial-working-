"use client"

import { AttendanceModule } from "@/components/dashboard/attendance-module"
import { PlayerAttendanceModule } from "@/components/dashboard/player-attendance-module"
import { useAuth } from "@/components/auth/auth-provider"

export default function AttendancePage() {
  const { user } = useAuth()

  if (user?.role === "player") {
    return <PlayerAttendanceModule />
  }

  return <AttendanceModule />
}
