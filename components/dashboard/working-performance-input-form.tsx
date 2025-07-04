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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  FileImage,
  CheckCircle,
  AlertCircle,
  Loader2,
  Save,
  RefreshCw,
  Table,
  X,
  Plus,
  Trash2,
  Camera,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PerformanceEntry {
  id: string
  matchNumber: number
  map: string
  damage: number
  kills: number
  assists: number
  survivalTime: string
  placement: number
  playerName?: string
  verified?: boolean
}

interface WorkingPerformanceInputFormProps {
  onClose: () => void
  onSave: (data: any) => void
  inputMethod: "table" | "ocr"
  userRole?: string
  userName?: string
  userTeam?: string
}

const maps = ["Erangel", "Miramar", "Sanhok", "Vikendi", "Karakin", "Paramo"]
const slots = ["A1", "A2", "B1", "B2", "C1", "C2"]

// Simulated OCR extraction results
const simulateOCRExtraction = (): PerformanceEntry[] => [
  {
    id: "1",
    matchNumber: 1,
    map: "Erangel",
    damage: 2450,
    kills: 12,
    assists: 3,
    survivalTime: "18:45",
    placement: 15,
    playerName: "ShadowStrike",
    verified: false,
  },
  {
    id: "2",
    matchNumber: 1,
    map: "Erangel",
    damage: 1890,
    kills: 8,
    assists: 5,
    survivalTime: "16:20",
    placement: 15,
    playerName: "RebelSniper",
    verified: false,
  },
  {
    id: "3",
    matchNumber: 1,
    map: "Erangel",
    damage: 1650,
    kills: 6,
    assists: 2,
    survivalTime: "14:30",
    placement: 15,
    playerName: "StormRider",
    verified: false,
  },
]

export function WorkingPerformanceInputForm({
  onClose,
  onSave,
  inputMethod,
  userRole,
  userName,
  userTeam,
}: WorkingPerformanceInputFormProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState(inputMethod)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [extractedData, setExtractedData] = useState<PerformanceEntry[]>([])

  // Manual entry state
  const [manualEntries, setManualEntries] = useState<PerformanceEntry[]>([
    {
      id: "manual-1",
      matchNumber: 1,
      map: "",
      damage: 0,
      kills: 0,
      assists: 0,
      survivalTime: "",
      placement: 1,
      playerName: userName || "",
    },
  ])

  const [matchInfo, setMatchInfo] = useState({
    assignedSlot: "",
    date: new Date().toISOString().split("T")[0],
    teamPlacement: 1,
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
        description: "Ready to process the image with OCR",
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

  const handleAddManualEntry = () => {
    const newEntry: PerformanceEntry = {
      id: `manual-${Date.now()}`,
      matchNumber: manualEntries.length + 1,
      map: "",
      damage: 0,
      kills: 0,
      assists: 0,
      survivalTime: "",
      placement: 1,
      playerName: userName || "",
    }
    setManualEntries([...manualEntries, newEntry])
  }

  const handleRemoveManualEntry = (id: string) => {
    setManualEntries(manualEntries.filter((entry) => entry.id !== id))
  }

  const handleManualEntryChange = (id: string, field: keyof PerformanceEntry, value: any) => {
    setManualEntries((entries) => entries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)))
  }

  const handleExtractedDataChange = (id: string, field: keyof PerformanceEntry, value: any) => {
    setExtractedData((entries) => entries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)))
  }

  const handleVerifyExtractedEntry = (id: string) => {
    setExtractedData((entries) => entries.map((entry) => (entry.id === id ? { ...entry, verified: true } : entry)))
  }

  const handleSave = useCallback(async () => {
    try {
      const dataToSave = activeTab === "manual" ? manualEntries : extractedData

      // Validate data
      const invalidEntries = dataToSave.filter(
        (entry) => !entry.map || entry.damage < 0 || entry.kills < 0 || !entry.survivalTime,
      )

      if (invalidEntries.length > 0) {
        toast({
          title: "Incomplete Data",
          description: "Please fill in all required fields for each entry.",
          variant: "destructive",
        })
        return
      }

      if (activeTab === "ocr") {
        const unverifiedEntries = extractedData.filter((entry) => !entry.verified)
        if (unverifiedEntries.length > 0) {
          toast({
            title: "Unverified Data",
            description: "Please verify all extracted entries before saving.",
            variant: "destructive",
          })
          return
        }
      }

      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const performanceData = {
        team: userTeam,
        ...matchInfo,
        entries: dataToSave,
        extractionMethod: activeTab,
        originalScreenshot: uploadedFile?.name,
        submittedBy: userName,
        submittedAt: new Date().toISOString(),
      }

      onSave(performanceData)

      toast({
        title: "Performance Data Saved",
        description: `${dataToSave.length} performance entries have been successfully saved.`,
      })

      // Clean up uploaded file (simulate deletion)
      if (uploadedFile) {
        setUploadedFile(null)
        setUploadedImageUrl("")
        toast({
          title: "Screenshot Deleted",
          description: "Original screenshot has been automatically deleted from storage.",
        })
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save performance data. Please try again.",
        variant: "destructive",
      })
    }
  }, [activeTab, manualEntries, extractedData, matchInfo, userTeam, userName, uploadedFile, onSave, toast])

  const isFormValid = () => {
    if (activeTab === "manual") {
      return manualEntries.every((entry) => entry.map && entry.survivalTime)
    } else {
      return extractedData.every((entry) => entry.verified) && extractedData.length > 0
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden dashboard-card">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground flex items-center gap-2">
                {activeTab === "manual" ? <Table className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                Add Performance Data
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {userRole === "player" ? `Adding data for ${userName}` : "Add performance data for team members"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Table className="w-4 h-4" />
                  Manual Entry
                </TabsTrigger>
                <TabsTrigger value="ocr" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Screenshot OCR
                </TabsTrigger>
              </TabsList>

              {/* Match Information */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg">Match Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slot" className="text-foreground">
                        Assigned Slot
                      </Label>
                      <Select
                        value={matchInfo.assignedSlot}
                        onValueChange={(value) => setMatchInfo((prev) => ({ ...prev, assignedSlot: value }))}
                      >
                        <SelectTrigger className="dashboard-input">
                          <SelectValue placeholder="Select slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {slots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              Slot {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teamPlacement" className="text-foreground">
                        Team Placement
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
                        className="dashboard-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-foreground">
                        Match Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={matchInfo.date}
                        onChange={(e) => setMatchInfo((prev) => ({ ...prev, date: e.target.value }))}
                        className="dashboard-input"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <TabsContent value="manual" className="space-y-6">
                <Card className="dashboard-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-foreground">Manual Performance Entry</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Enter performance data manually using the table below
                        </CardDescription>
                      </div>
                      <Button onClick={handleAddManualEntry} size="sm" className="dashboard-button">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Entry
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {manualEntries.map((entry, index) => (
                        <div key={entry.id} className="grid grid-cols-8 gap-4 p-4 border rounded-lg">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Match #</Label>
                            <Input
                              type="number"
                              min="1"
                              value={entry.matchNumber}
                              onChange={(e) =>
                                handleManualEntryChange(entry.id, "matchNumber", Number.parseInt(e.target.value) || 1)
                              }
                              className="dashboard-input h-8"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Map *</Label>
                            <Select
                              value={entry.map}
                              onValueChange={(value) => handleManualEntryChange(entry.id, "map", value)}
                            >
                              <SelectTrigger className="dashboard-input h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {maps.map((map) => (
                                  <SelectItem key={map} value={map}>
                                    {map}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Damage *</Label>
                            <Input
                              type="number"
                              min="0"
                              value={entry.damage}
                              onChange={(e) =>
                                handleManualEntryChange(entry.id, "damage", Number.parseInt(e.target.value) || 0)
                              }
                              className="dashboard-input h-8"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Kills *</Label>
                            <Input
                              type="number"
                              min="0"
                              value={entry.kills}
                              onChange={(e) =>
                                handleManualEntryChange(entry.id, "kills", Number.parseInt(e.target.value) || 0)
                              }
                              className="dashboard-input h-8"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Assists</Label>
                            <Input
                              type="number"
                              min="0"
                              value={entry.assists}
                              onChange={(e) =>
                                handleManualEntryChange(entry.id, "assists", Number.parseInt(e.target.value) || 0)
                              }
                              className="dashboard-input h-8"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Survival *</Label>
                            <Input
                              placeholder="18:45"
                              value={entry.survivalTime}
                              onChange={(e) => handleManualEntryChange(entry.id, "survivalTime", e.target.value)}
                              className="dashboard-input h-8"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Placement</Label>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              value={entry.placement}
                              onChange={(e) =>
                                handleManualEntryChange(entry.id, "placement", Number.parseInt(e.target.value) || 1)
                              }
                              className="dashboard-input h-8"
                            />
                          </div>

                          <div className="flex items-end">
                            {manualEntries.length > 1 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveManualEntry(entry.id)}
                                className="text-red-600 hover:bg-red-50 h-8"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ocr" className="space-y-6">
                {/* Screenshot Upload */}
                <Card className="dashboard-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Upload Screenshot</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Upload a clear screenshot of the match scoreboard for OCR processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
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

                    {uploadedFile && !isProcessing && extractedData.length === 0 && (
                      <div className="mt-4 text-center">
                        <Button onClick={handleProcessScreenshot} className="dashboard-button" size="lg">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Process Screenshot with OCR
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Processing */}
                {isProcessing && (
                  <Card className="dashboard-card">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
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

                {/* Extracted Data Verification */}
                {extractedData.length > 0 && (
                  <Card className="dashboard-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">Verify Extracted Data</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Review and verify the OCR extracted performance data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {extractedData.map((entry, index) => (
                          <div
                            key={entry.id}
                            className={`p-4 border rounded-lg ${
                              entry.verified ? "border-green-500 bg-green-50" : "border-orange-500 bg-orange-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm">
                                  {index + 1}
                                </div>
                                <div>
                                  <h3 className="font-medium text-foreground">Player: {entry.playerName}</h3>
                                  <p className="text-sm text-muted-foreground">Match #{entry.matchNumber}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {entry.verified ? (
                                  <Badge className="bg-green-600 text-white">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => handleVerifyExtractedEntry(entry.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Verify
                                  </Button>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Map</Label>
                                <Select
                                  value={entry.map}
                                  onValueChange={(value) => handleExtractedDataChange(entry.id, "map", value)}
                                >
                                  <SelectTrigger className="dashboard-input h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {maps.map((map) => (
                                      <SelectItem key={map} value={map}>
                                        {map}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Kills</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={entry.kills}
                                  onChange={(e) =>
                                    handleExtractedDataChange(entry.id, "kills", Number.parseInt(e.target.value) || 0)
                                  }
                                  className="dashboard-input h-8"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Assists</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={entry.assists}
                                  onChange={(e) =>
                                    handleExtractedDataChange(entry.id, "assists", Number.parseInt(e.target.value) || 0)
                                  }
                                  className="dashboard-input h-8"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Damage</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={entry.damage}
                                  onChange={(e) =>
                                    handleExtractedDataChange(entry.id, "damage", Number.parseInt(e.target.value) || 0)
                                  }
                                  className="dashboard-input h-8"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Survival</Label>
                                <Input
                                  placeholder="18:45"
                                  value={entry.survivalTime}
                                  onChange={(e) => handleExtractedDataChange(entry.id, "survivalTime", e.target.value)}
                                  className="dashboard-input h-8"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Placement</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={entry.placement}
                                  onChange={(e) =>
                                    handleExtractedDataChange(
                                      entry.id,
                                      "placement",
                                      Number.parseInt(e.target.value) || 1,
                                    )
                                  }
                                  className="dashboard-input h-8"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {extractedData.length > 0 && extractedData.some((entry) => !entry.verified) && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please verify all extracted entries before saving. Click the "Verify" button on each entry after
                      reviewing the data.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>

        {/* Form Actions */}
        <div className="border-t p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {activeTab === "manual"
                ? `${manualEntries.length} manual entries`
                : `${extractedData.length} extracted entries`}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!isFormValid()} className="dashboard-button">
                <Save className="w-4 h-4 mr-2" />
                Save Performance Data
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
