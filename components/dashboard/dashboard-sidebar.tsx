"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type UserRole } from "@/lib/role-config" // Import UserRole
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import {
  Home,
  Users,
  Calendar,
  BarChart3,
  Trophy,
  FileText,
  DollarSign,
  Settings,
  LogOut,
  ChevronUp,
  Target,
  CalendarDays,
  User,
  TrendingUp,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getVisibleMenuItems } from "@/lib/role-config"
import { RoleSwitcher } from "./role-switcher"

const menuItemIcons = {
  Home,
  Users,
  Calendar,
  Target,
  Trophy,
  CalendarDays,
  BarChart3,
  FileText,
  DollarSign,
  Settings,
  User,
  TrendingUp,
}

export function DashboardSidebar() {
  const { user, profile, signOut } = useAuth() // Use profile and signOut
  const pathname = usePathname()

  // Use profile.role if available and valid, otherwise fallback to user.role (which might be 'authenticated')
  // The getVisibleMenuItems function has its own fallback for undefined/invalid roles.
  const appRole = profile?.role as UserRole | undefined;
  const authRole = user?.role as UserRole | undefined; // Supabase role, e.g., 'authenticated'

  // Prefer appRole from profile if it exists and is a valid UserRole string
  // The `getVisibleMenuItems` will handle if the passed role is undefined or not in its map.
  const roleForMenu = appRole || authRole;
  const visibleMenuItems = getVisibleMenuItems(roleForMenu)

  // For display, prioritize profile.role, then user.user_metadata.full_name or profile.full_name
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email;
  const displayRole = profile?.role || user?.role;
  const displayAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url || "/placeholder.svg?height=24&width=24";


  return (
    <Sidebar className="border-r bg-background">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">R</span>
            </div>
            <div>
              <h2 className="font-bold text-foreground">Raptors</h2>
              <p className="text-xs text-muted-foreground">Esports Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <RoleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  className="text-foreground hover:text-primary hover:bg-accent data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                >
                  <Link href="/dashboard">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {visibleMenuItems.map((item) => {
                const IconComponent = menuItemIcons[item.icon as keyof typeof menuItemIcons]
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="text-foreground hover:text-primary hover:bg-accent data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                    >
                      <Link href={item.url}>
                        <IconComponent className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Home Button Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary">Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-foreground hover:text-primary hover:bg-accent">
                  <Link href="/">
                    <ExternalLink className="w-4 h-4" />
                    <span>Back to Homepage</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-accent">
              <Avatar className="w-6 h-6 mr-2">
                <AvatarImage src={displayAvatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {displayName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">{displayName}</div>
                <div className="text-xs text-muted-foreground capitalize">{displayRole}</div>
              </div>
              <ChevronUp className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-56">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard/profile">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
