"use client"

export interface ExportData {
  headers: string[]
  rows: (string | number)[][]
  title: string
  subtitle?: string
}

export interface ExportOptions {
  format: "pdf" | "excel"
  theme: "dark" | "light" | "auto"
  includeCharts?: boolean
  includeLogo?: boolean
  logoFile?: File
  columns?: string[]
  template?: "detailed" | "compact" | "summary"
}

export class ExportService {
  private static instance: ExportService
  private theme: "dark" | "light" = "dark"

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService()
    }
    return ExportService.instance
  }

  setTheme(theme: "dark" | "light") {
    this.theme = theme
  }

  async exportToPDF(data: ExportData, options: ExportOptions): Promise<void> {
    // Simulate PDF generation with theme-aware styling
    const themeColors = this.getThemeColors(options.theme)

    console.log("Generating PDF with options:", {
      ...options,
      theme: themeColors,
      dataRows: data.rows.length,
    })

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create a mock PDF blob
    const pdfContent = this.generatePDFContent(data, options, themeColors)
    const blob = new Blob([pdfContent], { type: "application/pdf" })

    // Download the file
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${data.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async exportToExcel(data: ExportData, options: ExportOptions): Promise<void> {
    console.log("Generating Excel with options:", {
      ...options,
      dataRows: data.rows.length,
    })

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Create CSV content (simplified Excel)
    const csvContent = this.generateCSVContent(data, options)
    const blob = new Blob([csvContent], { type: "text/csv" })

    // Download the file
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${data.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  private getThemeColors(theme: "dark" | "light" | "auto") {
    const actualTheme = theme === "auto" ? this.theme : theme

    if (actualTheme === "dark") {
      return {
        background: "#1a1a2e",
        surface: "#16213e",
        primary: "#ea580c",
        secondary: "#6366f1",
        text: "#ffffff",
        textSecondary: "#a1a1aa",
        border: "#374151",
        accent: "#f59e0b",
      }
    } else {
      return {
        background: "#ffffff",
        surface: "#f8fafc",
        primary: "#ea580c",
        secondary: "#6366f1",
        text: "#1f2937",
        textSecondary: "#6b7280",
        border: "#e5e7eb",
        accent: "#f59e0b",
      }
    }
  }

  private generatePDFContent(data: ExportData, options: ExportOptions, colors: any): string {
    return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
72 720 Td
(${data.title}) Tj
0 -20 Td
(Generated: ${new Date().toLocaleDateString()}) Tj
0 -20 Td
(Theme: ${options.theme}) Tj
0 -20 Td
(Rows: ${data.rows.length}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000110 00000 n 
0000000181 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
400
%%EOF`
  }

  private generateCSVContent(data: ExportData, options: ExportOptions): string {
    const filteredHeaders = options.columns
      ? data.headers.filter((_, index) => options.columns!.includes(index.toString()))
      : data.headers

    const filteredRows = options.columns
      ? data.rows.map((row) => row.filter((_, index) => options.columns!.includes(index.toString())))
      : data.rows

    const csvRows = [filteredHeaders.join(","), ...filteredRows.map((row) => row.map((cell) => `"${cell}"`).join(","))]

    return csvRows.join("\n")
  }

  getEstimatedSize(data: ExportData, format: "pdf" | "excel"): string {
    const baseSize = data.rows.length * 0.1 // KB per row
    const formatMultiplier = format === "pdf" ? 2.5 : 1.2
    const totalSize = baseSize * formatMultiplier

    if (totalSize < 1024) {
      return `${Math.round(totalSize)} KB`
    } else {
      return `${(totalSize / 1024).toFixed(1)} MB`
    }
  }

  getEstimatedTime(data: ExportData, format: "pdf" | "excel"): string {
    const baseTime = Math.max(2, data.rows.length * 0.01) // seconds
    const formatMultiplier = format === "pdf" ? 1.5 : 1.0
    const totalTime = Math.round(baseTime * formatMultiplier)

    return `${totalTime} seconds`
  }
}
