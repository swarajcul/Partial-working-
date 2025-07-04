"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth/auth-provider"
import { rolePermissions } from "@/lib/role-config"
import { Code, Database, User, Shield } from "lucide-react"

export function DevInfoPanel() {
  const { user, isDevMode, isRoleTesting, originalRole } = useAuth()

  if (!isDevMode || !user) {
    return null
  }

  const currentPermissions = rolePermissions[user.role as keyof typeof rolePermissions]

  return (
    <Card className="border-green-500/20 bg-green-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center text-green-700">
          <Code className="w-4 h-4 mr-2" />
          Developer Debug Panel
        </CardTitle>
        <CardDescription className="text-xs">Role testing and permission debugging information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* User Info */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex items-center mb-1">
              <User className="w-3 h-3 mr-1" />
              <span className="font-medium">User Info</span>
            </div>
            <div className="space-y-1 text-muted-foreground">
              <div>
                ID: <code className="text-green-600">{user.id}</code>
              </div>
              <div>
                Email: <code className="text-green-600">{user.email}</code>
              </div>
              <div>
                Team: <code className="text-green-600">{user.team || "None"}</code>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-1">
              <Shield className="w-3 h-3 mr-1" />
              <span className="font-medium">Role Status</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Current:</span>
                <Badge variant="outline" className="text-xs">
                  {user.role}
                </Badge>
              </div>
              {isRoleTesting && originalRole && (
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Original:</span>
                  <Badge variant="secondary" className="text-xs">
                    {originalRole}
                  </Badge>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Testing:</span>
                <Badge variant={isRoleTesting ? "default" : "secondary"} className="text-xs">
                  {isRoleTesting ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Grid */}
        <div>
          <div className="flex items-center mb-2">
            <Database className="w-3 h-3 mr-1" />
            <span className="font-medium text-xs">Current Permissions</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {Object.entries(currentPermissions).map(([permission, hasAccess]) => (
              <div key={permission} className={`flex justify-between ${hasAccess ? "text-green-600" : "text-red-500"}`}>
                <span className="truncate">
                  {permission
                    .replace("can", "")
                    .replace(/([A-Z])/g, " $1")
                    .trim()}
                </span>
                <span>{hasAccess ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
