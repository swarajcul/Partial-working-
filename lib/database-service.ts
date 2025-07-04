import { supabase } from "./supabase-client"
import type { AuthUser } from "./aws-auth"

// Interfaces remain the same for component compatibility
export interface User {
  id: string
  cognito_id: string
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

class DatabaseService {
  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await supabase.from("users").select("id").limit(1)
      if (error) {
        console.error("Database health check failed:", error)
        return false
      }
      return true
    } catch (error) {
      console.error("Database health check failed:", error)
      return false
    }
  }

  // --- User Operations ---

  async upsertUserFromCognito(cognitoUser: AuthUser): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          cognito_id: cognitoUser.id,
          email: cognitoUser.email,
          name: cognitoUser.name,
          role: cognitoUser.role,
        },
        { onConflict: "cognito_id", ignoreDuplicates: false },
      )
      .select()
      .single()

    if (error) {
      console.error("Error upserting user:", error)
      return null
    }
    return data
  }

  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase.from("users").select("*")
    if (error) throw error
    return data
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()
    if (error) {
      if (error.code === "PGRST116") return null // Not found
      throw error
    }
    return data
  }

  async getUserByCognitoId(cognitoId: string): Promise<User | null> {
    const { data, error } = await supabase.from("users").select("*").eq("cognito_id", cognitoId).single()
    if (error) {
      if (error.code === "PGRST116") return null // Not found
      throw error
    }
    return data
  }

  // --- Team Operations ---

  async getTeams(): Promise<Team[]> {
    const { data, error } = await supabase.from("teams").select("*")
    if (error) throw error
    return data
  }

  // --- Performance Operations ---

  async getPerformanceRecords(userId?: string): Promise<PerformanceRecord[]> {
    let query = supabase.from("performance_records").select("*")
    if (userId) {
      query = query.eq("user_id", userId)
    }
    const { data, error } = await query
    if (error) throw error
    return data
  }

  async addPerformanceRecord(record: Omit<PerformanceRecord, "id" | "created_at">): Promise<PerformanceRecord> {
    const { data, error } = await supabase.from("performance_records").insert(record).select().single()
    if (error) throw error
    return data
  }

  // --- Attendance Operations ---

  async getAttendanceRecords(userId?: string): Promise<AttendanceRecord[]> {
    let query = supabase.from("attendance_records").select("*")
    if (userId) {
      query = query.eq("user_id", userId)
    }
    const { data, error } = await query
    if (error) throw error
    return data
  }

  async markAttendance(record: Omit<AttendanceRecord, "id" | "created_at">): Promise<AttendanceRecord> {
    const { data, error } = await supabase
      .from("attendance_records")
      .upsert(record, { onConflict: "user_id,date" })
      .select()
      .single()
    if (error) throw error
    return data
  }
}

export const databaseService = new DatabaseService()
