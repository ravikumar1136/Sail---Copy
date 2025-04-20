const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const { initializeApp } = require("./lib/init")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

async function startServer() {
  try {
    // Initialize database first
    await initializeApp()
    
    // Then start the Next.js server
    await app.prepare()
    
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true)
      handle(req, res, parsedUrl)
    }).listen(3000, (err) => {
      if (err) throw err
      console.log("> Ready on http://localhost:3000")
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer() 