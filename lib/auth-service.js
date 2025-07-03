"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const aws_config_1 = require("./aws-config");
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
];
class AuthService {
    constructor() {
        this.currentUser = null;
        this.token = null;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, aws_config_1.isDevelopmentMode)()) {
                // Mock authentication for development
                const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
                if (user) {
                    this.currentUser = {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        name: user.name,
                        team: user.team,
                    };
                    this.token = `mock-token-${user.id}`;
                    // Store in localStorage for persistence
                    if (typeof window !== "undefined") {
                        localStorage.setItem("auth_user", JSON.stringify(this.currentUser));
                        localStorage.setItem("auth_token", this.token);
                    }
                    return {
                        success: true,
                        user: this.currentUser,
                        token: this.token,
                    };
                }
                else {
                    return {
                        success: false,
                        error: "Invalid email or password",
                    };
                }
            }
            else {
                // TODO: Implement AWS Cognito authentication
                return {
                    success: false,
                    error: "AWS authentication not implemented yet",
                };
            }
        });
    }
    signup(email_1, password_1, name_1) {
        return __awaiter(this, arguments, void 0, function* (email, password, name, role = "player") {
            if ((0, aws_config_1.isDevelopmentMode)()) {
                // Mock signup for development
                const newUser = {
                    id: Date.now().toString(),
                    email,
                    role,
                    name,
                    team: "Raptors Esports",
                };
                this.currentUser = newUser;
                this.token = `mock-token-${newUser.id}`;
                if (typeof window !== "undefined") {
                    localStorage.setItem("auth_user", JSON.stringify(this.currentUser));
                    localStorage.setItem("auth_token", this.token);
                }
                return {
                    success: true,
                    user: this.currentUser,
                    token: this.token,
                };
            }
            else {
                // TODO: Implement AWS Cognito signup
                return {
                    success: false,
                    error: "AWS signup not implemented yet",
                };
            }
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentUser = null;
            this.token = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("auth_user");
                localStorage.removeItem("auth_token");
            }
        });
    }
    getCurrentUser() {
        if (!this.currentUser && typeof window !== "undefined") {
            // Try to restore from localStorage
            const storedUser = localStorage.getItem("auth_user");
            const storedToken = localStorage.getItem("auth_token");
            if (storedUser && storedToken) {
                this.currentUser = JSON.parse(storedUser);
                this.token = storedToken;
            }
        }
        return this.currentUser;
    }
    getToken() {
        if (!this.token && typeof window !== "undefined") {
            this.token = localStorage.getItem("auth_token");
        }
        return this.token;
    }
    isAuthenticated() {
        return !!(this.getCurrentUser() && this.getToken());
    }
    // Role switching for testing (development only)
    switchRole(role) {
        if ((0, aws_config_1.isDevelopmentMode)() && this.currentUser && typeof window !== "undefined") {
            this.currentUser.role = role;
            localStorage.setItem("auth_user", JSON.stringify(this.currentUser));
        }
    }
}
exports.authService = new AuthService();
