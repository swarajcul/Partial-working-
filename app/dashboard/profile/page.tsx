"use client"

import { PlayerProfilePage } from "@/components/dashboard/player-profile-page"
import { useAuth } from "@/components/auth/auth-provider"
import { redirect } from "next/navigation"

export default function ProfilePage() {
  const { user } = useAuth()

  // Only allow players to access this page
  if (user?.role !== "player") {
    redirect("/dashboard")
  }

  return <PlayerProfilePage />
}
