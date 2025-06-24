"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Users, Plus, Edit, Trash2, Settings, Trophy, Target } from "lucide-react"

const teams = [
  {
    id: "rebellion",
    name: "Rebellion",
    tier: "Tier 1",
    members: 4,
    coach: "Mike Coach",
    assignedSlots: ["A1", "A2"],
    winRate: 78,
    totalMatches: 156,
    players: [
      { id: "1", name: "ShadowStrike", role: "IGL", status: "Active" },
      { id: "2", name: "RebelSniper", role: "Sniper", status: "Active" },
      { id: "3", name: "StormRider", role: "Assault", status: "Active" },
      { id: "4", name: "PhantomEdge", role: "Support", status: "Benched" },
    ],
  },
  {
    id: "phoenix",
    name: "Phoenix",
    tier: "Tier 2",
    members: 4,
    coach: "Sarah Phoenix",
    assignedSlots: ["B1", "B2"],
    winRate: 65,
    totalMatches: 134,
    players: [
      { id: "5", name: "PhoenixRise", role: "IGL", status: "Active" },
      { id: "6", name: "FireStorm", role: "Sniper", status: "Active" },
      { id: "7", name: "BlazeFury", role: "Assault", status: "Active" },
      { id: "8", name: "EmberWing", role: "Support", status: "Active" },
    ],
  },
  {
    id: "vanguard",
    name: "Vanguard",
    tier: "Tier 1",
    members: 4,
    coach: "Alex Vanguard",
    assignedSlots: ["C1"],
    winRate: 82,
    totalMatches: 142,
    players: [
      { id: "9", name: "VanguardLead", role: "IGL", status: "Active" },
      { id: "10", name: "SteelShot", role: "Sniper", status: "Active" },
      { id: "11", name: "IronFist", role: "Assault", status: "Active" },
      { id: "12", name: "GuardianShield", role: "Support", status: "Active" },
    ],
  },
]

export function TeamManagement() {
  const [selectedTeam, setSelectedTeam] = useState(teams[0])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-white">Team Management</h1>
            <p className="text-gray-400">Create, edit, and manage your esports teams</p>
          </div>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
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
            <div className="text-2xl font-bold text-white">{selectedTeam.winRate}%</div>
            <p className="text-xs text-gray-400">{selectedTeam.totalMatches} matches</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Team Members</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{selectedTeam.members}</div>
            <p className="text-xs text-gray-400">Active players</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Assigned Slots</CardTitle>
            <Target className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{selectedTeam.assignedSlots.length}</div>
            <p className="text-xs text-gray-400">{selectedTeam.assignedSlots.join(", ")}</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Team Tier</CardTitle>
            <Badge className="bg-orange-600 text-white">{selectedTeam.tier}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-white">{selectedTeam.tier}</div>
            <p className="text-xs text-gray-400">Competition level</p>
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
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
            </div>
            <CardDescription className="text-gray-400">Manage team members and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Coach */}
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
                  <Button size="sm" variant="ghost" className="text-orange-500 hover:bg-orange-600/20">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Players */}
              {selectedTeam.players.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
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
                  <div className="flex items-center space-x-2">
                    <Badge className={player.status === "Active" ? "bg-green-600" : "bg-yellow-600"}>
                      {player.status}
                    </Badge>
                    <Button size="sm" variant="ghost" className="text-orange-500 hover:bg-orange-600/20">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-600/20">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Team Settings
            </CardTitle>
            <CardDescription className="text-gray-400">Configure team details and assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Team Name</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{selectedTeam.name}</span>
                  <Button size="sm" variant="ghost" className="text-orange-500 hover:bg-orange-600/20">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white">Competition Tier</span>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-orange-600 text-white">{selectedTeam.tier}</Badge>
                  <Button size="sm" variant="ghost" className="text-orange-500 hover:bg-orange-600/20">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white">Assigned Slots</span>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {selectedTeam.assignedSlots.map((slot) => (
                      <Badge key={slot} variant="secondary" className="bg-gray-700 text-gray-300">
                        {slot}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" variant="ghost" className="text-orange-500 hover:bg-orange-600/20">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white">Coach</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{selectedTeam.coach}</span>
                  <Button size="sm" variant="ghost" className="text-orange-500 hover:bg-orange-600/20">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700 space-y-3">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">Save Changes</Button>
              <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                Export Team Data
              </Button>
              <Button className="w-full bg-red-600 hover:bg-red-700">Disband Team</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
