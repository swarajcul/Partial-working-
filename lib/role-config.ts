export type UserRole = "admin" | "manager" | "coach" | "analyst" | "player"

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
  canViewProfile: boolean
  canEditProfile: boolean
  canViewKPIs: boolean
  canEditKPIs: boolean
  canManageStaff: boolean
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
    canViewProfile: true,
    canEditProfile: true,
    canViewKPIs: true,
    canEditKPIs: true,
    canManageStaff: true,
  },
  manager: {
    canViewAllTeams: true,
    canEditTeams: true,
    canManageUsers: false,
    canViewFinance: true,
    canEditFinance: false,
    canViewReports: true,
    canEditReports: true,
    canViewPerformance: true,
    canEditPerformance: true,
    canViewAttendance: true,
    canEditAttendance: true,
    canScheduleMatches: true,
    canViewAnalytics: true,
    canAccessAdmin: false,
    canViewOwnDataOnly: false,
    canExportData: true,
    canViewProfile: true,
    canEditProfile: true,
    canViewKPIs: true,
    canEditKPIs: true,
    canManageStaff: true,
  },
  coach: {
    canViewAllTeams: false,
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
    canViewProfile: true,
    canEditProfile: true,
    canViewKPIs: true,
    canEditKPIs: false,
    canManageStaff: false,
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
    canViewProfile: true,
    canEditProfile: true,
    canViewKPIs: true,
    canEditKPIs: false,
    canManageStaff: false,
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
    canEditPerformance: true,
    canViewAttendance: true,
    canEditAttendance: true,
    canScheduleMatches: false,
    canViewAnalytics: true,
    canAccessAdmin: false,
    canViewOwnDataOnly: true,
    canExportData: false,
    canViewProfile: true,
    canEditProfile: true,
    canViewKPIs: false,
    canEditKPIs: false,
    canManageStaff: false,
  },
}

export const roleLabels: Record<UserRole, string> = {
  admin: "👑 Admin",
  manager: "🎯 Manager",
  coach: "🧑‍🏫 Coach",
  analyst: "📊 Analyst",
  player: "🧍 Player",
}

export const roleDescriptions: Record<UserRole, string> = {
  admin: "Full system access - manage everything",
  manager: "Team oversight - manage coaches and analysts",
  coach: "Team management - assigned teams only",
  analyst: "Advanced analytics and reporting access",
  player: "Personal data and team information only",
}

export const roleHierarchy: Record<UserRole, number> = {
  admin: 5,
  manager: 4,
  coach: 3,
  analyst: 3,
  player: 1,
}

export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return rolePermissions[role][permission]
}

export function getVisibleMenuItems(role?: UserRole) { // Allow role to be optional
  const defaultMenuItems = [
    {
      title: "Overview",
      url: "/dashboard",
      icon: "Home",
      visible: true,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: "User",
      visible: true, // Basic visibility for profile
    },
  ];

  if (!role || !rolePermissions[role]) {
    // If role is undefined, or not a valid key in rolePermissions,
    // return a minimal safe menu.
    return defaultMenuItems.filter(item => item.visible);
  }

  const permissions = rolePermissions[role];

  const menuItems = [
    {
      title: "Overview",
      url: "/dashboard",
      icon: "Home",
      visible: true,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: "User",
      visible: permissions.canViewProfile,
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
      title: "KPI Dashboard",
      url: "/dashboard/kpi",
      icon: "TrendingUp",
      visible: permissions.canViewKPIs,
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
