"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X, Github } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Simplified scroll handler with passive event listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Simplified link click handler - no animations or delays
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Close menu immediately
    setIsOpen(false)

    // Handle different types of links
    if (href.startsWith("#")) {
      e.preventDefault()
      const element = document.getElementById(href.substring(1))
      if (element) element.scrollIntoView()
    } else if (href.startsWith("http")) {
      e.preventDefault()
      window.open(href, "_blank")
    }
  }

  // Navigation links
  const navLinks = [
    { href: "/landing", label: "Home" },
    {
      href: "#features",
      label: "Features",
      description: "Personalized city guides with housing, jobs, and local recommendations",
    },
    { href: "/new-form", label: "Generate Guide" },
    { href: "#footer", label: "Contact" },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 w-full ${
        isScrolled ? "py-2 bg-white/90 dark:bg-gray-900/90 shadow-md" : "py-4 bg-white/80 dark:bg-black/70"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <a
          href="#"
          className="flex items-center text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400"
          onClick={(e) => handleLinkClick(e, "#")}
        >
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Anywhere AI
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <div key={link.href} className="relative group">
              <a
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
              >
                {link.label}
              </a>
              {link.description && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 px-4 py-2 bg-white dark:bg-gray-800 rounded shadow-lg text-sm text-gray-700 dark:text-gray-200 opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                  {link.description}
                </div>
              )}
            </div>
          ))}

          {/* GitHub Link */}
          <a
            href="https://github.com/vinnyboi7/welcome-anywhere-app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
            onClick={(e) => handleLinkClick(e, "https://github.com/vinnyboi7/welcome-anywhere-app")}
          >
            <Github className="h-5 w-5" />
            <span className="ml-1">GitHub</span>
          </a>
        </div>

        {/* Mobile Menu Button - No animations */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation - Static display instead of animated */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 py-4 px-4 z-40">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <div key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 py-2 block"
                >
                  {link.label}
                </a>
                {link.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 pl-2 mt-1 mb-2">{link.description}</p>
                )}
              </div>
            ))}

            {/* Mobile GitHub Link */}
            <a
              href="https://github.com/vinnyboi7/welcome-anywhere-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 py-2"
              onClick={(e) => handleLinkClick(e, "https://github.com/vinnyboi7/welcome-anywhere-app")}
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
