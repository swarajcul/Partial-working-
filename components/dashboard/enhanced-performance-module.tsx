"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth/auth-provider"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart, LabelList } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Target, Trophy, Zap, Edit, Filter, Upload, Table } from "lucide-react"
import { WorkingPerformanceInputForm } from "./working-performance-input-form"
import { hasPermission } from "@/lib/role-config"

const teams = [
  { id: "rebellion", name: "Rebellion" },
  { id: "phoenix", name: "Phoenix" },
  { id: "vanguard", name: "Vanguard" },
]

const players = [
  { id: "1", name: "ShadowStrike", teamId: "rebellion" },
  { id: "2", name: "RebelSniper", teamId: "rebellion" },
  { id: "3", name: "StormRider", teamId: "rebellion" },
  { id: "4", name: "PhantomEdge", teamId: "rebellion" },
  { id: "5", name: "PhoenixRise", teamId: "phoenix" },
  { id: "6", name: "FireStorm", teamId: "phoenix" },
  { id: "7", name: "VanguardLead", teamId: "vanguard" },
  { id: "8", name: "SteelShot", teamId: "vanguard" },
]

const performanceData = [
  {
    match: "Match 1",
    kills: 18,
    placement: 2,
    damage: 2400,
    team: "rebellion",
    slot: "A1",
    matchNumber: 1,
    map: "Erangel",
  },
  {
    match: "Match 2",
    kills: 22,
    placement: 1,
    damage: 2800,
    team: "rebellion",
    slot: "A1",
    matchNumber: 2,
    map: "Miramar",
  },
  {
    match: "Match 3",
    kills: 15,
    placement: 4,
    damage: 2100,
    team: "phoenix",
    slot: "B2",
    matchNumber: 1,
    map: "Sanhok",
  },
  {
    match: "Match 4",
    kills: 19,
    placement: 3,
    damage: 2600,
    team: "vanguard",
    slot: "C1",
    matchNumber: 1,
    map: "Vikendi",
  },
  {
    match: "Match 5",
    kills: 24,
    placement: 1,
    damage: 3200,
    team: "rebellion",
    slot: "A1",
    matchNumber: 3,
    map: "Erangel",
  },
]

const playerStats = [
  {
    name: "ShadowStrike",
    kills: 847,
    damage: 124500,
    winRate: 84,
    kd: 2.8,
    teamId: "rebellion",
    totalMatches: 45,
    avgSurvival: "18:30",
    placement: 2.1,
    highestDamage: 3850,
    mostKills: 28,
  },
  {
    name: "RebelSniper",
    kills: 723,
    damage: 98600,
    winRate: 79,
    kd: 2.4,
    teamId: "rebellion",
    totalMatches: 42,
    avgSurvival: "16:45",
    placement: 2.3,
    highestDamage: 3200,
    mostKills: 24,
  },
  {
    name: "VanguardLead",
    kills: 892,
    damage: 135600,
    winRate: 85,
    kd: 3.1,
    teamId: "vanguard",
    totalMatches: 48,
    avgSurvival: "19:20",
    placement: 1.8,
    highestDamage: 4100,
    mostKills: 31,
  },
]

export function EnhancedPerformanceModule() {
  const { user } = useAuth()
  const [showInputForm, setShowInputForm] = useState(false)
  const [inputMethod, setInputMethod] = useState<"table" | "ocr">("table")
  const [selectedTeam, setSelectedTeam] = useState<string>("all")
  const [selectedPlayer, setSelectedPlayer] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("all")

  const canEdit = useMemo(() => {
    return hasPermission(user?.role as any, "canEditPerformance")
  }, [user?.role])

  const canViewAll = useMemo(() => {
    return hasPermission(user?.role as any, "canViewAllTeams")
  }, [user?.role])

  // Filter data based on selections and user permissions
  const filteredPerformanceData = useMemo(() => {
    let data = performanceData

    // If user can only view own data, filter to their team/data
    if (!canViewAll && user?.role === "player") {
      data = data.filter((match) => match.team === user?.team || match.team === "rebellion") // Mock user team
    }

    if (selectedTeam !== "all") {
      data = data.filter((match) => match.team === selectedTeam)
    }

    return data
  }, [selectedTeam, canViewAll, user])

  const filteredPlayerStats = useMemo(() => {
    let data = playerStats

    // If user can only view own data, filter to their data
    if (!canViewAll && user?.role === "player") {
      data = data.filter((player) => player.name === user?.name || player.name === "ShadowStrike") // Mock user
    }

    if (selectedTeam !== "all") {
      data = data.filter((player) => player.teamId === selectedTeam)
    }
    if (selectedPlayer !== "all") {
      data = data.filter((player) => player.name === selectedPlayer)
    }

    return data
  }, [selectedTeam, selectedPlayer, canViewAll, user])

  const availablePlayers = useMemo(() => {
    let data = players

    if (!canViewAll && user?.role === "player") {
      data = data.filter((player) => player.name === user?.name || player.name === "ShadowStrike")
    }

    return data.filter((player) => selectedTeam === "all" || player.teamId === selectedTeam)
  }, [selectedTeam, canViewAll, user])

  // Calculate aggregated metrics
  const aggregatedMetrics = useMemo(() => {
    const data = filteredPlayerStats
    if (data.length === 0)
      return { avgKD: 0, avgPlacement: 0, totalDamage: 0, winRate: 0, highestDamage: 0, mostKills: 0 }

    return {
      avgKD: (data.reduce((sum, p) => sum + p.kd, 0) / data.length).toFixed(1),
      avgPlacement: (data.reduce((sum, p) => sum + p.placement, 0) / data.length).toFixed(1),
      totalDamage: Math.round(data.reduce((sum, p) => sum + p.damage, 0) / 1000),
      winRate: Math.round(data.reduce((sum, p) => sum + p.winRate, 0) / data.length),
      highestDamage: Math.max(...data.map((p) => p.highestDamage)),
      mostKills: Math.max(...data.map((p) => p.mostKills)),
    }
  }, [filteredPlayerStats])

  const handleShowInputForm = (method: "table" | "ocr") => {
    setInputMethod(method)
    setShowInputForm(true)
  }

  const handleCloseInputForm = () => setShowInputForm(false)

  const handleSavePerformance = (data: any) => {
    console.log("Performance data saved:", data)
    setShowInputForm(false)
  }

  return (
    <div className="dashboard-container">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Performance Analytics</h1>
              <p className="text-muted-foreground">Track team and individual player performance metrics</p>
            </div>
          </div>
          {canEdit && (
            <div className="flex space-x-2">
              <Button onClick={() => handleShowInputForm("table")} className="dashboard-button">
                <Table className="w-4 h-4 mr-2" />
                Manual Entry
              </Button>
              <Button onClick={() => handleShowInputForm("ocr")} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Screenshot
              </Button>
            </div>
          )}
        </div>

        {/* Enhanced Filters */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Performance Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {canViewAll && (
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">Team</label>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger className="dashboard-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="all" className="text-foreground">
                        All Teams
                      </SelectItem>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id} className="text-foreground">
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Player</label>
                <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                  <SelectTrigger className="dashboard-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all" className="text-foreground">
                      All Players
                    </SelectItem>
                    {availablePlayers.map((player) => (
                      <SelectItem key={player.id} value={player.name} className="text-foreground">
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="dashboard-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all" className="text-foreground">
                      All Time
                    </SelectItem>
                    <SelectItem value="today" className="text-foreground">
                      Today
                    </SelectItem>
                    <SelectItem value="week" className="text-foreground">
                      This Week
                    </SelectItem>
                    <SelectItem value="month" className="text-foreground">
                      This Month
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTeam("all")
                    setSelectedPlayer("all")
                    setDateRange("all")
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview with Chart Value Labels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg K/D Ratio</CardTitle>
              <Target className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{aggregatedMetrics.avgKD}</div>
              <p className="text-xs text-green-400">
                {selectedTeam !== "all" ? `Team: ${teams.find((t) => t.id === selectedTeam)?.name}` : "All Teams"}
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Placement</CardTitle>
              <Trophy className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">#{aggregatedMetrics.avgPlacement}</div>
              <p className="text-xs text-green-400">
                {filteredPlayerStats.length} player{filteredPlayerStats.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Damage</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{aggregatedMetrics.totalDamage}K</div>
              <p className="text-xs text-green-400">Combined damage</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{aggregatedMetrics.winRate}%</div>
              <p className="text-xs text-green-400">Average win rate</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Highest Damage</CardTitle>
              <Zap className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{aggregatedMetrics.highestDamage}</div>
              <p className="text-xs text-green-400">Single match</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Most Kills</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{aggregatedMetrics.mostKills}</div>
              <p className="text-xs text-green-400">Single match</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts with Value Labels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-foreground">Match Performance Trend</CardTitle>
              <CardDescription className="text-muted-foreground">
                {selectedTeam !== "all"
                  ? `${teams.find((t) => t.id === selectedTeam)?.name} Team Performance`
                  : "All Teams Performance"}
              </CardDescription>
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
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="match" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="kills" stroke="var(--color-kills)" strokeWidth={2}>
                      <LabelList dataKey="kills" position="top" />
                    </Line>
                    <Line type="monotone" dataKey="placement" stroke="var(--color-placement)" strokeWidth={2}>
                      <LabelList dataKey="placement" position="bottom" formatter={(value: number) => `#${value}`} />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-foreground">Player Statistics</CardTitle>
              <CardDescription className="text-muted-foreground">
                Individual player performance comparison
              </CardDescription>
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
                  <BarChart data={filteredPlayerStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
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
        </div>

        {/* Detailed Player Stats */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-foreground">Detailed Player Statistics</CardTitle>
            <CardDescription className="text-muted-foreground">
              Comprehensive performance breakdown
              {selectedTeam !== "all" && ` - ${teams.find((t) => t.id === selectedTeam)?.name} Team`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPlayerStats.map((player, index) => (
                <div
                  key={`${player.name}-${index}`}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">{player.name.slice(0, 2)}</span>
                    </div>
                    <div>
                      <h4 className="text-foreground font-medium">{player.name}</h4>
                      <p className="text-muted-foreground text-sm">
                        {teams.find((t) => t.id === player.teamId)?.name} Team
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-8">
                    <div className="grid grid-cols-6 gap-6 text-center">
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
                        <div className="text-muted-foreground text-sm">K/D Ratio</div>
                      </div>
                      <div>
                        <div className="text-blue-400 font-bold">{player.highestDamage}</div>
                        <div className="text-muted-foreground text-sm">Best Damage</div>
                      </div>
                      <div>
                        <div className="text-purple-400 font-bold">{player.mostKills}</div>
                        <div className="text-muted-foreground text-sm">Best Kills</div>
                      </div>
                    </div>
                    {canEdit && (
                      <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/20">
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Input Form */}
        {showInputForm && (
          <WorkingPerformanceInputForm
            onClose={handleCloseInputForm}
            onSave={handleSavePerformance}
            inputMethod={inputMethod}
            userRole={user?.role}
            userName={user?.name}
            userTeam={user?.team || "Rebellion"}
          />
        )}
      </div>
    </div>
  )
}
