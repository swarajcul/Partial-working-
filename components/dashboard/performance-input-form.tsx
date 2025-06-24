"use client"

import { PerformanceInputModule } from "./performance-input-module"

interface PerformanceInputFormProps {
  onClose: () => void
  onSave: (data: any) => void
  initialData?: any
}

export function PerformanceInputForm({ onClose, onSave, initialData }: PerformanceInputFormProps) {
  return <PerformanceInputModule onClose={onClose} onSave={onSave} initialData={initialData} />
}
