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

// Mock data for development
const MOCK_DATA = {
  users: [
    { id: "1", email: "admin@esports.com", role: "admin", name: "Admin User", team: "Raptors Esports" },
    { id: "2", email: "manager@esports.com", role: "manager", name: "Team Manager", team: "Raptors Esports" },
    { id: "3", email: "coach@esports.com", role: "coach", name: "Head Coach", team: "Raptors Esports" },
    { id: "4", email: "analyst@esports.com", role: "analyst", name: "Data Analyst", team: "Raptors Esports" },
    { id: "5", email: "player@esports.com", role: "player", name: "Pro Player", team: "Raptors Esports" },
  ],
  performance: [
    { id: "1", userId: "5", match: "Scrim vs Team Alpha", kills: 15, deaths: 8, assists: 12, date: "2024-01-15" },
    { id: "2", userId: "5", match: "Tournament Final", kills: 22, deaths: 5, assists: 18, date: "2024-01-14" },
  ],
  attendance: [
    { id: "1", userId: "5", date: "2024-01-15", status: "present", notes: "On time" },
    { id: "2", userId: "5", date: "2024-01-14", status: "present", notes: "Great performance" },
  ],
  teams: [{ id: "1", name: "Raptors Esports", game: "Valorant", members: ["5"], coach: "3", manager: "2" }],
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
      // Mock database queries for development
      console.log("Mock DB Query:", sql, params)

      // Simple mock responses based on common queries
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
      // TODO: Implement real database queries with AWS RDS
      throw new Error("AWS RDS not implemented yet")
    }
  }

  async find(query: DatabaseQuery): Promise<any[]> {
    if (isDevelopmentMode()) {
      const data = MOCK_DATA[query.table as keyof typeof MOCK_DATA] || []

      let result = [...data]

      // Apply where conditions
      if (query.where) {
        result = result.filter((item) => {
          return Object.entries(query.where!).every(([key, value]) => item[key] === value)
        })
      }

      // Apply limit
      if (query.limit) {
        result = result.slice(0, query.limit)
      }

      return result
    } else {
      // TODO: Implement real database queries
      return []
    }
  }

  async insert(table: string, data: Record<string, any>): Promise<any> {
    if (isDevelopmentMode()) {
      const newItem = { id: Date.now().toString(), ...data }

      if (MOCK_DATA[table as keyof typeof MOCK_DATA]) {
        ;(MOCK_DATA[table as keyof typeof MOCK_DATA] as any[]).push(newItem)
      }

      return newItem
    } else {
      // TODO: Implement real database insert
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
      // TODO: Implement real database update
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
      // TODO: Implement real database delete
      throw new Error("AWS RDS not implemented yet")
    }
  }

  async isHealthy(): Promise<boolean> {
    return true
  }

  // User operations
  static async getUsers(): Promise<User[]> {
    const dbService = new DatabaseService()
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      return MOCK_DATA.users as User[]
    }
    // TODO: Implement AWS RDS query
    return dbService.query("SELECT * FROM users")
  }

  static async getUserById(id: string): Promise<User | null> {
    const dbService = new DatabaseService()
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      return MOCK_DATA.users.find((u) => u.id === id) || null
    }
    // TODO: Implement AWS RDS query
    const users = await dbService.query("SELECT * FROM users WHERE id = ?", [id])
    return users.length > 0 ? users[0] : null
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const dbService = new DatabaseService()
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      return MOCK_DATA.users.find((u) => u.email === email) || null
    }
    // TODO: Implement AWS RDS query
    const users = await dbService.query("SELECT * FROM users WHERE email = ?", [email])
    return users.length > 0 ? users[0] : null
  }

  // Team operations
  static async getTeams(): Promise<Team[]> {
    const dbService = new DatabaseService()
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      return MOCK_DATA.teams as Team[]
    }
    // TODO: Implement AWS RDS query
    return dbService.query("SELECT * FROM teams")
  }

  static async getTeamById(id: string): Promise<Team | null> {
    const dbService = new DatabaseService()
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      return MOCK_DATA.teams.find((t) => t.id === id) || null
    }
    // TODO: Implement AWS RDS query
    const teams = await dbService.query("SELECT * FROM teams WHERE id = ?", [id])
    return teams.length > 0 ? teams[0] : null
  }

  // Performance operations
  static async getPerformanceRecords(userId?: string): Promise<PerformanceRecord[]> {
    const dbService = new DatabaseService()
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      return userId
        ? MOCK_DATA.performance.filter((p) => p.userId === userId)
        : (MOCK_DATA.performance as PerformanceRecord[])
    }
    // TODO: Implement AWS RDS query
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
      ;(MOCK_DATA.performance as any[]).push(newRecord)
      return newRecord
    }
    // TODO: Implement AWS RDS insert
    await dbService.insert("performance", record)
    return newRecord
  }

  // Attendance operations
  static async getAttendanceRecords(userId?: string): Promise<AttendanceRecord[]> {
    const dbService = new DatabaseService()
    if (!this.isAWSConfigured || isDevelopmentMode()) {
      return userId
        ? MOCK_DATA.attendance.filter((a) => a.userId === userId)
        : (MOCK_DATA.attendance as AttendanceRecord[])
    }
    // TODO: Implement AWS RDS query
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
      // Remove existing record for same user/date
      const existingIndex = MOCK_DATA.attendance.findIndex((a) => a.userId === record.user_id && a.date === record.date)
      if (existingIndex >= 0) {
        MOCK_DATA.attendance[existingIndex] = newRecord
      } else {
        ;(MOCK_DATA.attendance as any[]).push(newRecord)
      }
      return newRecord
    }
    // TODO: Implement AWS RDS upsert
    await dbService.update("attendance", record.user_id, record)
    return newRecord
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    const dbService = new DatabaseService()
    try {
      // For development, always return true
      if (!this.isAWSConfigured || isDevelopmentMode()) {
        return true
      }
      // TODO: Implement AWS RDS health check
      return await dbService.isHealthy()
    } catch (error) {
      console.error("Database health check failed:", error)
      return false
    }
  }
}

export const databaseService = new DatabaseService()
