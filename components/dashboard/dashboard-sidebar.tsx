import { LayoutDashboard, ListChecks, Plus, Settings, User, Users } from "lucide-react"
import type { NavItem } from "@/types"

interface DashboardSidebarProps {
  isAdmin: boolean
}

export const DashboardSidebar = ({ isAdmin }: DashboardSidebarProps) => {
  const navigationItems: NavItem[] = [
    {
      title: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Quests",
      url: "/dashboard/quests",
      icon: ListChecks,
    },
    {
      title: "Create Quest",
      url: "/dashboard/quests/create",
      icon: Plus,
      permissions: ["canCreateQuest"],
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
      permissions: ["canViewProfile"],
    },
  ]

  const adminNavigationItems: NavItem[] = [
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
      permissions: ["canViewUsers"],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      permissions: ["canManageSettings"],
    },
  ]

  const filteredNavigationItems = navigationItems.filter((item) => {
    if (item.permissions) {
      return isAdmin
    }
    return true
  })

  const filteredAdminNavigationItems = adminNavigationItems.filter((item) => {
    if (item.permissions) {
      return isAdmin
    }
    return true
  })

  return (
    <div className="w-64 bg-gray-100 h-full p-4">
      <nav>
        <ul>
          {filteredNavigationItems.map((item) => (
            <li key={item.title}>
              <a href={item.url} className="block py-2 px-4 hover:bg-gray-200">
                <item.icon className="inline-block mr-2" size={16} />
                {item.title}
              </a>
            </li>
          ))}
          {isAdmin &&
            filteredAdminNavigationItems.map((item) => (
              <li key={item.title}>
                <a href={item.url} className="block py-2 px-4 hover:bg-gray-200">
                  <item.icon className="inline-block mr-2" size={16} />
                  {item.title}
                </a>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  )
}
