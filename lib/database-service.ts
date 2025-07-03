import { validateAWSConfig, isDevelopmentMode } from "./aws-config"

export interface User {
  id: string
  email: string
  name: string
  role: string
  team_id?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  description?: string
  logo_url?: string
  created_at: string
  updated_at: string
}

export interface PerformanceRecord {
  id: string
  user_id: string
  match_date: string
  kills: number
  deaths: number
  assists: number
  damage_dealt: number
  placement?: number
  notes?: string
  created_at: string
}

export interface AttendanceRecord {
  id: string
  user_id: string
  date: string
  status: "present" | "absent" | "late" | "excused"
  notes?: string
  created_at: string
}

// Mock data for development, fully aligned with interfaces
const MOCK_DATA: {
  users: User[]
  teams: Team[]
  performance: PerformanceRecord[]
  attendance: AttendanceRecord[]
} = {
  users: [
    {
      id: "1",
      email: "admin@esports.com",
      role: "admin",
      name: "Admin User",
      team_id: "1",
      avatar_url: "/avatars/avatar1.png",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      email: "manager@esports.com",
      role: "manager",
      name: "Team Manager",
      team_id: "1",
      avatar_url: "/avatars/avatar2.png",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      email: "coach@esports.com",
      role: "coach",
      name: "Head Coach",
      team_id: "1",
      avatar_url: "/avatars/avatar3.png",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "4",
      email: "analyst@esports.com",
      role: "analyst",
      name: "Data Analyst",
      team_id: "1",
      avatar_url: "/avatars/avatar4.png",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "5",
      email: "player@esports.com",
      role: "player",
      name: "Pro Player",
      team_id: "1",
      avatar_url: "/avatars/avatar5.png",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  teams: [
    {
      id: "1",
      name: "Raptors Esports",
      description: "Valorant Division",
      logo_url: "/logos/raptors.png",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  performance: [
    {
      id: "1",
      user_id: "5",
      match_date: "2024-07-01",
      kills: 15,
      deaths: 8,
      assists: 12,
      damage_dealt: 3200,
      placement: 1,
      notes: "Scrim vs Team Alpha",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: "5",
      match_date: "2024-07-02",
      kills: 22,
      deaths: 5,
      assists: 18,
      damage_dealt: 4500,
      placement: 1,
      notes: "Tournament Final",
      created_at: new Date().toISOString(),
    },
  ],
  attendance: [
    {
      id: "1",
      user_id: "5",
      date: "2024-07-01",
      status: "present",
      notes: "On time for scrims.",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: "5",
      date: "2024-07-02",
      status: "late",
      notes: "Arrived 15 minutes late, traffic.",
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      user_id: "4",
      date: "2024-07-02",
      status: "present",
      notes: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      user_id: "3",
      date: "2024-07-03",
      status: "absent",
      notes: "Doctor's appointment.",
      created_at: new Date().toISOString(),
    },
    {
      id: "5",
      user_id: "5",
      date: "2024-07-03",
      status: "excused",
      notes: "Family emergency, approved by manager.",
      created_at: new Date().toISOString(),
    },
  ],
}

export interface DatabaseQuery {
  table: string
  where?: Record<string, any>
  select?: string[]
  limit?: number
}

class DatabaseService {
  private static isAWSConfigured = validateAWSConfig()

  async query(sql: string, params?: any[]): Promise<any[]> {
    if (isDevelopmentMode()) {
      console.log("Mock DB Query:", sql, params)
      if (sql.includes("users")) {
        return MOCK_DATA.users
      } else if (sql.includes("performance")) {
        return MOCK_DATA.performance
      } else if (sql.includes("attendance")) {
        return MOCK_DATA.attendance
      } else if (sql.includes("teams")) {
        return MOCK_DATA.teams
      }
      return []
    } else {
      throw new Error("AWS RDS not implemented yet")
    }
  }

  async find(query: DatabaseQuery): Promise<any[]> {
    if (isDevelopmentMode()) {
      const data = MOCK_DATA[query.table as keyof typeof MOCK_DATA] || []
      let result = [...data]
      if (query.where) {
        result = result.filter((item) => {
          return Object.entries(query.where!).every(([key, value]) => item[key as keyof typeof item] === value)
        })
      }
      if (query.limit) {
        result = result.slice(0, query.limit)
      }
      return result
    } else {
      return []
    }
  }

  async insert(table: string, data: Record<string, any>): Promise<any> {
    if (isDevelopmentMode()) {
      const newItem = { id: Date.now().toString(), ...data, created_at: new Date().toISOString() }
      if (MOCK_DATA[table as keyof typeof MOCK_DATA]) {
        ;(MOCK_DATA[table as keyof typeof MOCK_DATA] as any[]).push(newItem)
      }
      return newItem
    } else {
      throw new Error("AWS RDS not implemented yet")
    }
  }

  async update(table: string, id: string, data: Record<string, any>): Promise<any> {
    if (isDevelopmentMode()) {
      const items = MOCK_DATA[table as keyof typeof MOCK_DATA] as any[]
      const index = items.findIndex((item) => item.id === id)
      if (index !== -1) {
        items[index] = { ...items[index], ...data }
        return items[index]
      }
      return null
    } else {
      throw new Error("AWS RDS not implemented yet")
    }
  }

  async delete(table: string, id: string): Promise<boolean> {
    if (isDevelopmentMode()) {
      const items = MOCK_DATA[table as keyof typeof MOCK_DATA] as any[]
      const index = items.findIndex((item) => item.id === id)
      if (index !== -1) {
        items.splice(index, 1)
        return true
      }
      return false
    } else {
      throw new Error("AWS RDS not implemented yet")
    }
  }

  async isHealthy(): Promise<boolean> {
    return true
  }

  static async getUsers(): Promise<User[]> {
    const dbService = new DatabaseService()
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      return MOCK_DATA.users as User[]
    }
    return dbService.query("SELECT * FROM users")
  }

  static async getUserById(id: string): Promise<User | null> {
    const dbService = new DatabaseService()
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      return MOCK_DATA.users.find((u) => u.id === id) || null
    }
    const users = await dbService.query("SELECT * FROM users WHERE id = ?", [id])
    return users.length > 0 ? users[0] : null
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const dbService = new DatabaseService()
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      return MOCK_DATA.users.find((u) => u.email === email) || null
    }
    const users = await dbService.query("SELECT * FROM users WHERE email = ?", [email])
    return users.length > 0 ? users[0] : null
  }

  static async getTeams(): Promise<Team[]> {
    const dbService = new DatabaseService()
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      return MOCK_DATA.teams as Team[]
    }
    return dbService.query("SELECT * FROM teams")
  }

  static async getTeamById(id: string): Promise<Team | null> {
    const dbService = new DatabaseService()
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      return MOCK_DATA.teams.find((t) => t.id === id) || null
    }
    const teams = await dbService.query("SELECT * FROM teams WHERE id = ?", [id])
    return teams.length > 0 ? teams[0] : null
  }

  static async getPerformanceRecords(userId?: string): Promise<PerformanceRecord[]> {
    const dbService = new DatabaseService()
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      return userId
        ? MOCK_DATA.performance.filter((p) => p.user_id === userId)
        : (MOCK_DATA.performance as PerformanceRecord[])
    }
    const sql = userId ? "SELECT * FROM performance WHERE user_id = ?" : "SELECT * FROM performance"
    const params = userId ? [userId] : []
    return dbService.query(sql, params)
  }

  static async addPerformanceRecord(record: Omit<PerformanceRecord, "id" | "created_at">): Promise<PerformanceRecord> {
    const dbService = new DatabaseService()
    const newRecord: PerformanceRecord = {
      ...record,
      id: `perf-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      MOCK_DATA.performance.push(newRecord)
      return newRecord
    }
    await dbService.insert("performance", record)
    return newRecord
  }

  static async getAttendanceRecords(userId?: string): Promise<AttendanceRecord[]> {
    const dbService = new DatabaseService()
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      return userId
        ? MOCK_DATA.attendance.filter((a) => a.user_id === userId)
        : (MOCK_DATA.attendance as AttendanceRecord[])
    }
    const sql = userId ? "SELECT * FROM attendance WHERE user_id = ?" : "SELECT * FROM attendance"
    const params = userId ? [userId] : []
    return dbService.query(sql, params)
  }

  static async markAttendance(record: Omit<AttendanceRecord, "id" | "created_at">): Promise<AttendanceRecord> {
    const dbService = new DatabaseService()
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      const existingIndex = MOCK_DATA.attendance.findIndex(
        (a) => a.user_id === record.user_id && a.date === record.date,
      )
      if (existingIndex >= 0) {
        MOCK_DATA.attendance[existingIndex] = newRecord
      } else {
        MOCK_DATA.attendance.push(newRecord)
      }
      return newRecord
    }
    await dbService.update("attendance", record.user_id, record)
    return newRecord
  }

  static async healthCheck(): Promise<boolean> {
    const dbService = new DatabaseService()
    try {
      if (!this.isAWSConfigured || isDevelopmentMode()) {
        return true
      }
      return await dbService.isHealthy()
    } catch (error) {
      console.error("Database health check failed:", error)
      return false
    }
  }
}

export const databaseService = new DatabaseService()
