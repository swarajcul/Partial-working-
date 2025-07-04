import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db, initializeDatabase } from "../lib/aws-database"

async function runMigrations() {
  try {
    console.log("🔄 Starting database migrations...")

    // Initialize database schema
    await initializeDatabase()

    // Insert default teams
    // await db.query(`
    //   INSERT INTO teams (name, description)
    //   VALUES
    //     ('Rebellion', 'Main competitive team'),
    //     ('Academy', 'Training and development team')
    //   ON CONFLICT (name) DO NOTHING
    // `)

    // Insert default admin user (you'll need to create this in Cognito first)
    // IMPORTANT: Replace 'admin-cognito-id' with the actual Sub ID from your Cognito user
    // await db.query(`
    //   INSERT INTO users (cognito_id, email, name, role)
    //   VALUES
    //     ('admin-cognito-id', 'admin@esports.com', 'Admin User', 'admin')
    //   ON CONFLICT (cognito_id) DO NOTHING
    // `)

    console.log("✅ Database schema initialized. Default data insertion has been skipped.")

    // Test database connection
    const healthCheck = await db.healthCheck()
    if (healthCheck) {
      console.log("✅ Database connection test passed!")
    } else {
      console.log("❌ Database connection test failed!")
    }
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  } finally {
    await db.close()
  }
}

runMigrations()
