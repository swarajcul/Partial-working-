"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, RefreshCw } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  user: string
  action: string
  target: string
  type: "user" | "content" | "system" | "auth"
  status: "success" | "warning" | "error"
  details: string
  ip?: string
}

export function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [logs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "2024-01-15 14:30:25",
      user: "admin@raptorsesports.com",
      action: "Role Updated",
      target: "alex@raptorsesports.com",
      type: "user",
      status: "success",
      details: "Changed role from 'unassigned' to 'player', assigned to team 'Rebellion'",
      ip: "192.168.1.100",
    },
    {
      id: "2",
      timestamp: "2024-01-15 14:25:12",
      user: "admin@raptorsesports.com",
      action: "Content Updated",
      target: "Hero Title",
      type: "content",
      status: "success",
      details: "Updated hero section title text",
      ip: "192.168.1.100",
    },
    {
      id: "3",
      timestamp: "2024-01-15 14:20:45",
      user: "newuser@example.com",
      action: "Login Attempt",
      target: "Authentication",
      type: "auth",
      status: "success",
      details: "Successful login via Google OAuth",
      ip: "203.0.113.45",
    },
    {
      id: "4",
      timestamp: "2024-01-15 14:15:33",
      user: "system",
      action: "Backup Created",
      target: "Database",
      type: "system",
      status: "success",
      details: "Automated daily backup completed successfully",
    },
    {
      id: "5",
      timestamp: "2024-01-15 14:10:18",
      user: "admin@raptorsesports.com",
      action: "Asset Upload",
      target: "hero-banner.jpg",
      type: "content",
      status: "warning",
      details: "Image uploaded but dimensions don't match requirements (1200x400 instead of 1920x600)",
      ip: "192.168.1.100",
    },
    {
      id: "6",
      timestamp: "2024-01-15 14:05:22",
      user: "unknown@example.com",
      action: "Login Attempt",
      target: "Authentication",
      type: "auth",
      status: "error",
      details: "Failed login attempt - invalid credentials",
      ip: "198.51.100.42",
    },
  ])

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || log.type === typeFilter
    const matchesStatus = statusFilter === "all" || log.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-600"
      case "warning":
        return "bg-yellow-600"
      case "error":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "user":
        return "bg-blue-600"
      case "content":
        return "bg-purple-600"
      case "system":
        return "bg-gray-600"
      case "auth":
        return "bg-orange-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{logs.length}</div>
            <p className="text-xs text-gray-400">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{logs.filter((l) => l.status === "success").length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {logs.filter((l) => l.status === "warning").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{logs.filter((l) => l.status === "error").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Logs */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">System Activity Logs</CardTitle>
              <CardDescription className="text-gray-400">Track all system activities and changes</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">
                  All Types
                </SelectItem>
                <SelectItem value="user" className="text-white">
                  User
                </SelectItem>
                <SelectItem value="content" className="text-white">
                  Content
                </SelectItem>
                <SelectItem value="system" className="text-white">
                  System
                </SelectItem>
                <SelectItem value="auth" className="text-white">
                  Auth
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">
                  All Status
                </SelectItem>
                <SelectItem value="success" className="text-white">
                  Success
                </SelectItem>
                <SelectItem value="warning" className="text-white">
                  Warning
                </SelectItem>
                <SelectItem value="error" className="text-white">
                  Error
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Log Entries */}
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getTypeColor(log.type)} text-white text-xs`}>{log.type.toUpperCase()}</Badge>
                    <Badge className={`${getStatusColor(log.status)} text-white text-xs`}>
                      {log.status.toUpperCase()}
                    </Badge>
                    <span className="text-gray-400 text-sm font-mono">{log.timestamp}</span>
                  </div>
                  {log.ip && <span className="text-gray-500 text-xs font-mono">{log.ip}</span>}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{log.action}</span>
                    <span className="text-gray-400">by</span>
                    <span className="text-blue-400">{log.user}</span>
                    <span className="text-gray-400">on</span>
                    <span className="text-orange-400">{log.target}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{log.details}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No logs found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
