import { isDevelopmentMode } from "./aws-config"

export interface User {
  id: string
  email: string
  role: string
  name: string
  team: string
  avatar?: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  error?: string
}

// Mock users for development
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@esports.com",
    password: "password123",
    role: "admin",
    name: "Admin User",
    team: "Raptors Esports",
  },
  {
    id: "2",
    email: "manager@esports.com",
    password: "password123",
    role: "manager",
    name: "Team Manager",
    team: "Raptors Esports",
  },
  {
    id: "3",
    email: "coach@esports.com",
    password: "password123",
    role: "coach",
    name: "Head Coach",
    team: "Raptors Esports",
  },
  {
    id: "4",
    email: "analyst@esports.com",
    password: "password123",
    role: "analyst",
    name: "Data Analyst",
    team: "Raptors Esports",
  },
  {
    id: "5",
    email: "player@esports.com",
    password: "password123",
    role: "player",
    name: "Pro Player",
    team: "Raptors Esports",
  },
]

class AuthService {
  private currentUser: User | null = null
  private token: string | null = null

  async login(email: string, password: string): Promise<AuthResponse> {
    if (isDevelopmentMode()) {
      // Mock authentication for development
      const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

      if (user) {
        this.currentUser = {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          team: user.team,
        }
        this.token = `mock-token-${user.id}`

        // Store in localStorage for persistence
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_user", JSON.stringify(this.currentUser))
          localStorage.setItem("auth_token", this.token)
        }

        return {
          success: true,
          user: this.currentUser,
          token: this.token,
        }
      } else {
        return {
          success: false,
          error: "Invalid email or password",
        }
      }
    } else {
      // TODO: Implement AWS Cognito authentication
      return {
        success: false,
        error: "AWS authentication not implemented yet",
      }
    }
  }

  async signup(email: string, password: string, name: string, role = "player"): Promise<AuthResponse> {
    if (isDevelopmentMode()) {
      // Mock signup for development
      const newUser: User = {
        id: Date.now().toString(),
        email,
        role,
        name,
        team: "Raptors Esports",
      }

      this.currentUser = newUser
      this.token = `mock-token-${newUser.id}`

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(this.currentUser))
        localStorage.setItem("auth_token", this.token)
      }

      return {
        success: true,
        user: this.currentUser,
        token: this.token,
      }
    } else {
      // TODO: Implement AWS Cognito signup
      return {
        success: false,
        error: "AWS signup not implemented yet",
      }
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_user")
      localStorage.removeItem("auth_token")
    }
  }

  getCurrentUser(): User | null {
    if (!this.currentUser && typeof window !== "undefined") {
      // Try to restore from localStorage
      const storedUser = localStorage.getItem("auth_user")
      const storedToken = localStorage.getItem("auth_token")

      if (storedUser && storedToken) {
        this.currentUser = JSON.parse(storedUser)
        this.token = storedToken
      }
    }

    return this.currentUser
  }

  getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
    return this.token
  }

  isAuthenticated(): boolean {
    return !!(this.getCurrentUser() && this.getToken())
  }

  // Role switching for testing (development only)
  switchRole(role: string): void {
    if (isDevelopmentMode() && this.currentUser && typeof window !== "undefined") {
      this.currentUser.role = role
      localStorage.setItem("auth_user", JSON.stringify(this.currentUser))
    }
  }
}

export const authService = new AuthService()
