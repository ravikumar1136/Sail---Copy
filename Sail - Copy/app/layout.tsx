import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ensureDbInitialized } from "@/lib/db-init"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sail - Steel Order Management",
  description: "A modern steel order management system",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize database without blocking the UI
  ensureDbInitialized().catch(error => {
    console.error("Database initialization error:", error);
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'