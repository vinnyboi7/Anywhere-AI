"use client"

import type React from "react"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Compass, Home, Briefcase, Heart, Globe, ArrowRight } from "lucide-react"

// Animation variants for sections
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const fadeInRight = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

// Section component with animation
function AnimatedSection({
  children,
  id,
  className = "",
}: {
  children: React.ReactNode
  id?: string
  className?: string
}) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.section
      id={id}
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={controls}
      className={`py-16 md:py-24 ${className}`}
    >
      {children}
    </motion.section>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <h1 className="text-4xl font-bold mb-2 text-purple-900">Anywhere AI</h1>
      <h2 className="text-2xl font-medium mb-3 text-purple-700"></h2>
      <p className="text-xl text-gray-600 max-w-md text-center mb-8">
        Discover local events, culture, and jobs based on what you love. No sign-up needed—just enter your interests and
        location.
      </p>
      <Link href="/new-form">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>

      <motion.div
        className="mt-12 max-w-lg w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-purple-900">Discover Your New Home</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Get personalized recommendations for housing, jobs, events, and local resources tailored to your
            preferences.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="flex items-center">
              <Home className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-sm text-gray-700">Housing Options</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-sm text-gray-700">Job Opportunities</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-sm text-gray-700">Local Events</span>
            </div>
            <div className="flex items-center">
              <Compass className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-sm text-gray-700">City Navigation</span>
            </div>
          </div>
        </div>
      </motion.div>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Welcome Anywhere. All rights reserved.</p>
      </footer>
    </div>
  )
}
