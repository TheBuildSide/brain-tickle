import { supabase } from "./supabase";
import { readFileSync } from "fs";
import { join } from "path";
import { DB_CONFIG } from "./config/database";

// Global variable to track initialization status
declare global {
  var __dbInitialized: boolean | undefined;
}

async function runMigration(sql: string) {
  const { error } = await supabase.rpc("exec_sql", { sql });
  if (error) {
    throw new Error(`Migration failed: ${error.message}`);
  }
}

export async function initializeDatabase() {
  // Check if already initialized
  if (global.__dbInitialized) {
    return true;
  }

  try {
    // Run each migration in sequence
    for (const fileName of DB_CONFIG.migrations.files) {
      const migrationPath = join(DB_CONFIG.migrations.directory, fileName);
      const sql = readFileSync(migrationPath, "utf-8");
      await runMigration(sql);
      console.log(`Successfully ran migration: ${fileName}`);
    }

    // Mark as initialized
    global.__dbInitialized = true;
    console.log("All migrations completed successfully");
    return true;
  } catch (error) {
    console.error("Error running migrations:", error);
    return false;
  }
}
