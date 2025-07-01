"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth/auth-provider"
import { hasPermission } from "@/lib/role-config"
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Home,
} from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Link from "next/link"

// Mock KPI data
const coachKPIs = {
  teamPerformance: {
    winRate: 78,
    target: 80,
    trend: "up",
    change: "+5%",
  },
  playerDevelopment: {
    skillImprovement: 85,
    target: 75,
    trend: "up",
    change: "+12%",
  },
  attendanceRate: {
    current: 92,
    target: 95,
    trend: "down",
    change: "-3%",
  },
  strategyEffectiveness: {
    current: 88,
    target: 85,
    trend: "up",
    change: "+8%",
  },
}

const analystKPIs = {
  dataAccuracy: {
    current: 96,
    target: 95,
    trend: "up",
    change: "+2%",
  },
  reportDelivery: {
    onTime: 94,
    target: 90,
    trend: "up",
    change: "+4%",
  },
  insightQuality: {
    current: 89,
    target: 85,
    trend: "up",
    change: "+6%",
  },
  predictionAccuracy: {
    current: 82,
    target: 80,
    trend: "up",
    change: "+3%",
  },
}

const performanceTrend = [
  { month: "Jan", coach: 75, analyst: 78, target: 80 },
  { month: "Feb", coach: 78, analyst: 82, target: 80 },
  { month: "Mar", coach: 82, analyst: 85, target: 80 },
  { month: "Apr", coach: 85, analyst: 88, target: 80 },
  { month: "May", coach: 88, analyst: 91, target: 80 },
  { month: "Jun", coach: 92, analyst: 94, target: 80 },
]

const teamComparison = [
  { team: "Rebellion", performance: 92, coach: "John Doe", analyst: "Jane Smith" },
  { team: "Phoenix", performance: 88, coach: "Mike Johnson", analyst: "Sarah Wilson" },
  { team: "Vanguard", performance: 85, coach: "Alex Brown", analyst: "Tom Davis" },
]

const goalProgress = [
  { goal: "Win Rate Improvement", progress: 78, target: 85, status: "on-track" },
  { goal: "Player Skill Development", progress: 92, target: 90, status: "achieved" },
  { goal: "Strategy Implementation", progress: 65, target: 80, status: "behind" },
  { goal: "Data Analysis Accuracy", progress: 96, target: 95, status: "achieved" },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function KPIDashboard() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [selectedTeam, setSelectedTeam] = useState("all")

  const userRole = user?.role
  const isCoach = userRole === "coach"
  const isAnalyst = userRole === "analyst"
  const canEdit = hasPermission(userRole as any, "canEditKPIs")

  const currentKPIs = isCoach ? coachKPIs : analystKPIs

  const getStatusColor = (status: string) => {
    switch (status) {
      case "achieved":
        return "text-green-600 bg-green-100"
      case "on-track":
        return "text-blue-600 bg-blue-100"
      case "behind":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return <CheckCircle className="w-4 h-4" />
      case "on-track":
        return <Clock className="w-4 h-4" />
      case "behind":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <Button variant="outline" size="sm" asChild className="bg-background border-border">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Homepage
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-primary" />
                KPI Dashboard
              </h1>
              <p className="text-muted-foreground">
                {isCoach ? "Coach" : "Analyst"} performance metrics and key indicators
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 capitalize">
              {userRole} View
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Filters & Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-card-foreground text-sm font-medium">Time Period</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-card-foreground text-sm font-medium">Team</label>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    <SelectItem value="rebellion">Rebellion</SelectItem>
                    <SelectItem value="phoenix">Phoenix</SelectItem>
                    <SelectItem value="vanguard">Vanguard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                {canEdit && (
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Target className="w-4 h-4 mr-2" />
                    Update Targets
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(currentKPIs).map(([key, kpi]) => (
            <Card key={key} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </CardTitle>
                <div className="flex items-center space-x-1">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{kpi.current}%</div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">Target: {kpi.target}%</p>
                  <p className={`text-xs ${kpi.trend === "up" ? "text-green-500" : "text-red-500"}`}>{kpi.change}</p>
                </div>
                <Progress value={kpi.current} className="mt-2 h-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Trend Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Performance Trend Analysis</CardTitle>
            <CardDescription className="text-muted-foreground">
              Monthly performance comparison with targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                coach: { label: "Coach Performance", color: "hsl(var(--chart-1))" },
                analyst: { label: "Analyst Performance", color: "hsl(var(--chart-2))" },
                target: { label: "Target", color: "hsl(var(--chart-3))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="coach"
                    stroke="var(--color-coach)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-coach)", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="analyst"
                    stroke="var(--color-analyst)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-analyst)", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="var(--color-target)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "var(--color-target)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Performance Comparison */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Team Performance Comparison</CardTitle>
              <CardDescription className="text-muted-foreground">Performance metrics by team</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  performance: { label: "Performance", color: "hsl(var(--chart-1))" },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="team" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="performance" fill="var(--color-performance)">
                      {teamComparison.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Goal Progress */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Goal Progress Tracking</CardTitle>
              <CardDescription className="text-muted-foreground">Current progress towards set goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {goalProgress.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded-full ${getStatusColor(goal.status)}`}>
                        {getStatusIcon(goal.status)}
                      </div>
                      <span className="text-card-foreground font-medium text-sm">{goal.goal}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-card-foreground font-bold">{goal.progress}%</span>
                      <span className="text-muted-foreground text-xs ml-1">/ {goal.target}%</span>
                    </div>
                  </div>
                  <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Detailed Performance Metrics</CardTitle>
            <CardDescription className="text-muted-foreground">
              Comprehensive breakdown of all performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 text-card-foreground">Metric</th>
                    <th className="text-left p-2 text-card-foreground">Current</th>
                    <th className="text-left p-2 text-card-foreground">Target</th>
                    <th className="text-left p-2 text-card-foreground">Trend</th>
                    <th className="text-left p-2 text-card-foreground">Status</th>
                    <th className="text-left p-2 text-card-foreground">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(currentKPIs).map(([key, kpi], index) => (
                    <tr key={key} className="border-b border-border/50">
                      <td className="p-2 text-card-foreground font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </td>
                      <td className="p-2 text-card-foreground">{kpi.current}%</td>
                      <td className="p-2 text-muted-foreground">{kpi.target}%</td>
                      <td className="p-2">
                        <div className="flex items-center space-x-1">
                          {kpi.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                          <span className={kpi.trend === "up" ? "text-green-500" : "text-red-500"}>{kpi.change}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge
                          variant="outline"
                          className={
                            kpi.current >= kpi.target
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }
                        >
                          {kpi.current >= kpi.target ? "On Target" : "Below Target"}
                        </Badge>
                      </td>
                      <td className="p-2 text-muted-foreground">2 hours ago</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Action Items & Recommendations</CardTitle>
            <CardDescription className="text-muted-foreground">
              Suggested actions based on current performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Attendance Rate Below Target</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Current attendance is 3% below target. Consider implementing attendance incentives.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">Excellent Strategy Performance</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Strategy effectiveness is 8% above target. Document successful strategies for replication.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Star className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Player Development Opportunity</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Consider additional training sessions to maintain the positive skill improvement trend.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
