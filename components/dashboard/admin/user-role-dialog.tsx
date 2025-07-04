"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "coach" | "player" | null
  team?: string
  status: "active" | "pending" | "inactive"
  joinDate: string
  lastActive: string
}

interface UserRoleDialogProps {
  user: User
  onClose: () => void
  onSave: (userId: string, role: string, team?: string) => void
}

export function UserRoleDialog({ user, onClose, onSave }: UserRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState(user.role || "")
  const [selectedTeam, setSelectedTeam] = useState(user.team || "")

  const teams = ["Rebellion", "Phoenix", "Vanguard"]
  const roles = [
    { value: "admin", label: "Admin", description: "Full access to all features and settings" },
    { value: "manager", label: "Manager", description: "Access to all team data, no settings/configs" },
    { value: "coach", label: "Coach", description: "Access to assigned team only" },
    { value: "player", label: "Player", description: "Self + team stats only" },
  ]

  const handleSave = () => {
    onSave(user.id, selectedRole, selectedRole === "player" || selectedRole === "coach" ? selectedTeam : undefined)
    onClose()
  }

  const needsTeam = selectedRole === "player" || selectedRole === "coach"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-gray-900 border-orange-600/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Edit User Role</CardTitle>
              <CardDescription className="text-gray-400">Assign role and team for {user.name}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white">Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value} className="text-white">
                    <div>
                      <div className="font-medium">{role.label}</div>
                      <div className="text-sm text-gray-400">{role.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {needsTeam && (
            <div className="space-y-2">
              <Label className="text-white">Team Assignment</Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {teams.map((team) => (
                    <SelectItem key={team} value={team} className="text-white">
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Role Permissions</h4>
            {selectedRole && (
              <div className="text-gray-400 text-sm">{roles.find((r) => r.value === selectedRole)?.description}</div>
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              disabled={!selectedRole || (needsTeam && !selectedTeam)}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
