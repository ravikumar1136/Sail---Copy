"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image src="/sailLogo.jpg" alt="SAIL Logo" fill className="object-contain" />
            </div>
            <span className="hidden font-bold text-xl sm:inline-block">SAIL</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/order" className="text-sm font-medium transition-colors hover:text-primary">
            Order
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
          <ModeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="container flex flex-col gap-4 py-4">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/order"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              Order
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header

