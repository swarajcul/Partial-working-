"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Download, TrendingUp, Target, Users, Trophy, Loader2 } from "lucide-react"
import { NoStatsEmptyState, LoadingEmptyState } from "@/components/empty-states/module-empty-states"

const winRateData = [
  { name: "Wins", value: 78, color: "#ea580c" },
  { name: "Losses", value: 22, color: "#6b7280" },
]

const headshotData = [
  { player: "ShadowStrike", percentage: 45 },
  { player: "RebelSniper", percentage: 62 },
  { player: "StormRider", percentage: 38 },
  { player: "PhantomEdge", percentage: 28 },
  { player: "PhoenixRise", percentage: 41 },
]

const survivalHeatmap = [
  { zone: "Zone 1", survival: 95 },
  { zone: "Zone 2", survival: 88 },
  { zone: "Zone 3", survival: 76 },
  { zone: "Zone 4", survival: 62 },
  { zone: "Zone 5", survival: 45 },
  { zone: "Zone 6", survival: 28 },
]

const teamComparisonData = [
  { metric: "Damage", teamA: 85, teamB: 72 },
  { metric: "Positioning", teamA: 78, teamB: 88 },
  { metric: "Utility", teamA: 92, teamB: 65 },
  { metric: "Communication", teamA: 88, teamB: 82 },
  { metric: "Strategy", teamA: 75, teamB: 90 },
  { metric: "Clutch", teamA: 82, teamB: 76 },
]

const performanceTrend = [
  { match: 1, player1: 2.1, player2: 1.8, player3: 2.4, player4: 1.6 },
  { match: 2, player1: 2.3, player2: 2.1, player3: 2.2, player4: 1.9 },
  { match: 3, player1: 1.9, player2: 2.4, player3: 2.6, player4: 2.1 },
  { match: 4, player1: 2.8, player2: 2.2, player3: 2.1, player4: 1.8 },
  { match: 5, player1: 2.4, player2: 2.6, player3: 2.8, player4: 2.3 },
  { match: 6, player1: 2.6, player2: 2.1, player3: 2.4, player4: 2.0 },
  { match: 7, player1: 2.2, player2: 2.8, player3: 2.3, player4: 2.4 },
  { match: 8, player1: 2.9, player2: 2.4, player3: 2.7, player4: 2.1 },
  { match: 9, player1: 2.5, player2: 2.7, player3: 2.5, player4: 2.6 },
  { match: 10, player1: 2.8, player2: 2.3, player3: 2.9, player4: 2.2 },
]

export function StatisticsVisualization() {
  const [activeTab, setActiveTab] = useState("overall")
  const [isLoading, setIsLoading] = useState(false)
  const [exportFormat, setExportFormat] = useState<string | null>(null)
  const [hasData, setHasData] = useState(true) // Toggle this to test empty state

  const handleExport = async (format: "PNG" | "CSV" | "PDF") => {
    setExportFormat(format)
    setIsLoading(true)

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log(`Exporting as ${format}`)
    setIsLoading(false)
    setExportFormat(null)
  }

  const handleRecordMatch = () => {
    console.log("Navigate to match recording")
    // This would typically navigate to a match recording form
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-gray-300">
              {entry.name}: <span style={{ color: entry.color }}>{entry.value}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Show loading state
  if (isLoading && !hasData) {
    return (
      <div className="space-y-6 bg-purple-950 min-h-screen p-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-white">Statistics Dashboard</h1>
            <p className="text-gray-400">Comprehensive data visualization and analytics</p>
          </div>
        </div>
        <LoadingEmptyState />
      </div>
    )
  }

  // Show empty state if no data
  if (!hasData) {
    return (
      <div className="space-y-6 bg-purple-950 min-h-screen p-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-white">Statistics Dashboard</h1>
            <p className="text-gray-400">Comprehensive data visualization and analytics</p>
          </div>
        </div>
        <NoStatsEmptyState onAction={handleRecordMatch} />
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-purple-950 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-white">Statistics Dashboard</h1>
            <p className="text-gray-400">Comprehensive data visualization and analytics</p>
          </div>
        </div>

        {/* Export Controls */}
        <div className="flex space-x-2">
          <Button
            onClick={() => handleExport("PNG")}
            disabled={isLoading}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800"
          >
            {isLoading && exportFormat === "PNG" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            PNG
          </Button>
          <Button
            onClick={() => handleExport("CSV")}
            disabled={isLoading}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800"
          >
            {isLoading && exportFormat === "CSV" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            CSV
          </Button>
          <Button
            onClick={() => handleExport("PDF")}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isLoading && exportFormat === "PDF" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Win Rate</CardTitle>
            <Trophy className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">78.5%</div>
            <p className="text-xs text-green-400">+3.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg K/D</CardTitle>
            <Target className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.34</div>
            <p className="text-xs text-green-400">+0.15 improvement</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Headshot %</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">42.8%</div>
            <p className="text-xs text-green-400">+2.1% accuracy</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Players</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-gray-400">Across all teams</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-900 border border-orange-600/20">
          <TabsTrigger value="overall" className="data-[state=active]:bg-orange-600">
            Overall Stats
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-orange-600">
            Team Analysis
          </TabsTrigger>
          <TabsTrigger value="player" className="data-[state=active]:bg-orange-600">
            Player Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Win Rate Donut Chart */}
            <Card className="bg-gray-900 border-orange-600/20">
              <CardHeader>
                <CardTitle className="text-white">Win Rate Distribution</CardTitle>
                <CardDescription className="text-gray-400">Overall team performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    wins: { label: "Wins", color: "#ea580c" },
                    losses: { label: "Losses", color: "#6b7280" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={winRateData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {winRateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Headshot Percentage Bar Chart */}
            <Card className="bg-gray-900 border-orange-600/20">
              <CardHeader>
                <CardTitle className="text-white">Headshot Accuracy</CardTitle>
                <CardDescription className="text-gray-400">Player headshot percentages</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    percentage: { label: "Headshot %", color: "#ea580c" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={headshotData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="player" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="percentage" fill="#ea580c" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Survival Heatmap */}
          <Card className="bg-gray-900 border-orange-600/20">
            <CardHeader>
              <CardTitle className="text-white">Zone Survival Rate</CardTitle>
              <CardDescription className="text-gray-400">Team survival percentage by zone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {survivalHeatmap.map((zone, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="h-16 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{
                        backgroundColor: `rgba(234, 88, 12, ${zone.survival / 100})`,
                        border: "1px solid rgba(234, 88, 12, 0.3)",
                      }}
                    >
                      {zone.survival}%
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{zone.zone}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          {/* Team vs Team Radar Chart */}
          <Card className="bg-gray-900 border-orange-600/20">
            <CardHeader>
              <CardTitle className="text-white">Team Comparison Analysis</CardTitle>
              <CardDescription className="text-gray-400">Rebellion vs Phoenix performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  teamA: { label: "Rebellion", color: "#ea580c" },
                  teamB: { label: "Phoenix", color: "#6366f1" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={teamComparisonData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Rebellion" dataKey="teamA" stroke="#ea580c" fill="#ea580c" fillOpacity={0.3} />
                    <Radar name="Phoenix" dataKey="teamB" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="player" className="space-y-6">
          {/* Player Performance Trend */}
          <Card className="bg-gray-900 border-orange-600/20">
            <CardHeader>
              <CardTitle className="text-white">Player Performance Trends</CardTitle>
              <CardDescription className="text-gray-400">K/D ratio over last 10 matches</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  player1: { label: "ShadowStrike", color: "#ea580c" },
                  player2: { label: "RebelSniper", color: "#6366f1" },
                  player3: { label: "StormRider", color: "#10b981" },
                  player4: { label: "PhantomEdge", color: "#f59e0b" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="match" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="player1" stroke="#ea580c" strokeWidth={2} />
                    <Line type="monotone" dataKey="player2" stroke="#6366f1" strokeWidth={2} />
                    <Line type="monotone" dataKey="player3" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="player4" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
