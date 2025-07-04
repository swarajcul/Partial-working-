"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Calendar, Clock, Plus, Users, MapPin } from "lucide-react"
import { ScheduleMatchDialog } from "./schedule-match-dialog"

const upcomingMatches = [
  {
    id: "1",
    title: "BGMI Championship - Qualifier 1",
    date: "2024-01-20",
    time: "18:00",
    teams: ["Rebellion", "Phoenix"],
    type: "Tournament",
    status: "scheduled",
    venue: "Online",
  },
  {
    id: "2",
    title: "Practice Scrim vs Alpha Team",
    date: "2024-01-18",
    time: "20:00",
    teams: ["Vanguard"],
    type: "Scrim",
    status: "confirmed",
    venue: "Online",
  },
  {
    id: "3",
    title: "BGMI League - Week 3",
    date: "2024-01-22",
    time: "19:30",
    teams: ["Rebellion", "Phoenix", "Vanguard"],
    type: "League",
    status: "pending",
    venue: "Online",
  },
]

const pastMatches = [
  {
    id: "4",
    title: "BGMI Championship - Qualifier",
    date: "2024-01-15",
    time: "18:00",
    teams: ["Rebellion"],
    result: "1st Place",
    status: "completed",
  },
  {
    id: "5",
    title: "Practice Match vs Beta Squad",
    date: "2024-01-14",
    time: "20:00",
    teams: ["Phoenix"],
    result: "2nd Place",
    status: "completed",
  },
]

export function MatchScheduler() {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-600"
      case "confirmed":
        return "bg-green-600"
      case "pending":
        return "bg-yellow-600"
      case "completed":
        return "bg-gray-600"
      default:
        return "bg-gray-600"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Tournament":
        return "bg-red-600"
      case "League":
        return "bg-purple-600"
      case "Scrim":
        return "bg-orange-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-white">Match Scheduler</h1>
            <p className="text-gray-400">Schedule and manage team matches and scrimmages</p>
          </div>
        </div>
        <Button onClick={() => setShowScheduleDialog(true)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Match
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Upcoming Matches</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{upcomingMatches.length}</div>
            <p className="text-xs text-gray-400">Next 7 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">This Week</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">5</div>
            <p className="text-xs text-gray-400">Matches scheduled</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Teams Active</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-gray-400">All teams</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Win Rate</CardTitle>
            <MapPin className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">78%</div>
            <p className="text-xs text-green-400">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Match Tabs */}
      <div className="flex space-x-4">
        <Button
          variant={activeTab === "upcoming" ? "default" : "outline"}
          onClick={() => setActiveTab("upcoming")}
          className={
            activeTab === "upcoming"
              ? "bg-orange-600 hover:bg-orange-700"
              : "border-gray-600 text-white hover:bg-gray-800"
          }
        >
          Upcoming Matches
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "outline"}
          onClick={() => setActiveTab("past")}
          className={
            activeTab === "past" ? "bg-orange-600 hover:bg-orange-700" : "border-gray-600 text-white hover:bg-gray-800"
          }
        >
          Past Matches
        </Button>
      </div>

      {/* Matches List */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">
            {activeTab === "upcoming" ? "Upcoming Matches" : "Match History"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {activeTab === "upcoming" ? "Scheduled matches and scrimmages" : "Previous match results"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeTab === "upcoming"
              ? upcomingMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <Calendar className="w-5 h-5 text-orange-500 mb-1" />
                        <span className="text-gray-400 text-xs">{match.date}</span>
                        <span className="text-gray-400 text-xs">{match.time}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{match.title}</h4>
                        <p className="text-gray-400 text-sm">Teams: {match.teams.join(", ")}</p>
                        <p className="text-gray-400 text-sm">Venue: {match.venue}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getTypeColor(match.type)} text-white`}>{match.type}</Badge>
                      <Badge className={`${getStatusColor(match.status)} text-white`}>{match.status}</Badge>
                      <Button size="sm" variant="ghost" className="text-orange-500 hover:bg-orange-600/20">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))
              : pastMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mb-1" />
                        <span className="text-gray-400 text-xs">{match.date}</span>
                        <span className="text-gray-400 text-xs">{match.time}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{match.title}</h4>
                        <p className="text-gray-400 text-sm">Teams: {match.teams.join(", ")}</p>
                        <p className="text-green-400 text-sm font-medium">Result: {match.result}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-green-600 text-white">Completed</Badge>
                      <Button size="sm" variant="ghost" className="text-blue-500 hover:bg-blue-600/20">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>

      {showScheduleDialog && <ScheduleMatchDialog onClose={() => setShowScheduleDialog(false)} />}
    </div>
  )
}
