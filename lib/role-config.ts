export type UserRole = "admin" | "coach" | "analyst" | "player"

export interface RolePermissions {
  canViewAllTeams: boolean
  canEditTeams: boolean
  canManageUsers: boolean
  canViewFinance: boolean
  canEditFinance: boolean
  canViewReports: boolean
  canEditReports: boolean
  canViewPerformance: boolean
  canEditPerformance: boolean
  canViewAttendance: boolean
  canEditAttendance: boolean
  canScheduleMatches: boolean
  canViewAnalytics: boolean
  canAccessAdmin: boolean
  canViewOwnDataOnly: boolean
  canExportData: boolean
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    canViewAllTeams: true,
    canEditTeams: true,
    canManageUsers: true,
    canViewFinance: true,
    canEditFinance: true,
    canViewReports: true,
    canEditReports: true,
    canViewPerformance: true,
    canEditPerformance: true,
    canViewAttendance: true,
    canEditAttendance: true,
    canScheduleMatches: true,
    canViewAnalytics: true,
    canAccessAdmin: true,
    canViewOwnDataOnly: false,
    canExportData: true,
  },
  coach: {
    canViewAllTeams: false, // Only assigned teams
    canEditTeams: true,
    canManageUsers: false,
    canViewFinance: false,
    canEditFinance: false,
    canViewReports: true,
    canEditReports: false,
    canViewPerformance: true,
    canEditPerformance: true,
    canViewAttendance: true,
    canEditAttendance: true,
    canScheduleMatches: true,
    canViewAnalytics: true,
    canAccessAdmin: false,
    canViewOwnDataOnly: false,
    canExportData: true,
  },
  analyst: {
    canViewAllTeams: true,
    canEditTeams: false,
    canManageUsers: false,
    canViewFinance: false,
    canEditFinance: false,
    canViewReports: true,
    canEditReports: false,
    canViewPerformance: true,
    canEditPerformance: false,
    canViewAttendance: true,
    canEditAttendance: false,
    canScheduleMatches: false,
    canViewAnalytics: true,
    canAccessAdmin: false,
    canViewOwnDataOnly: false,
    canExportData: true,
  },
  player: {
    canViewAllTeams: false,
    canEditTeams: false,
    canManageUsers: false,
    canViewFinance: false,
    canEditFinance: false,
    canViewReports: false,
    canEditReports: false,
    canViewPerformance: true,
    canEditPerformance: false,
    canViewAttendance: true,
    canEditAttendance: false,
    canScheduleMatches: false,
    canViewAnalytics: true,
    canAccessAdmin: false,
    canViewOwnDataOnly: true,
    canExportData: false,
  },
}

export const roleLabels: Record<UserRole, string> = {
  admin: "👑 Admin",
  coach: "🧑‍🏫 Coach",
  analyst: "🧑‍💻 Analyst",
  player: "🧍 Player",
}

export const roleDescriptions: Record<UserRole, string> = {
  admin: "Full system access - manage everything",
  coach: "Team management - assigned teams only",
  analyst: "Read-only analytics and reporting access",
  player: "Personal data and team information only",
}

export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return rolePermissions[role][permission]
}

export function getVisibleMenuItems(role: UserRole) {
  const permissions = rolePermissions[role]

  const menuItems = [
    {
      title: "Overview",
      url: "/dashboard",
      icon: "Home",
      visible: true,
    },
    {
      title: "Team Info",
      url: "/dashboard/teams",
      icon: "Users",
      visible: permissions.canViewAllTeams || !permissions.canViewOwnDataOnly,
    },
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: "Calendar",
      visible: permissions.canViewAttendance,
    },
    {
      title: "Performance",
      url: "/dashboard/performance",
      icon: "Target",
      visible: permissions.canViewPerformance,
    },
    {
      title: "Match Scheduler",
      url: "/dashboard/matches",
      icon: "Trophy",
      visible: permissions.canScheduleMatches,
    },
    {
      title: "Calendar Scheduler",
      url: "/dashboard/scheduler",
      icon: "CalendarDays",
      visible: permissions.canScheduleMatches,
    },
    {
      title: "Analytics",
      url: "/dashboard/stats",
      icon: "BarChart3",
      visible: permissions.canViewAnalytics,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: "FileText",
      visible: permissions.canViewReports,
    },
    {
      title: "Finance",
      url: "/dashboard/finance",
      icon: "DollarSign",
      visible: permissions.canViewFinance,
    },
    {
      title: "Admin Panel",
      url: "/dashboard/admin",
      icon: "Settings",
      visible: permissions.canAccessAdmin,
    },
  ]

  return menuItems.filter((item) => item.visible)
}
