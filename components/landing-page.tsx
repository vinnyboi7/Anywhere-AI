"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Compass, Home, Briefcase, Heart, Globe, ArrowRight } from "lucide-react"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 via-white to-purple-50 dark:from-purple-950 dark:via-gray-900 dark:to-purple-950 p-4 transition-colors duration-500">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-200/20 via-transparent to-transparent dark:from-purple-500/10 opacity-70"></div>

        {/* Animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-2 text-purple-900 dark:text-purple-300 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Anywhere AI
        </motion.h1>

        <motion.p
          className="text-xl text-slate-600 dark:text-slate-300 max-w-md md:w-[600px] text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover local events, culture, and jobs based on what you love. No sign-up needed—just enter your interests
          and location.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="group"
        >
          <Link href="/new-form">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105">
              <span className="flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 max-w-lg w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-purple-100 dark:border-purple-900/30">
            <div className="flex items-center mb-6">
              <Globe className="h-7 w-7 text-purple-600 dark:text-purple-400 mr-3" />
              <h2 className="text-2xl font-semibold text-purple-900 dark:text-purple-300">Discover Your New Home</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              Get personalized recommendations for housing, jobs, events, and local resources tailored to your
              preferences.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Link
                href="/new-form?tab=housing"
                className="flex items-center p-3 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-800/30 transition-colors duration-200 cursor-pointer"
              >
                <Home className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Housing Options</span>
              </Link>
              <Link
                href="/new-form?tab=jobs"
                className="flex items-center p-3 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-800/30 transition-colors duration-200 cursor-pointer"
              >
                <Briefcase className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Job Opportunities</span>
              </Link>
              <Link
                href="/new-form?tab=events"
                className="flex items-center p-3 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-800/30 transition-colors duration-200 cursor-pointer"
              >
                <Heart className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Local Events</span>
              </Link>
              <Link
                href="/new-form?tab=food"
                className="flex items-center p-3 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-800/30 transition-colors duration-200 cursor-pointer"
              >
                <Compass className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">City Navigation</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Import the Footer component at the top of the file */}
      <Footer />
    </div>
  )
}
