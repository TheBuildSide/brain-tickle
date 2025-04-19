import { initializeDatabase } from "./init-db";

// Keep track of initialization status
let isInitialized = false;

export async function ensureDatabaseInitialized() {
  if (!isInitialized) {
    try {
      const success = await initializeDatabase();
      if (success) {
        console.log("Database initialized successfully");
        isInitialized = true;
      } else {
        console.error("Failed to initialize database");
      }
    } catch (error) {
      console.error("Error during database initialization:", error);
    }
  }
  return isInitialized;
}
