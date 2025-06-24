"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save, Users, MapPin, Trophy, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PlayerPerformance {
  playerId: string
  playerName: string
  inGameName: string
  kills: number
  assists: number
  damage: number
  survivalTime: string
  placement: number
}

interface ManualPerformanceData {
  team: string
  assignedSlot: string
  matchNumber: number
  map: string
  teamPlacement: number
  players: PlayerPerformance[]
  date: string
  notes: string
}

interface ManualPerformanceInputProps {
  onSave: (data: ManualPerformanceData) => void
  onCancel: () => void
  initialData?: Partial<ManualPerformanceData>
}

const teams = [
  {
    id: "rebellion",
    name: "Rebellion",
    players: [
      { id: "1", name: "ShadowStrike", ign: "ShdwStrk_YT" },
      { id: "2", name: "RebelSniper", ign: "RblSnpr_Pro" },
      { id: "3", name: "StormRider", ign: "StrmRdr_GG" },
      { id: "4", name: "PhantomEdge", ign: "PhntmEdg_X" },
    ],
  },
  {
    id: "phoenix",
    name: "Phoenix",
    players: [
      { id: "5", name: "PhoenixRise", ign: "PhxRise_YT" },
      { id: "6", name: "FireStorm", ign: "FrStrm_Pro" },
      { id: "7", name: "BlazeFury", ign: "BlzFry_GG" },
      { id: "8", name: "EmberWing", ign: "EmbrWng_X" },
    ],
  },
  {
    id: "vanguard",
    name: "Vanguard",
    players: [
      { id: "9", name: "VanguardLead", ign: "VngrdLd_YT" },
      { id: "10", name: "SteelShot", ign: "StlSht_Pro" },
      { id: "11", name: "IronFist", ign: "IrnFst_GG" },
      { id: "12", name: "GuardianShield", ign: "GrdnShld_X" },
    ],
  },
]

const slots = [
  { id: "A1", name: "Slot A1", matchesPerSlot: 5 },
  { id: "A2", name: "Slot A2", matchesPerSlot: 4 },
  { id: "B1", name: "Slot B1", matchesPerSlot: 5 },
  { id: "B2", name: "Slot B2", matchesPerSlot: 3 },
  { id: "C1", name: "Slot C1", matchesPerSlot: 4 },
]

const maps = ["Erangel", "Miramar", "Sanhok", "Vikendi", "Karakin", "Paramo"]

export function ManualPerformanceInput({ onSave, onCancel, initialData }: ManualPerformanceInputProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<ManualPerformanceData>(() => ({
    team: initialData?.team || "",
    assignedSlot: initialData?.assignedSlot || "",
    matchNumber: initialData?.matchNumber || 1,
    map: initialData?.map || "",
    teamPlacement: initialData?.teamPlacement || 1,
    players: initialData?.players || [],
    date: initialData?.date || new Date().toISOString().split("T")[0],
    notes: initialData?.notes || "",
  }))

  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

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

  const initializePlayers = useCallback((teamId: string) => {
    const team = teams.find((t) => t.id === teamId)
    if (!team) return []

    return team.players.slice(0, 4).map((player) => ({
      playerId: player.id,
      playerName: player.name,
      inGameName: player.ign,
      kills: 0,
      assists: 0,
      damage: 0,
      survivalTime: "",
      placement: 1,
    }))
  }, [])

  const handleTeamChange = useCallback(
    (teamId: string) => {
      setFormData((prev) => ({
        ...prev,
        team: teamId,
        players: initializePlayers(teamId),
        assignedSlot: "",
        matchNumber: 1,
      }))
    },
    [initializePlayers],
  )

  const handlePlayerChange = useCallback(
    (playerIndex: number, field: keyof PlayerPerformance, value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        players: prev.players.map((player, index) => (index === playerIndex ? { ...player, [field]: value } : player)),
      }))
    },
    [],
  )

  const handleNextStep = useCallback(() => {
    if (currentStep === 1) {
      // Validate basic match info
      if (!formData.team || !formData.assignedSlot || !formData.map) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required match information.",
          variant: "destructive",
        })
        return
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }, [currentStep, formData, toast])

  const handlePrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }, [])

  const handleSave = useCallback(async () => {
    setIsLoading(true)
    try {
      // Validate all data
      if (formData.players.length === 0) {
        throw new Error("No player data to save")
      }

      // Simulate save delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      onSave(formData)
      toast({
        title: "Performance Data Saved",
        description: "Match performance has been successfully recorded.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save performance data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [formData, onSave, toast])

  const isStep1Valid = formData.team && formData.assignedSlot && formData.map
  const isStep2Valid = formData.players.length > 0 && formData.players.every((p) => p.playerName)
  const isStep3Valid = formData.teamPlacement > 0

  return (
    <div className="h-full flex flex-col">
      {/* Progress Steps */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step <= currentStep
                    ? "bg-orange-600 text-white"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {step}
              </div>
              <div className="ml-3 text-sm">
                <div className={`font-medium ${step <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                  {step === 1 && "Match Info"}
                  {step === 2 && "Player Data"}
                  {step === 3 && "Review & Save"}
                </div>
              </div>
              {step < 3 && <div className="w-16 h-px bg-border ml-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Match Information</h2>
              <p className="text-muted-foreground">Enter basic match details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="team" className="text-foreground">
                  Team *
                </Label>
                <Select value={formData.team} onValueChange={handleTeamChange} required>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id} className="text-foreground">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{team.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedSlot" className="text-foreground">
                  Assigned Slot *
                </Label>
                <Select
                  value={formData.assignedSlot}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, assignedSlot: value, matchNumber: 1 }))}
                  required
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select slot" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {slots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id} className="text-foreground">
                        {slot.name} ({slot.matchesPerSlot} matches)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="matchNumber" className="text-foreground">
                  Match Number *
                </Label>
                <Select
                  value={formData.matchNumber?.toString()}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, matchNumber: Number.parseInt(value) }))}
                  required
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select match" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {availableMatchNumbers.map((num) => (
                      <SelectItem key={num} value={num.toString()} className="text-foreground">
                        Match {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="map" className="text-foreground">
                  Map *
                </Label>
                <Select
                  value={formData.map}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, map: value }))}
                  required
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select map" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {maps.map((map) => (
                      <SelectItem key={map} value={map} className="text-foreground">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{map}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamPlacement" className="text-foreground">
                  Team Placement (1-100) *
                </Label>
                <Input
                  id="teamPlacement"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.teamPlacement}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, teamPlacement: Number.parseInt(e.target.value) || 1 }))
                  }
                  required
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-foreground">
                  Match Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && selectedTeam && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Player Performance</h2>
              <p className="text-muted-foreground">Enter individual player statistics</p>
              <Badge variant="outline" className="mt-2">
                {selectedTeam.name} Team
              </Badge>
            </div>

            <div className="space-y-4">
              {formData.players.map((player, index) => (
                <Card key={player.playerId} className="bg-muted/50 border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-foreground flex items-center space-x-2">
                      <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs">
                        {player.playerName.slice(0, 2)}
                      </div>
                      <div>
                        <div>{player.playerName}</div>
                        <div className="text-xs text-muted-foreground font-normal">IGN: {player.inGameName}</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label className="text-foreground text-xs">Kills</Label>
                        <Input
                          type="number"
                          min="0"
                          value={player.kills}
                          onChange={(e) => handlePlayerChange(index, "kills", Number.parseInt(e.target.value) || 0)}
                          className="bg-background border-border text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground text-xs">Assists</Label>
                        <Input
                          type="number"
                          min="0"
                          value={player.assists}
                          onChange={(e) => handlePlayerChange(index, "assists", Number.parseInt(e.target.value) || 0)}
                          className="bg-background border-border text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground text-xs">Damage</Label>
                        <Input
                          type="number"
                          min="0"
                          value={player.damage}
                          onChange={(e) => handlePlayerChange(index, "damage", Number.parseInt(e.target.value) || 0)}
                          className="bg-background border-border text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground text-xs">Survival Time</Label>
                        <Input
                          placeholder="25:30"
                          value={player.survivalTime}
                          onChange={(e) => handlePlayerChange(index, "survivalTime", e.target.value)}
                          className="bg-background border-border text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground text-xs">Individual Placement</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={player.placement}
                          onChange={(e) => handlePlayerChange(index, "placement", Number.parseInt(e.target.value) || 1)}
                          className="bg-background border-border text-foreground"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-foreground">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional observations or notes about the match performance..."
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                className="bg-background border-border text-foreground"
                rows={3}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Review & Confirm</h2>
              <p className="text-muted-foreground">Please review all data before saving</p>
            </div>

            {/* Match Summary */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Match Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-orange-600" />
                    <div>
                      <div className="text-sm text-muted-foreground">Team</div>
                      <div className="font-medium text-foreground">{selectedTeam?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-sm text-muted-foreground">Map</div>
                      <div className="font-medium text-foreground">{formData.map}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <div>
                      <div className="text-sm text-muted-foreground">Team Placement</div>
                      <div className="font-medium text-foreground">#{formData.teamPlacement}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-sm text-muted-foreground">Date</div>
                      <div className="font-medium text-foreground">{formData.date}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Player Performance Summary */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Player Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-foreground">Player</th>
                        <th className="text-left py-2 text-foreground">IGN</th>
                        <th className="text-center py-2 text-foreground">Kills</th>
                        <th className="text-center py-2 text-foreground">Assists</th>
                        <th className="text-center py-2 text-foreground">Damage</th>
                        <th className="text-center py-2 text-foreground">Survival</th>
                        <th className="text-center py-2 text-foreground">Placement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.players.map((player, index) => (
                        <tr key={player.playerId} className="border-b border-border/50">
                          <td className="py-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs">
                                {player.playerName.slice(0, 2)}
                              </div>
                              <span className="font-medium text-foreground">{player.playerName}</span>
                            </div>
                          </td>
                          <td className="py-3 text-muted-foreground">{player.inGameName}</td>
                          <td className="py-3 text-center font-medium text-foreground">{player.kills}</td>
                          <td className="py-3 text-center font-medium text-foreground">{player.assists}</td>
                          <td className="py-3 text-center font-medium text-foreground">
                            {player.damage.toLocaleString()}
                          </td>
                          <td className="py-3 text-center font-medium text-foreground">{player.survivalTime}</td>
                          <td className="py-3 text-center font-medium text-foreground">#{player.placement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {formData.notes && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{formData.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="border-t border-border p-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel} className="text-foreground">
              Cancel
            </Button>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevStep} className="text-foreground">
                Previous
              </Button>
            )}
          </div>

          <div className="flex space-x-2">
            {currentStep < 3 ? (
              <Button
                onClick={handleNextStep}
                disabled={
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid) ||
                  (currentStep === 3 && !isStep3Valid)
                }
                className="bg-orange-600 hover:bg-orange-700"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={isLoading || !isStep3Valid}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Performance Data
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
