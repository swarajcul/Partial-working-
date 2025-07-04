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
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const visibleMenuItems = getVisibleMenuItems(user?.role as any)

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
                <AvatarImage src={user?.avatar_url || "/placeholder.svg?height=24&width=24"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
              </div>
              <ChevronUp className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-56">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard/profile">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
