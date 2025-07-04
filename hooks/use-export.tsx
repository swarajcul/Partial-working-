"use client"

import { useState } from "react"
import type { ExportData } from "@/components/export/export-service"

export function useExport() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [exportData, setExportData] = useState<ExportData | null>(null)
  const [exportTitle, setExportTitle] = useState("")

  const openExportModal = (data: ExportData, title: string) => {
    setExportData(data)
    setExportTitle(title)
    setIsExportModalOpen(true)
  }

  const closeExportModal = () => {
    setIsExportModalOpen(false)
    setExportData(null)
    setExportTitle("")
  }

  return {
    isExportModalOpen,
    exportData,
    exportTitle,
    openExportModal,
    closeExportModal,
  }
}
