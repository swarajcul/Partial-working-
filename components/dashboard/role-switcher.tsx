"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth/auth-provider"
import { type UserRole, roleLabels, roleDescriptions, hasPermission } from "@/lib/role-config"
import { TestTube, RotateCcw, Eye, Code, AlertTriangle } from "lucide-react"

export function RoleSwitcher() {
  const { user, switchRole, resetRole, isRoleTesting, toggleDevMode, isDevMode } = useAuth()
  const [showRoleInfo, setShowRoleInfo] = useState(false)

  if (!user || (user.role !== "admin" && !isRoleTesting)) {
    return null
  }

  const currentRole = user.role as UserRole
  const availableRoles: UserRole[] = ["admin", "coach", "analyst", "player"]

  return (
    <div className="flex items-center space-x-2">
      {/* Dev Mode Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="dev-mode"
          checked={isDevMode}
          onCheckedChange={toggleDevMode}
          className="data-[state=checked]:bg-green-600"
        />
        <Label htmlFor="dev-mode" className="text-xs text-muted-foreground">
          <Code className="w-3 h-3 inline mr-1" />
          Dev
        </Label>
      </div>

      {/* Role Testing Indicator */}
      {isRoleTesting && (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          <TestTube className="w-3 h-3 mr-1" />
          Testing Mode
        </Badge>
      )}

      {/* Role Switcher Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs">
            <Eye className="w-3 h-3 mr-1" />
            {roleLabels[currentRole]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs">Switch Role View</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {availableRoles.map((role) => (
            <DropdownMenuItem
              key={role}
              onClick={() => switchRole(role)}
              className={`text-xs ${currentRole === role ? "bg-accent" : ""}`}
            >
              <div className="flex items-center justify-between w-full">
                <span>{roleLabels[role]}</span>
                {currentRole === role && (
                  <Badge variant="secondary" className="text-xs">
                    Current
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={resetRole} className="text-xs text-orange-600">
            <RotateCcw className="w-3 h-3 mr-2" />
            Reset to Original Role
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setShowRoleInfo(true)} className="text-xs">
            <AlertTriangle className="w-3 h-3 mr-2" />
            Role Permissions Info
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Role Information Dialog */}
      <Dialog open={showRoleInfo} onOpenChange={setShowRoleInfo}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Role Permissions Overview</DialogTitle>
            <DialogDescription>Understanding what each role can access and modify</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {availableRoles.map((role) => (
              <Card key={role} className={`${currentRole === role ? "ring-2 ring-primary" : ""}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    {roleLabels[role]}
                    {currentRole === role && (
                      <Badge variant="default" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs">{roleDescriptions[role]}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Permissions:</div>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div
                        className={`flex justify-between ${hasPermission(role, "canViewAllTeams") ? "text-green-600" : "text-red-500"}`}
                      >
                        <span>View All Teams</span>
                        <span>{hasPermission(role, "canViewAllTeams") ? "✓" : "✗"}</span>
                      </div>
                      <div
                        className={`flex justify-between ${hasPermission(role, "canEditTeams") ? "text-green-600" : "text-red-500"}`}
                      >
                        <span>Edit Teams</span>
                        <span>{hasPermission(role, "canEditTeams") ? "✓" : "✗"}</span>
                      </div>
                      <div
                        className={`flex justify-between ${hasPermission(role, "canViewFinance") ? "text-green-600" : "text-red-500"}`}
                      >
                        <span>View Finance</span>
                        <span>{hasPermission(role, "canViewFinance") ? "✓" : "✗"}</span>
                      </div>
                      <div
                        className={`flex justify-between ${hasPermission(role, "canAccessAdmin") ? "text-green-600" : "text-red-500"}`}
                      >
                        <span>Admin Access</span>
                        <span>{hasPermission(role, "canAccessAdmin") ? "✓" : "✗"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
