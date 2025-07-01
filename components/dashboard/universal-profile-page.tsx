"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Upload,
  Save,
  Edit,
  Lock,
  Users,
  Shield,
  Star,
  Smartphone,
  Trophy,
  BarChart3,
  Crown,
  Monitor,
  Headphones,
  Mouse,
  Keyboard,
  Gamepad2,
  Target,
  Home,
} from "lucide-react"
import Link from "next/link"

interface ProfileData {
  id: string
  name: string
  email: string
  role: string
  profilePicture: string
  // Player specific
  ign?: string
  playerId?: string
  assignedTeam?: string
  playerRole?: string
  tier?: string
  status?: string
  deviceInfo?: {
    device: string
    processor: string
    ram: string
    sensitivity: string
    controls: string
    graphics: string
    monitor?: string
    headset?: string
    mouse?: string
    keyboard?: string
    mousepad?: string
    dpi?: string
  }
  // Coach/Analyst/Manager specific
  specialization?: string
  experience?: string
  certifications?: string[]
  assignedTeams?: string[]
  managementLevel?: string
  reportsTo?: string
  directReports?: string[]
  // Admin specific
  permissions?: string[]
  lastLogin?: string
  accountCreated?: string
}

const playerRoles = ["IGL", "Assaulter", "Sniper", "Support", "Entry Fragger"]
const playerTiers = ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "God Tier"]
const playerStatuses = ["Active", "Benched", "On Leave", "Trial"]
const coachSpecializations = ["Strategy", "Aim Training", "Team Coordination", "Mental Coaching"]
const analystSpecializations = ["Performance Analysis", "Data Science", "Match Analysis", "Statistical Modeling"]
const managerSpecializations = ["Team Management", "Operations", "Strategic Planning", "Staff Development"]

export function UniversalProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Mock profile data based on user role
  const [profileData, setProfileData] = useState<ProfileData>({
    id: user?.id || "1",
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    role: user?.role || "player",
    profilePicture: "/placeholder.svg?height=120&width=120",
    // Player specific data
    ...(user?.role === "player" && {
      ign: "RaptorPlayer",
      playerId: "RP001",
      assignedTeam: "Rebellion",
      playerRole: "IGL",
      tier: "God Tier",
      status: "Active",
      deviceInfo: {
        device: "iPhone 14 Pro Max",
        processor: "A16 Bionic",
        ram: "6GB",
        sensitivity: "High",
        controls: "4-Finger Claw",
        graphics: "Smooth + Extreme",
        monitor: "ASUS ROG Swift PG259QN",
        headset: "SteelSeries Arctis Pro",
        mouse: "Logitech G Pro X Superlight",
        keyboard: "Corsair K65 RGB Mini",
        mousepad: "SteelSeries QcK Heavy",
        dpi: "800",
      },
    }),
    // Coach specific data
    ...(user?.role === "coach" && {
      specialization: "Strategy",
      experience: "5 years",
      certifications: ["Certified Esports Coach", "Team Management"],
      assignedTeams: ["Rebellion", "Phoenix"],
      reportsTo: "Team Manager",
      managementLevel: "Team Level",
    }),
    // Analyst specific data
    ...(user?.role === "analyst" && {
      specialization: "Performance Analysis",
      experience: "3 years",
      certifications: ["Data Analytics", "Statistical Analysis"],
      assignedTeams: ["All Teams"],
      reportsTo: "Team Manager",
      managementLevel: "Team Level",
    }),
    // Manager specific data
    ...(user?.role === "manager" && {
      specialization: "Team Management",
      experience: "7 years",
      certifications: ["Management Certification", "Leadership Training", "Esports Operations"],
      assignedTeams: ["All Teams"],
      reportsTo: "Admin",
      directReports: ["Head Coach", "Lead Analyst", "Performance Coach"],
      managementLevel: "Department Level",
    }),
    // Admin specific data
    ...(user?.role === "admin" && {
      permissions: ["Full Access", "User Management", "System Configuration"],
      lastLogin: new Date().toISOString().split("T")[0],
      accountCreated: "2024-01-01",
      managementLevel: "Organization Level",
      directReports: ["Team Manager", "Finance Manager", "Operations Manager"],
    }),
  })

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
        ...prev.deviceInfo!,
        [field]: value,
      },
    }))
  }, [])

  const handleAvatarUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Profile picture must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }

      setUploadingAvatar(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const reader = new FileReader()
        reader.onload = (e) => {
          setProfileData((prev) => ({
            ...prev,
            profilePicture: e.target?.result as string,
          }))
        }
        reader.readAsDataURL(file)

        toast({
          title: "Profile Picture Updated",
          description: "Your profile picture has been updated successfully",
        })
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to upload profile picture",
          variant: "destructive",
        })
      } finally {
        setUploadingAvatar(false)
      }
    },
    [toast],
  )

  const handleSave = useCallback(async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save profile changes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-5 h-5 text-yellow-500" />
      case "manager":
        return <Target className="w-5 h-5 text-purple-500" />
      case "coach":
        return <Users className="w-5 h-5 text-blue-500" />
      case "analyst":
        return <BarChart3 className="w-5 h-5 text-green-500" />
      case "player":
        return <Gamepad2 className="w-5 h-5 text-orange-500" />
      default:
        return <User className="w-5 h-5" />
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
        return "bg-red-100 text-red-800 border-red-200"
      case "Trial":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const canEditField = (field: string) => {
    if (!user?.role) return false

    const editableFields = {
      player: ["ign", "profilePicture", "deviceInfo"],
      coach: ["name", "profilePicture", "specialization", "experience"],
      analyst: ["name", "profilePicture", "specialization", "experience"],
      manager: ["name", "profilePicture", "specialization", "experience"],
      admin: ["name", "profilePicture", "permissions"],
    }

    return editableFields[user.role as keyof typeof editableFields]?.includes(field) || false
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <Button variant="outline" size="sm" asChild className="bg-background border-border">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Homepage
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                {getRoleIcon(profileData.role)}
                My Profile
              </h1>
              <p className="text-muted-foreground">Manage your {profileData.role} profile and settings</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-primary text-primary-foreground">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-background border-border">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture and Basic Info */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-card-foreground">Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Avatar className="w-32 h-32 mx-auto">
                  <AvatarImage src={profileData.profilePicture || "/placeholder.svg"} alt="Profile picture" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {profileData.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && canEditField("profilePicture") && (
                  <div>
                    <Label htmlFor="profile-upload" className="cursor-pointer">
                      <Button variant="outline" className="w-full bg-background border-border" asChild>
                        <span>
                          {uploadingAvatar ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          ) : (
                            <Upload className="w-4 h-4 mr-2" />
                          )}
                          Upload New Picture
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Max 5MB, JPG/PNG only</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Role-specific badges */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Role & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <Badge variant="outline" className="flex items-center space-x-1 border-border">
                    {getRoleIcon(profileData.role)}
                    <span className="capitalize">{profileData.role}</span>
                  </Badge>
                </div>
                {profileData.tier && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tier</span>
                    <Badge className={getTierColor(profileData.tier)}>
                      <Star className="w-3 h-3 mr-1" />
                      {profileData.tier}
                    </Badge>
                  </div>
                )}
                {profileData.status && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className={getStatusColor(profileData.status)}>
                      {profileData.status}
                    </Badge>
                  </div>
                )}
                {profileData.assignedTeam && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Team</span>
                    <Badge className="bg-blue-600 text-white">
                      <Users className="w-3 h-3 mr-1" />
                      {profileData.assignedTeam}
                    </Badge>
                  </div>
                )}
                {profileData.managementLevel && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Management Level</span>
                    <Badge className="bg-purple-600 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      {profileData.managementLevel}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Basic Information</CardTitle>
                <CardDescription className="text-muted-foreground">Your core profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-card-foreground">
                      {profileData.role === "player" ? "Real Name" : "Name"} *
                      {profileData.role === "player" && <Lock className="w-3 h-3 ml-1 inline text-muted-foreground" />}
                    </Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      disabled={!isEditing || (profileData.role === "player" && !canEditField("name"))}
                      className={`bg-background border-border text-foreground ${
                        profileData.role === "player" ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-card-foreground flex items-center">
                      Email
                      <Lock className="w-3 h-3 ml-1 text-muted-foreground" />
                    </Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      disabled
                      className="bg-background border-border text-foreground opacity-50 cursor-not-allowed"
                    />
                  </div>

                  {/* Player specific fields */}
                  {profileData.role === "player" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="ign" className="text-card-foreground">
                          IGN (In-Game Name) *
                        </Label>
                        <Input
                          id="ign"
                          value={profileData.ign || ""}
                          onChange={(e) => handleInputChange("ign", e.target.value)}
                          disabled={!isEditing}
                          className="bg-background border-border text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="playerId" className="text-card-foreground">
                          Player ID (Optional)
                        </Label>
                        <Input
                          id="playerId"
                          value={profileData.playerId || ""}
                          onChange={(e) => handleInputChange("playerId", e.target.value)}
                          disabled={!isEditing}
                          className="bg-background border-border text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="playerRole" className="text-card-foreground flex items-center">
                          Player Role
                          <Lock className="w-3 h-3 ml-1 text-muted-foreground" />
                        </Label>
                        <Select value={profileData.playerRole || ""} disabled>
                          <SelectTrigger className="bg-background border-border text-foreground opacity-50 cursor-not-allowed">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {playerRoles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tier" className="text-card-foreground flex items-center">
                          Tier
                          <Lock className="w-3 h-3 ml-1 text-muted-foreground" />
                        </Label>
                        <Select value={profileData.tier || ""} disabled>
                          <SelectTrigger className="bg-background border-border text-foreground opacity-50 cursor-not-allowed">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {playerTiers.map((tier) => (
                              <SelectItem key={tier} value={tier}>
                                {tier}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* Coach/Analyst/Manager specific fields */}
                  {(profileData.role === "coach" ||
                    profileData.role === "analyst" ||
                    profileData.role === "manager") && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="specialization" className="text-card-foreground">
                          Specialization
                        </Label>
                        <Select
                          value={profileData.specialization || ""}
                          onValueChange={(value) => handleInputChange("specialization", value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className="bg-background border-border text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(profileData.role === "coach"
                              ? coachSpecializations
                              : profileData.role === "analyst"
                                ? analystSpecializations
                                : managerSpecializations
                            ).map((spec) => (
                              <SelectItem key={spec} value={spec}>
                                {spec}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-card-foreground">
                          Experience
                        </Label>
                        <Input
                          id="experience"
                          value={profileData.experience || ""}
                          onChange={(e) => handleInputChange("experience", e.target.value)}
                          disabled={!isEditing}
                          className="bg-background border-border text-foreground"
                          placeholder="e.g., 5 years"
                        />
                      </div>

                      {profileData.reportsTo && (
                        <div className="space-y-2">
                          <Label htmlFor="reportsTo" className="text-card-foreground flex items-center">
                            Reports To
                            <Lock className="w-3 h-3 ml-1 text-muted-foreground" />
                          </Label>
                          <Input
                            id="reportsTo"
                            value={profileData.reportsTo}
                            disabled
                            className="bg-background border-border text-foreground opacity-50 cursor-not-allowed"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Device & Technical Details (Player only) */}
            {profileData.role === "player" && profileData.deviceInfo && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Device & Technical Details
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Your gaming setup and technical specifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="device" className="text-card-foreground flex items-center">
                        <Smartphone className="w-4 h-4 mr-1" />
                        Device
                      </Label>
                      <Input
                        id="device"
                        value={profileData.deviceInfo.device}
                        onChange={(e) => handleDeviceInfoChange("device", e.target.value)}
                        disabled={!isEditing}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="processor" className="text-card-foreground">
                        Processor
                      </Label>
                      <Input
                        id="processor"
                        value={profileData.deviceInfo.processor}
                        onChange={(e) => handleDeviceInfoChange("processor", e.target.value)}
                        disabled={!isEditing}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ram" className="text-card-foreground">
                        RAM
                      </Label>
                      <Input
                        id="ram"
                        value={profileData.deviceInfo.ram}
                        onChange={(e) => handleDeviceInfoChange("ram", e.target.value)}
                        disabled={!isEditing}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sensitivity" className="text-card-foreground">
                        Sensitivity
                      </Label>
                      <Input
                        id="sensitivity"
                        value={profileData.deviceInfo.sensitivity}
                        onChange={(e) => handleDeviceInfoChange("sensitivity", e.target.value)}
                        disabled={!isEditing}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="controls" className="text-card-foreground">
                        Controls
                      </Label>
                      <Input
                        id="controls"
                        value={profileData.deviceInfo.controls}
                        onChange={(e) => handleDeviceInfoChange("controls", e.target.value)}
                        disabled={!isEditing}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="graphics" className="text-card-foreground">
                        Graphics Settings
                      </Label>
                      <Input
                        id="graphics"
                        value={profileData.deviceInfo.graphics}
                        onChange={(e) => handleDeviceInfoChange("graphics", e.target.value)}
                        disabled={!isEditing}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    {/* PC Gaming Setup (if applicable) */}
                    {profileData.deviceInfo.monitor && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="monitor" className="text-card-foreground flex items-center">
                            <Monitor className="w-4 h-4 mr-1" />
                            Monitor
                          </Label>
                          <Input
                            id="monitor"
                            value={profileData.deviceInfo.monitor}
                            onChange={(e) => handleDeviceInfoChange("monitor", e.target.value)}
                            disabled={!isEditing}
                            className="bg-background border-border text-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="headset" className="text-card-foreground flex items-center">
                            <Headphones className="w-4 h-4 mr-1" />
                            Headset
                          </Label>
                          <Input
                            id="headset"
                            value={profileData.deviceInfo.headset || ""}
                            onChange={(e) => handleDeviceInfoChange("headset", e.target.value)}
                            disabled={!isEditing}
                            className="bg-background border-border text-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mouse" className="text-card-foreground flex items-center">
                            <Mouse className="w-4 h-4 mr-1" />
                            Mouse
                          </Label>
                          <Input
                            id="mouse"
                            value={profileData.deviceInfo.mouse || ""}
                            onChange={(e) => handleDeviceInfoChange("mouse", e.target.value)}
                            disabled={!isEditing}
                            className="bg-background border-border text-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="keyboard" className="text-card-foreground flex items-center">
                            <Keyboard className="w-4 h-4 mr-1" />
                            Keyboard
                          </Label>
                          <Input
                            id="keyboard"
                            value={profileData.deviceInfo.keyboard || ""}
                            onChange={(e) => handleDeviceInfoChange("keyboard", e.target.value)}
                            disabled={!isEditing}
                            className="bg-background border-border text-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mousepad" className="text-card-foreground">
                            Mousepad
                          </Label>
                          <Input
                            id="mousepad"
                            value={profileData.deviceInfo.mousepad || ""}
                            onChange={(e) => handleDeviceInfoChange("mousepad", e.target.value)}
                            disabled={!isEditing}
                            className="bg-background border-border text-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dpi" className="text-card-foreground">
                            DPI
                          </Label>
                          <Input
                            id="dpi"
                            value={profileData.deviceInfo.dpi || ""}
                            onChange={(e) => handleDeviceInfoChange("dpi", e.target.value)}
                            disabled={!isEditing}
                            className="bg-background border-border text-foreground"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Management Structure (Manager/Admin only) */}
            {(profileData.role === "manager" || profileData.role === "admin") && profileData.directReports && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Management Structure</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Your direct reports and team structure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-card-foreground font-medium">Direct Reports</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profileData.directReports.map((report, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Users className="w-3 h-3 mr-1" />
                            {report}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certifications (Coach/Analyst/Manager only) */}
            {(profileData.role === "coach" || profileData.role === "analyst" || profileData.role === "manager") &&
              profileData.certifications && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Certifications & Qualifications</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Your professional certifications and qualifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profileData.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Trophy className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Admin Permissions */}
            {profileData.role === "admin" && profileData.permissions && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">System Permissions</CardTitle>
                  <CardDescription className="text-muted-foreground">Your administrative access levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <Shield className="w-3 h-3 mr-1" />
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
