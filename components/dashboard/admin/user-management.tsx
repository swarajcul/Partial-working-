"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Search, UserPlus, Shield, Users, AlertTriangle } from "lucide-react"
import { UserRoleDialog } from "./user-role-dialog"
import { InviteUserDialog } from "./invite-user-dialog"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "coach" | "player" | null
  team?: string
  status: "active" | "pending" | "inactive"
  joinDate: string
  lastActive: string
}

export function UserManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Admin",
      email: "admin@raptorsesports.com",
      role: "admin",
      status: "active",
      joinDate: "2024-01-01",
      lastActive: "2024-01-15",
    },
    {
      id: "2",
      name: "Sarah Manager",
      email: "sarah@raptorsesports.com",
      role: "manager",
      status: "active",
      joinDate: "2024-01-05",
      lastActive: "2024-01-15",
    },
    {
      id: "3",
      name: "Mike Coach",
      email: "mike@raptorsesports.com",
      role: "coach",
      team: "Rebellion",
      status: "active",
      joinDate: "2024-01-10",
      lastActive: "2024-01-14",
    },
    {
      id: "4",
      name: "Alex Player",
      email: "alex@raptorsesports.com",
      role: "player",
      team: "Rebellion",
      status: "active",
      joinDate: "2024-01-12",
      lastActive: "2024-01-15",
    },
    {
      id: "5",
      name: "New User",
      email: "newuser@example.com",
      role: null,
      status: "pending",
      joinDate: "2024-01-15",
      lastActive: "2024-01-15",
    },
  ])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter || (roleFilter === "unassigned" && !user.role)
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleRoleUpdate = (userId: string, newRole: string, team?: string) => {
    setUsers(
      users.map((user) => (user.id === userId ? { ...user, role: newRole as any, team, status: "active" } : user)),
    )
    toast({
      title: "Role updated",
      description: `User role has been updated successfully.`,
    })
  }

  const handleStatusChange = (userId: string, newStatus: "active" | "inactive") => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
    toast({
      title: "Status updated",
      description: `User status changed to ${newStatus}.`,
    })
  }

  const unassignedCount = users.filter((u) => !u.role).length
  const activeCount = users.filter((u) => u.status === "active").length
  const pendingCount = users.filter((u) => u.status === "pending").length

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{users.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Unassigned</CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{unassignedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">User Management</CardTitle>
              <CardDescription className="text-gray-400">
                Manage user roles, teams, and access permissions
              </CardDescription>
            </div>
            <Button onClick={() => setShowInviteDialog(true)} className="bg-orange-600 hover:bg-orange-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">
                  All Roles
                </SelectItem>
                <SelectItem value="admin" className="text-white">
                  Admin
                </SelectItem>
                <SelectItem value="manager" className="text-white">
                  Manager
                </SelectItem>
                <SelectItem value="coach" className="text-white">
                  Coach
                </SelectItem>
                <SelectItem value="player" className="text-white">
                  Player
                </SelectItem>
                <SelectItem value="unassigned" className="text-white">
                  Unassigned
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">
                  All Status
                </SelectItem>
                <SelectItem value="active" className="text-white">
                  Active
                </SelectItem>
                <SelectItem value="pending" className="text-white">
                  Pending
                </SelectItem>
                <SelectItem value="inactive" className="text-white">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-red-600 text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-white font-medium">{user.name}</h4>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    {user.team && <p className="text-gray-400 text-sm">Team: {user.team}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex space-x-2 mb-1">
                      {user.role ? (
                        <Badge variant="secondary" className="bg-orange-600 text-white capitalize">
                          {user.role}
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-600 text-white">
                          Unassigned
                        </Badge>
                      )}
                      <Badge
                        variant={
                          user.status === "active" ? "default" : user.status === "pending" ? "secondary" : "destructive"
                        }
                        className={
                          user.status === "active"
                            ? "bg-green-600"
                            : user.status === "pending"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">Joined: {user.joinDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedUser(user)
                        setShowRoleDialog(true)
                      }}
                      className="text-orange-500 hover:bg-orange-600/20"
                    >
                      Edit Role
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatusChange(user.id, user.status === "active" ? "inactive" : "active")}
                      className={
                        user.status === "active"
                          ? "text-red-500 hover:bg-red-600/20"
                          : "text-green-500 hover:bg-green-600/20"
                      }
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      {showRoleDialog && selectedUser && (
        <UserRoleDialog
          user={selectedUser}
          onClose={() => {
            setShowRoleDialog(false)
            setSelectedUser(null)
          }}
          onSave={handleRoleUpdate}
        />
      )}

      {showInviteDialog && (
        <InviteUserDialog
          onClose={() => setShowInviteDialog(false)}
          onInvite={(email, role, team) => {
            const newUser: User = {
              id: Date.now().toString(),
              name: email.split("@")[0],
              email,
              role: role as any,
              team,
              status: "pending",
              joinDate: new Date().toISOString().split("T")[0],
              lastActive: new Date().toISOString().split("T")[0],
            }
            setUsers([...users, newUser])
            toast({
              title: "Invitation sent",
              description: `Invitation sent to ${email}`,
            })
          }}
        />
      )}
    </div>
  )
}
