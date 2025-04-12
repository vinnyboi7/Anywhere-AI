"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function CitySilhouettes() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Left side silhouettes */}
      <div className="fixed top-0 left-0 w-64 h-full pointer-events-none z-0 overflow-hidden hidden md:block">
        {theme === "dark" ? <DarkThemeSilhouettesLeft /> : <LightThemeSilhouettesLeft />}
      </div>

      {/* Right side silhouettes */}
      <div className="fixed top-0 right-0 w-64 h-full pointer-events-none z-0 overflow-hidden hidden md:block">
        {theme === "dark" ? <DarkThemeSilhouettesRight /> : <LightThemeSilhouettesRight />}
      </div>
    </>
  )
}

// Dark theme silhouettes for left side
function DarkThemeSilhouettesLeft() {
  return (
    <div className="relative h-full w-full">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-transparent"></div>

      {/* Background layer - furthest buildings */}
      <div
        className="absolute bottom-0 left-0 w-full h-full opacity-70"
        style={{
          background: "linear-gradient(to bottom, transparent 40%, #4c1d95)",
          clipPath:
            "polygon(0% 100%, 10% 80%, 20% 90%, 30% 70%, 40% 85%, 50% 60%, 60% 80%, 70% 50%, 80% 70%, 90% 40%, 100% 60%, 100% 100%)",
        }}
      />

      {/* Middle layer */}
      <div
        className="absolute bottom-0 left-0 w-full h-full opacity-80"
        style={{
          background: "linear-gradient(to bottom, transparent 50%, #6d28d9)",
          clipPath:
            "polygon(0% 100%, 8% 85%, 16% 95%, 24% 75%, 32% 90%, 40% 70%, 48% 85%, 56% 65%, 64% 80%, 72% 60%, 80% 75%, 88% 55%, 100% 70%, 100% 100%)",
        }}
      />

      {/* Foreground layer - closest buildings */}
      <div
        className="absolute bottom-0 left-0 w-full h-full opacity-90"
        style={{
          background: "linear-gradient(to bottom, transparent 60%, #8b5cf6)",
          clipPath:
            "polygon(0% 100%, 5% 90%, 10% 100%, 15% 80%, 20% 95%, 25% 75%, 30% 90%, 35% 70%, 40% 85%, 45% 65%, 50% 80%, 55% 60%, 60% 75%, 65% 55%, 70% 70%, 75% 50%, 80% 65%, 85% 45%, 90% 60%, 95% 40%, 100% 55%, 100% 100%)",
        }}
      />

      {/* Animated floating orbs */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full bg-purple-300 animate-pulse"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            opacity: 0.3 + Math.random() * 0.4,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Floating orbs that move upward */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`float-${i}`}
          className="absolute rounded-full bg-purple-200"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            left: `${20 + Math.random() * 60}%`,
            bottom: "-5%",
            opacity: 0.2 + Math.random() * 0.3,
            animation: `float-up ${8 + Math.random() * 12}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Glowing windows */}
      {[...Array(30)].map((_, i) => {
        const size = 1 + Math.random() * 3
        return (
          <div
            key={`window-${i}`}
            className="absolute bg-purple-300 animate-pulse"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 40}%`,
              opacity: 0.4 + Math.random() * 0.5,
              boxShadow: "0 0 5px rgba(167, 139, 250, 0.7)",
              animationDuration: `${1 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        )
      })}

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// Dark theme silhouettes for right side
function DarkThemeSilhouettesRight() {
  return (
    <div className="relative h-full w-full">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-l from-purple-900/30 to-transparent"></div>

      {/* Background layer - furthest buildings */}
      <div
        className="absolute bottom-0 right-0 w-full h-full opacity-70"
        style={{
          background: "linear-gradient(to bottom, transparent 40%, #4c1d95)",
          clipPath:
            "polygon(0% 60%, 10% 40%, 20% 65%, 30% 45%, 40% 70%, 50% 50%, 60% 75%, 70% 55%, 80% 80%, 90% 60%, 100% 75%, 100% 100%, 0% 100%)",
        }}
      />

      {/* Middle layer */}
      <div
        className="absolute bottom-0 right-0 w-full h-full opacity-80"
        style={{
          background: "linear-gradient(to bottom, transparent 50%, #6d28d9)",
          clipPath:
            "polygon(0% 70%, 12% 55%, 24% 75%, 36% 60%, 48% 80%, 60% 65%, 72% 85%, 84% 70%, 100% 90%, 100% 100%, 0% 100%)",
        }}
      />

      {/* Foreground layer - closest buildings */}
      <div
        className="absolute bottom-0 right-0 w-full h-full opacity-90"
        style={{
          background: "linear-gradient(to bottom, transparent 60%, #8b5cf6)",
          clipPath:
            "polygon(0% 55%, 5% 40%, 10% 60%, 15% 45%, 20% 65%, 25% 50%, 30% 70%, 35% 55%, 40% 75%, 45% 60%, 50% 80%, 55% 65%, 60% 85%, 65% 70%, 70% 90%, 75% 75%, 80% 95%, 85% 80%, 90% 100%, 95% 85%, 100% 95%, 100% 100%, 0% 100%)",
        }}
      />

      {/* Animated floating orbs */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full bg-purple-300 animate-pulse"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            right: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            opacity: 0.3 + Math.random() * 0.4,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Floating orbs that move upward */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`float-${i}`}
          className="absolute rounded-full bg-purple-200"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            right: `${20 + Math.random() * 60}%`,
            bottom: "-5%",
            opacity: 0.2 + Math.random() * 0.3,
            animation: `float-up ${8 + Math.random() * 12}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Glowing windows */}
      {[...Array(30)].map((_, i) => {
        const size = 1 + Math.random() * 3
        return (
          <div
            key={`window-${i}`}
            className="absolute bg-purple-300 animate-pulse"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              right: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 40}%`,
              opacity: 0.4 + Math.random() * 0.5,
              boxShadow: "0 0 5px rgba(167, 139, 250, 0.7)",
              animationDuration: `${1 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        )
      })}

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// Light theme silhouettes for left side
function LightThemeSilhouettesLeft() {
  return (
    <div className="relative h-full w-full">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/40 to-transparent"></div>

      {/* Background layer - pastel buildings */}
      <div
        className="absolute bottom-0 left-0 w-full h-full opacity-60"
        style={{
          background: "linear-gradient(to bottom, transparent 40%, #dbeafe)",
          clipPath:
            "polygon(0% 100%, 10% 85%, 20% 95%, 30% 80%, 40% 90%, 50% 75%, 60% 85%, 70% 70%, 80% 80%, 90% 65%, 100% 75%, 100% 100%)",
        }}
      />

      {/* Middle layer - outline buildings */}
      <div className="absolute bottom-0 left-0 w-full h-full">
        {/* Building outlines */}
        {[...Array(8)].map((_, i) => {
          const width = 10 + Math.random() * 12
          const height = 30 + Math.random() * 50
          const left = i * 12

          return (
            <div
              key={i}
              className="absolute bottom-0 bg-transparent border-t-2 border-l-2 border-r-2 border-blue-200 rounded-t-sm"
              style={{
                width: `${width}%`,
                height: `${height}%`,
                left: `${left}%`,
                opacity: 0.6 + Math.random() * 0.3,
                animation: `float-y ${3 + Math.random() * 2}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          )
        })}
      </div>

      {/* Foreground layer - colored blocks */}
      <div className="absolute bottom-0 left-0 w-full h-full">
        {[...Array(6)].map((_, i) => {
          const width = 8 + Math.random() * 10
          const height = 20 + Math.random() * 60
          const left = 5 + i * 15
          const colors = ["bg-blue-100", "bg-indigo-100", "bg-sky-100", "bg-cyan-100"]
          const color = colors[Math.floor(Math.random() * colors.length)]

          return (
            <div
              key={i}
              className={`absolute bottom-0 ${color} rounded-t-sm`}
              style={{
                width: `${width}%`,
                height: `${height}%`,
                left: `${left}%`,
                opacity: 0.7,
                animation: `float-y ${3 + Math.random() * 2}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          )
        })}
      </div>

      {/* Floating lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"
            style={{
              width: `${30 + Math.random() * 40}%`,
              left: `${Math.random() * 30}%`,
              top: `${20 + Math.random() * 60}%`,
              opacity: 0.6,
              animation: `float-x ${15 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Animated particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full bg-blue-200"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.5 + Math.random() * 0.4,
            animation: `pulse-fade ${3 + Math.random() * 4}s ease-in-out infinite alternate`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float-y {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes float-x {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes pulse-fade {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.5);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  )
}

// Light theme silhouettes for right side
function LightThemeSilhouettesRight() {
  return (
    <div className="relative h-full w-full">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-l from-indigo-100/40 to-transparent"></div>

      {/* Background layer - pastel buildings */}
      <div
        className="absolute bottom-0 right-0 w-full h-full opacity-60"
        style={{
          background: "linear-gradient(to bottom, transparent 40%, #e0e7ff)",
          clipPath:
            "polygon(0% 75%, 10% 65%, 20% 80%, 30% 70%, 40% 85%, 50% 75%, 60% 90%, 70% 80%, 80% 95%, 90% 85%, 100% 100%, 0% 100%)",
        }}
      />

      {/* Middle layer - outline buildings */}
      <div className="absolute bottom-0 right-0 w-full h-full">
        {/* Building outlines */}
        {[...Array(8)].map((_, i) => {
          const width = 10 + Math.random() * 12
          const height = 30 + Math.random() * 50
          const right = i * 12

          return (
            <div
              key={i}
              className="absolute bottom-0 bg-transparent border-t-2 border-l-2 border-r-2 border-indigo-200 rounded-t-sm"
              style={{
                width: `${width}%`,
                height: `${height}%`,
                right: `${right}%`,
                opacity: 0.6 + Math.random() * 0.3,
                animation: `float-y ${3 + Math.random() * 2}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          )
        })}
      </div>

      {/* Foreground layer - colored blocks */}
      <div className="absolute bottom-0 right-0 w-full h-full">
        {[...Array(6)].map((_, i) => {
          const width = 8 + Math.random() * 10
          const height = 20 + Math.random() * 60
          const right = 5 + i * 15
          const colors = ["bg-indigo-100", "bg-violet-100", "bg-purple-100", "bg-fuchsia-100"]
          const color = colors[Math.floor(Math.random() * colors.length)]

          return (
            <div
              key={i}
              className={`absolute bottom-0 ${color} rounded-t-sm`}
              style={{
                width: `${width}%`,
                height: `${height}%`,
                right: `${right}%`,
                opacity: 0.7,
                animation: `float-y ${3 + Math.random() * 2}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          )
        })}
      </div>

      {/* Floating lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"
            style={{
              width: `${30 + Math.random() * 40}%`,
              right: `${Math.random() * 30}%`,
              top: `${20 + Math.random() * 60}%`,
              opacity: 0.6,
              animation: `float-x-reverse ${15 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Animated particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full bg-indigo-200"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            right: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.5 + Math.random() * 0.4,
            animation: `pulse-fade ${3 + Math.random() * 4}s ease-in-out infinite alternate`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float-y {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes float-x-reverse {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        @keyframes pulse-fade {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.5);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  )
}
