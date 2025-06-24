"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Upload, Save, User, Shield, Settings, Bell, Edit, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock player profile data
const mockPlayerProfile = {
  id: "player-1",
  ign: "ShadowStrike",
  realName: "Alex Johnson",
  playerId: "BGM_SS_001",
  assignedTeam: "Rebellion",
  role: "IGL",
  tier: "God Tier",
  profilePicture: "/placeholder.svg?height=120&width=120",
  status: "Active",
  deviceInfo: {
    device: "iPhone 14 Pro",
    processor: "A16 Bionic",
    ram: "6GB",
    storage: "256GB",
    internet: "5G/WiFi",
    sensitivity: "245 ADS, 180 Camera",
    controls: "6 Finger Claw",
    hud: "Custom Layout v2.1",
  },
  joinDate: "2024-01-15",
  lastActive: "2024-12-24",
}

export function PlayerProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState(mockPlayerProfile)

  const handleInputChange = useCallback((field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleDeviceInfoChange = useCallback((field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      deviceInfo: {
        ...prev.deviceInfo,
        [field]: value,
      },
    }))
  }, [])

  const handleSave = useCallback(async () => {
    setIsLoading(true)
    try {
      // Simulate save delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const handleProfilePictureUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Profile picture must be less than 5MB.",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file.",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfileData((prev) => ({
          ...prev,
          profilePicture: result,
        }))
      }
      reader.readAsDataURL(file)
    },
    [toast],
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-600 text-white"
      case "Benched":
        return "bg-yellow-600 text-white"
      case "On Leave":
        return "bg-blue-600 text-white"
      case "Trial":
        return "bg-purple-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "God Tier":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
      case "Tier 1":
        return "bg-red-600 text-white"
      case "Tier 2":
        return "bg-orange-600 text-white"
      case "Tier 3":
        return "bg-blue-600 text-white"
      case "Tier 4":
        return "bg-gray-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  return (
    <div className="space-y-6 bg-background min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your player profile and settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-orange-600 hover:bg-orange-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setProfileData(mockPlayerProfile) // Reset changes
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Left Menu Buttons */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>Profile</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Bell className="w-4 h-4" />
          <span>Alert Center</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profileData.profilePicture || "/placeholder.svg"} alt="Profile picture" />
                <AvatarFallback className="bg-orange-600 text-white text-2xl">
                  {profileData.ign.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="w-full">
                  <Label htmlFor="profile-upload" className="cursor-pointer">
                    <div className="flex items-center justify-center w-full h-12 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      <span className="text-sm">Upload New Picture</span>
                    </div>
                  </Label>
                  <Input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-center">Max 5MB, PNG/JPG</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status and Tier Cards */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Status & Tier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className={getStatusColor(profileData.status)}>{profileData.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tier</span>
                <Badge className={getTierColor(profileData.tier)}>{profileData.tier}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Role</span>
                <Badge variant="outline">{profileData.role}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Personal Information</CardTitle>
              <CardDescription className="text-muted-foreground">Your basic profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ign" className="text-foreground">
                    IGN (In-Game Name) *
                  </Label>
                  {isEditing ? (
                    <Input
                      id="ign"
                      value={profileData.ign}
                      onChange={(e) => handleInputChange("ign", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-foreground">{profileData.ign}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground flex items-center">
                    Real Name <Lock className="w-3 h-3 ml-1 text-muted-foreground" />
                  </Label>
                  <div className="p-2 bg-muted/50 rounded-md text-muted-foreground border border-dashed">
                    {profileData.realName} (Admin Only)
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="playerId" className="text-foreground">
                    Player ID (Optional)
                  </Label>
                  {isEditing ? (
                    <Input
                      id="playerId"
                      value={profileData.playerId}
                      onChange={(e) => handleInputChange("playerId", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-foreground">{profileData.playerId}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground flex items-center">
                    Assigned Team <Lock className="w-3 h-3 ml-1 text-muted-foreground" />
                  </Label>
                  <div className="p-2 bg-muted/50 rounded-md text-muted-foreground border border-dashed">
                    {profileData.assignedTeam || "No Team Assigned Yet"} (Auto-Assigned)
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-foreground">
                  Status
                </Label>
                {isEditing ? (
                  <Select value={profileData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="Active" className="text-foreground">
                        Active
                      </SelectItem>
                      <SelectItem value="Benched" className="text-foreground">
                        Benched
                      </SelectItem>
                      <SelectItem value="On Leave" className="text-foreground">
                        On Leave
                      </SelectItem>
                      <SelectItem value="Trial" className="text-foreground">
                        Trial
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-muted rounded-md">
                    <Badge className={getStatusColor(profileData.status)}>{profileData.status}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Device & Technical Details */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Device & Technical Details
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your gaming setup and technical specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="device" className="text-foreground">
                    Device
                  </Label>
                  {isEditing ? (
                    <Input
                      id="device"
                      value={profileData.deviceInfo.device}
                      onChange={(e) => handleDeviceInfoChange("device", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-foreground">{profileData.deviceInfo.device}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="processor" className="text-foreground">
                    Processor
                  </Label>
                  {isEditing ? (
                    <Input
                      id="processor"
                      value={profileData.deviceInfo.processor}
                      onChange={(e) => handleDeviceInfoChange("processor", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-foreground">{profileData.deviceInfo.processor}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ram" className="text-foreground">
                    RAM
                  </Label>
                  {isEditing ? (
                    <Input
                      id="ram"
                      value={profileData.deviceInfo.ram}
                      onChange={(e) => handleDeviceInfoChange("ram", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-foreground">{profileData.deviceInfo.ram}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage" className="text-foreground">
                    Storage
                  </Label>
                  {isEditing ? (
                    <Input
                      id="storage"
                      value={profileData.deviceInfo.storage}
                      onChange={(e) => handleDeviceInfoChange("storage", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-foreground">{profileData.deviceInfo.storage}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="internet" className="text-foreground">
                    Internet Connection
                  </Label>
                  {isEditing ? (
                    <Input
                      id="internet"
                      value={profileData.deviceInfo.internet}
                      onChange={(e) => handleDeviceInfoChange("internet", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-foreground">{profileData.deviceInfo.internet}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="controls" className="text-foreground">
                    Control Layout
                  </Label>
                  {isEditing ? (
                    <Input
                      id="controls"
                      value={profileData.deviceInfo.controls}
                      onChange={(e) => handleDeviceInfoChange("controls", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-foreground">{profileData.deviceInfo.controls}</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sensitivity" className="text-foreground">
                  Sensitivity Settings
                </Label>
                {isEditing ? (
                  <Input
                    id="sensitivity"
                    value={profileData.deviceInfo.sensitivity}
                    onChange={(e) => handleDeviceInfoChange("sensitivity", e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-foreground">{profileData.deviceInfo.sensitivity}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hud" className="text-foreground">
                  HUD Layout
                </Label>
                {isEditing ? (
                  <Textarea
                    id="hud"
                    value={profileData.deviceInfo.hud}
                    onChange={(e) => handleDeviceInfoChange("hud", e.target.value)}
                    className="bg-background border-border text-foreground"
                    rows={2}
                  />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-foreground">{profileData.deviceInfo.hud}</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Join Date</Label>
                  <div className="p-2 bg-muted rounded-md text-foreground">{profileData.joinDate}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Last Active</Label>
                  <div className="p-2 bg-muted rounded-md text-foreground">{profileData.lastActive}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
