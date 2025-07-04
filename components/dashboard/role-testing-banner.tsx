"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth/auth-provider"
import { roleLabels } from "@/lib/role-config"
import { TestTube, X, AlertTriangle } from "lucide-react"

export function RoleTestingBanner() {
  const { user, isRoleTesting, resetRole, originalRole } = useAuth()

  if (!isRoleTesting || !user) {
    return null
  }

  return (
    <Alert className="mb-4 border-yellow-500/20 bg-yellow-500/10">
      <TestTube className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm">
            <strong>Role Testing Mode:</strong> Currently viewing as{" "}
            <Badge variant="outline" className="mx-1 text-yellow-700 border-yellow-500/30">
              {roleLabels[user.role as keyof typeof roleLabels]}
            </Badge>
            {originalRole && (
              <span className="text-muted-foreground">
                (Original: {roleLabels[originalRole as keyof typeof roleLabels]})
              </span>
            )}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetRole}
          className="text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/20"
        >
          <X className="h-3 w-3 mr-1" />
          Exit Testing
        </Button>
      </AlertDescription>
    </Alert>
  )
}
