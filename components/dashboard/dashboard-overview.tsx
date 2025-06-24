"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth/auth-provider"
import { Trophy, Users, Target, TrendingUp, BarChart3, AlertTriangle } from "lucide-react"
import { useMemo } from "react"
import { RoleTestingBanner } from "./role-testing-banner"
import { DevInfoPanel } from "./dev-info-panel"
import { PlayerDashboardOverview } from "./player-dashboard-overview"

export function DashboardOverview() {
  const { user } = useAuth()

  // Memoize static data to prevent re-renders
  const stats = useMemo(
    () => [
      {
        title: "Total Matches",
        value: "247",
        change: "+12%",
        icon: Trophy,
        color: "text-green-500",
      },
      {
        title: "Team Members",
        value: "16",
        change: "+2",
        icon: Users,
        color: "text-blue-500",
      },
      {
        title: "Win Rate",
        value: "78%",
        change: "+5%",
        icon: Target,
        color: "text-orange-500",
      },
      {
        title: "Avg Placement",
        value: "3.2",
        change: "-0.3",
        icon: TrendingUp,
        color: "text-red-500",
      },
    ],
    [],
  )

  const recentMatches = useMemo(
    () => [
      { id: "BGMI-2024-01-15-ER-M1", date: "Jan 15", placement: 2, kills: 18 },
      { id: "BGMI-2024-01-14-ER-M2", date: "Jan 14", placement: 1, kills: 22 },
      { id: "BGMI-2024-01-13-ER-M3", date: "Jan 13", placement: 4, kills: 15 },
    ],
    [],
  )

  const alerts = useMemo(
    () => [
      { type: "warning", message: "Phoenix team attendance below 70% this week" },
      { type: "info", message: "New match scheduled for tomorrow" },
    ],
    [],
  )

  const userRole = user?.role
  const userName = user?.name

  // If user is a player, show player-specific dashboard
  if (user?.role === "player") {
    return <PlayerDashboardOverview />
  }

  return (
    <div className="space-y-6 bg-background min-h-screen transition-colors duration-300">
      <RoleTestingBanner />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {userName}</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your {userRole === "admin" ? "organization" : "team"} today.
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-primary text-primary-foreground capitalize">
          {userRole}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <p className={`text-xs ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Matches */}
        <Card className="bg-card border-border transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Recent Matches
            </CardTitle>
            <CardDescription className="text-muted-foreground">Latest match results and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg transition-colors duration-300"
                >
                  <div>
                    <p className="text-card-foreground font-medium">{match.id}</p>
                    <p className="text-muted-foreground text-sm">{match.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={match.placement <= 3 ? "default" : "secondary"}
                      className={match.placement <= 3 ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}
                    >
                      #{match.placement}
                    </Badge>
                    <p className="text-muted-foreground text-sm mt-1">{match.kills} kills</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="bg-card border-border transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Team Performance
            </CardTitle>
            <CardDescription className="text-muted-foreground">Current month statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Win Rate</span>
                <span className="text-card-foreground">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Attendance</span>
                <span className="text-card-foreground">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Performance Score</span>
                <span className="text-card-foreground">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-card border-border transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center p-3 bg-muted rounded-lg transition-colors duration-300">
                  <AlertTriangle
                    className={`w-4 h-4 mr-3 ${alert.type === "warning" ? "text-yellow-500" : "text-blue-500"}`}
                  />
                  <span className="text-card-foreground">{alert.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Dev Info Panel */}
      <DevInfoPanel />
    </div>
  )
}
