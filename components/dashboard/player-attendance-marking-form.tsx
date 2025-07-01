"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock } from "lucide-react"

interface AttendanceFormData {
  date: string
  sessionType: "Training" | "Scrims" | "Match" | "Strategy Meeting"
  status: "Present" | "Absent" | "Late"
  duration: string
  notes?: string
}

interface PlayerAttendanceMarkingFormProps {
  onClose: () => void
  onSubmit: (data: AttendanceFormData) => void
}

export function PlayerAttendanceMarkingForm({ onClose, onSubmit }: PlayerAttendanceMarkingFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<AttendanceFormData>({
    date: new Date().toISOString().split("T")[0],
    sessionType: "Training",
    status: "Present",
    duration: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.date || !formData.sessionType || !formData.status || !formData.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Validate date is not in the future
    const selectedDate = new Date(formData.date)
    const today = new Date()
    today.setHours(23, 59, 59, 999) // End of today

    if (selectedDate > today) {
      toast({
        title: "Invalid Date",
        description: "Cannot mark attendance for future dates.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSubmit(formData)

      toast({
        title: "Attendance Marked",
        description: "Your attendance has been successfully recorded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Mark Attendance
          </DialogTitle>
          <DialogDescription>Record your attendance for a training session or match.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionType">Session Type *</Label>
            <Select
              value={formData.sessionType}
              onValueChange={(value: any) => setFormData((prev) => ({ ...prev, sessionType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Training">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Training
                  </div>
                </SelectItem>
                <SelectItem value="Scrims">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    Scrims
                  </div>
                </SelectItem>
                <SelectItem value="Match">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    Match
                  </div>
                </SelectItem>
                <SelectItem value="Strategy Meeting">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Strategy Meeting
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Attendance Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Present">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Present
                  </div>
                </SelectItem>
                <SelectItem value="Late">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    Late
                  </div>
                </SelectItem>
                <SelectItem value="Absent">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    Absent
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Duration *
            </Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 2h 30m"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes about the session..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </div>
              ) : (
                "Mark Attendance"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
