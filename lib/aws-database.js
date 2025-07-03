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
exports.db = void 0;
exports.initializeDatabase = initializeDatabase;
const pg_1 = require("pg");
const aws_config_1 = require("./aws-config");
class DatabaseService {
    constructor() {
        this.pool = new pg_1.Pool({
            host: aws_config_1.AWS_CONFIG.rds.host,
            port: aws_config_1.AWS_CONFIG.rds.port,
            database: aws_config_1.AWS_CONFIG.rds.database,
            user: aws_config_1.AWS_CONFIG.rds.username,
            password: aws_config_1.AWS_CONFIG.rds.password,
            ssl: {
                rejectUnauthorized: false, // For AWS RDS
            },
            max: 20, // Maximum number of clients in the pool
            idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
            connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
        });
    }
    static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }
    query(text, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                const result = yield client.query(text, params);
                return result;
            }
            finally {
                client.release();
            }
        });
    }
    getClient() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.pool.connect();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.end();
        });
    }
    // Health check
    healthCheck() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.query("SELECT 1 as health");
                return result.rows[0].health === 1;
            }
            catch (error) {
                console.error("Database health check failed:", error);
                return false;
            }
        });
    }
}
exports.db = DatabaseService.getInstance();
// Database schema initialization
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Teams table
            yield exports.db.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logo_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
            // Users table
            yield exports.db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cognito_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'player',
        team_id UUID REFERENCES teams(id),
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
            // Performance records table
            yield exports.db.query(`
      CREATE TABLE IF NOT EXISTS performance_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        match_date DATE NOT NULL,
        kills INTEGER DEFAULT 0,
        deaths INTEGER DEFAULT 0,
        assists INTEGER DEFAULT 0,
        damage_dealt INTEGER DEFAULT 0,
        placement INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
            // Attendance records table
            yield exports.db.query(`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'present',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, date)
      )
    `);
            // Matches table
            yield exports.db.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        scheduled_date TIMESTAMP NOT NULL,
        opponent VARCHAR(255),
        match_type VARCHAR(50) DEFAULT 'scrim',
        status VARCHAR(20) DEFAULT 'scheduled',
        team_id UUID REFERENCES teams(id),
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
            // KPI records table
            yield exports.db.query(`
      CREATE TABLE IF NOT EXISTS kpi_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        metric_name VARCHAR(100) NOT NULL,
        metric_value DECIMAL(10,2) NOT NULL,
        target_value DECIMAL(10,2),
        period_start DATE NOT NULL,
        period_end DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
            console.log("Database schema initialized successfully");
        }
        catch (error) {
            console.error("Database initialization error:", error);
            throw error;
        }
    });
}
