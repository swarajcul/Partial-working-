"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Users, Trophy, Target } from "lucide-react"

const monthlyData = [
  { month: "Jan", matches: 45, wins: 35, kills: 1247 },
  { month: "Feb", matches: 52, wins: 41, kills: 1456 },
  { month: "Mar", matches: 48, wins: 38, kills: 1389 },
  { month: "Apr", matches: 55, wins: 43, kills: 1523 },
  { month: "May", matches: 49, wins: 39, kills: 1401 },
  { month: "Jun", matches: 58, wins: 47, kills: 1678 },
]

const teamPerformance = [
  { name: "Rebellion", value: 35, color: "#dc2626" },
  { name: "Phoenix", value: 25, color: "#ea580c" },
  { name: "Vanguard", value: 40, color: "#d97706" },
]

const weaponStats = [
  { weapon: "AKM", kills: 456, percentage: 28 },
  { weapon: "M416", kills: 389, percentage: 24 },
  { weapon: "AWM", kills: 234, percentage: 14 },
  { weapon: "Kar98k", kills: 198, percentage: 12 },
  { weapon: "UMP45", kills: 167, percentage: 10 },
  { weapon: "Others", kills: 203, percentage: 12 },
]

export function AnalyticsModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400">Comprehensive performance analytics and insights</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Matches</CardTitle>
            <Trophy className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">307</div>
            <p className="text-xs text-green-400">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">78.5%</div>
            <p className="text-xs text-green-400">+3.2% improvement</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Kills</CardTitle>
            <Target className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8,694</div>
            <p className="text-xs text-green-400">+15% this season</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Players</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-gray-400">Across all teams</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader>
            <CardTitle className="text-white">Monthly Performance Trend</CardTitle>
            <CardDescription className="text-gray-400">Matches played and wins over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                matches: {
                  label: "Matches",
                  color: "hsl(var(--chart-1))",
                },
                wins: {
                  label: "Wins",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="matches" stroke="var(--color-matches)" strokeWidth={2} />
                  <Line type="monotone" dataKey="wins" stroke="var(--color-wins)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader>
            <CardTitle className="text-white">Team Performance Distribution</CardTitle>
            <CardDescription className="text-gray-400">Win percentage by team</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rebellion: {
                  label: "Rebellion",
                  color: "#dc2626",
                },
                phoenix: {
                  label: "Phoenix",
                  color: "#ea580c",
                },
                vanguard: {
                  label: "Vanguard",
                  color: "#d97706",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={teamPerformance}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {teamPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weapon Statistics */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">Weapon Usage Statistics</CardTitle>
          <CardDescription className="text-gray-400">Most used weapons and kill distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weaponStats.map((weapon, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{weapon.weapon.slice(0, 2)}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{weapon.weapon}</h4>
                    <p className="text-gray-400 text-sm">{weapon.kills} kills</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${weapon.percentage}%` }} />
                  </div>
                  <span className="text-white font-medium w-12 text-right">{weapon.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
