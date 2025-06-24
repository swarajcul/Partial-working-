"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Users, Calendar } from "lucide-react"

interface AttendanceFormProps {
  onClose: () => void
}

const teams = [
  { id: "rebellion", name: "Rebellion", players: ["ShadowStrike", "RebelSniper", "StormRider", "PhantomEdge"] },
  { id: "phoenix", name: "Phoenix", players: ["PhoenixRise", "FireStorm", "BlazeFury", "EmberWing"] },
  { id: "vanguard", name: "Vanguard", players: ["VanguardLead", "SteelShot", "IronFist", "GuardianShield"] },
]

const slots = [
  { id: "A1", name: "Slot A1", matchesPerSlot: 5 },
  { id: "A2", name: "Slot A2", matchesPerSlot: 4 },
  { id: "B1", name: "Slot B1", matchesPerSlot: 5 },
  { id: "B2", name: "Slot B2", matchesPerSlot: 3 },
  { id: "C1", name: "Slot C1", matchesPerSlot: 4 },
]

const maps = ["Erangel", "Miramar", "Sanhok", "Vikendi", "Karakin", "Paramo"]

export function AttendanceForm({ onClose }: AttendanceFormProps) {
  const [sessionType, setSessionType] = useState<"training" | "match">("training")
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    trainingType: "", // Individual/Team
    team: "",
    assignedSlot: "",
    matchNumber: 1,
    map: "",
    playerAttendance: {} as Record<string, "Present" | "Absent">,
  })

  const selectedTeam = useMemo(() => {
    return teams.find((team) => team.id === formData.team)
  }, [formData.team])

  const selectedSlot = useMemo(() => {
    return slots.find((slot) => slot.id === formData.assignedSlot)
  }, [formData.assignedSlot])

  const availableMatchNumbers = useMemo(() => {
    if (!selectedSlot) return []
    return Array.from({ length: selectedSlot.matchesPerSlot }, (_, i) => i + 1)
  }, [selectedSlot])

  const handleTeamChange = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId)
    if (team) {
      const initialAttendance: Record<string, "Present" | "Absent"> = {}
      team.players.forEach((player) => {
        initialAttendance[player] = "Present"
      })
      setFormData((prev) => ({
        ...prev,
        team: teamId,
        playerAttendance: initialAttendance,
        assignedSlot: "", // Reset slot when team changes
        matchNumber: 1,
      }))
    }
  }

  const handlePlayerAttendanceChange = (playerName: string, status: "Present" | "Absent") => {
    setFormData((prev) => ({
      ...prev,
      playerAttendance: {
        ...prev.playerAttendance,
        [playerName]: status,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Attendance data:", { sessionType, ...formData })
    onClose()
  }

  const isFormValid = () => {
    if (sessionType === "training") {
      return formData.date && formData.trainingType && Object.keys(formData.playerAttendance).length > 0
    } else {
      return (
        formData.date &&
        formData.team &&
        formData.assignedSlot &&
        formData.matchNumber &&
        formData.map &&
        Object.keys(formData.playerAttendance).length > 0
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl bg-gray-900 border-orange-600/20 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Mark Attendance</CardTitle>
              <CardDescription className="text-gray-400">
                Record player attendance for training or matches
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Session Type Selection */}
            <div className="space-y-4">
              <Label className="text-white text-lg font-medium">Session Type</Label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={sessionType === "training" ? "default" : "outline"}
                  onClick={() => setSessionType("training")}
                  className={
                    sessionType === "training"
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "border-gray-600 text-white hover:bg-gray-800"
                  }
                >
                  <Users className="w-4 h-4 mr-2" />
                  Training Session
                </Button>
                <Button
                  type="button"
                  variant={sessionType === "match" ? "default" : "outline"}
                  onClick={() => setSessionType("match")}
                  className={
                    sessionType === "match"
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "border-gray-600 text-white hover:bg-gray-800"
                  }
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Match Attendance
                </Button>
              </div>
            </div>

            {/* Common Fields */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-white">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>

            {/* Training Session Fields */}
            {sessionType === "training" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Training Type</Label>
                  <Select
                    value={formData.trainingType}
                    onValueChange={(value) => setFormData({ ...formData, trainingType: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select training type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="Individual" className="text-white">
                        Individual Training
                      </SelectItem>
                      <SelectItem value="Team" className="text-white">
                        Team Training
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.trainingType === "Team" && (
                  <div className="space-y-2">
                    <Label className="text-white">Team</Label>
                    <Select value={formData.team} onValueChange={handleTeamChange}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id} className="text-white">
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {/* Match Attendance Fields */}
            {sessionType === "match" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Team</Label>
                    <Select value={formData.team} onValueChange={handleTeamChange}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id} className="text-white">
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Assigned Slot</Label>
                    <Select
                      value={formData.assignedSlot}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, assignedSlot: value, matchNumber: 1 }))
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select slot" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {slots.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id} className="text-white">
                            {slot.name} ({slot.matchesPerSlot} matches)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Match Number</Label>
                    <Select
                      value={formData.matchNumber.toString()}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, matchNumber: Number.parseInt(value) }))
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select match" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {availableMatchNumbers.map((num) => (
                          <SelectItem key={num} value={num.toString()} className="text-white">
                            Match {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Map</Label>
                    <Select value={formData.map} onValueChange={(value) => setFormData({ ...formData, map: value })}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select map" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {maps.map((map) => (
                          <SelectItem key={map} value={map} className="text-white">
                            {map}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Player Attendance */}
            {selectedTeam && (
              <div className="space-y-4">
                <Label className="text-white text-lg font-medium">Player Attendance</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTeam.players.map((player) => (
                    <div key={player} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <span className="text-white font-medium">{player}</span>
                      <Select
                        value={formData.playerAttendance[player] || "Present"}
                        onValueChange={(value: "Present" | "Absent") => handlePlayerAttendanceChange(player, value)}
                      >
                        <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="Present" className="text-white">
                            Present
                          </SelectItem>
                          <SelectItem value="Absent" className="text-white">
                            Absent
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Training Player Selection */}
            {sessionType === "training" && formData.trainingType === "Individual" && (
              <div className="space-y-4">
                <Label className="text-white text-lg font-medium">Select Players</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams
                    .flatMap((team) => team.players)
                    .map((player) => (
                      <div key={player} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <span className="text-white font-medium">{player}</span>
                        <Select
                          value={formData.playerAttendance[player] || "Absent"}
                          onValueChange={(value: "Present" | "Absent") => handlePlayerAttendanceChange(player, value)}
                        >
                          <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="Present" className="text-white">
                              Present
                            </SelectItem>
                            <SelectItem value="Absent" className="text-white">
                              Absent
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700" disabled={!isFormValid()}>
                Save Attendance
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
