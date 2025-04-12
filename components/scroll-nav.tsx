"use client"

import { useState, useEffect } from "react"

export function ScrollNav() {
  const [showNav, setShowNav] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled near the bottom of the page
      const scrollPosition = window.scrollY + window.innerHeight
      const nearBottom = document.body.scrollHeight - scrollPosition < 200

      setShowNav(nearBottom)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return null
}
