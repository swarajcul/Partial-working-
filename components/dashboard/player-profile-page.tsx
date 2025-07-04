"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Lock, Upload, Save, Trophy, Monitor, Headphones, Mouse, Keyboard } from "lucide-react"

interface PlayerProfile {
  id: string
  ign: string
  realName: string
  playerId: string
  team: string
  role: string
  tier: string
  status: string
  profilePicture: string
  device: {
    monitor: string
    headset: string
    mouse: string
    keyboard: string
    mousepad: string
    dpi: string
    sensitivity: string
  }
  stats: {
    totalMatches: number
    winRate: number
    avgKills: number
    avgPlacement: number
  }
}

export function PlayerProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Mock player data - in real app, this would come from API
  const [profile, setProfile] = useState<PlayerProfile>({
    id: user?.id || "1",
    ign: "RaptorPlayer",
    realName: user?.name || "John Doe",
    playerId: "RP001",
    team: user?.team || "Raptors",
    role: "Assaulter",
    tier: "Tier 1",
    status: "Active",
    profilePicture: "/placeholder.svg?height=120&width=120",
    device: {
      monitor: "ASUS ROG Swift PG259QN",
      headset: "SteelSeries Arctis Pro",
      mouse: "Logitech G Pro X Superlight",
      keyboard: "Corsair K65 RGB Mini",
      mousepad: "SteelSeries QcK Heavy",
      dpi: "800",
      sensitivity: "0.35",
    },
    stats: {
      totalMatches: 156,
      winRate: 68.5,
      avgKills: 8.2,
      avgPlacement: 3.4,
    },
  })

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid image file.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const imageUrl = URL.createObjectURL(file)
      setProfile((prev) => ({ ...prev, profilePicture: imageUrl }))

      toast({
        title: "Image Uploaded",
        description: "Profile picture updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "God Tier":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
      case "Tier 1":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "Tier 2":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "Tier 3":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
      case "Tier 4":
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Benched":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "On Leave":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Trial":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Player Profile</h1>
          <p className="text-muted-foreground">Manage your player information and gaming setup</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="w-32 h-32 mx-auto">
                <AvatarImage src={profile.profilePicture || "/placeholder.svg"} alt={profile.ign} />
                <AvatarFallback className="text-2xl">{profile.ign.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <Label htmlFor="profile-upload" className="cursor-pointer">
                    <div className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors">
                      {isUploading ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </div>
                  </Label>
                  <Input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{profile.ign}</h2>
              <p className="text-muted-foreground">{profile.realName}</p>
              <div className="flex justify-center gap-2">
                <Badge className={getTierColor(profile.tier)}>
                  <Trophy className="w-3 h-3 mr-1" />
                  {profile.tier}
                </Badge>
                <Badge variant="outline" className={getStatusColor(profile.status)}>
                  {profile.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Player ID</p>
                <p className="font-medium">{profile.playerId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Team</p>
                <p className="font-medium">{profile.team}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Role</p>
                <p className="font-medium">{profile.role}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Matches</p>
                <p className="font-medium">{profile.stats.totalMatches}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your personal and gaming details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ign">In-Game Name (IGN)</Label>
                <Input
                  id="ign"
                  value={profile.ign}
                  onChange={(e) => setProfile((prev) => ({ ...prev, ign: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="realName" className="flex items-center gap-2">
                  Real Name
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </Label>
                <Input id="realName" value={profile.realName} disabled={true} className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="playerId" className="flex items-center gap-2">
                  Player ID
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </Label>
                <Input id="playerId" value={profile.playerId} disabled={true} className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team" className="flex items-center gap-2">
                  Team
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </Label>
                <Input id="team" value={profile.team} disabled={true} className="bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gaming Setup */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Gaming Setup & Technical Details
            </CardTitle>
            <CardDescription>Your gaming equipment and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monitor" className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Monitor
                </Label>
                <Input
                  id="monitor"
                  value={profile.device.monitor}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      device: { ...prev.device, monitor: e.target.value },
                    }))
                  }
                  disabled={!isEditing}
                  placeholder="e.g., ASUS ROG Swift PG259QN"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headset" className="flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  Headset
                </Label>
                <Input
                  id="headset"
                  value={profile.device.headset}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      device: { ...prev.device, headset: e.target.value },
                    }))
                  }
                  disabled={!isEditing}
                  placeholder="e.g., SteelSeries Arctis Pro"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mouse" className="flex items-center gap-2">
                  <Mouse className="w-4 h-4" />
                  Mouse
                </Label>
                <Input
                  id="mouse"
                  value={profile.device.mouse}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      device: { ...prev.device, mouse: e.target.value },
                    }))
                  }
                  disabled={!isEditing}
                  placeholder="e.g., Logitech G Pro X Superlight"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keyboard" className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4" />
                  Keyboard
                </Label>
                <Input
                  id="keyboard"
                  value={profile.device.keyboard}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      device: { ...prev.device, keyboard: e.target.value },
                    }))
                  }
                  disabled={!isEditing}
                  placeholder="e.g., Corsair K65 RGB Mini"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mousepad">Mousepad</Label>
                <Input
                  id="mousepad"
                  value={profile.device.mousepad}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      device: { ...prev.device, mousepad: e.target.value },
                    }))
                  }
                  disabled={!isEditing}
                  placeholder="e.g., SteelSeries QcK Heavy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dpi">DPI</Label>
                <Input
                  id="dpi"
                  value={profile.device.dpi}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      device: { ...prev.device, dpi: e.target.value },
                    }))
                  }
                  disabled={!isEditing}
                  placeholder="e.g., 800"
                />
              </div>
              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <Label htmlFor="sensitivity">In-Game Sensitivity</Label>
                <Input
                  id="sensitivity"
                  value={profile.device.sensitivity}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      device: { ...prev.device, sensitivity: e.target.value },
                    }))
                  }
                  disabled={!isEditing}
                  placeholder="e.g., 0.35"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Your current season statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{profile.stats.totalMatches}</div>
                <div className="text-sm text-muted-foreground">Total Matches</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{profile.stats.winRate}%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{profile.stats.avgKills}</div>
                <div className="text-sm text-muted-foreground">Avg Kills</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">#{profile.stats.avgPlacement}</div>
                <div className="text-sm text-muted-foreground">Avg Placement</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
