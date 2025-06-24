"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, Users, MapPin, AlertTriangle, Save, Send, ChevronLeft, ChevronRight } from "lucide-react"

interface Match {
  id: string
  title: string
  date: string
  time: string
  teams: string[]
  map: string
  tournament: string
  status: "draft" | "published" | "conflict"
}

interface Team {
  id: string
  name: string
  logo: string
}

const mockMatches: Match[] = [
  {
    id: "BGMI-2024-01-15-1400-ERG",
    title: "Team Alpha vs Team Beta",
    date: "2024-01-15",
    time: "14:00",
    teams: ["Team Alpha", "Team Beta"],
    map: "Erangel",
    tournament: "Winter Championship",
    status: "published",
  },
  {
    id: "BGMI-2024-01-15-1500-MIR",
    title: "Team Gamma vs Team Delta",
    date: "2024-01-15",
    time: "15:00",
    teams: ["Team Gamma", "Team Delta"],
    map: "Miramar",
    tournament: "Winter Championship",
    status: "conflict",
  },
]

const mockTeams: Team[] = [
  { id: "1", name: "Team Alpha", logo: "/placeholder.svg?height=32&width=32" },
  { id: "2", name: "Team Beta", logo: "/placeholder.svg?height=32&width=32" },
  { id: "3", name: "Team Gamma", logo: "/placeholder.svg?height=32&width=32" },
  { id: "4", name: "Team Delta", logo: "/placeholder.svg?height=32&width=32" },
  { id: "5", name: "Team Epsilon", logo: "/placeholder.svg?height=32&width=32" },
  { id: "6", name: "Team Zeta", logo: "/placeholder.svg?height=32&width=32" },
]

const maps = [
  { id: "erangel", name: "Erangel", abbr: "ERG", thumbnail: "/placeholder.svg?height=60&width=80" },
  { id: "miramar", name: "Miramar", abbr: "MIR", thumbnail: "/placeholder.svg?height=60&width=80" },
  { id: "sanhok", name: "Sanhok", abbr: "SAN", thumbnail: "/placeholder.svg?height=60&width=80" },
  { id: "vikendi", name: "Vikendi", abbr: "VIK", thumbnail: "/placeholder.svg?height=60&width=80" },
]

const tournaments = ["Winter Championship", "Spring League", "Summer Cup", "Autumn Tournament"]

export function EnhancedMatchScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [matches, setMatches] = useState<Match[]>(mockMatches)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedTournament, setSelectedTournament] = useState("")
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [selectedMap, setSelectedMap] = useState("")
  const [conflicts, setConflicts] = useState<string[]>([])
  const [matchId, setMatchId] = useState("")

  // Generate match ID when form data changes
  useEffect(() => {
    if (selectedDate && selectedTime && selectedMap) {
      const date = selectedDate.replace(/-/g, "")
      const time = selectedTime.replace(":", "")
      const mapAbbr = maps.find((m) => m.id === selectedMap)?.abbr || "UNK"
      setMatchId(`BGMI-${date}-${time}-${mapAbbr}`)
    }
  }, [selectedDate, selectedTime, selectedMap])

  // Check for conflicts
  useEffect(() => {
    const newConflicts: string[] = []

    if (selectedDate && selectedTime && selectedTeams.length > 0) {
      // Check for time conflicts
      const existingMatches = matches.filter(
        (m) =>
          m.date === selectedDate &&
          Math.abs(Number.parseInt(m.time.replace(":", "")) - Number.parseInt(selectedTime.replace(":", ""))) < 100,
      )

      if (existingMatches.length > 0) {
        newConflicts.push("Time slot conflict detected")
      }

      // Check for team conflicts
      const teamConflicts = matches.filter(
        (m) => m.date === selectedDate && m.teams.some((team) => selectedTeams.includes(team)),
      )

      if (teamConflicts.length > 0) {
        newConflicts.push("Team already scheduled for this date")
      }
    }

    setConflicts(newConflicts)
  }, [selectedDate, selectedTime, selectedTeams, matches])

  const handleTeamToggle = (teamName: string) => {
    setSelectedTeams((prev) => (prev.includes(teamName) ? prev.filter((t) => t !== teamName) : [...prev, teamName]))
  }

  const handleSaveDraft = () => {
    if (!selectedDate || !selectedTime || selectedTeams.length < 2 || !selectedMap || !selectedTournament) {
      alert("Please fill all required fields")
      return
    }

    const newMatch: Match = {
      id: matchId,
      title: `${selectedTeams[0]} vs ${selectedTeams[1]}`,
      date: selectedDate,
      time: selectedTime,
      teams: selectedTeams,
      map: selectedMap,
      tournament: selectedTournament,
      status: conflicts.length > 0 ? "conflict" : "draft",
    }

    setMatches((prev) => [...prev, newMatch])
    // Reset form
    setSelectedDate("")
    setSelectedTime("")
    setSelectedTeams([])
    setSelectedMap("")
    setSelectedTournament("")
  }

  const handlePublish = () => {
    if (conflicts.length > 0) {
      alert("Cannot publish match with conflicts. Please resolve conflicts first.")
      return
    }
    handleSaveDraft()
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-700"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayMatches = matches.filter((m) => m.date === dateStr)
      const isSelected = selectedDate === dateStr

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-700 p-1 cursor-pointer hover:bg-purple-800/50 ${
            isSelected ? "bg-orange-600/20 border-orange-600" : ""
          }`}
          onClick={() => setSelectedDate(dateStr)}
        >
          <div className="text-sm text-white mb-1">{day}</div>
          <div className="space-y-1">
            {dayMatches.slice(0, 2).map((match) => (
              <div
                key={match.id}
                className={`text-xs p-1 rounded truncate ${
                  match.status === "published"
                    ? "bg-green-600/20 text-green-300"
                    : match.status === "conflict"
                      ? "bg-red-600/20 text-red-300"
                      : "bg-yellow-600/20 text-yellow-300"
                }`}
              >
                {match.time} {match.title}
              </div>
            ))}
            {dayMatches.length > 2 && <div className="text-xs text-gray-400">+{dayMatches.length - 2} more</div>}
          </div>
        </div>,
      )
    }

    return days
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar Panel */}
      <Card className="bg-purple-900/50 border-orange-600/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Match Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="text-white hover:bg-orange-600/20"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-white font-medium">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="text-white hover:bg-orange-600/20"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
        </CardContent>
      </Card>

      {/* Scheduling Form Panel */}
      <Card className="bg-purple-900/50 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Schedule Match
          </CardTitle>
          {matchId && (
            <Badge variant="outline" className="text-orange-400 border-orange-600">
              ID: {matchId}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Conflict Alerts */}
          {conflicts.length > 0 && (
            <Alert className="border-red-600/20 bg-red-600/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                {conflicts.map((conflict, index) => (
                  <div key={index}>{conflict}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          {/* Tournament Selection */}
          <div className="space-y-2">
            <Label className="text-white">Tournament</Label>
            <Select value={selectedTournament} onValueChange={setSelectedTournament}>
              <SelectTrigger className="bg-purple-800 border-gray-600 text-white">
                <SelectValue placeholder="Select tournament" />
              </SelectTrigger>
              <SelectContent className="bg-purple-800 border-gray-600">
                {tournaments.map((tournament) => (
                  <SelectItem key={tournament} value={tournament} className="text-white">
                    {tournament}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-purple-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Time</Label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="bg-purple-800 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Team Selection */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <Users className="w-4 h-4" />
              Teams ({selectedTeams.length} selected)
            </Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {mockTeams.map((team) => (
                <Button
                  key={team.id}
                  variant={selectedTeams.includes(team.name) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTeamToggle(team.name)}
                  className={`justify-start ${
                    selectedTeams.includes(team.name)
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-purple-800 border-gray-600 text-white hover:bg-purple-700"
                  }`}
                >
                  <img src={team.logo || "/placeholder.svg"} alt={team.name} className="w-4 h-4 mr-2 rounded" />
                  {team.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Map Selection */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Map
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {maps.map((map) => (
                <Button
                  key={map.id}
                  variant={selectedMap === map.id ? "default" : "outline"}
                  onClick={() => setSelectedMap(map.id)}
                  className={`p-2 h-auto flex-col ${
                    selectedMap === map.id
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-purple-800 border-gray-600 text-white hover:bg-purple-700"
                  }`}
                >
                  <img
                    src={map.thumbnail || "/placeholder.svg"}
                    alt={map.name}
                    className="w-full h-12 object-cover rounded mb-1"
                  />
                  <span className="text-xs">{map.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              className="flex-1 bg-purple-800 border-gray-600 text-white hover:bg-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={handlePublish}
              disabled={conflicts.length > 0}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
