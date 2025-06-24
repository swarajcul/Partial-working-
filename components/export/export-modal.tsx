"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/components/theme/theme-provider"
import { ExportService, type ExportData, type ExportOptions } from "./export-service"
import {
  FileText,
  Download,
  Upload,
  CheckCircle,
  Loader2,
  X,
  AlertTriangle,
  Palette,
  FileSpreadsheet,
  Settings,
} from "lucide-react"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  data: ExportData
  title: string
}

const exportFormats = [
  {
    id: "pdf",
    name: "PDF Report",
    description: "Professional report with charts and styling",
    icon: FileText,
    templates: ["detailed", "compact", "summary"],
  },
  {
    id: "excel",
    name: "Excel Spreadsheet",
    description: "Raw data for analysis and manipulation",
    icon: FileSpreadsheet,
    templates: ["raw", "formatted"],
  },
]

const themeOptions = [
  { id: "auto", name: "Auto (Follow System)", description: "Uses current theme setting" },
  { id: "dark", name: "Dark Theme", description: "Dark background with light text" },
  { id: "light", name: "Light Theme", description: "Light background with dark text" },
]

export function ExportModal({ isOpen, onClose, data, title }: ExportModalProps) {
  const { actualTheme } = useTheme()
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "excel">("pdf")
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "light" | "auto">("auto")
  const [selectedTemplate, setSelectedTemplate] = useState("detailed")
  const [selectedColumns, setSelectedColumns] = useState<string[]>(data.headers.map((_, index) => index.toString()))
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeLogo, setIncludeLogo] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportStatus, setExportStatus] = useState<"idle" | "processing" | "complete" | "error">("idle")
  const [estimatedSize, setEstimatedSize] = useState("")
  const [estimatedTime, setEstimatedTime] = useState("")

  const exportService = ExportService.getInstance()

  useEffect(() => {
    exportService.setTheme(actualTheme)
    setEstimatedSize(exportService.getEstimatedSize(data, selectedFormat))
    setEstimatedTime(exportService.getEstimatedTime(data, selectedFormat))
  }, [actualTheme, data, selectedFormat])

  const handleColumnToggle = (columnIndex: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnIndex) ? prev.filter((id) => id !== columnIndex) : [...prev, columnIndex],
    )
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setLogoFile(file)
    }
  }

  const simulateExport = async () => {
    setIsExporting(true)
    setExportStatus("processing")
    setExportProgress(0)

    // Simulate progress
    const progressSteps = [10, 25, 40, 60, 80, 95, 100]
    for (const step of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setExportProgress(step)
    }

    try {
      const options: ExportOptions = {
        format: selectedFormat,
        theme: selectedTheme,
        includeCharts,
        includeLogo,
        logoFile: logoFile || undefined,
        columns: selectedColumns,
        template: selectedTemplate as "detailed" | "compact" | "summary",
      }

      if (selectedFormat === "pdf") {
        await exportService.exportToPDF(data, options)
      } else {
        await exportService.exportToExcel(data, options)
      }

      setExportStatus("complete")
    } catch (error) {
      setExportStatus("error")
    }

    setIsExporting(false)
  }

  const handleExport = () => {
    simulateExport()
  }

  const resetModal = () => {
    setExportStatus("idle")
    setExportProgress(0)
    setSelectedFormat("pdf")
    setSelectedTheme("auto")
    setLogoFile(null)
    setSelectedColumns(data.headers.map((_, index) => index.toString()))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl bg-card border-border max-h-[90vh] overflow-y-auto theme-transition">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Export {title}</CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure export settings and download your data
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {exportStatus === "idle" && (
            <>
              {/* Format Selection */}
              <div className="space-y-4">
                <Label className="text-foreground font-medium">Export Format</Label>
                <RadioGroup value={selectedFormat} onValueChange={(value: "pdf" | "excel") => setSelectedFormat(value)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exportFormats.map((format) => {
                      const Icon = format.icon
                      return (
                        <div key={format.id} className="relative">
                          <RadioGroupItem value={format.id} id={format.id} className="sr-only" />
                          <Label
                            htmlFor={format.id}
                            className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all theme-transition ${
                              selectedFormat === format.id
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-card border-border hover:border-muted-foreground"
                            }`}
                          >
                            <Icon className="w-6 h-6 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-medium">{format.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{format.description}</p>
                            </div>
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </RadioGroup>
              </div>

              {/* Theme Selection */}
              <div className="space-y-4">
                <Label className="text-foreground font-medium flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  Theme Settings
                </Label>
                <Select
                  value={selectedTheme}
                  onValueChange={(value: "dark" | "light" | "auto") => setSelectedTheme(value)}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themeOptions.map((theme) => (
                      <SelectItem key={theme.id} value={theme.id}>
                        <div>
                          <div className="font-medium">{theme.name}</div>
                          <div className="text-sm text-muted-foreground">{theme.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* PDF Specific Options */}
              {selectedFormat === "pdf" && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-foreground font-medium flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    PDF Customization
                  </h3>

                  {/* Template Selection */}
                  <div className="space-y-2">
                    <Label className="text-foreground">Report Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detailed">Detailed Report - Complete analysis with charts</SelectItem>
                        <SelectItem value="compact">Compact Report - Summary with key metrics</SelectItem>
                        <SelectItem value="summary">Executive Summary - High-level overview</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={includeLogo}
                        onCheckedChange={(checked) => setIncludeLogo(checked as boolean)}
                      />
                      <Label className="text-foreground">Include Team Logo</Label>
                    </div>
                    {includeLogo && (
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center bg-background">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">
                            {logoFile ? logoFile.name : "Click to upload logo (PNG, JPG)"}
                          </p>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Include Charts */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={includeCharts}
                      onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                    />
                    <Label className="text-foreground">Include Charts and Visualizations</Label>
                  </div>
                </div>
              )}

              {/* Column Selection */}
              <div className="space-y-4">
                <Label className="text-foreground font-medium">Include Columns</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto p-2 border border-border rounded-lg bg-background">
                  {data.headers.map((header, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedColumns.includes(index.toString())}
                        onCheckedChange={() => handleColumnToggle(index.toString())}
                      />
                      <span className="text-foreground text-sm truncate">{header}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {selectedColumns.length} of {data.headers.length} columns selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedColumns(data.headers.map((_, index) => index.toString()))}
                  >
                    Select All
                  </Button>
                </div>
              </div>

              {/* Export Preview */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h4 className="text-foreground font-medium">Export Preview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Format:</span>
                    <div className="font-medium text-foreground">{selectedFormat.toUpperCase()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Theme:</span>
                    <div className="font-medium text-foreground capitalize">{selectedTheme}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <div className="font-medium text-foreground">{estimatedSize}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <div className="font-medium text-foreground">{estimatedTime}</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Records:</span>
                  <Badge variant="secondary">{data.rows.length} rows</Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleExport}
                  disabled={selectedColumns.length === 0}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export {selectedFormat.toUpperCase()}
                </Button>
                <Button onClick={onClose} variant="outline" className="border-border text-foreground hover:bg-muted">
                  Cancel
                </Button>
              </div>
            </>
          )}

          {/* Export Progress */}
          {exportStatus === "processing" && (
            <div className="text-center space-y-6 py-8">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
              <div className="space-y-3">
                <h3 className="text-foreground font-medium text-lg">Generating Export...</h3>
                <Progress value={exportProgress} className="w-full max-w-md mx-auto" />
                <p className="text-muted-foreground">{exportProgress}% complete</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Processing {data.rows.length} records</div>
                  <div>Applying {selectedTheme} theme</div>
                  <div>Format: {selectedFormat.toUpperCase()}</div>
                </div>
              </div>
            </div>
          )}

          {/* Export Complete */}
          {exportStatus === "complete" && (
            <div className="text-center space-y-6 py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div className="space-y-2">
                <h3 className="text-foreground font-medium text-lg">Export Complete!</h3>
                <p className="text-muted-foreground">Your file has been downloaded successfully</p>
              </div>
              <div className="flex space-x-3 justify-center">
                <Button onClick={resetModal} className="bg-primary hover:bg-primary/90">
                  Export Another
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Export Error */}
          {exportStatus === "error" && (
            <div className="text-center space-y-6 py-8">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto" />
              <div className="space-y-2">
                <h3 className="text-foreground font-medium text-lg">Export Failed</h3>
                <p className="text-muted-foreground">There was an error generating your export</p>
              </div>
              <div className="flex space-x-3 justify-center">
                <Button onClick={handleExport} className="bg-primary hover:bg-primary/90">
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
