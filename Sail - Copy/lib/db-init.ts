import { initDatabase } from "./db"

let isInitialized = false
let initializationPromise: Promise<void> | null = null

export async function ensureDbInitialized() {
  // If already initialized, return immediately
  if (isInitialized) {
    return
  }

  // If initialization is in progress, wait for it to complete
  if (initializationPromise) {
    return initializationPromise
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        console.log('Database initialization skipped in browser environment')
        return
      }

      await initDatabase()
      isInitialized = true
      console.log("Database initialized successfully")
    } catch (error) {
      console.error("Failed to initialize database:", error)
      // Don't throw the error to allow the app to continue loading
      // The database connection will be retried on subsequent requests
    } finally {
      // Clear the promise so we can retry if needed
      initializationPromise = null
    }
  })()

  return initializationPromise
} 