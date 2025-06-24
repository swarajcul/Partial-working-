"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Target, Trophy, Zap, Filter, MapPin, Crosshair } from "lucide-react"

// Mock player analytics data
const mockPlayerAnalytics = {
  playerName: "ShadowStrike",
  team: "Rebellion",
  personalStats: {
    winRate: 84,
    avgKD: 2.8,
    totalDamage: 124500,
    avgPlacement: 2.1,
    highestDamage: 4250,
    mostKills: 28,
  },
  performanceTrend: [
    { month: "Sep", winRate: 78, kd: 2.4, damage: 18500 },
    { month: "Oct", winRate: 82, kd: 2.6, damage: 21200 },
    { month: "Nov", winRate: 85, kd: 2.9, damage: 23800 },
    { month: "Dec", winRate: 84, kd: 2.8, damage: 22100 },
    { month: "Jan", winRate: 87, kd: 3.1, damage: 24600 },
  ],
  killTrend: [
    { match: "M1", kills: 18, placement: 2 },
    { match: "M2", kills: 22, placement: 1 },
    { match: "M3", kills: 15, placement: 4 },
    { match: "M4", kills: 19, placement: 3 },
    { match: "M5", kills: 24, placement: 1 },
    { match: "M6", kills: 16, placement: 5 },
    { match: "M7", kills: 21, placement: 2 },
    { match: "M8", kills: 17, placement: 3 },
  ],
  placementTrend: [
    { match: "M1", placement: 2 },
    { match: "M2", placement: 1 },
    { match: "M3", placement: 4 },
    { match: "M4", placement: 3 },
    { match: "M5", placement: 1 },
    { match: "M6", placement: 5 },
    { match: "M7", placement: 2 },
    { match: "M8", placement: 3 },
  ],
  mapPerformance: [
    { map: "Erangel", matches: 12, wins: 10, winRate: 83, avgKills: 19.2 },
    { map: "Miramar", matches: 10, wins: 8, winRate: 80, avgKills: 17.8 },
    { map: "Sanhok", matches: 8, wins: 7, winRate: 87, avgKills: 21.5 },
    { map: "Vikendi", matches: 6, wins: 5, winRate: 83, avgKills: 18.3 },
    { map: "Karakin", matches: 4, wins: 3, winRate: 75, avgKills: 16.2 },
  ],
  teamComparison: [
    { name: "ShadowStrike", kills: 847, damage: 124500, winRate: 84, kd: 2.8 },
    { name: "RebelSniper", kills: 723, damage: 98600, winRate: 79, kd: 2.4 },
    { name: "StormRider", kills: 692, damage: 89200, winRate: 76, kd: 2.2 },
    { name: "PhantomEdge", kills: 585, damage: 76800, winRate: 81, kd: 2.1 },
  ],
}

export function PlayerAnalyticsModule() {
  const [selectedFilter, setSelectedFilter] = useState("personal")
  const [matchTypeFilter, setMatchTypeFilter] = useState("all")
  const [mapFilter, setMapFilter] = useState("all")

  const mapColors = ["#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d"]

  // Custom label function for charts
  const renderCustomLabel = (props: any) => {
    const { cx, cy, value } = props
    return (
      <text x={cx} y={cy} fill="white" textAnchor={cy ? "middle" : "start"} dominantBaseline="central" fontSize="12">
        {value}
      </text>
    )
  }

  return (
    <div className="space-y-6 bg-background min-h-screen transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Analytics</h1>
            <p className="text-muted-foreground">
              {mockPlayerAnalytics.playerName} • Team {mockPlayerAnalytics.team}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Filters */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Analytics Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48 bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="personal" className="text-foreground">
                  My Performance Only
                </SelectItem>
                <SelectItem value="team" className="text-foreground">
                  Team {mockPlayerAnalytics.team} Overview
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={matchTypeFilter} onValueChange={setMatchTypeFilter}>
              <SelectTrigger className="w-48 bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all" className="text-foreground">
                  All Match Types
                </SelectItem>
                <SelectItem value="scrims" className="text-foreground">
                  Scrims Only
                </SelectItem>
                <SelectItem value="tournaments" className="text-foreground">
                  Tournaments Only
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={mapFilter} onValueChange={setMapFilter}>
              <SelectTrigger className="w-48 bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all" className="text-foreground">
                  All Maps
                </SelectItem>
                <SelectItem value="Erangel" className="text-foreground">
                  Erangel
                </SelectItem>
                <SelectItem value="Miramar" className="text-foreground">
                  Miramar
                </SelectItem>
                <SelectItem value="Sanhok" className="text-foreground">
                  Sanhok
                </SelectItem>
                <SelectItem value="Vikendi" className="text-foreground">
                  Vikendi
                </SelectItem>
                <SelectItem value="Karakin" className="text-foreground">
                  Karakin
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
            <Trophy className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockPlayerAnalytics.personalStats.winRate}%</div>
            <p className="text-xs text-green-400">+3% this month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">K/D Ratio</CardTitle>
            <Target className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockPlayerAnalytics.personalStats.avgKD}</div>
            <p className="text-xs text-green-400">+0.4 improvement</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Damage</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(mockPlayerAnalytics.personalStats.totalDamage / 1000)}K
            </div>
            <p className="text-xs text-green-400">+18K this season</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Placement</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockPlayerAnalytics.personalStats.avgPlacement}</div>
            <p className="text-xs text-green-400">-0.3 better</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Highest Damage</CardTitle>
            <Zap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockPlayerAnalytics.personalStats.highestDamage}</div>
            <p className="text-xs text-muted-foreground">Single match</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Most Kills</CardTitle>
            <Crosshair className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockPlayerAnalytics.personalStats.mostKills}</div>
            <p className="text-xs text-muted-foreground">Single match</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kill Trend Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Kill Trend</CardTitle>
            <CardDescription className="text-muted-foreground">Your recent match kill performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                kills: {
                  label: "Kills",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockPlayerAnalytics.killTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="match" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="kills" fill="var(--color-kills)">
                    <LabelList dataKey="kills" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Placement Trend Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Placement Trend</CardTitle>
            <CardDescription className="text-muted-foreground">Your match placement performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                placement: {
                  label: "Placement",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPlayerAnalytics.placementTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="match" />
                  <YAxis domain={[1, 10]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="placement"
                    stroke="var(--color-placement)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-placement)", strokeWidth: 2, r: 4 }}
                  >
                    <LabelList dataKey="placement" position="top" />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Map Performance Pie Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Map Performance
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your match distribution and win rates across different maps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              matches: {
                label: "Matches",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockPlayerAnalytics.mapPerformance}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="matches"
                  label={({ map, winRate }) => `${map}: ${winRate}%`}
                  labelLine={false}
                >
                  {mockPlayerAnalytics.mapPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={mapColors[index % mapColors.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium text-foreground">{data.map}</p>
                          <p className="text-sm text-muted-foreground">Matches: {data.matches}</p>
                          <p className="text-sm text-muted-foreground">Wins: {data.wins}</p>
                          <p className="text-sm text-muted-foreground">Win Rate: {data.winRate}%</p>
                          <p className="text-sm text-muted-foreground">Avg Kills: {data.avgKills}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Team Comparison (only if team filter is selected) */}
      {selectedFilter === "team" && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Team {mockPlayerAnalytics.team} Comparison</CardTitle>
            <CardDescription className="text-muted-foreground">Performance comparison within your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPlayerAnalytics.teamComparison.map((player, index) => (
                <div
                  key={player.name}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    player.name === mockPlayerAnalytics.playerName
                      ? "bg-orange-600/20 border border-orange-600/50"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-foreground font-medium">
                        {player.name}
                        {player.name === mockPlayerAnalytics.playerName && (
                          <span className="ml-2 text-xs bg-orange-600 text-white px-2 py-1 rounded">You</span>
                        )}
                      </h4>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-foreground font-bold">{player.kills}</div>
                      <div className="text-muted-foreground text-sm">Kills</div>
                    </div>
                    <div>
                      <div className="text-foreground font-bold">{player.damage.toLocaleString()}</div>
                      <div className="text-muted-foreground text-sm">Damage</div>
                    </div>
                    <div>
                      <div className="text-green-400 font-bold">{player.winRate}%</div>
                      <div className="text-muted-foreground text-sm">Win Rate</div>
                    </div>
                    <div>
                      <div className="text-orange-400 font-bold">{player.kd}</div>
                      <div className="text-muted-foreground text-sm">K/D</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
