"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth/auth-provider"
import { Trophy, Users, Target, TrendingUp, AlertTriangle } from "lucide-react"
import { useMemo } from "react"
import { RoleTestingBanner } from "./role-testing-banner"
import { DevInfoPanel } from "./dev-info-panel"

// Mock player data - in real app, this would come from API
const mockPlayerData = {
  id: "player-1",
  name: "ShadowStrike",
  team: "Rebellion",
  stats: {
    totalMatches: 45,
    winRate: 84,
    avgPlacement: 2.1,
    avgKills: 18.7,
    totalKills: 847,
    totalDamage: 124500,
    kd: 2.8,
    avgSurvival: "18:30",
  },
  recentMatches: [
    { id: "BGMI-2024-01-20-ER-M1", date: "Jan 20", placement: 1, kills: 22, damage: 2800, map: "Erangel" },
    { id: "BGMI-2024-01-19-ER-M2", date: "Jan 19", placement: 2, kills: 18, damage: 2400, map: "Miramar" },
    { id: "BGMI-2024-01-18-ER-M3", date: "Jan 18", placement: 3, kills: 20, damage: 2600, map: "Sanhok" },
    { id: "BGMI-2024-01-17-ER-M4", date: "Jan 17", placement: 1, kills: 24, damage: 3200, map: "Vikendi" },
    { id: "BGMI-2024-01-16-ER-M5", date: "Jan 16", placement: 4, kills: 15, damage: 2100, map: "Erangel" },
    { id: "BGMI-2024-01-15-ER-M6", date: "Jan 15", placement: 2, kills: 19, damage: 2500, map: "Miramar" },
    { id: "BGMI-2024-01-14-ER-M7", date: "Jan 14", placement: 1, kills: 21, damage: 2900, map: "Sanhok" },
    { id: "BGMI-2024-01-13-ER-M8", date: "Jan 13", placement: 5, kills: 14, damage: 1900, map: "Vikendi" },
    { id: "BGMI-2024-01-12-ER-M9", date: "Jan 12", placement: 2, kills: 17, damage: 2300, map: "Erangel" },
    { id: "BGMI-2024-01-11-ER-M10", date: "Jan 11", placement: 3, kills: 16, damage: 2200, map: "Miramar" },
  ],
  teamPerformance: {
    avgPlacement: 2.3,
    totalKills: 3420,
    winRate: 78,
    matchesPlayed: 52,
  },
  alerts: [
    { type: "warning", message: "You missed 2 training sessions this week", priority: "high" },
    { type: "info", message: "Team match scheduled for tomorrow at 8 PM", priority: "medium" },
    { type: "success", message: "Great performance in last match! +24 kills", priority: "low" },
    { type: "info", message: "New team strategy meeting on Friday", priority: "medium" },
  ],
}

export function PlayerDashboardOverview() {
  const { user } = useAuth()

  const playerStats = useMemo(
    () => [
      {
        title: "Total Matches",
        value: mockPlayerData.stats.totalMatches.toString(),
        change: "+3 this week",
        icon: Trophy,
        color: "text-blue-500",
      },
      {
        title: "Win Rate",
        value: `${mockPlayerData.stats.winRate}%`,
        change: "+2% this month",
        icon: Target,
        color: "text-green-500",
      },
      {
        title: "Avg Placement",
        value: mockPlayerData.stats.avgPlacement.toString(),
        change: "-0.2 improvement",
        icon: TrendingUp,
        color: "text-orange-500",
      },
      {
        title: "Avg Kills",
        value: mockPlayerData.stats.avgKills.toString(),
        change: "+1.2 per match",
        icon: Target,
        color: "text-red-500",
      },
    ],
    [],
  )

  const priorityColors = {
    high: "border-red-500 bg-red-500/10",
    medium: "border-yellow-500 bg-yellow-500/10",
    low: "border-green-500 bg-green-500/10",
  }

  const alertIcons = {
    warning: "text-yellow-500",
    info: "text-blue-500",
    success: "text-green-500",
    error: "text-red-500",
  }

  return (
    <div className="space-y-6 bg-background min-h-screen transition-colors duration-300">
      <RoleTestingBanner />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {mockPlayerData.name}</h1>
            <p className="text-muted-foreground">Team {mockPlayerData.team} • Your personal performance dashboard</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-600 text-white">
            {mockPlayerData.team}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {user?.role}
          </Badge>
        </div>
      </div>

      {/* Personal Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {playerStats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <p className="text-xs text-green-400">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Match History with Horizontal Scroll */}
        <Card className="bg-card border-border transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Recent Match History
            </CardTitle>
            <CardDescription className="text-muted-foreground">Your last 10 matches with performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-4" style={{ width: "max-content" }}>
                {mockPlayerData.recentMatches.map((match, index) => (
                  <div
                    key={match.id}
                    className="flex-shrink-0 w-64 p-4 bg-muted rounded-lg border transition-all duration-300 hover:shadow-md"
                    style={{
                      animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={match.placement <= 3 ? "default" : "secondary"}
                        className={match.placement <= 3 ? "bg-green-600 text-white" : "bg-muted-foreground"}
                      >
                        #{match.placement}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{match.date}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-card-foreground text-sm">{match.map}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{match.kills} kills</span>
                        <span>{match.damage} dmg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance Summary */}
        <Card className="bg-card border-border transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Team {mockPlayerData.team} Performance
            </CardTitle>
            <CardDescription className="text-muted-foreground">Your team's overall statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Team Win Rate</span>
                <span className="text-card-foreground">{mockPlayerData.teamPerformance.winRate}%</span>
              </div>
              <Progress value={mockPlayerData.teamPerformance.winRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Avg Team Placement</span>
                <span className="text-card-foreground">{mockPlayerData.teamPerformance.avgPlacement}</span>
              </div>
              <Progress value={100 - (mockPlayerData.teamPerformance.avgPlacement - 1) * 20} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-card-foreground">
                  {mockPlayerData.teamPerformance.matchesPlayed}
                </div>
                <div className="text-xs text-muted-foreground">Matches Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-card-foreground">
                  {mockPlayerData.teamPerformance.totalKills}
                </div>
                <div className="text-xs text-muted-foreground">Total Team Kills</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Notifications */}
      <Card className="bg-card border-border transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Alerts & Notifications
          </CardTitle>
          <CardDescription className="text-muted-foreground">Important updates and reminders for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPlayerData.alerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-center p-4 rounded-lg border-l-4 transition-colors duration-300 ${
                  priorityColors[alert.priority as keyof typeof priorityColors]
                }`}
              >
                <AlertTriangle className={`w-4 h-4 mr-3 ${alertIcons[alert.type as keyof typeof alertIcons]}`} />
                <div className="flex-1">
                  <span className="text-card-foreground">{alert.message}</span>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-xs">
                      {alert.priority} priority
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dev Info Panel */}
      <DevInfoPanel />

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
