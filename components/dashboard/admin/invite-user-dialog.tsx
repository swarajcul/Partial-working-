"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Mail } from "lucide-react"

interface InviteUserDialogProps {
  onClose: () => void
  onInvite: (email: string, role: string, team?: string) => void
}

export function InviteUserDialog({ onClose, onInvite }: InviteUserDialogProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [team, setTeam] = useState("")

  const teams = ["Rebellion", "Phoenix", "Vanguard"]
  const roles = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "coach", label: "Coach" },
    { value: "player", label: "Player" },
  ]

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    onInvite(email, role, role === "player" || role === "coach" ? team : undefined)
    onClose()
  }

  const needsTeam = role === "player" || role === "coach"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-gray-900 border-orange-600/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Invite New User</CardTitle>
              <CardDescription className="text-gray-400">Send an invitation to join the platform</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Role</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {roles.map((roleOption) => (
                    <SelectItem key={roleOption.value} value={roleOption.value} className="text-white">
                      {roleOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {needsTeam && (
              <div className="space-y-2">
                <Label className="text-white">Team Assignment</Label>
                <Select value={team} onValueChange={setTeam} required>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {teams.map((teamOption) => (
                      <SelectItem key={teamOption} value={teamOption} className="text-white">
                        {teamOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex space-x-2 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                disabled={!email || !role || (needsTeam && !team)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
