"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: '.env.local' });
const aws_database_1 = require("../lib/aws-database");
function runMigrations() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("🔄 Starting database migrations...");
            // Initialize database schema
            yield (0, aws_database_1.initializeDatabase)();
            // Insert default teams
            // await db.query(`
            //   INSERT INTO teams (name, description)
            //   VALUES
            //     ('Rebellion', 'Main competitive team'),
            //     ('Academy', 'Training and development team')
            //   ON CONFLICT (name) DO NOTHING
            // `);
            // Insert default admin user (you'll need to create this in Cognito first)
            // IMPORTANT: Replace 'admin-cognito-id' with the actual Sub ID from your Cognito user
            // await db.query(`
            //   INSERT INTO users (cognito_id, email, name, role)
            //   VALUES
            //     ('admin-cognito-id', 'admin@esports.com', 'Admin User', 'admin')
            //   ON CONFLICT (cognito_id) DO NOTHING
            // `);
            console.log("✅ Database schema initialized. Default data insertion has been skipped.");
            // Test database connection
            const healthCheck = yield aws_database_1.db.healthCheck();
            if (healthCheck) {
                console.log("✅ Database connection test passed!");
            }
            else {
                console.log("❌ Database connection test failed!");
            }
        }
        catch (error) {
            console.error("❌ Migration failed:", error);
            process.exit(1);
        }
        finally {
            yield aws_database_1.db.close();
        }
    });
}
runMigrations();
