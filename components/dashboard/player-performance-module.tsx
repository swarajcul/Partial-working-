"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Target, Trophy, Zap, TrendingUp, Camera } from "lucide-react"
import { PerformanceInputModule } from "./performance-input-module"

// Mock player performance data
const mockPlayerPerformance = {
  playerName: "ShadowStrike",
  team: "Rebellion",
  stats: {
    totalMatches: 45,
    totalKills: 847,
    totalDamage: 124500,
    winRate: 84,
    kd: 2.8,
    avgPlacement: 2.1,
    avgSurvival: "18:30",
  },
  matchTrend: [
    { match: "M1", kills: 18, placement: 2, damage: 2400, date: "Jan 15" },
    { match: "M2", kills: 22, placement: 1, damage: 2800, date: "Jan 16" },
    { match: "M3", kills: 15, placement: 4, damage: 2100, date: "Jan 17" },
    { match: "M4", kills: 19, placement: 3, damage: 2600, date: "Jan 18" },
    { match: "M5", kills: 24, placement: 1, damage: 3200, date: "Jan 19" },
    { match: "M6", kills: 16, placement: 5, damage: 2300, date: "Jan 20" },
    { match: "M7", kills: 21, placement: 2, damage: 2900, date: "Jan 21" },
    { match: "M8", kills: 17, placement: 3, damage: 2500, date: "Jan 22" },
  ],
  teamStats: {
    avgPlacement: 2.3,
    totalKills: 3420,
    winRate: 78,
    matchesPlayed: 52,
  },
  recentMatches: [
    {
      id: "BGMI-2024-01-22-ER-M1",
      date: "Jan 22",
      map: "Erangel",
      placement: 3,
      kills: 17,
      assists: 4,
      damage: 2500,
      survival: "16:45",
    },
    {
      id: "BGMI-2024-01-21-MR-M2",
      date: "Jan 21",
      map: "Miramar",
      placement: 2,
      kills: 21,
      assists: 6,
      damage: 2900,
      survival: "18:20",
    },
    {
      id: "BGMI-2024-01-20-SK-M3",
      date: "Jan 20",
      map: "Sanhok",
      placement: 5,
      kills: 16,
      assists: 3,
      damage: 2300,
      survival: "14:30",
    },
  ],
}

export function PlayerPerformanceModule() {
  const [showInputForm, setShowInputForm] = useState(false)

  return (
    <div className="space-y-6 bg-background min-h-screen transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Performance</h1>
            <p className="text-muted-foreground">
              {mockPlayerPerformance.playerName} • Team {mockPlayerPerformance.team}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowInputForm(true)} className="bg-orange-600 hover:bg-orange-700">
            <Camera className="w-4 h-4 mr-2" />
            Add Performance
          </Button>
        </div>
      </div>

      {/* Personal Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">K/D Ratio</CardTitle>
            <Target className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockPlayerPerformance.stats.kd}</div>
            <p className="text-xs text-green-400">+0.3 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Placement</CardTitle>
            <Trophy className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockPlayerPerformance.stats.avgPlacement}</div>
            <p className="text-xs text-green-400">-0.2 improvement</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Damage</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(mockPlayerPerformance.stats.totalDamage / 1000)}K
            </div>
            <p className="text-xs text-green-400">+15K this week</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockPlayerPerformance.stats.winRate}%</div>
            <p className="text-xs text-green-400">+2% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Match Performance Trend Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Match Performance Trend</CardTitle>
          <CardDescription className="text-muted-foreground">Your recent match performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              kills: {
                label: "Kills",
                color: "hsl(var(--chart-1))",
              },
              placement: {
                label: "Placement",
                color: "hsl(var(--chart-2))",
              },
              damage: {
                label: "Damage",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPlayerPerformance.matchTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="match" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="kills"
                  stroke="var(--color-kills)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-kills)", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="placement"
                  stroke="var(--color-placement)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-placement)", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Recent Match Details */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Match Details</CardTitle>
          <CardDescription className="text-muted-foreground">Detailed breakdown of your latest matches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPlayerPerformance.recentMatches.map((match, index) => (
              <div key={match.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">#{match.placement}</span>
                  </div>
                  <div>
                    <h4 className="text-foreground font-medium">{match.map}</h4>
                    <p className="text-muted-foreground text-sm">{match.date}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-foreground font-bold">{match.kills}</div>
                    <div className="text-muted-foreground text-sm">Kills</div>
                  </div>
                  <div>
                    <div className="text-foreground font-bold">{match.assists}</div>
                    <div className="text-muted-foreground text-sm">Assists</div>
                  </div>
                  <div>
                    <div className="text-foreground font-bold">{match.damage}</div>
                    <div className="text-muted-foreground text-sm">Damage</div>
                  </div>
                  <div>
                    <div className="text-foreground font-bold">{match.survival}</div>
                    <div className="text-muted-foreground text-sm">Survival</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance Comparison */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Team {mockPlayerPerformance.team} Overview</CardTitle>
          <CardDescription className="text-muted-foreground">Your team's overall performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{mockPlayerPerformance.teamStats.avgPlacement}</div>
              <div className="text-sm text-muted-foreground">Avg Placement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{mockPlayerPerformance.teamStats.totalKills}</div>
              <div className="text-sm text-muted-foreground">Total Kills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{mockPlayerPerformance.teamStats.winRate}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{mockPlayerPerformance.teamStats.matchesPlayed}</div>
              <div className="text-sm text-muted-foreground">Matches</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Input Form */}
      {showInputForm && (
        <PerformanceInputModule
          onClose={() => setShowInputForm(false)}
          onSave={(data) => {
            console.log("Performance data saved:", data)
            setShowInputForm(false)
            // Handle the saved performance data here
          }}
          initialData={{
            team: mockPlayerPerformance.team,
            playerName: mockPlayerPerformance.playerName,
          }}
        />
      )}
    </div>
  )
}
