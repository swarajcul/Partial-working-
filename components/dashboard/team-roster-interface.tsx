"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Download,
  Users,
  Bell,
  Star,
  Target,
  Shield,
  Crosshair,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  UserPlus,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NoPlayersEmptyState, NoSearchResultsEmptyState } from "@/components/empty-states/module-empty-states"
import { PlayerFormModal } from "@/components/forms/player-form-modal"

interface Player {
  id: string
  name: string
  role: "Assaulter" | "Sniper" | "Support"
  specialization: string
  kdRatio: number
  rank: number
  avatar: string
  matchesPlayed: number
  winRate: number
  status: "Active" | "Inactive" | "Benched"
  joinDate: string
  lastActive: string
}

const mockPlayers: Player[] = [
  {
    id: "1",
    name: "ShadowStrike",
    role: "Assaulter",
    specialization: "Entry Fragger",
    kdRatio: 2.8,
    rank: 5,
    avatar: "/placeholder.svg?height=60&width=60",
    matchesPlayed: 156,
    winRate: 84,
    status: "Active",
    joinDate: "2024-01-15",
    lastActive: "2024-12-24",
  },
  {
    id: "2",
    name: "RebelSniper",
    role: "Sniper",
    specialization: "Long Range",
    kdRatio: 3.2,
    rank: 5,
    avatar: "/placeholder.svg?height=60&width=60",
    matchesPlayed: 142,
    winRate: 79,
    status: "Active",
    joinDate: "2024-02-01",
    lastActive: "2024-12-24",
  },
  {
    id: "3",
    name: "StormRider",
    role: "Assaulter",
    specialization: "Flanker",
    kdRatio: 2.1,
    rank: 4,
    avatar: "/placeholder.svg?height=60&width=60",
    matchesPlayed: 134,
    winRate: 76,
    status: "Active",
    joinDate: "2024-01-20",
    lastActive: "2024-12-23",
  },
  {
    id: "4",
    name: "PhantomEdge",
    role: "Support",
    specialization: "Medic",
    kdRatio: 1.8,
    rank: 4,
    avatar: "/placeholder.svg?height=60&width=60",
    matchesPlayed: 128,
    winRate: 81,
    status: "Benched",
    joinDate: "2024-03-10",
    lastActive: "2024-12-20",
  },
  {
    id: "5",
    name: "PhoenixRise",
    role: "Assaulter",
    specialization: "IGL",
    kdRatio: 2.4,
    rank: 4,
    avatar: "/placeholder.svg?height=60&width=60",
    matchesPlayed: 145,
    winRate: 68,
    status: "Active",
    joinDate: "2024-02-15",
    lastActive: "2024-12-24",
  },
]

const roleIcons = {
  Assaulter: Target,
  Sniper: Crosshair,
  Support: Shield,
}

const statusColors = {
  Active: "bg-green-500",
  Inactive: "bg-red-500",
  Benched: "bg-yellow-500",
}

export function TeamRosterInterface() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("All")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [kdRange, setKdRange] = useState([0, 5])
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showPlayerForm, setShowPlayerForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const playersPerPage = 10

  const filteredPlayers = useMemo(() => {
    return mockPlayers.filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === "All" || player.role === roleFilter
      const matchesStatus = statusFilter === "All" || player.status === statusFilter
      const matchesKD = player.kdRatio >= kdRange[0] && player.kdRatio <= kdRange[1]

      return matchesSearch && matchesRole && matchesStatus && matchesKD
    })
  }, [searchTerm, roleFilter, statusFilter, kdRange])

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage)
  const startIndex = (currentPage - 1) * playersPerPage
  const paginatedPlayers = filteredPlayers.slice(startIndex, startIndex + playersPerPage)

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayers((prev) => (prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]))
  }

  const handleSelectAll = () => {
    if (selectedPlayers.length === paginatedPlayers.length && paginatedPlayers.length > 0) {
      setSelectedPlayers([])
    } else {
      setSelectedPlayers(paginatedPlayers.map((p) => p.id))
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setRoleFilter("All")
    setStatusFilter("All")
    setKdRange([0, 5])
    setCurrentPage(1)
  }

  const handleAddPlayer = () => {
    setEditingPlayer(null)
    setShowPlayerForm(true)
  }

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player)
    setShowPlayerForm(true)
  }

  const getKDColor = (kd: number) => {
    if (kd >= 2.5) return "text-green-400"
    if (kd >= 1.5) return "text-yellow-400"
    return "text-red-400"
  }

  const renderStars = (rank: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < rank ? "text-yellow-400 fill-current" : "text-gray-600"}`} />
    ))
  }

  const activeFiltersCount = [
    searchTerm !== "",
    roleFilter !== "All",
    statusFilter !== "All",
    kdRange[0] !== 0 || kdRange[1] !== 5,
  ].filter(Boolean).length

  // Show empty state if no players exist at all
  if (mockPlayers.length === 0) {
    return (
      <div className="space-y-6 bg-background min-h-screen p-6 transition-colors duration-300">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold">Team Roster</h1>
            <p className="text-muted-foreground">Manage your esports team members</p>
          </div>
        </div>
        <NoPlayersEmptyState onAction={handleAddPlayer} />
        <PlayerFormModal isOpen={showPlayerForm} onClose={() => setShowPlayerForm(false)} player={editingPlayer} />
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-background min-h-screen p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold">Team Roster</h1>
            <p className="text-muted-foreground">Manage your esports team members</p>
          </div>
        </div>
        <Button onClick={handleAddPlayer} className="bg-orange-600 hover:bg-orange-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Player
        </Button>
      </div>

      {/* Sticky Search and Filter Bar */}
      <Card className="sticky top-0 z-10 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            {/* Search and Filter Toggle */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search players by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 bg-orange-600 text-white text-xs">{activeFiltersCount}</Badge>
                  )}
                </Button>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row gap-4 pt-4 border-t">
                    {/* Role Filter */}
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Roles</SelectItem>
                        <SelectItem value="Assaulter">Assaulter</SelectItem>
                        <SelectItem value="Sniper">Sniper</SelectItem>
                        <SelectItem value="Support">Support</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Benched">Benched</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* K/D Range Slider */}
                    <div className="flex items-center space-x-4 min-w-64">
                      <span className="text-sm whitespace-nowrap">K/D Ratio:</span>
                      <Slider
                        value={kdRange}
                        onValueChange={setKdRange}
                        max={5}
                        min={0}
                        step={0.1}
                        className="flex-1"
                      />
                      <span className="text-sm whitespace-nowrap text-muted-foreground">
                        {kdRange[0].toFixed(1)}-{kdRange[1].toFixed(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Toolbar */}
      <AnimatePresence>
        {selectedPlayers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-orange-600 border-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">
                    {selectedPlayers.length} player{selectedPlayers.length !== 1 ? "s" : ""} selected
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export Selected
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      Assign to Match
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Bell className="w-4 h-4 mr-2" />
                      Send Notification
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Bulk Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Cards Grid or Empty State */}
      {paginatedPlayers.length > 0 ? (
        <>
          {/* Select All Checkbox */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedPlayers.length === paginatedPlayers.length && paginatedPlayers.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm">Select All ({paginatedPlayers.length})</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + playersPerPage, filteredPlayers.length)} of{" "}
              {filteredPlayers.length} players
            </p>
          </div>

          {/* Player Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {paginatedPlayers.map((player, index) => {
                const RoleIcon = roleIcons[player.role]
                const isSelected = selectedPlayers.includes(player.id)

                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <Card
                      className={`
                        relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105
                        ${isSelected ? "ring-2 ring-orange-600 shadow-lg" : ""}
                      `}
                      style={{ width: "200px", height: "120px" }}
                      onClick={() => handlePlayerSelect(player.id)}
                    >
                      <CardContent className="p-3 h-full flex flex-col">
                        {/* Header with Checkbox and Status */}
                        <div className="flex items-start justify-between mb-2">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handlePlayerSelect(player.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${statusColors[player.status]}`} />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditPlayer(player)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Player
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Users className="w-4 h-4 mr-2" />
                                  Assign to Match
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Player Info */}
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                            <AvatarFallback className="bg-orange-600 text-white text-xs">
                              {player.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{player.name}</h3>
                            <div className="flex items-center space-x-1">
                              <RoleIcon className="w-3 h-3 text-orange-500" />
                              <span className="text-xs text-muted-foreground truncate">{player.specialization}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stats and Rank */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center space-x-1">{renderStars(player.rank)}</div>
                          <div className="text-right">
                            <div className={`font-bold text-sm ${getKDColor(player.kdRatio)}`}>
                              {player.kdRatio.toFixed(1)}
                            </div>
                            <div className="text-xs text-muted-foreground">K/D</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={currentPage === pageNum ? "bg-orange-600 hover:bg-orange-700" : ""}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        /* No Search Results Empty State */
        <NoSearchResultsEmptyState onAction={clearFilters} searchTerm={searchTerm} />
      )}

      {/* Player Form Modal */}
      <PlayerFormModal isOpen={showPlayerForm} onClose={() => setShowPlayerForm(false)} player={editingPlayer} />
    </div>
  )
}
