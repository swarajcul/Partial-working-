"use client"

import React from "react"

import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Upload, User, Target, Crosshair, Shield, Star, CalendarIcon, Loader2, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { playerSchema, type PlayerFormData, defaultPlayerValues } from "@/lib/player-validation"

interface PlayerFormProps {
  initialData?: Partial<PlayerFormData>
  onSubmit: (data: PlayerFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  mode: "add" | "edit"
}

const roleIcons = {
  Assaulter: Target,
  Sniper: Crosshair,
  Support: Shield,
}

const roleDescriptions = {
  Assaulter: "Front-line fighters who engage enemies directly",
  Sniper: "Long-range specialists who provide cover and elimination",
  Support: "Team players who provide utility and strategic support",
}

const statusColors = {
  Active: "bg-green-500",
  Inactive: "bg-red-500",
  Benched: "bg-yellow-500",
}

export function PlayerForm({ initialData, onSubmit, onCancel, isLoading = false, mode }: PlayerFormProps) {
  const [avatarPreview, setAvatarPreview] = useState<string>(initialData?.avatar || "")
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const form = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      ...defaultPlayerValues,
      ...initialData,
    },
  })

  const watchedRole = form.watch("role")
  const watchedRank = form.watch("rank")
  const watchedStatus = form.watch("status")
  const watchedKdRatio = form.watch("kdRatio")

  const handleAvatarUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (file.size > 5 * 1024 * 1024) {
        form.setError("avatar", { message: "Avatar file size must be less than 5MB" })
        return
      }

      if (!file.type.startsWith("image/")) {
        form.setError("avatar", { message: "Avatar must be an image file" })
        return
      }

      setUploadingAvatar(true)
      try {
        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setAvatarPreview(result)
          form.setValue("avatar", result)
          form.clearErrors("avatar")
        }
        reader.readAsDataURL(file)
      } catch (error) {
        form.setError("avatar", { message: "Failed to upload avatar" })
      } finally {
        setUploadingAvatar(false)
      }
    },
    [form],
  )

  const handleSubmit = useCallback(
    async (data: PlayerFormData) => {
      try {
        await onSubmit(data)
      } catch (error) {
        console.error("Form submission error:", error)
      }
    },
    [onSubmit],
  )

  const renderStars = (rank: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors ${i < rank ? "text-yellow-400 fill-current" : "text-muted-foreground"}`}
      />
    ))
  }

  const getKDColor = (kd: number) => {
    if (kd >= 2.5) return "text-green-500"
    if (kd >= 1.5) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="max-w-4xl mx-auto"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{mode === "add" ? "Add New Player" : "Edit Player"}</h2>
              <p className="text-muted-foreground">
                {mode === "add" ? "Create a new team member profile" : "Update player information"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {watchedStatus && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${statusColors[watchedStatus]}`} />
                  <span>{watchedStatus}</span>
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Player Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter player name" {...field} className="transition-colors" />
                          </FormControl>
                          <FormDescription>Unique identifier for the player (2-20 characters)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Entry Fragger, AWM Specialist"
                              {...field}
                              className="transition-colors"
                            />
                          </FormControl>
                          <FormDescription>Player's specific role specialization</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="transition-colors">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(roleIcons).map(([role, Icon]) => (
                              <SelectItem key={role} value={role}>
                                <div className="flex items-center space-x-2">
                                  <Icon className="w-4 h-4" />
                                  <span>{role}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {watchedRole && (
                          <FormDescription className="flex items-center space-x-2">
                            {React.createElement(roleIcons[watchedRole], { className: "w-4 h-4" })}
                            <span>{roleDescriptions[watchedRole]}</span>
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="transition-colors">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(statusColors).map(([status, colorClass]) => (
                              <SelectItem key={status} value={status}>
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${colorClass}`} />
                                  <span>{status}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Current player status in the team</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Performance Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="kdRatio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>K/D Ratio *</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="10"
                                placeholder="1.50"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                className="transition-colors"
                              />
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Kill/Death Ratio</span>
                                <span className={`font-medium ${getKDColor(watchedKdRatio || 0)}`}>
                                  {(watchedKdRatio || 0).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skill Rank *</FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              <Slider
                                min={1}
                                max={5}
                                step={1}
                                value={[field.value || 3]}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="transition-colors"
                              />
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">{renderStars(watchedRank || 3)}</div>
                                <span className="text-sm font-medium">{watchedRank || 3}/5 Stars</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>Player skill level (1-5 stars)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="matchesPlayed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matches Played *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                              className="transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="winRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Win Rate (%) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                              className="transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dates */}
              <Card>
                <CardHeader>
                  <CardTitle>Important Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="joinDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Join Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal transition-colors",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => field.onChange(date?.toISOString().split("T")[0])}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Last Active *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal transition-colors",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => field.onChange(date?.toISOString().split("T")[0])}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Avatar & Preview */}
            <div className="space-y-6">
              {/* Avatar Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Player Avatar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Player avatar" />
                      <AvatarFallback className="bg-orange-600 text-white text-lg">
                        {form.watch("name")?.slice(0, 2).toUpperCase() || "PL"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="w-full">
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors">
                          {uploadingAvatar ? (
                            <div className="flex flex-col items-center space-y-2">
                              <Loader2 className="w-6 h-6 animate-spin" />
                              <span className="text-sm text-muted-foreground">Uploading...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center space-y-2">
                              <Upload className="w-6 h-6 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Click to upload avatar</span>
                              <span className="text-xs text-muted-foreground">PNG, JPG up to 5MB</span>
                            </div>
                          )}
                        </div>
                      </Label>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <FormMessage />
                </CardContent>
              </Card>

              {/* Player Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Preview" />
                        <AvatarFallback className="bg-orange-600 text-white">
                          {form.watch("name")?.slice(0, 2).toUpperCase() || "PL"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{form.watch("name") || "Player Name"}</h3>
                        <div className="flex items-center space-x-1">
                          {watchedRole &&
                            React.createElement(roleIcons[watchedRole], { className: "w-3 h-3 text-orange-500" })}
                          <span className="text-sm text-muted-foreground truncate">
                            {form.watch("specialization") || "Specialization"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">{renderStars(watchedRank || 3)}</div>
                      <div className="text-right">
                        <div className={`font-bold text-sm ${getKDColor(watchedKdRatio || 0)}`}>
                          {(watchedKdRatio || 0).toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">K/D</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Matches:</span>
                        <span className="ml-1 font-medium">{form.watch("matchesPlayed") || 0}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Win Rate:</span>
                        <span className="ml-1 font-medium">{form.watch("winRate") || 0}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-orange-600 hover:bg-orange-700 min-w-[120px]">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{mode === "add" ? "Adding..." : "Saving..."}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{mode === "add" ? "Add Player" : "Save Changes"}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  )
}
