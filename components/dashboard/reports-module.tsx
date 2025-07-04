"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Calendar, BarChart3, Users, Trophy, Target, AlertTriangle } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const reportTemplates = [
  {
    id: "attendance-daily",
    name: "Daily Attendance Report",
    description: "Daily breakdown of player attendance across all activities",
    icon: Users,
    frequency: "Daily",
    lastGenerated: "2024-01-15",
    type: "attendance",
  },
  {
    id: "attendance-weekly",
    name: "Weekly Attendance Summary",
    description: "Weekly attendance trends and top performers",
    icon: Calendar,
    frequency: "Weekly",
    lastGenerated: "2024-01-14",
    type: "attendance",
  },
  {
    id: "performance-daily",
    name: "Daily Performance Report",
    description: "Daily match performance and statistics",
    icon: BarChart3,
    frequency: "Daily",
    lastGenerated: "2024-01-15",
    type: "performance",
  },
  {
    id: "performance-weekly",
    name: "Weekly Performance Analysis",
    description: "Comprehensive weekly performance metrics",
    icon: Trophy,
    frequency: "Weekly",
    lastGenerated: "2024-01-14",
    type: "performance",
  },
  {
    id: "team-comparison",
    name: "Team Comparison Report",
    description: "Compare performance across all teams",
    icon: Target,
    frequency: "Monthly",
    lastGenerated: "2024-01-01",
    type: "performance",
  },
]

const attendanceMetrics = {
  totalPlayers: 12,
  topPerformer: "ShadowStrike",
  topPerformerRate: 95,
  individualSessions: 45,
  teamSessions: 18,
  matchesPlayed: 23,
  lowAttendancePlayers: ["PhoenixRise", "EmberWing"],
}

const performanceMetrics = {
  totalMatches: 23,
  avgPlacementPoints: 1250,
  totalTeamKills: 487,
  avgSurvivalTime: "17:30",
  topPerformer: "VanguardLead",
  firstPlaceFinishes: 8,
  top3Finishes: 15,
  top4Finishes: 18,
}

const playerPerformanceData = [
  {
    name: "ShadowStrike",
    kills: 847,
    avgKills: 18.8,
    damage: 124500,
    avgSurvival: "18:30",
    matches: 45,
    avgPlacement: 2.1,
  },
  {
    name: "VanguardLead",
    kills: 892,
    avgKills: 19.4,
    damage: 135600,
    avgSurvival: "19:20",
    matches: 46,
    avgPlacement: 1.8,
  },
  {
    name: "RebelSniper",
    kills: 723,
    avgKills: 17.2,
    damage: 98600,
    avgSurvival: "16:45",
    matches: 42,
    avgPlacement: 2.3,
  },
]

const attendanceTrendData = [
  { week: "Week 1", attendance: 85, training: 92, matches: 78 },
  { week: "Week 2", attendance: 92, training: 95, matches: 89 },
  { week: "Week 3", attendance: 78, training: 82, matches: 74 },
  { week: "Week 4", attendance: 88, training: 91, matches: 85 },
]

const generatedReports = [
  {
    id: "1",
    name: "Weekly Attendance Summary - Week 3",
    type: "Attendance",
    generatedDate: "2024-01-15",
    size: "2.4 MB",
    format: "PDF",
    period: "weekly",
  },
  {
    id: "2",
    name: "Daily Performance Report - Jan 15",
    type: "Performance",
    generatedDate: "2024-01-15",
    size: "1.8 MB",
    format: "Excel",
    period: "daily",
  },
  {
    id: "3",
    name: "Team Comparison - January 2024",
    type: "Performance",
    generatedDate: "2024-01-14",
    size: "3.1 MB",
    format: "PDF",
    period: "monthly",
  },
]

export function ReportsModule() {
  const [selectedPeriod, setSelectedPeriod] = useState("weekly")
  const [selectedFormat, setSelectedFormat] = useState("pdf")
  const [selectedReportType, setSelectedReportType] = useState("all")

  const filteredTemplates = reportTemplates.filter(
    (template) => selectedReportType === "all" || template.type === selectedReportType,
  )

  const handleGenerateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId}`)
  }

  const handleDownloadReport = (reportId: string) => {
    console.log(`Downloading report: ${reportId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400">Generate comprehensive attendance and performance reports</p>
        </div>
      </div>

      {/* Report Type Filter */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Report Type</label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-white">
                    All Reports
                  </SelectItem>
                  <SelectItem value="attendance" className="text-white">
                    Attendance Reports
                  </SelectItem>
                  <SelectItem value="performance" className="text-white">
                    Performance Reports
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Report Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="daily" className="text-white">
                    Daily
                  </SelectItem>
                  <SelectItem value="weekly" className="text-white">
                    Weekly
                  </SelectItem>
                  <SelectItem value="monthly" className="text-white">
                    Monthly
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Format</label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="pdf" className="text-white">
                    PDF
                  </SelectItem>
                  <SelectItem value="excel" className="text-white">
                    Excel
                  </SelectItem>
                  <SelectItem value="csv" className="text-white">
                    CSV
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Metrics Overview */}
      {(selectedReportType === "all" || selectedReportType === "attendance") && (
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Attendance Metrics Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{attendanceMetrics.totalPlayers}</div>
                <div className="text-sm text-gray-400">Total Players</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{attendanceMetrics.topPerformer}</div>
                <div className="text-sm text-gray-400">Top Performer ({attendanceMetrics.topPerformerRate}%)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{attendanceMetrics.individualSessions}</div>
                <div className="text-sm text-gray-400">Individual Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{attendanceMetrics.teamSessions}</div>
                <div className="text-sm text-gray-400">Team Sessions</div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-white font-medium mb-3">Low Attendance Alert (&lt;70%)</h4>
              <div className="flex space-x-2">
                {attendanceMetrics.lowAttendancePlayers.map((player) => (
                  <Badge key={player} variant="destructive" className="bg-red-600">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {player}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics Overview */}
      {(selectedReportType === "all" || selectedReportType === "performance") && (
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Performance Metrics Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{performanceMetrics.totalMatches}</div>
                <div className="text-sm text-gray-400">Total Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{performanceMetrics.avgPlacementPoints}</div>
                <div className="text-sm text-gray-400">Avg Placement Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{performanceMetrics.totalTeamKills}</div>
                <div className="text-sm text-gray-400">Total Team Kills</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{performanceMetrics.avgSurvivalTime}</div>
                <div className="text-sm text-gray-400">Avg Survival Time</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">{performanceMetrics.firstPlaceFinishes}</div>
                <div className="text-sm text-gray-400">1st Place Finishes</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-400">{performanceMetrics.top3Finishes}</div>
                <div className="text-sm text-gray-400">Top 3 Finishes</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">{performanceMetrics.top4Finishes}</div>
                <div className="text-sm text-gray-400">Top 4 Finishes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Trend Chart */}
      {(selectedReportType === "all" || selectedReportType === "attendance") && (
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader>
            <CardTitle className="text-white">Attendance Trend Analysis</CardTitle>
            <CardDescription className="text-gray-400">Weekly attendance breakdown by activity type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                attendance: { label: "Overall", color: "hsl(var(--chart-1))" },
                training: { label: "Training", color: "hsl(var(--chart-2))" },
                matches: { label: "Matches", color: "hsl(var(--chart-3))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="attendance" stroke="var(--color-attendance)" strokeWidth={2} />
                  <Line type="monotone" dataKey="training" stroke="var(--color-training)" strokeWidth={2} />
                  <Line type="monotone" dataKey="matches" stroke="var(--color-matches)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Player Performance Comparison */}
      {(selectedReportType === "all" || selectedReportType === "performance") && (
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader>
            <CardTitle className="text-white">Player Performance Comparison</CardTitle>
            <CardDescription className="text-gray-400">Detailed metrics for all team players</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {playerPerformanceData.map((player, index) => (
                <div key={player.name} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{player.name}</h4>
                    <Badge className="bg-orange-600 text-white">Rank #{index + 1}</Badge>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">{player.kills}</div>
                      <div className="text-xs text-gray-400">Total Kills</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-400">{player.avgKills}</div>
                      <div className="text-xs text-gray-400">Avg Kills</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-400">{player.damage.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Total Damage</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-yellow-400">{player.avgSurvival}</div>
                      <div className="text-xs text-gray-400">Avg Survival</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-400">{player.matches}</div>
                      <div className="text-xs text-gray-400">Matches Played</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-400">{player.avgPlacement}</div>
                      <div className="text-xs text-gray-400">Avg Placement</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Templates */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">Report Templates</CardTitle>
          <CardDescription className="text-gray-400">
            Pre-configured report templates for quick generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                      <template.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{template.name}</h3>
                      <p className="text-gray-400 text-sm">{template.description}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Type:</span>
                    <Badge
                      variant="secondary"
                      className={template.type === "attendance" ? "bg-blue-600" : "bg-green-600"}
                    >
                      {template.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Frequency:</span>
                    <span className="text-white">{template.frequency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Generated:</span>
                    <span className="text-white">{template.lastGenerated}</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleGenerateReport(template.id)}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  size="sm"
                >
                  Generate Now
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Reports */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">Generated Reports</CardTitle>
          <CardDescription className="text-gray-400">
            Previously generated reports available for download
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generatedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{report.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Generated: {report.generatedDate}</span>
                      <span>Size: {report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                    {report.format}
                  </Badge>
                  <Badge variant="secondary" className={report.type === "Attendance" ? "bg-blue-600" : "bg-green-600"}>
                    {report.type}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-600 text-white">
                    {report.period}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownloadReport(report.id)}
                    className="text-green-400 hover:bg-green-600/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{generatedReports.length}</div>
            <p className="text-xs text-gray-400">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">47</div>
            <p className="text-xs text-green-400">+12 this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-gray-400">Auto-generated</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Storage Used</CardTitle>
            <BarChart3 className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12.4 GB</div>
            <p className="text-xs text-gray-400">Of 50 GB limit</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
