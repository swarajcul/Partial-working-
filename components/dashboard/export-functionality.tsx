"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Upload, CheckCircle, Loader2, X, AlertTriangle } from "lucide-react"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  dataType: string
}

const exportFormats = [
  { id: "pdf-detailed", name: "PDF - Detailed Report", description: "Complete report with charts and analysis" },
  { id: "pdf-compact", name: "PDF - Compact Report", description: "Summary report with key metrics" },
  { id: "excel-raw", name: "Excel - Raw Data", description: "Unprocessed data for custom analysis" },
  { id: "excel-aggregated", name: "Excel - Aggregated Stats", description: "Pre-calculated statistics and summaries" },
]

const colorThemes = [
  { id: "dark", name: "Dark Theme", primary: "#1f2937", secondary: "#374151" },
  { id: "light", name: "Light Theme", primary: "#ffffff", secondary: "#f9fafb" },
  { id: "custom", name: "Custom Theme", primary: "#7c3aed", secondary: "#a855f7" },
]

const availableColumns = [
  { id: "player_name", name: "Player Name", category: "Basic" },
  { id: "kd_ratio", name: "K/D Ratio", category: "Performance" },
  { id: "headshot_pct", name: "Headshot %", category: "Performance" },
  { id: "damage_dealt", name: "Damage Dealt", category: "Combat" },
  { id: "survival_time", name: "Survival Time", category: "Survival" },
  { id: "matches_played", name: "Matches Played", category: "Basic" },
  { id: "win_rate", name: "Win Rate", category: "Performance" },
  { id: "avg_placement", name: "Average Placement", category: "Performance" },
]

export function ExportModal({ isOpen, onClose, dataType }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState("")
  const [selectedTheme, setSelectedTheme] = useState("dark")
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["player_name", "kd_ratio", "headshot_pct"])
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportStatus, setExportStatus] = useState<"idle" | "processing" | "complete" | "error">("idle")
  const [estimatedSize, setEstimatedSize] = useState("2.4 MB")
  const [estimatedTime, setEstimatedTime] = useState("15 seconds")

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns((prev) => (prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
    }
  }

  const simulateExport = async () => {
    setIsExporting(true)
    setExportStatus("processing")
    setExportProgress(0)

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setExportProgress(i)
    }

    // Simulate completion or error
    const success = Math.random() > 0.2 // 80% success rate
    if (success) {
      setExportStatus("complete")
    } else {
      setExportStatus("error")
    }

    setIsExporting(false)
  }

  const handleExport = () => {
    if (!selectedFormat) return
    simulateExport()
  }

  const resetModal = () => {
    setExportStatus("idle")
    setExportProgress(0)
    setSelectedFormat("")
    setLogoFile(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-gray-900 border-orange-600/20 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Export {dataType}</CardTitle>
              <CardDescription className="text-gray-400">
                Configure export settings and download your data
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {exportStatus === "idle" && (
            <>
              {/* Format Selection */}
              <div className="space-y-3">
                <Label className="text-white">Export Format</Label>
                <div className="grid grid-cols-1 gap-3">
                  {exportFormats.map((format) => (
                    <div
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedFormat === format.id
                          ? "bg-orange-600 border-orange-600"
                          : "bg-gray-800 border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-white" />
                        <div>
                          <h4 className="text-white font-medium">{format.name}</h4>
                          <p className="text-gray-400 text-sm">{format.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF Customization */}
              {selectedFormat?.startsWith("pdf") && (
                <div className="space-y-4">
                  <h3 className="text-white font-medium">PDF Customization</h3>

                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label className="text-white">Team Logo</Label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400">{logoFile ? logoFile.name : "Click to upload logo"}</p>
                      </label>
                    </div>
                  </div>

                  {/* Color Theme */}
                  <div className="space-y-2">
                    <Label className="text-white">Color Theme</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorThemes.map((theme) => (
                        <div
                          key={theme.id}
                          onClick={() => setSelectedTheme(theme.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedTheme === theme.id ? "border-orange-600" : "border-gray-600 hover:border-gray-500"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.primary }} />
                            <span className="text-white text-sm">{theme.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Excel Options */}
              {selectedFormat?.startsWith("excel") && (
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Excel Options</h3>

                  {/* Column Selection */}
                  <div className="space-y-2">
                    <Label className="text-white">Include Columns</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {availableColumns.map((column) => (
                        <div key={column.id} className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedColumns.includes(column.id)}
                            onCheckedChange={() => handleColumnToggle(column.id)}
                          />
                          <span className="text-white text-sm">{column.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {column.category}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Export Info */}
              <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Size:</span>
                  <span className="text-white">{estimatedSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Time:</span>
                  <span className="text-white">{estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Records:</span>
                  <span className="text-white">1,247 rows</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={handleExport}
                  disabled={!selectedFormat}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Start Export
                </Button>
                <Button onClick={onClose} variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  Cancel
                </Button>
              </div>
            </>
          )}

          {/* Export Progress */}
          {exportStatus === "processing" && (
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
              <div>
                <h3 className="text-white font-medium mb-2">Generating Export...</h3>
                <Progress value={exportProgress} className="w-full" />
                <p className="text-gray-400 text-sm mt-2">{exportProgress}% complete</p>
              </div>
            </div>
          )}

          {/* Export Complete */}
          {exportStatus === "complete" && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-white font-medium">Export Complete!</h3>
                <p className="text-gray-400">Your file is ready for download</p>
              </div>
              <div className="flex space-x-2">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </Button>
                <Button variant="outline" onClick={resetModal}>
                  Export Another
                </Button>
              </div>
            </div>
          )}

          {/* Export Error */}
          {exportStatus === "error" && (
            <div className="text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-white font-medium">Export Failed</h3>
                <p className="text-gray-400">There was an error generating your export</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleExport} className="bg-orange-600 hover:bg-orange-700">
                  Try Again
                </Button>
                <Button variant="outline" onClick={resetModal}>
                  Start Over
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
