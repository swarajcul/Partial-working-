"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus } from "lucide-react"
import { PlayerAttendanceMarkingForm } from "./player-attendance-marking-form"

interface AttendanceRecord {
  id: string
  date: string
  sessionType: "Training" | "Scrims" | "Match" | "Strategy Meeting"
  status: "Present" | "Absent" | "Late" | "Pending"
  duration: string
  notes?: string
}

export function PlayerAttendanceModule() {
  const [showMarkingForm, setShowMarkingForm] = useState(false)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: "1",
      date: "2024-01-15",
      sessionType: "Training",
      status: "Present",
      duration: "2h 30m",
      notes: "Great performance in aim training",
    },
    {
      id: "2",
      date: "2024-01-14",
      sessionType: "Scrims",
      status: "Present",
      duration: "3h 15m",
    },
    {
      id: "3",
      date: "2024-01-13",
      sessionType: "Match",
      status: "Present",
      duration: "1h 45m",
      notes: "Tournament match vs Team Alpha",
    },
    {
      id: "4",
      date: "2024-01-12",
      sessionType: "Strategy Meeting",
      status: "Late",
      duration: "45m",
      notes: "Arrived 15 minutes late",
    },
    {
      id: "5",
      date: "2024-01-16",
      sessionType: "Training",
      status: "Pending",
      duration: "2h 00m",
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Absent":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "Late":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "Pending":
        return <Clock className="w-4 h-4 text-blue-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800 border-green-200"
      case "Absent":
        return "bg-red-100 text-red-800 border-red-200"
      case "Late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Pending":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "Training":
        return "bg-blue-100 text-blue-800"
      case "Scrims":
        return "bg-purple-100 text-purple-800"
      case "Match":
        return "bg-red-100 text-red-800"
      case "Strategy Meeting":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleMarkAttendance = (recordId: string, status: "Present" | "Absent") => {
    setAttendanceRecords((prev) => prev.map((record) => (record.id === recordId ? { ...record, status } : record)))
  }

  const attendanceStats = {
    totalSessions: attendanceRecords.length,
    presentSessions: attendanceRecords.filter((r) => r.status === "Present").length,
    lateSessions: attendanceRecords.filter((r) => r.status === "Late").length,
    absentSessions: attendanceRecords.filter((r) => r.status === "Absent").length,
    attendanceRate:
      Math.round(
        (attendanceRecords.filter((r) => r.status === "Present" || r.status === "Late").length /
          attendanceRecords.filter((r) => r.status !== "Pending").length) *
          100,
      ) || 0,
  }

  return (
    <div className="space-y-6">
      {/* Attendance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{attendanceStats.attendanceRate}%</div>
            <div className="text-sm text-muted-foreground">Attendance Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{attendanceStats.presentSessions}</div>
            <div className="text-sm text-muted-foreground">Present</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{attendanceStats.lateSessions}</div>
            <div className="text-sm text-muted-foreground">Late</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{attendanceStats.absentSessions}</div>
            <div className="text-sm text-muted-foreground">Absent</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Attendance Records
              </CardTitle>
              <CardDescription>Your session attendance history</CardDescription>
            </div>
            <Button onClick={() => setShowMarkingForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(record.status)}
                    <div>
                      <div className="font-medium">{new Date(record.date).toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {record.duration}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getSessionTypeColor(record.sessionType)}>
                      {record.sessionType}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {record.status === "Pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                        onClick={() => handleMarkAttendance(record.id, "Present")}
                      >
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                        onClick={() => handleMarkAttendance(record.id, "Absent")}
                      >
                        Absent
                      </Button>
                    </div>
                  )}
                  {record.notes && (
                    <div className="text-sm text-muted-foreground max-w-xs truncate">{record.notes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Marking Form Modal */}
      {showMarkingForm && (
        <PlayerAttendanceMarkingForm
          onClose={() => setShowMarkingForm(false)}
          onSubmit={(data) => {
            const newRecord: AttendanceRecord = {
              id: Date.now().toString(),
              date: data.date,
              sessionType: data.sessionType,
              status: data.status,
              duration: data.duration,
              notes: data.notes,
            }
            setAttendanceRecords((prev) => [newRecord, ...prev])
            setShowMarkingForm(false)
          }}
        />
      )}
    </div>
  )
}
