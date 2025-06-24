"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Calendar, Clock, AlertTriangle, TrendingUp, CheckCircle, XCircle } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

// Mock player attendance data
const mockPlayerAttendance = {
  playerName: "ShadowStrike",
  team: "Rebellion",
  overallAttendance: 87,
  thisWeekAttendance: 75,
  totalSessions: 48,
  attendedSessions: 42,
  missedSessions: 6,
  attendanceRecords: [
    {
      id: 1,
      date: "2024-01-20",
      type: "Team Training",
      status: "Present",
      duration: "2 hours",
      notes: "Excellent performance in scrimmage",
    },
    {
      id: 2,
      date: "2024-01-19",
      type: "Individual Training",
      status: "Present",
      duration: "1.5 hours",
      notes: "Worked on aim training",
    },
    {
      id: 3,
      date: "2024-01-18",
      type: "Match",
      status: "Present",
      duration: "3 hours",
      notes: "Tournament match - placed 2nd",
    },
    {
      id: 4,
      date: "2024-01-17",
      type: "Team Training",
      status: "Absent",
      duration: "2 hours",
      notes: "Personal emergency",
    },
    {
      id: 5,
      date: "2024-01-16",
      type: "Strategy Meeting",
      status: "Present",
      duration: "1 hour",
      notes: "Discussed new tactics",
    },
    {
      id: 6,
      date: "2024-01-15",
      type: "Team Training",
      status: "Late",
      duration: "1.5 hours",
      notes: "Joined 30 minutes late",
    },
  ],
  attendanceTrend: [
    { week: "Week 1", attendance: 90, missed: 1 },
    { week: "Week 2", attendance: 85, missed: 2 },
    { week: "Week 3", attendance: 95, missed: 0 },
    { week: "Week 4", attendance: 80, missed: 2 },
    { week: "Week 5", attendance: 75, missed: 3 },
    { week: "Week 6", attendance: 87, missed: 1 },
  ],
  alerts: [
    { type: "warning", message: "You've missed 2 training sessions this week" },
    { type: "info", message: "Perfect attendance last month - keep it up!" },
  ],
}

export function PlayerAttendanceModule() {
  const [showAttendanceForm, setShowAttendanceForm] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Absent":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "Late":
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-600 text-white"
      case "Absent":
        return "bg-red-600 text-white"
      case "Late":
        return "bg-yellow-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  return (
    <div className="space-y-6 bg-background min-h-screen transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowAttendanceForm(true)} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Attendance</h1>
            <p className="text-muted-foreground">
              {mockPlayerAttendance.playerName} • Team {mockPlayerAttendance.team}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-600 text-white">
          {mockPlayerAttendance.team}
        </Badge>
      </div>

      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockPlayerAttendance.overallAttendance}%</div>
            <p className="text-xs text-muted-foreground">
              {mockPlayerAttendance.attendedSessions} of {mockPlayerAttendance.totalSessions} sessions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockPlayerAttendance.thisWeekAttendance}%</div>
            <p className="text-xs text-yellow-400">Below target (80%)</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions Attended</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockPlayerAttendance.attendedSessions}</div>
            <p className="text-xs text-green-400">Great participation!</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions Missed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockPlayerAttendance.missedSessions}</div>
            <p className="text-xs text-red-400">Try to improve</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Trend Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Attendance Trend</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your weekly attendance percentage with missed sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              attendance: {
                label: "Attendance %",
                color: "hsl(var(--chart-1))",
              },
              missed: {
                label: "Missed Sessions",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPlayerAttendance.attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="var(--color-attendance)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-attendance)", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Attendance Records</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your training and match attendance history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPlayerAttendance.attendanceRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(record.status)}
                  <div>
                    <p className="font-medium text-foreground">{record.type}</p>
                    <p className="text-sm text-muted-foreground">{record.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{record.duration}</p>
                  </div>
                  <div className="max-w-xs">
                    <p className="text-sm text-muted-foreground">{record.notes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Alerts */}
      {mockPlayerAttendance.alerts.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Attendance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPlayerAttendance.alerts.map((alert, index) => (
                <div key={index} className="flex items-center p-3 bg-muted rounded-lg">
                  <AlertTriangle
                    className={`w-4 h-4 mr-3 ${alert.type === "warning" ? "text-yellow-500" : "text-blue-500"}`}
                  />
                  <span className="text-foreground">{alert.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Marking Form */}
      {showAttendanceForm && (
        <AttendanceMarkingForm
          playerName={mockPlayerAttendance.playerName}
          playerTeam={mockPlayerAttendance.team}
          onClose={() => setShowAttendanceForm(false)}
          onSave={(data) => {
            // Handle attendance save
            setShowAttendanceForm(false)
            toast({
              title: "Attendance Marked",
              description: "Your attendance has been successfully recorded.",
            })
          }}
        />
      )}
    </div>
  )
}

interface AttendanceMarkingFormProps {
  playerName: string
  playerTeam: string
  onClose: () => void
  onSave: (data: any) => void // Replace 'any' with the actual type of your data
}

const AttendanceMarkingForm: React.FC<AttendanceMarkingFormProps> = ({ playerName, playerTeam, onClose, onSave }) => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [type, setType] = useState("Team Training")
  const [status, setStatus] = useState("Present")
  const [duration, setDuration] = useState("2 hours")
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    // Basic validation
    if (!date || !type || !status || !duration) {
      alert("Please fill in all fields.")
      return
    }

    // Create data object
    const formData = {
      date: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      type,
      status,
      duration,
      notes,
    }

    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Mark Attendance for {playerName}</h3>
          <div className="mt-2 px-7 py-3">
            {/* Date */}
            <div className="mb-4">
              <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
                Date:
              </label>
              <input
                type="date"
                id="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={date ? date.toISOString().split("T")[0] : ""}
                onChange={(e) => setDate(new Date(e.target.value))}
              />
            </div>

            {/* Type */}
            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
                Type:
              </label>
              <select
                id="type"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>Team Training</option>
                <option>Individual Training</option>
                <option>Match</option>
                <option>Strategy Meeting</option>
              </select>
            </div>

            {/* Status */}
            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                Status:
              </label>
              <select
                id="status"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Present</option>
                <option>Absent</option>
                <option>Late</option>
              </select>
            </div>

            {/* Duration */}
            <div className="mb-4">
              <label htmlFor="duration" className="block text-gray-700 text-sm font-bold mb-2">
                Duration:
              </label>
              <input
                type="text"
                id="duration"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">
                Notes:
              </label>
              <textarea
                id="notes"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          {/* Footer */}
          <div className="items-center px-4 py-3">
            <button
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              onClick={handleSubmit}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 ml-2"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
