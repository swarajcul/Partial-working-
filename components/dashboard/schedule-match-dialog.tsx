"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X, Save } from "lucide-react"

interface ScheduleMatchDialogProps {
  onClose: () => void
}

export function ScheduleMatchDialog({ onClose }: ScheduleMatchDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    time: "",
    teams: [] as string[],
    venue: "Online",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle match scheduling logic here
    console.log("Match scheduled:", formData)
    onClose()
  }

  const teams = ["Rebellion", "Phoenix", "Vanguard"]
  const matchTypes = ["Tournament", "League", "Scrim", "Practice"]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-gray-900 border-orange-600/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Schedule New Match</CardTitle>
              <CardDescription className="text-gray-400">Create a new match or scrimmage</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Match Title
              </Label>
              <Input
                id="title"
                placeholder="BGMI Championship - Qualifier 1"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Match Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select match type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {matchTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-white">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-white">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-white">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Participating Teams</Label>
              <div className="space-y-2">
                {teams.map((team) => (
                  <label key={team} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.teams.includes(team)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, teams: [...formData.teams, team] })
                        } else {
                          setFormData({ ...formData, teams: formData.teams.filter((t) => t !== team) })
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-white">{team}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Additional match details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                disabled={!formData.title || !formData.type || !formData.date || !formData.time}
              >
                <Save className="w-4 h-4 mr-2" />
                Schedule Match
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
