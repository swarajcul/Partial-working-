"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileImage, Eye, CheckCircle, AlertCircle, Loader2, Save, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface ExtractedPlayerData {
  id: string
  extractedIGN: string
  matchedPlayerId?: string
  matchedPlayerName?: string
  kills: number
  assists: number
  damage: number
  survivalTime: string
  placement: number
  confidence: number
  verified: boolean
}

interface ScreenshotPerformanceInputProps {
  onSave: (data: any) => void
  onCancel: () => void
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

// Simulated OCR extraction results
const simulateOCRExtraction = (): ExtractedPlayerData[] => [
  {
    id: "1",
    extractedIGN: "ShdwStrk_YT",
    kills: 12,
    assists: 3,
    damage: 2450,
    survivalTime: "18:45",
    placement: 15,
    confidence: 0.95,
    verified: false,
  },
  {
    id: "2",
    extractedIGN: "RblSnpr_Pr0", // Intentional OCR error
    kills: 8,
    assists: 5,
    damage: 1890,
    survivalTime: "16:20",
    placement: 15,
    confidence: 0.78,
    verified: false,
  },
  {
    id: "3",
    extractedIGN: "StrmRdr_GG",
    kills: 6,
    assists: 2,
    damage: 1650,
    survivalTime: "14:30",
    placement: 15,
    confidence: 0.92,
    verified: false,
  },
  {
    id: "4",
    extractedIGN: "PhntmEdg_X",
    kills: 4,
    assists: 7,
    damage: 1320,
    survivalTime: "12:15",
    placement: 15,
    confidence: 0.88,
    verified: false,
  },
]

export function ScreenshotPerformanceInput({ onSave, onCancel }: ScreenshotPerformanceInputProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [extractedData, setExtractedData] = useState<ExtractedPlayerData[]>([])
  const [selectedTeam, setSelectedTeam] = useState("")
  const [matchInfo, setMatchInfo] = useState({
    assignedSlot: "",
    matchNumber: 1,
    map: "",
    teamPlacement: 1,
    date: new Date().toISOString().split("T")[0],
  })

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (PNG, JPG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive",
        })
        return
      }

      setUploadedFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImageUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      toast({
        title: "Screenshot Uploaded",
        description: "Ready to process the image",
      })
    },
    [toast],
  )

  const handleProcessScreenshot = useCallback(async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    setProcessingProgress(0)

    try {
      // Simulate OCR processing with progress
      const steps = [
        { progress: 20, message: "Analyzing image quality..." },
        { progress: 40, message: "Detecting text regions..." },
        { progress: 60, message: "Extracting player data..." },
        { progress: 80, message: "Processing statistics..." },
        { progress: 100, message: "Finalizing extraction..." },
      ]

      for (const step of steps) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setProcessingProgress(step.progress)
      }

      // Simulate extracted data
      const extracted = simulateOCRExtraction()
      setExtractedData(extracted)
      setCurrentStep(3)

      toast({
        title: "OCR Processing Complete",
        description: `Extracted data for ${extracted.length} players. Please verify the results.`,
      })
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Failed to extract data from screenshot. Please try again or use manual entry.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }, [uploadedFile, toast])

  const handlePlayerMatch = useCallback((extractedId: string, playerId: string) => {
    const allPlayers = teams.flatMap((team) => team.players)
    const matchedPlayer = allPlayers.find((p) => p.id === playerId)

    setExtractedData((prev) =>
      prev.map((player) =>
        player.id === extractedId
          ? {
              ...player,
              matchedPlayerId: playerId,
              matchedPlayerName: matchedPlayer?.name,
              verified: true,
            }
          : player,
      ),
    )
  }, [])

  const handleDataEdit = useCallback(
    (extractedId: string, field: keyof ExtractedPlayerData, value: string | number) => {
      setExtractedData((prev) =>
        prev.map((player) => (player.id === extractedId ? { ...player, [field]: value } : player)),
      )
    },
    [],
  )

  const handleSave = useCallback(async () => {
    try {
      // Validate all players are matched
      const unmatchedPlayers = extractedData.filter((p) => !p.matchedPlayerId)
      if (unmatchedPlayers.length > 0) {
        toast({
          title: "Incomplete Verification",
          description: "Please match all players before saving.",
          variant: "destructive",
        })
        return
      }

      const performanceData = {
        team: selectedTeam,
        ...matchInfo,
        players: extractedData.map((player) => ({
          playerId: player.matchedPlayerId,
          playerName: player.matchedPlayerName,
          inGameName: player.extractedIGN,
          kills: player.kills,
          assists: player.assists,
          damage: player.damage,
          survivalTime: player.survivalTime,
          placement: player.placement,
        })),
        extractionMethod: "screenshot",
        originalScreenshot: uploadedFile?.name,
      }

      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSave(performanceData)

      toast({
        title: "Performance Data Saved",
        description: "Screenshot data has been successfully processed and saved.",
      })

      // Clean up uploaded file (simulate deletion)
      setUploadedFile(null)
      setUploadedImageUrl("")
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save performance data. Please try again.",
        variant: "destructive",
      })
    }
  }, [extractedData, selectedTeam, matchInfo, uploadedFile, onSave, toast])

  const allPlayersMatched = extractedData.every((p) => p.matchedPlayerId)
  const averageConfidence =
    extractedData.length > 0 ? extractedData.reduce((sum, p) => sum + p.confidence, 0) / extractedData.length : 0

  return (
    <div className="h-full flex flex-col">
      {/* Progress Steps */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step <= currentStep ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {step}
              </div>
              <div className="ml-3 text-sm">
                <div className={`font-medium ${step <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                  {step === 1 && "Upload"}
                  {step === 2 && "Process"}
                  {step === 3 && "Verify"}
                  {step === 4 && "Save"}
                </div>
              </div>
              {step < 4 && <div className="w-12 h-px bg-border ml-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Upload Screenshot</h2>
                <p className="text-muted-foreground">Upload a clear screenshot of the match scoreboard</p>
              </div>

              <Card className="bg-card border-border">
                <CardContent className="p-8">
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-blue-500/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadedImageUrl ? (
                      <div className="space-y-4">
                        <img
                          src={uploadedImageUrl || "/placeholder.svg"}
                          alt="Uploaded screenshot"
                          className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                        />
                        <div className="space-y-2">
                          <p className="text-foreground font-medium">{uploadedFile?.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {uploadedFile && (uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              fileInputRef.current?.click()
                            }}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Change Screenshot
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FileImage className="w-16 h-16 text-muted-foreground mx-auto" />
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-foreground">Upload Screenshot</h3>
                          <p className="text-muted-foreground">
                            Click to select or drag and drop your match scoreboard screenshot
                          </p>
                          <p className="text-sm text-muted-foreground">Supports PNG, JPG, JPEG (Max 10MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </CardContent>
              </Card>

              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tips for best results:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Ensure the screenshot is clear and well-lit</li>
                    <li>• Include the full scoreboard with all player stats</li>
                    <li>• Avoid blurry or cropped images</li>
                    <li>• Make sure player names and stats are clearly visible</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="process"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Process Screenshot</h2>
                <p className="text-muted-foreground">Configure match details and process the image</p>
              </div>

              {/* Match Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Match Information</CardTitle>
                  <CardDescription>Enter basic match details before processing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="team" className="text-foreground">
                        Team *
                      </Label>
                      <Select value={selectedTeam} onValueChange={setSelectedTeam} required>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id} className="text-foreground">
                              {team.name}
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
                        value={matchInfo.map}
                        onValueChange={(value) => setMatchInfo((prev) => ({ ...prev, map: value }))}
                        required
                      >
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue placeholder="Select map" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          {maps.map((map) => (
                            <SelectItem key={map} value={map} className="text-foreground">
                              {map}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teamPlacement" className="text-foreground">
                        Team Placement *
                      </Label>
                      <Input
                        id="teamPlacement"
                        type="number"
                        min="1"
                        max="100"
                        value={matchInfo.teamPlacement}
                        onChange={(e) =>
                          setMatchInfo((prev) => ({ ...prev, teamPlacement: Number.parseInt(e.target.value) || 1 }))
                        }
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
                        value={matchInfo.date}
                        onChange={(e) => setMatchInfo((prev) => ({ ...prev, date: e.target.value }))}
                        className="bg-background border-border text-foreground"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Processing */}
              {isProcessing && (
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        <span className="text-foreground font-medium">Processing Screenshot...</span>
                      </div>
                      <Progress value={processingProgress} className="w-full" />
                      <p className="text-sm text-muted-foreground">
                        This may take a few moments depending on image complexity
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!isProcessing && uploadedFile && selectedTeam && matchInfo.map && (
                <div className="text-center">
                  <Button onClick={handleProcessScreenshot} className="bg-blue-600 hover:bg-blue-700" size="lg">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Process Screenshot with OCR
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Verify Extracted Data</h2>
                <p className="text-muted-foreground">Review and match players with your team roster</p>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Confidence: {(averageConfidence * 100).toFixed(0)}%</span>
                  </Badge>
                  <Badge variant={allPlayersMatched ? "default" : "secondary"}>
                    {extractedData.filter((p) => p.matchedPlayerId).length}/{extractedData.length} Players Matched
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                {extractedData.map((player, index) => (
                  <Card
                    key={player.id}
                    className={`bg-card border-border ${
                      player.verified ? "ring-2 ring-green-500/20" : "ring-2 ring-orange-500/20"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">Extracted IGN: {player.extractedIGN}</h3>
                            {player.matchedPlayerName && (
                              <p className="text-sm text-green-600">Matched: {player.matchedPlayerName}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={player.confidence > 0.9 ? "default" : "secondary"}>
                            {(player.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                          {player.verified ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Player Matching */}
                        <div className="space-y-4">
                          <Label className="text-foreground">Match with Team Player *</Label>
                          <Select
                            value={player.matchedPlayerId || ""}
                            onValueChange={(value) => handlePlayerMatch(player.id, value)}
                          >
                            <SelectTrigger className="bg-background border-border text-foreground">
                              <SelectValue placeholder="Select player from team" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-border">
                              {teams
                                .find((t) => t.id === selectedTeam)
                                ?.players.map((teamPlayer) => (
                                  <SelectItem key={teamPlayer.id} value={teamPlayer.id} className="text-foreground">
                                    <div className="flex items-center space-x-2">
                                      <span>{teamPlayer.name}</span>
                                      <span className="text-muted-foreground text-sm">({teamPlayer.ign})</span>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Extracted Stats */}
                        <div className="space-y-4">
                          <Label className="text-foreground">Extracted Statistics</Label>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Kills</Label>
                              <Input
                                type="number"
                                min="0"
                                value={player.kills}
                                onChange={(e) =>
                                  handleDataEdit(player.id, "kills", Number.parseInt(e.target.value) || 0)
                                }
                                className="bg-background border-border text-foreground h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Assists</Label>
                              <Input
                                type="number"
                                min="0"
                                value={player.assists}
                                onChange={(e) =>
                                  handleDataEdit(player.id, "assists", Number.parseInt(e.target.value) || 0)
                                }
                                className="bg-background border-border text-foreground h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Damage</Label>
                              <Input
                                type="number"
                                min="0"
                                value={player.damage}
                                onChange={(e) =>
                                  handleDataEdit(player.id, "damage", Number.parseInt(e.target.value) || 0)
                                }
                                className="bg-background border-border text-foreground h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Survival</Label>
                              <Input
                                placeholder="18:45"
                                value={player.survivalTime}
                                onChange={(e) => handleDataEdit(player.id, "survivalTime", e.target.value)}
                                className="bg-background border-border text-foreground h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Placement</Label>
                              <Input
                                type="number"
                                min="1"
                                max="100"
                                value={player.placement}
                                onChange={(e) =>
                                  handleDataEdit(player.id, "placement", Number.parseInt(e.target.value) || 1)
                                }
                                className="bg-background border-border text-foreground h-8"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!allPlayersMatched && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please match all extracted players with your team roster before proceeding to save.
                  </AlertDescription>
                </Alert>
              )}
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="save"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Final Review</h2>
                <p className="text-muted-foreground">Review all data before saving to database</p>
              </div>

              {/* Match Summary */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Match Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Team</div>
                      <div className="font-medium text-foreground">
                        {teams.find((t) => t.id === selectedTeam)?.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Map</div>
                      <div className="font-medium text-foreground">{matchInfo.map}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Team Placement</div>
                      <div className="font-medium text-foreground">#{matchInfo.teamPlacement}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Date</div>
                      <div className="font-medium text-foreground">{matchInfo.date}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Final Player Data */}
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
                        {extractedData.map((player) => (
                          <tr key={player.id} className="border-b border-border/50">
                            <td className="py-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                                  {player.matchedPlayerName?.slice(0, 2)}
                                </div>
                                <span className="font-medium text-foreground">{player.matchedPlayerName}</span>
                              </div>
                            </td>
                            <td className="py-3 text-muted-foreground">{player.extractedIGN}</td>
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

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Ready to Save:</strong> All player data has been verified and is ready to be saved to the
                  database. The original screenshot will be automatically deleted after saving.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="border-t border-border p-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel} className="text-foreground">
              Cancel
            </Button>
            {currentStep > 1 && currentStep !== 3 && (
              <Button variant="outline" onClick={() => setCurrentStep((prev) => prev - 1)} className="text-foreground">
                Previous
              </Button>
            )}
          </div>

          <div className="flex space-x-2">
            {currentStep === 1 && uploadedFile && (
              <Button onClick={() => setCurrentStep(2)} className="bg-blue-600 hover:bg-blue-700">
                Next: Configure Match
              </Button>
            )}

            {currentStep === 3 && allPlayersMatched && (
              <Button onClick={() => setCurrentStep(4)} className="bg-blue-600 hover:bg-blue-700">
                Next: Final Review
              </Button>
            )}

            {currentStep === 4 && (
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Performance Data
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
