"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X, Save, Calendar, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AttendanceMarkingFormProps {
  playerName: string
  playerTeam: string
  onClose: () => void
  onSave: (data: any) => void
}

export function AttendanceMarkingForm({ playerName, playerTeam, onClose, onSave }: AttendanceMarkingFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    sessionType: "",
    status: "Present",
    startTime: "",
    endTime: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validate form
      if (!formData.sessionType) {
        toast({
          title: "Missing Information",
          description: "Please select a session type.",
          variant: "destructive",
        })
        return
      }

      // Prevent marking future dates
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

      // Prevent marking dates older than 7 days
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      sevenDaysAgo.setHours(0, 0, 0, 0)

      if (selectedDate < sevenDaysAgo) {
        toast({
          title: "Date Too Old",
          description: "Cannot mark attendance for dates older than 7 days.",
          variant: "destructive",
        })
        return
      }

      setIsLoading(true)
      try {
        // Simulate save delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        onSave({
          ...formData,
          playerName,
          playerTeam,
        })
      } catch (error) {
        toast({
          title: "Save Failed",
          description: "Failed to mark attendance. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [formData, playerName, playerTeam, onSave, toast],
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Mark Attendance
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Player Info */}
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="font-medium text-foreground">{playerName}</p>
                  <p className="text-sm text-muted-foreground">Team {playerTeam}</p>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-foreground">
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                max={new Date().toISOString().split("T")[0]}
                min={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                required
                className="bg-background border-border text-foreground"
              />
              <p className="text-xs text-muted-foreground">Can only mark attendance for the last 7 days</p>
            </div>

            {/* Session Type */}
            <div className="space-y-2">
              <Label className="text-foreground">Session Type *</Label>
              <Select
                value={formData.sessionType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, sessionType: value }))}
                required
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="Training" className="text-foreground">
                    Team Training
                  </SelectItem>
                  <SelectItem value="Scrims" className="text-foreground">
                    Scrimmage
                  </SelectItem>
                  <SelectItem value="Match" className="text-foreground">
                    Official Match
                  </SelectItem>
                  <SelectItem value="Strategy" className="text-foreground">
                    Strategy Meeting
                  </SelectItem>
                  <SelectItem value="Individual" className="text-foreground">
                    Individual Practice
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-foreground">Attendance Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                required
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="Present" className="text-foreground">
                    Present (On Time)
                  </SelectItem>
                  <SelectItem value="Late" className="text-foreground">
                    Present (Late)
                  </SelectItem>
                  <SelectItem value="Absent" className="text-foreground">
                    Absent
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-foreground">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-foreground">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-foreground">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about the session..."
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                className="bg-background border-border text-foreground"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1 bg-green-600 hover:bg-green-700">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Marking...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Mark Attendance
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="text-foreground">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
