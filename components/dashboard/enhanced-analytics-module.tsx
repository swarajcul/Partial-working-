"use client"

import { Badge } from "@/components/ui/badge"

import { Label } from "@/components/ui/label"

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
import { TrendingUp, Target, Trophy, Zap, Filter, Map, Award } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { hasPermission } from "@/lib/role-config"

// Enhanced analytics data with value labels
const mockAnalyticsData = {
  personalStats: {
    winRate: 84,
    avgKD: 2.8,
    totalDamage: 124500,
    avgPlacement: 2.1,
    highestDamage: 3850,
    mostKills: 28,
    totalMatches: 156,
    totalKills: 847,
  },
  performanceTrend: [
    { month: "Sep", winRate: 78, kd: 2.4, damage: 18500, kills: 145 },
    { month: "Oct", winRate: 82, kd: 2.6, damage: 21200, kills: 167 },
    { month: "Nov", winRate: 85, kd: 2.9, damage: 23800, kills: 189 },
    { month: "Dec", winRate: 84, kd: 2.8, damage: 22100, kills: 178 },
    { month: "Jan", winRate: 87, kd: 3.1, damage: 24600, kills: 198 },
  ],
  mapPerformance: [
    { map: "Erangel", matches: 42, wins: 35, winRate: 83, avgKills: 19.2 },
    { map: "Miramar", matches: 38, wins: 30, winRate: 79, avgKills: 17.8 },
    { map: "Sanhok", matches: 35, wins: 30, winRate: 86, avgKills: 21.5 },
    { map: "Vikendi", matches: 28, wins: 23, winRate: 82, avgKills: 18.3 },
    { map: "Karakin", matches: 13, wins: 9, winRate: 69, avgKills: 16.2 },
  ],
  killTrend: [
    { match: "M1", kills: 18, damage: 2400 },
    { match: "M2", kills: 22, damage: 2800 },
    { match: "M3", kills: 15, damage: 2100 },
    { match: "M4", kills: 19, damage: 2600 },
    { match: "M5", kills: 24, damage: 3200 },
    { match: "M6", kills: 16, damage: 2300 },
    { match: "M7", kills: 21, damage: 2900 },
    { match: "M8", kills: 17, damage: 2500 },
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
  teamComparison: [
    { name: "ShadowStrike", kills: 847, damage: 124500, winRate: 84, kd: 2.8, isCurrentUser: true },
    { name: "VanguardLead", kills: 892, damage: 135600, winRate: 85, kd: 3.1, isCurrentUser: false },
    { name: "RebelSniper", kills: 723, damage: 98600, winRate: 79, kd: 2.4, isCurrentUser: false },
    { name: "StormRider", kills: 692, damage: 89200, winRate: 76, kd: 2.2, isCurrentUser: false },
  ],
}

const mapColors = ["#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d"]

export function EnhancedAnalyticsModule() {
  const { user } = useAuth()
  const [selectedFilter, setSelectedFilter] = useState("personal")
  const [matchTypeFilter, setMatchTypeFilter] = useState("all")
  const [mapFilter, setMapFilter] = useState("all")
  const [timeRangeFilter, setTimeRangeFilter] = useState("all")

  const canViewAll = hasPermission(user?.role as any, "canViewAllTeams")
  const isPlayer = user?.role === "player"

  return (
    <div className="dashboard-container">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">{isPlayer ? "My Analytics" : "Team Analytics"}</h1>
              <p className="text-muted-foreground">
                {isPlayer
                  ? "Your personal performance analytics and insights"
                  : "Comprehensive team performance analytics"}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics Filters */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Analytics Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {!isPlayer && (
                <div className="space-y-2">
                  <Label className="text-foreground text-sm font-medium">View</Label>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="dashboard-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Performance</SelectItem>
                      <SelectItem value="team">Team Overview</SelectItem>
                      <SelectItem value="comparison">Team Comparison</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium">Match Type</Label>
                <Select value={matchTypeFilter} onValueChange={setMatchTypeFilter}>
                  <SelectTrigger className="dashboard-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Matches</SelectItem>
                    <SelectItem value="scrims">Scrims Only</SelectItem>
                    <SelectItem value="tournaments">Tournaments Only</SelectItem>
                    <SelectItem value="ranked">Ranked Matches</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium">Map</Label>
                <Select value={mapFilter} onValueChange={setMapFilter}>
                  <SelectTrigger className="dashboard-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Maps</SelectItem>
                    <SelectItem value="Erangel">Erangel</SelectItem>
                    <SelectItem value="Miramar">Miramar</SelectItem>
                    <SelectItem value="Sanhok">Sanhok</SelectItem>
                    <SelectItem value="Vikendi">Vikendi</SelectItem>
                    <SelectItem value="Karakin">Karakin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium">Time Range</Label>
                <Select value={timeRangeFilter} onValueChange={setTimeRangeFilter}>
                  <SelectTrigger className="dashboard-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="season">This Season</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Performance Metrics with Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
              <Trophy className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockAnalyticsData.personalStats.winRate}%</div>
              <p className="text-xs text-green-400">+3% this month</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">K/D Ratio</CardTitle>
              <Target className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockAnalyticsData.personalStats.avgKD}</div>
              <p className="text-xs text-green-400">+0.4 improvement</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Highest Damage</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockAnalyticsData.personalStats.highestDamage}</div>
              <p className="text-xs text-green-400">Personal best!</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Most Kills</CardTitle>
              <Award className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockAnalyticsData.personalStats.mostKills}</div>
              <p className="text-xs text-green-400">Single match record</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Matches</CardTitle>
              <Trophy className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockAnalyticsData.personalStats.totalMatches}</div>
              <p className="text-xs text-muted-foreground">This season</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Placement</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">#{mockAnalyticsData.personalStats.avgPlacement}</div>
              <p className="text-xs text-green-400">-0.3 better</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trend Chart with Enhanced Value Labels */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-foreground">Performance Trend Analysis</CardTitle>
            <CardDescription className="text-muted-foreground">
              Monthly performance progression with detailed metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                winRate: {
                  label: "Win Rate %",
                  color: "hsl(var(--chart-1))",
                },
                kd: {
                  label: "K/D Ratio",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockAnalyticsData.performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="winRate" stroke="var(--color-winRate)" strokeWidth={3}>
                    <LabelList dataKey="winRate" position="top" formatter={(value: number) => `${value}%`} />
                  </Line>
                  <Line type="monotone" dataKey="kd" stroke="var(--color-kd)" strokeWidth={3}>
                    <LabelList dataKey="kd" position="bottom" />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Performance Pie Chart with Value Labels */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Map className="w-5 h-5 mr-2" />
                Map Performance Distribution
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Win rate distribution across different maps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  winRate: {
                    label: "Win Rate",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockAnalyticsData.mapPerformance}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="winRate"
                      label={({ map, winRate }) => `${map}: ${winRate}%`}
                    >
                      {mockAnalyticsData.mapPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={mapColors[index % mapColors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Kill Trend Chart with Value Labels */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Kill Performance</CardTitle>
              <CardDescription className="text-muted-foreground">Your last 8 matches kill trend</CardDescription>
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
                  <BarChart data={mockAnalyticsData.killTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="match" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="kills" fill="var(--color-kills)" radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="kills" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Placement Trend Chart with Value Labels */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-foreground">Placement Trend Analysis</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your match placement progression (lower is better)
            </CardDescription>
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
                <LineChart data={mockAnalyticsData.placementTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="match" />
                  <YAxis reversed domain={[1, 10]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="placement"
                    stroke="var(--color-placement)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-placement)", strokeWidth: 2, r: 6 }}
                  >
                    <LabelList dataKey="placement" position="top" formatter={(value: number) => `#${value}`} />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Team Comparison (only if not player or if team filter is selected) */}
        {(!isPlayer || selectedFilter === "team") && (
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-foreground">Team Performance Comparison</CardTitle>
              <CardDescription className="text-muted-foreground">
                Performance comparison within the team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.teamComparison.map((player, index) => (
                  <div
                    key={player.name}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      player.isCurrentUser && isPlayer ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-foreground font-medium flex items-center gap-2">
                          {player.name}
                          {player.isCurrentUser && isPlayer && (
                            <Badge variant="outline" className="text-xs">
                              You
                            </Badge>
                          )}
                        </h4>
                        <p className="text-muted-foreground text-sm">Team Member</p>
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
    </div>
  )
}
