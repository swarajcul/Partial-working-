"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Calendar, Users, AlertTriangle, Plus, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AttendanceForm } from "./attendance-form"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const attendanceData = [
  {
    id: 1,
    player: "ShadowStrike",
    team: "Rebellion",
    date: "2024-01-15",
    type: "Match",
    status: "Present",
    match: "BGMI-2024-01-15-ER-M1",
    slot: "A1",
    matchNumber: 1,
    map: "Erangel",
  },
  {
    id: 2,
    player: "PhoenixRise",
    team: "Phoenix",
    date: "2024-01-15",
    type: "Team Training",
    status: "Absent",
    match: null,
  },
  {
    id: 3,
    player: "VanguardLead",
    team: "Vanguard",
    date: "2024-01-14",
    type: "Individual Training",
    status: "Present",
    match: null,
  },
  {
    id: 4,
    player: "RebelSniper",
    team: "Rebellion",
    date: "2024-01-14",
    type: "Match",
    status: "Present",
    match: "BGMI-2024-01-14-ER-M2",
    slot: "A1",
    matchNumber: 2,
    map: "Miramar",
  },
]

const attendanceTrend = [
  { week: "Week 1", attendance: 85 },
  { week: "Week 2", attendance: 92 },
  { week: "Week 3", attendance: 78 },
  { week: "Week 4", attendance: 88 },
  { week: "Week 5", attendance: 95 },
]

const teams = ["All Teams", "Rebellion", "Phoenix", "Vanguard"]
const attendanceTypes = ["All Types", "Individual Training", "Team Training", "Match"]

export function AttendanceModule() {
  const [selectedTeam, setSelectedTeam] = useState("All Teams")
  const [selectedType, setSelectedType] = useState("All Types")
  const [showForm, setShowForm] = useState(false)

  const filteredData = attendanceData.filter((record) => {
    const teamMatch = selectedTeam === "All Teams" || record.team === selectedTeam
    const typeMatch = selectedType === "All Types" || record.type === selectedType
    return teamMatch && typeMatch
  })

  const attendanceRate = Math.round(
    (filteredData.filter((r) => r.status === "Present").length / filteredData.length) * 100,
  )

  const totalIndividualSessions = filteredData.filter((r) => r.type === "Individual Training").length
  const totalTeamSessions = filteredData.filter((r) => r.type === "Team Training").length
  const totalMatches = filteredData.filter((r) => r.type === "Match").length
  const lowAttendancePlayers = 2 // Mock data - players with <70% attendance

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-white">Attendance Tracking</h1>
            <p className="text-gray-400">Monitor player and team attendance across all activities</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Mark Attendance
        </Button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Overall Attendance</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{attendanceRate}%</div>
            <p className="text-xs text-gray-400">
              {filteredData.filter((r) => r.status === "Present").length} of {filteredData.length} sessions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Training Sessions</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalIndividualSessions + totalTeamSessions}</div>
            <p className="text-xs text-gray-400">
              {totalIndividualSessions} Individual, {totalTeamSessions} Team
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Matches Played</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalMatches}</div>
            <p className="text-xs text-gray-400">This period</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Low Attendance Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{lowAttendancePlayers}</div>
            <p className="text-xs text-gray-400">Players below 70%</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Trend Chart */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">Attendance Trend</CardTitle>
          <CardDescription className="text-gray-400">Weekly attendance percentage over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              attendance: {
                label: "Attendance %",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="attendance" stroke="var(--color-attendance)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {teams.map((team) => (
                  <SelectItem key={team} value={team} className="text-white">
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {attendanceTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-white">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">Attendance Records</CardTitle>
          <CardDescription className="text-gray-400">Recent attendance tracking data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredData.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-white font-medium">{record.player}</p>
                    <p className="text-gray-400 text-sm">
                      {record.team} • {record.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                    {record.type}
                  </Badge>
                  <Badge
                    variant={record.status === "Present" ? "default" : "destructive"}
                    className={record.status === "Present" ? "bg-green-600" : "bg-red-600"}
                  >
                    {record.status}
                  </Badge>
                  {record.match && (
                    <div className="text-gray-400 text-sm">
                      <div>{record.match}</div>
                      {record.slot && (
                        <div className="text-xs">
                          Slot: {record.slot}, Match: {record.matchNumber}, Map: {record.map}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showForm && <AttendanceForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
