"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth/auth-provider"
import { Users, Trophy, Target, Plus, Edit } from "lucide-react"

const teams = [
  {
    id: "rebellion",
    name: "Rebellion",
    tier: "Tier 1",
    members: 4,
    winRate: "78%",
    totalMatches: 156,
    wins: 122,
    losses: 34,
    avgPlacement: 2.3,
    totalKills: 2847,
    coach: "Mike Coach",
    players: [
      { name: "ShadowStrike", role: "IGL", kills: 847, winRate: "84%" },
      { name: "RebelSniper", role: "Sniper", kills: 723, winRate: "79%" },
      { name: "StormRider", role: "Assault", kills: 692, winRate: "76%" },
      { name: "PhantomEdge", role: "Support", kills: 585, winRate: "81%" },
    ],
  },
  {
    id: "phoenix",
    name: "Phoenix",
    tier: "Tier 2",
    members: 4,
    winRate: "65%",
    totalMatches: 134,
    wins: 87,
    losses: 47,
    avgPlacement: 3.1,
    totalKills: 2156,
    coach: "Sarah Phoenix",
    players: [
      { name: "PhoenixRise", role: "IGL", kills: 634, winRate: "68%" },
      { name: "FireStorm", role: "Sniper", kills: 587, winRate: "62%" },
      { name: "BlazeFury", role: "Assault", kills: 523, winRate: "67%" },
      { name: "EmberWing", role: "Support", kills: 412, winRate: "63%" },
    ],
  },
  {
    id: "vanguard",
    name: "Vanguard",
    tier: "Tier 1",
    members: 4,
    winRate: "82%",
    totalMatches: 142,
    wins: 116,
    losses: 26,
    avgPlacement: 2.1,
    totalKills: 3124,
    coach: "Alex Vanguard",
    players: [
      { name: "VanguardLead", role: "IGL", kills: 892, winRate: "85%" },
      { name: "SteelShot", role: "Sniper", kills: 834, winRate: "83%" },
      { name: "IronFist", role: "Assault", kills: 756, winRate: "80%" },
      { name: "GuardianShield", role: "Support", kills: 642, winRate: "84%" },
    ],
  },
]

export function TeamInfo() {
  const { user } = useAuth()
  const [selectedTeam, setSelectedTeam] = useState(teams[0])

  const canEdit = user?.role === "admin" || user?.role === "manager"

  return (
    <div className="space-y-6 bg-purple-950 min-h-screen">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-white">Team Information</h1>
          <p className="text-gray-400">Manage team details, rosters, and performance</p>
        </div>
      </div>

      {/* Team Selection */}
      <div className="flex space-x-4">
        {teams.map((team) => (
          <Button
            key={team.id}
            variant={selectedTeam.id === team.id ? "default" : "outline"}
            onClick={() => setSelectedTeam(team)}
            className={
              selectedTeam.id === team.id
                ? "bg-orange-600 hover:bg-orange-700"
                : "border-gray-600 text-white hover:bg-gray-800"
            }
          >
            {team.name}
          </Button>
        ))}
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Win Rate</CardTitle>
            <Trophy className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{selectedTeam.winRate}</div>
            <p className="text-xs text-gray-400">
              {selectedTeam.wins}W / {selectedTeam.losses}L
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Matches</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{selectedTeam.totalMatches}</div>
            <p className="text-xs text-gray-400">This season</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Placement</CardTitle>
            <Trophy className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{selectedTeam.avgPlacement}</div>
            <p className="text-xs text-gray-400">Out of 20 teams</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Kills</CardTitle>
            <Target className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{selectedTeam.totalKills}</div>
            <p className="text-xs text-gray-400">Team combined</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Team Roster
              </CardTitle>
              {canEdit && (
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Player
                </Button>
              )}
            </div>
            <CardDescription className="text-gray-400">Current active roster</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-blue-600 text-white">C</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-white font-medium">{selectedTeam.coach}</h4>
                    <p className="text-gray-400 text-sm">Coach</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-600 text-white">Coach</Badge>
                  {canEdit && (
                    <Button size="sm" variant="ghost" className="text-orange-500 hover:bg-orange-600/20">
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {selectedTeam.players.map((player, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback className="bg-orange-600 text-white">{player.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-white font-medium">{player.name}</h4>
                      <p className="text-gray-400 text-sm">{player.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-white font-medium">{player.kills} kills</div>
                      <div className="text-green-400 text-sm">{player.winRate} WR</div>
                    </div>
                    {canEdit && (
                      <Button size="sm" variant="ghost" className="text-orange-500 hover:bg-orange-600/20">
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader>
            <CardTitle className="text-white">Team Settings</CardTitle>
            <CardDescription className="text-gray-400">Manage team configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white">Team Name</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{selectedTeam.name}</span>
                  {canEdit && (
                    <Button size="sm" variant="ghost" className="text-orange-500 hover:bg-orange-600/20">
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Tier</span>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-orange-600 text-white">{selectedTeam.tier}</Badge>
                  {canEdit && (
                    <Button size="sm" variant="ghost" className="text-orange-500 hover:bg-orange-600/20">
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Coach</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{selectedTeam.coach}</span>
                  {canEdit && (
                    <Button size="sm" variant="ghost" className="text-orange-500 hover:bg-orange-600/20">
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {canEdit && (
              <div className="pt-4 border-t border-gray-700">
                <Button className="w-full bg-red-600 hover:bg-red-700">Disband Team</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
