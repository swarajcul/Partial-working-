"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PlayerForm } from "./player-form"
import { toast } from "@/hooks/use-toast"
import type { PlayerFormData } from "@/lib/player-validation"

interface Player {
  id: string
  name: string
  role: "Assaulter" | "Sniper" | "Support"
  specialization: string
  kdRatio: number
  rank: number
  avatar: string
  matchesPlayed: number
  winRate: number
  status: "Active" | "Inactive" | "Benched"
  joinDate: string
  lastActive: string
}

interface PlayerFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (player: Player) => void
  initialData?: Partial<Player>
  mode: "add" | "edit"
}

export function PlayerFormModal({ isOpen, onClose, onSuccess, initialData, mode }: PlayerFormModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: PlayerFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const player: Player = {
        id: initialData?.id || `player_${Date.now()}`,
        ...data,
      }

      onSuccess(player)
      onClose()

      toast({
        title: mode === "add" ? "Player Added" : "Player Updated",
        description: `${data.name} has been ${mode === "add" ? "added to" : "updated in"} the team roster.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} player. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{mode === "add" ? "Add New Player" : "Edit Player"}</DialogTitle>
        </DialogHeader>
        <PlayerForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  )
}
