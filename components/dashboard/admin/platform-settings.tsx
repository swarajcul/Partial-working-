"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Save, RefreshCw, Shield, Bell, Database, FileText, ImageIcon } from "lucide-react"

export function PlatformSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    // General Settings
    platformName: "Raptors Esports Platform",
    organizationName: "Raptors Esports",
    contactEmail: "admin@raptorsesports.com",
    supportEmail: "support@raptorsesports.com",

    // Security Settings
    requireEmailVerification: true,
    enableTwoFactor: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5,

    // Notification Settings
    emailNotifications: true,
    discordIntegration: true,
    discordWebhookUrl: "",

    // API Keys & Integrations
    googleClientId: "",
    googleClientSecret: "",
    nextAuthSecret: "",
    awsAccessKey: "",
    awsSecretKey: "",
    databaseUrl: "",

    // CTA & Links
    joinTeamCtaLink: "/auth/login",
    watchHighlightsCtaLink: "#",
    discordServerLink: "https://discord.gg/raptors",
    youtubeChannelLink: "#",
    twitchChannelLink: "#",
    instagramProfileLink: "#",

    // Media & Assets
    heroBackgroundVideo: "",
    heroBackgroundImage: "/placeholder.svg?height=600&width=1920",
    teamLogoUrl: "",

    // System Settings
    maintenanceMode: false,
    debugMode: false,
    logRetentionDays: 30,
    backupFrequency: "daily",

    // Feature Flags
    enableFinanceModule: true,
    enableMatchScheduler: true,
    enableReports: true,
    enableUserRegistration: false,
  })

  const handleSave = () => {
    // Save settings logic here
    toast({
      title: "Settings saved",
      description: "Platform settings have been updated successfully.",
    })
  }

  const handleReset = () => {
    // Reset to defaults logic here
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values.",
    })
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            General Settings
          </CardTitle>
          <CardDescription className="text-gray-400">Basic platform configuration and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platformName" className="text-white">
                Platform Name
              </Label>
              <Input
                id="platformName"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizationName" className="text-white">
                Organization Name
              </Label>
              <Input
                id="organizationName"
                value={settings.organizationName}
                onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-white">
                Contact Email
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail" className="text-white">
                Support Email
              </Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Settings
          </CardTitle>
          <CardDescription className="text-gray-400">Authentication and security configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Require Email Verification</Label>
              <p className="text-sm text-gray-400">Users must verify their email before accessing the platform</p>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Enable Two-Factor Authentication</Label>
              <p className="text-sm text-gray-400">Require 2FA for admin and manager accounts</p>
            </div>
            <Switch
              checked={settings.enableTwoFactor}
              onCheckedChange={(checked) => setSettings({ ...settings, enableTwoFactor: checked })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout" className="text-white">
                Session Timeout (hours)
              </Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: Number.parseInt(e.target.value) })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts" className="text-white">
                Max Login Attempts
              </Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({ ...settings, maxLoginAttempts: Number.parseInt(e.target.value) })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Settings
          </CardTitle>
          <CardDescription className="text-gray-400">Configure notification channels and integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Email Notifications</Label>
              <p className="text-sm text-gray-400">Send system notifications via email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Discord Integration</Label>
              <p className="text-sm text-gray-400">Send notifications to Discord channels</p>
            </div>
            <Switch
              checked={settings.discordIntegration}
              onCheckedChange={(checked) => setSettings({ ...settings, discordIntegration: checked })}
            />
          </div>

          {settings.discordIntegration && (
            <div className="space-y-2">
              <Label htmlFor="discordWebhook" className="text-white">
                Discord Webhook URL
              </Label>
              <Input
                id="discordWebhook"
                placeholder="https://discord.com/api/webhooks/..."
                value={settings.discordWebhookUrl}
                onChange={(e) => setSettings({ ...settings, discordWebhookUrl: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Keys & Integrations */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            API Keys & Integrations
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage third-party service integrations and API keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="googleClientId" className="text-white">
              Google OAuth Client ID
            </Label>
            <Input
              id="googleClientId"
              placeholder="Enter Google OAuth Client ID"
              value={settings.googleClientId || ""}
              onChange={(e) => setSettings({ ...settings, googleClientId: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="googleClientSecret" className="text-white">
              Google OAuth Client Secret
            </Label>
            <Input
              id="googleClientSecret"
              type="password"
              placeholder="Enter Google OAuth Client Secret"
              value={settings.googleClientSecret || ""}
              onChange={(e) => setSettings({ ...settings, googleClientSecret: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nextAuthSecret" className="text-white">
              NextAuth Secret
            </Label>
            <Input
              id="nextAuthSecret"
              type="password"
              placeholder="Enter NextAuth Secret Key"
              value={settings.nextAuthSecret || ""}
              onChange={(e) => setSettings({ ...settings, nextAuthSecret: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="awsAccessKey" className="text-white">
              AWS Access Key ID
            </Label>
            <Input
              id="awsAccessKey"
              placeholder="Enter AWS Access Key ID"
              value={settings.awsAccessKey || ""}
              onChange={(e) => setSettings({ ...settings, awsAccessKey: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="awsSecretKey" className="text-white">
              AWS Secret Access Key
            </Label>
            <Input
              id="awsSecretKey"
              type="password"
              placeholder="Enter AWS Secret Access Key"
              value={settings.awsSecretKey || ""}
              onChange={(e) => setSettings({ ...settings, awsSecretKey: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="databaseUrl" className="text-white">
              Database URL
            </Label>
            <Input
              id="databaseUrl"
              placeholder="Enter Database Connection URL"
              value={settings.databaseUrl || ""}
              onChange={(e) => setSettings({ ...settings, databaseUrl: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* CTA & Links Management */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            CTA & Links Management
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure call-to-action buttons and navigation links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="joinTeamCta" className="text-white">
                "Join Our Team" Button Link
              </Label>
              <Input
                id="joinTeamCta"
                placeholder="/auth/login"
                value={settings.joinTeamCtaLink || "/auth/login"}
                onChange={(e) => setSettings({ ...settings, joinTeamCtaLink: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="watchHighlightsCta" className="text-white">
                "Watch Highlights" Button Link
              </Label>
              <Input
                id="watchHighlightsCta"
                placeholder="https://youtube.com/..."
                value={settings.watchHighlightsCtaLink || "#"}
                onChange={(e) => setSettings({ ...settings, watchHighlightsCtaLink: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discordLink" className="text-white">
                Discord Server Link
              </Label>
              <Input
                id="discordLink"
                placeholder="https://discord.gg/..."
                value={settings.discordServerLink || "https://discord.gg/raptors"}
                onChange={(e) => setSettings({ ...settings, discordServerLink: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtubeLink" className="text-white">
                YouTube Channel Link
              </Label>
              <Input
                id="youtubeLink"
                placeholder="https://youtube.com/..."
                value={settings.youtubeChannelLink || "#"}
                onChange={(e) => setSettings({ ...settings, youtubeChannelLink: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitchLink" className="text-white">
                Twitch Channel Link
              </Label>
              <Input
                id="twitchLink"
                placeholder="https://twitch.tv/..."
                value={settings.twitchChannelLink || "#"}
                onChange={(e) => setSettings({ ...settings, twitchChannelLink: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramLink" className="text-white">
                Instagram Profile Link
              </Label>
              <Input
                id="instagramLink"
                placeholder="https://instagram.com/..."
                value={settings.instagramProfileLink || "#"}
                onChange={(e) => setSettings({ ...settings, instagramProfileLink: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media & Assets */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <ImageIcon className="w-5 h-5 mr-2" />
            Media & Assets
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure background videos, images, and media assets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroBackgroundVideo" className="text-white">
              Hero Background Video URL
            </Label>
            <Input
              id="heroBackgroundVideo"
              placeholder="https://example.com/bgmi-hero-video.mp4"
              value={settings.heroBackgroundVideo || ""}
              onChange={(e) => setSettings({ ...settings, heroBackgroundVideo: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
            <p className="text-xs text-gray-500">
              Recommended: BGMI/PUBG style action video with astronauts/soldiers dropping
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroBackgroundImage" className="text-white">
              Hero Background Image URL (Fallback)
            </Label>
            <Input
              id="heroBackgroundImage"
              placeholder="https://example.com/bgmi-hero-image.jpg"
              value={settings.heroBackgroundImage || "/placeholder.svg?height=600&width=1920"}
              onChange={(e) => setSettings({ ...settings, heroBackgroundImage: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl" className="text-white">
              Team Logo URL
            </Label>
            <Input
              id="logoUrl"
              placeholder="https://example.com/raptors-logo.png"
              value={settings.teamLogoUrl || ""}
              onChange={(e) => setSettings({ ...settings, teamLogoUrl: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Database className="w-5 h-5 mr-2" />
            System Settings
          </CardTitle>
          <CardDescription className="text-gray-400">System maintenance and operational settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Maintenance Mode</Label>
              <p className="text-sm text-gray-400">Temporarily disable access for maintenance</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Debug Mode</Label>
              <p className="text-sm text-gray-400">Enable detailed logging for troubleshooting</p>
            </div>
            <Switch
              checked={settings.debugMode}
              onCheckedChange={(checked) => setSettings({ ...settings, debugMode: checked })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logRetention" className="text-white">
                Log Retention (days)
              </Label>
              <Input
                id="logRetention"
                type="number"
                value={settings.logRetentionDays}
                onChange={(e) => setSettings({ ...settings, logRetentionDays: Number.parseInt(e.target.value) })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backupFrequency" className="text-white">
                Backup Frequency
              </Label>
              <select
                id="backupFrequency"
                value={settings.backupFrequency}
                onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">Feature Flags</CardTitle>
          <CardDescription className="text-gray-400">Enable or disable platform features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Finance Module</Label>
              <p className="text-sm text-gray-400">Enable financial tracking and reporting</p>
            </div>
            <Switch
              checked={settings.enableFinanceModule}
              onCheckedChange={(checked) => setSettings({ ...settings, enableFinanceModule: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Match Scheduler</Label>
              <p className="text-sm text-gray-400">Enable match scheduling and management</p>
            </div>
            <Switch
              checked={settings.enableMatchScheduler}
              onCheckedChange={(checked) => setSettings({ ...settings, enableMatchScheduler: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Reports Module</Label>
              <p className="text-sm text-gray-400">Enable report generation and exports</p>
            </div>
            <Switch
              checked={settings.enableReports}
              onCheckedChange={(checked) => setSettings({ ...settings, enableReports: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">User Registration</Label>
              <p className="text-sm text-gray-400">Allow public user registration</p>
            </div>
            <Switch
              checked={settings.enableUserRegistration}
              onCheckedChange={(checked) => setSettings({ ...settings, enableUserRegistration: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
            <Button variant="outline" onClick={handleReset} className="border-gray-600 text-white hover:bg-gray-800">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
