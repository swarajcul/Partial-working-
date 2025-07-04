"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Settings, Users, ImageIcon, FileText, Activity } from "lucide-react"
import { ContentEditor } from "./admin/content-editor"
import { UserManagement } from "./admin/user-management"
import { AssetManager } from "./admin/asset-manager"
import { SystemLogs } from "./admin/system-logs"
import { PlatformSettings } from "./admin/platform-settings"

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("content")

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400">Manage platform content, users, and settings</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900 border-orange-600/20">
          <TabsTrigger value="content" className="data-[state=active]:bg-orange-600">
            <FileText className="w-4 h-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-orange-600">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="assets" className="data-[state=active]:bg-orange-600">
            <ImageIcon className="w-4 h-4 mr-2" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-orange-600">
            <Activity className="w-4 h-4 mr-2" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-orange-600">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <ContentEditor />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="assets">
          <AssetManager />
        </TabsContent>

        <TabsContent value="logs">
          <SystemLogs />
        </TabsContent>

        <TabsContent value="settings">
          <PlatformSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
