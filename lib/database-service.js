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
exports.databaseService = void 0;
const aws_config_1 = require("./aws-config");
// Mock data for development, fully aligned with interfaces
const MOCK_DATA = {
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
};
class DatabaseService {
    query(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, aws_config_1.isDevelopmentMode)()) {
                // Mock database queries for development
                console.log("Mock DB Query:", sql, params);
                // Simple mock responses based on common queries
                if (sql.includes("users")) {
                    return MOCK_DATA.users;
                }
                else if (sql.includes("performance")) {
                    return MOCK_DATA.performance;
                }
                else if (sql.includes("attendance")) {
                    return MOCK_DATA.attendance;
                }
                else if (sql.includes("teams")) {
                    return MOCK_DATA.teams;
                }
                return [];
            }
            else {
                // TODO: Implement real database queries with AWS RDS
                throw new Error("AWS RDS not implemented yet");
            }
        });
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, aws_config_1.isDevelopmentMode)()) {
                const data = MOCK_DATA[query.table] || [];
                let result = [...data];
                // Apply where conditions
                if (query.where) {
                    result = result.filter((item) => {
                        return Object.entries(query.where).every(([key, value]) => item[key] === value);
                    });
                }
                // Apply limit
                if (query.limit) {
                    result = result.slice(0, query.limit);
                }
                return result;
            }
            else {
                // TODO: Implement real database queries
                return [];
            }
        });
    }
    insert(table, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, aws_config_1.isDevelopmentMode)()) {
                const newItem = Object.assign(Object.assign({ id: Date.now().toString() }, data), { created_at: new Date().toISOString() });
                if (MOCK_DATA[table]) {
                    ;
                    MOCK_DATA[table].push(newItem);
                }
                return newItem;
            }
            else {
                // TODO: Implement real database insert
                throw new Error("AWS RDS not implemented yet");
            }
        });
    }
    update(table, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, aws_config_1.isDevelopmentMode)()) {
                const items = MOCK_DATA[table];
                const index = items.findIndex((item) => item.id === id);
                if (index !== -1) {
                    items[index] = Object.assign(Object.assign({}, items[index]), data);
                    return items[index];
                }
                return null;
            }
            else {
                // TODO: Implement real database update
                throw new Error("AWS RDS not implemented yet");
            }
        });
    }
    delete(table, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, aws_config_1.isDevelopmentMode)()) {
                const items = MOCK_DATA[table];
                const index = items.findIndex((item) => item.id === id);
                if (index !== -1) {
                    items.splice(index, 1);
                    return true;
                }
                return false;
            }
            else {
                // TODO: Implement real database delete
                throw new Error("AWS RDS not implemented yet");
            }
        });
    }
    isHealthy() {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    // User operations
    static getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbService = new DatabaseService();
            if (!this.isAWSConfigured || (0, aws_config_1.isDevelopmentMode)()) {
                return MOCK_DATA.users;
            }
            // TODO: Implement AWS RDS query
            return dbService.query("SELECT * FROM users");
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbService = new DatabaseService();
            if (!this.isAWSConfigured || (0, aws_config_1.isDevelopmentMode)()) {
                return MOCK_DATA.users.find((u) => u.id === id) || null;
            }
            // TODO: Implement AWS RDS query
            const users = yield dbService.query("SELECT * FROM users WHERE id = ?", [id]);
            return users.length > 0 ? users[0] : null;
        });
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbService = new DatabaseService();
            if (!this.isAWSConfigured || (0, aws_config_1.isDevelopmentMode)()) {
                return MOCK_DATA.users.find((u) => u.email === email) || null;
            }
            // TODO: Implement AWS RDS query
            const users = yield dbService.query("SELECT * FROM users WHERE email = ?", [email]);
            return users.length > 0 ? users[0] : null;
        });
    }
    // Team operations
    static getTeams() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbService = new DatabaseService();
            if (!this.isAWSConfigured || (0, aws_config_1.isDevelopmentMode)()) {
                return MOCK_DATA.teams;
            }
            // TODO: Implement AWS RDS query
            return dbService.query("SELECT * FROM teams");
        });
    }
    static getTeamById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbService = new DatabaseService();
            if (!this.isAWSConfigured || (0, aws_config_1.isDevelopmentMode)()) {
                return MOCK_DATA.teams.find((t) => t.id === id) || null;
            }
            // TODO: Implement AWS RDS query
            const teams = yield dbService.query("SELECT * FROM teams WHERE id = ?", [id]);
            return teams.length > 0 ? teams[0] : null;
        });
    }
    // Performance operations
    static getPerformanceRecords(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbService = new DatabaseService();
            if (!this.isAWSConfigured || (0, aws_config_1.isDevelopmentMode)()) {
                return userId
                    ? MOCK_DATA.performance.filter((p) => p.user_id === userId)
                    : MOCK_DATA.performance;
            }
            // TODO: Implement AWS RDS query
            const sql = userId ? "SELECT * FROM performance WHERE user_id = ?" : "SELECT * FROM performance";
            const params = userId ? [userId] : [];
            return dbService.query(sql, params);
        });
    }
    static addPerformanceRecord(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbService = new DatabaseService();
            const newRecord = Object.assign(Object.assign({}, record), { id: `perf-${Date.now()}`, created_at: new Date().toISOString() });
            if (!this.isAWSConfigured || (0, aws_config_1.isDevelopmentMode)()) {
                ;
                MOCK_DATA.performance.push(newRecord);
                return newRecord;
            }
            // TODO: Implement AWS RDS insert
            yield dbService.insert("performance", record);
            return newRecord;
        });
    }
    // Attendance operations
    static getAttendanceRecords(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbService = new DatabaseService();
            if (!this.isAWSConfigured || (0, aws_config_1.isDevelopmentMode)()) {
                return userId
                    ? MOCK_DATA.attendance.filter((a) => a.user_id === userId)
                    : MOCK_DATA.attendance;
            }
            // TODO: Implement AWS RDS query
            const sql = userId ? "SELECT * FROM attendance WHERE user_id = ?" : "SELECT * FROM attendance";
            const params = userId ? [userId] : [];
            return dbService.query(sql, params);
        });
    }
    static markAttendance(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbService = new DatabaseService();
            const newRecord = Object.assign(Object.assign({}, record), { id: `att-${Date.now()}`, created_at: new Date().toISOString() });
            if (!this.isAWSConfigured || (0, aws_config_1.isDevelopmentMode)()) {
                // Remove existing record for same user/date
                const existingIndex = MOCK_DATA.attendance.findIndex((a) => a.user_id === record.user_id && a.date === record.date);
                if (existingIndex >= 0) {
                    MOCK_DATA.attendance[existingIndex] = newRecord;
                }
                else {
                    ;
                    MOCK_DATA.attendance.push(newRecord);
                }
                return newRecord;
            }
            // TODO: Implement AWS RDS upsert
            yield dbService.update("attendance", record.user_id, record);
            return newRecord;
        });
    }
    // Health check
    static healthCheck() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbService = new DatabaseService();
            try {
                // For development, always return true
                if (!this.isAWSConfigured || (0, aws_config_1.isDevelopmentMode)()) {
                    return true;
                }
                // TODO: Implement AWS RDS health check
                return yield dbService.isHealthy();
            }
            catch (error) {
                console.error("Database health check failed:", error);
                return false;
            }
        });
    }
}
DatabaseService.isAWSConfigured = (0, aws_config_1.validateAWSConfig)();
exports.databaseService = new DatabaseService();
try { }
catch (error) {
    console.error("Database health check failed:", error);
    return false;
}
exports.databaseService = new DatabaseService();
