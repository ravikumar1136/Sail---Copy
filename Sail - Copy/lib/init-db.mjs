import { initDatabase } from "./db.js"

// Initialize database when this module is imported
initDatabase().catch((error) => {
  console.error("Failed to initialize database:", error)
  process.exit(1)
}) 