import { initDatabase } from "./db"

export async function initializeApp() {
  try {
    await initDatabase()
    console.log("Application initialized successfully")
  } catch (error) {
    console.error("Failed to initialize application:", error)
    process.exit(1)
  }
} 