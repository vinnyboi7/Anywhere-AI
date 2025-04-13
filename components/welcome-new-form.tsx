"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/multi-select"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Briefcase, Home, Heart, Globe, Utensils, DollarSign, HelpCircle } from "lucide-react"
import { generateGuide, type GuideResponse } from "@/app/actions"
import { GuideResults } from "@/components/guide-results"
import { Loader2 } from "lucide-react"
import { Footer } from "@/components/footer"
import { useTheme } from "next-themes"

// Function to validate if input is a ZIP code
const isZipCode = (value: string) => /^\d{5}$/.test(value)

// Add CSS for building shadows
const buildingShadowStyles = `
  .city-building-shadows {
    position: relative;
    width: 100%;
  }
  
  .building-shadow {
    position: absolute;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 2px 2px 0 0;
  }

  .city-skyline {
    display: flex;
    justify-content: space-between;
  }

  .building-animated {
    position: relative;
    transform-origin: bottom;
    transition: transform 0.5s ease;
  }

  .building-animated:hover {
    transform: translateY(-10px);
  }

  .city-skyline .building-animated {
    animation: building-float 8s ease-in-out infinite;
  }

  @keyframes building-float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }

  .building-float-1 {
    animation-duration: 7s;
  }
  
  .building-float-2 {
    animation-duration: 9s;
  }
  
  .building-float-3 {
    animation-duration: 11s;
  }

  @keyframes pulse-slow {
    0%, 100% {
      opacity: 0.7;
      box-shadow: 0 0 15px 5px rgba(255, 255, 200, 0.5);
    }
    50% {
      opacity: 0.9;
      box-shadow: 0 0 25px 8px rgba(255, 255, 200, 0.7);
    }
  }

  @keyframes window-twinkle {
    0%, 100% {
      opacity: 0.7;
    }
    25% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.9;
    }
    75% {
      opacity: 0.5;
    }
  }

  /* Dark mode styles */
  .dark .hero-background {
    background: linear-gradient(to bottom right, #1e1b4b, #0f172a, #020617);
  }

  .dark .hero-overlay {
    background: linear-gradient(to top, rgba(30, 27, 75, 0.4), rgba(15, 23, 42, 0.3), transparent);
  }

  .dark .hero-text {
    color: white;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
  }

  .dark .hero-subtext {
    color: #e2e8f0;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  }

  .dark .moon {
    background-color: #f1f5f9;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  }

  .dark .building-animated {
    opacity: 0.95;
  }

  .dark .building-windows {
    background-image: 
      repeating-linear-gradient(
        to bottom,
        transparent,
        transparent 5px,
        rgba(255, 255, 200, 0.5) 5px,
        rgba(255, 255, 200, 0.5) 7px
      ),
      repeating-linear-gradient(
        to right,
        transparent,
        transparent 7px,
        rgba(255, 255, 200, 0.5) 7px,
        rgba(255, 255, 200, 0.5) 10px
    );
    filter: drop-shadow(0 0 3px rgba(255, 255, 200, 0.5));
  }

  /* Update cloud animations to be more visible */
  .cloud {
    position: absolute;
    background: white;
    border-radius: 100px;
    filter: blur(8px);
    opacity: 0.7;
  }

  .cloud-1 {
    width: 120px;
    height: 50px;
    top: 20%;
    left: -120px;
    animation: cloud-move 30s linear infinite;
    box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.3);
  }

  .cloud-2 {
    width: 180px;
    height: 60px;
    top: 40%;
    left: -180px;
    animation: cloud-move 40s linear infinite;
    animation-delay: 5s;
    box-shadow: 0 0 25px 12px rgba(255, 255, 255, 0.4);
  }

  .cloud-3 {
    width: 100px;
    height: 40px;
    top: 60%;
    left: -100px;
    animation: cloud-move 25s linear infinite;
    animation-delay: 12s;
    box-shadow: 0 0 15px 8px rgba(255, 255, 255, 0.3);
  }

  /* Cloud animations */
  .cloud {
    position: absolute;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    filter: blur(10px);
  }
  
  .cloud-1 {
    width: 100px;
    height: 40px;
    top: 20%;
    left: -100px;
    animation: cloud-move 30s linear infinite;
  }
  
  .cloud-2 {
    width: 150px;
    height: 50px;
    top: 40%;
    left: -150px;
    animation: cloud-move 40s linear infinite;
    animation-delay: 5s;
  }
  
  .cloud-3 {
    width: 80px;
    height: 30px;
    top: 60%;
    left: -80px;
    animation: cloud-move 25s linear infinite;
    animation-delay: 12s;
  }
  
  @keyframes cloud-move {
    0% {
      left: -150px;
      opacity: 0;
    }
    10% {
      opacity: 0.8;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      left: 100%;
      opacity: 0;
    }
  }
  
  /* Shooting star animations */
  .shooting-star {
    position: absolute;
    width: 2px;
    height: 2px;
    background: white;
    border-radius: 50%;
    opacity: 0;
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8));
    transform: rotate(-45deg);
  }
  
  .shooting-star::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 1px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.8), transparent);
    transform: translateX(-100%);
  }
  
  .star-1 {
    top: 20%;
    left: 80%;
    animation: shooting 4s linear infinite;
    animation-delay: 1s;
  }
  
  .star-2 {
    top: 15%;
    left: 60%;
    animation: shooting 6s linear infinite;
    animation-delay: 4s;
  }
  
  .star-3 {
    top: 30%;
    left: 70%;
    animation: shooting 5s linear infinite;
    animation-delay: 7s;
  }
  
  .star-4 {
    top: 10%;
    left: 50%;
    animation: shooting 7s linear infinite;
    animation-delay: 10s;
  }
  
  @keyframes shooting {
    0% {
      transform: rotate(-45deg) translateX(0);
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    20% {
      transform: rotate(-45deg) translateX(-200px);
      opacity: 0;
    }
    100% {
      transform: rotate(-45deg) translateX(-200px);
      opacity: 0;
    }
  }

  /* Add subtle pattern overlay to the light theme background */
  .light-theme-pattern {
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(96, 165, 250, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.05) 0%, transparent 70%);
    background-size: 100% 100%;
  }
`

// Update the formSchema to better validate location input

const formSchema = z.object({
  location: z.string().min(2, { message: "Please enter a valid location (city name or 5-digit ZIP code)" }),
  interests: z.array(z.string()).min(1, { message: "Select at least one interest" }),
  foodPreferences: z.array(z.string()).min(1, { message: "Select at least one food preference" }),
  language: z.string().min(1, { message: "Please select a language" }),
  housing: z.string().min(1, { message: "Please select a housing preference" }),
  jobField: z.string().min(2, { message: "Please enter a job field" }),
  budget: z.number().min(0),
  support: z.array(z.string()).optional(),
})

const interestOptions = [
  { label: "Sports", value: "sports" },
  { label: "Arts & Culture", value: "arts" },
  { label: "Outdoor Activities", value: "outdoor" },
  { label: "Technology", value: "technology" },
  { label: "Music", value: "music" },
  { label: "Reading", value: "reading" },
  { label: "Cooking", value: "cooking" },
  { label: "Volunteering", value: "volunteering" },
]

const foodOptions = [
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Halal", value: "halal" },
  { label: "Non-Veg", value: "non-veg" },
  { label: "Anything", value: "anything" },
]

const supportOptions = [
  { label: "Legal Assistance", value: "legal" },
  { label: "Mental Health Support", value: "mental-health" },
  { label: "ESL Classes", value: "esl" },
  { label: "Childcare", value: "childcare" },
  { label: "Immigration Help", value: "immigration" },
  { label: "Financial Advice", value: "financial" },
  { label: "Healthcare Access", value: "healthcare" },
  { label: "Community Events", value: "community" },
]

const languages = [
  "English",
  "Spanish",
  "French",
  "Arabic",
  "Mandarin",
  "Hindi",
  "Nepali",
  "Portuguese",
  "Russian",
  "Japanese",
  "Korean",
  "German",
  "Italian",
  "Swahili",
  "Vietnamese",
  "Tagalog",
]

const housingOptions = [
  "Apartment",
  "Shared Room",
  "Family Home",
  "Temporary Stay",
  "Student Housing",
  "Senior Living",
  "Accessible Housing",
]

export default function WelcomeForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [guideData, setGuideData] = useState<GuideResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [budgetDisplay, setBudgetDisplay] = useState(1000)
  const [locationInfo, setLocationInfo] = useState<{ city: string } | null>(null)
  const { theme, setTheme } = useTheme()

  // Handle tab selection from URL parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get("tab")

      // If guide data exists and a tab parameter is provided, scroll to results and select tab
      if (guideData && tabParam) {
        // Find the tab element and click it
        const tabElement = document.querySelector(`[data-value="${tabParam}"]`)
        if (tabElement) {
          ;(tabElement as HTMLElement).click()

          // Scroll to the results section
          const resultsElement = document.getElementById("guide-results")
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: "smooth" })
          }
        }
      }
    }
  }, [guideData])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      interests: [],
      foodPreferences: [],
      language: "",
      housing: "",
      jobField: "",
      budget: 1000,
      support: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const data = await generateGuide(values)
      setGuideData(data)

      // Extract city from welcome message if available
      if (data.welcomeMessage) {
        const cityMatch = data.welcomeMessage.match(/Welcome to ([^,]+),/)
        if (cityMatch && cityMatch[1]) {
          setLocationInfo({
            city: cityMatch[1].trim(),
          })
        }
      }
    } catch (err: any) {
      console.error("Error generating guide:", err)
      setError("We couldn't generate your personalized guide at this moment. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Add the style tag for building shadows
  useEffect(() => {
    // Add styles to head
    const styleElement = document.createElement("style")
    styleElement.innerHTML = buildingShadowStyles
    document.head.appendChild(styleElement)

    return () => {
      // Clean up on unmount
      document.head.removeChild(styleElement)
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Enhanced 3D City Hero Section - Smaller Height */}
      <div className="relative mb-12 rounded-lg overflow-hidden">
        {/* Animated 3D City Background */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-300 via-indigo-200 to-blue-300 dark:from-indigo-950 dark:via-slate-900 dark:to-gray-900 hero-background transition-colors duration-300">
          {/* Add decorative background elements for light theme */}
          {theme === "light" && (
            <>
              <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-full h-full opacity-40 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-[url('/Interlocking Dimensions.png')] bg-repeat opacity-10"></div>
            </>
          )}
        </div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-300/40 via-indigo-200/30 to-transparent dark:from-indigo-900/60 dark:via-slate-900/40 dark:to-transparent hero-overlay transition-colors duration-300"></div>

        {/* Content - Reduced height */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[280px] md:min-h-[320px] px-4 py-12 md:py-16">
          {/* Add floating shapes for light theme */}
          {theme === "light" && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="cloud cloud-1"></div>
              <div className="cloud cloud-2"></div>
              <div className="cloud cloud-3"></div>

              {/* Add decorative floating shapes */}
              <div className="absolute w-24 h-24 rounded-full bg-purple-200 opacity-30 top-[15%] left-[10%] animate-float-slow"></div>
              <div className="absolute w-16 h-16 rounded-full bg-blue-200 opacity-30 top-[25%] right-[15%] animate-float"></div>
              <div className="absolute w-20 h-20 rounded-full bg-indigo-200 opacity-30 bottom-[30%] left-[20%] animate-float-slower"></div>
              <div className="absolute w-32 h-12 rounded-full bg-purple-100 opacity-20 top-[40%] right-[25%] animate-float-slow"></div>
            </div>
          )}

          {/* Shooting stars for dark theme */}
          {theme === "dark" && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="shooting-star star-1"></div>
              <div className="shooting-star star-2"></div>
              <div className="shooting-star star-3"></div>
              <div className="shooting-star star-4"></div>
            </div>
          )}
          {/* Moon in top left */}
          <div
            className="absolute top-4 left-4 w-12 h-12 rounded-full cursor-pointer z-20 transition-all duration-300 flex items-center justify-center"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            role="button"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setTheme(theme === "dark" ? "light" : "dark")
              }
            }}
          >
            {theme === "light" ? (
              // Simple sun icon for light mode (without rays)
              <div className="w-12 h-12 rounded-full bg-yellow-300 shadow-lg animate-pulse-slow flex items-center justify-center relative">
                <div
                  className="absolute inset-0 rounded-full bg-yellow-300 opacity-70 animate-ping"
                  style={{ animationDuration: "3s" }}
                ></div>
                {/* Sun inner glow */}
                <div className="w-8 h-8 rounded-full bg-yellow-200 opacity-80"></div>
              </div>
            ) : (
              // Moon icon for dark mode
              <div className="w-12 h-12 rounded-full bg-yellow-100 opacity-80 shadow-lg animate-pulse-slow moon relative">
                {/* Moon crater */}
                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-yellow-50 opacity-60"></div>
                <div className="absolute bottom-4 left-3 w-2 h-2 rounded-full bg-yellow-50 opacity-60"></div>
              </div>
            )}
          </div>

          {/* Animated City Buildings at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] overflow-hidden"
            style={{ position: "absolute", transform: "translateZ(0)" }}
          >
            <div className="city-skyline flex items-end w-full h-full">
              {[...Array(10)].map((_, i) => {
                // Create an array of building colors for light and dark mode
                const lightBuildingColors = [
                  "bg-indigo-900",
                  "bg-purple-900",
                  "bg-blue-900",
                  "bg-violet-900",
                  "bg-slate-900",
                ]

                const darkBuildingColors = [
                  "bg-indigo-700",
                  "bg-purple-700",
                  "bg-blue-700",
                  "bg-violet-700",
                  "bg-slate-700",
                ]

                // Select a color based on index and theme
                const colorClass =
                  theme === "dark"
                    ? darkBuildingColors[i % darkBuildingColors.length]
                    : lightBuildingColors[i % lightBuildingColors.length]

                // Assign different float animation classes
                const floatClasses = ["building-float-1", "building-float-2", "building-float-3"]
                const floatClass = floatClasses[i % floatClasses.length]

                return (
                  <div
                    key={i}
                    className={`building-animated ${floatClass} ${colorClass} mx-[2px] rounded-t-sm transition-colors duration-300`}
                    style={{
                      height: `${30 + Math.random() * 70}px`,
                      width: `${30 + Math.random() * 50}px`,
                      animationDelay: `${i * 0.5}s`,
                      opacity: 0.9,
                      boxShadow: theme === "dark" ? "0 0 15px rgba(0, 0, 0, 0.5)" : "0 0 10px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {/* Replace the building windows with shining windows effect */}
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundImage: `
      radial-gradient(circle at ${10 + Math.random() * 80}% ${10 + Math.random() * 80}%, rgba(255, 255, 255, 0.8) 0%, transparent 5%),
      radial-gradient(circle at ${10 + Math.random() * 80}% ${10 + Math.random() * 80}%, rgba(255, 255, 255, 0.6) 0%, transparent 4%),
      radial-gradient(circle at ${10 + Math.random() * 80}% ${10 + Math.random() * 80}%, rgba(255, 255, 255, 0.7) 0%, transparent 4.5%),
      radial-gradient(circle at ${10 + Math.random() * 80}% ${10 + Math.random() * 80}%, rgba(255, 255, 255, 0.5) 0%, transparent 3.5%),
      radial-gradient(circle at ${10 + Math.random() * 80}% ${10 + Math.random() * 80}%, rgba(255, 255, 255, 0.7) 0%, transparent 4%),
      radial-gradient(circle at ${10 + Math.random() * 80}% ${10 + Math.random() * 80}%, rgba(255, 255, 255, 0.6) 0%, transparent 3%),
      radial-gradient(circle at ${10 + Math.random() * 80}% ${10 + Math.random() * 80}%, rgba(255, 255, 255, 0.8) 0%, transparent 4.5%),
      radial-gradient(circle at ${10 + Math.random() * 80}% ${10 + Math.random() * 80}%, rgba(255, 255, 255, 0.5) 0%, transparent 3%)
    `,
                        animationName: "window-twinkle",
                        animationDuration: `${3 + Math.random() * 5}s`,
                        animationTimingFunction: "ease-in-out",
                        animationIterationCount: "infinite",
                        animationDirection: "alternate",
                        animationDelay: `${i * 0.3}s`,
                      }}
                    ></div>

                    {/* Add light at the top of some buildings */}
                    {i % 3 === 0 && (
                      <div
                        className="absolute -top-1 left-1/2 w-1 h-1 bg-yellow-200 rounded-full"
                        style={{
                          boxShadow:
                            theme === "dark"
                              ? "0 0 8px 3px rgba(255, 255, 200, 0.9)"
                              : "0 0 5px 2px rgba(255, 255, 200, 0.7)",
                          transform: "translateX(-50%)",
                        }}
                      ></div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-black dark:text-white drop-shadow-lg animate-fade-in hero-text transition-colors duration-300">
            Moving to a New City?
          </h1>
          <p className="text-xl md:text-2xl text-black dark:text-gray-200 max-w2xl mx-auto drop-shadow-md animate-fade-in-delay hero-subtext transition-colors duration-300">
            Let us create your personalized welcome guide.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div>
        <Card className="shadow-xl border-0 overflow-hidden bg-white dark:bg-gray-900 rounded-xl transform hover:scale-[1.01] transition-all duration-300">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                {/* Location */}
                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="flex items-center gap-2 text-base font-medium dark:text-gray-200"
                  >
                    <MapPin className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    Where are you moving to?
                  </Label>
                  <Input
                    id="location"
                    placeholder="Enter city, state or 5-digit ZIP code"
                    {...form.register("location")}
                    className="h-12 px-4 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus-visible:ring-purple-500"
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                  )}
                  {!form.formState.errors.location && form.getValues("location") && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isZipCode(form.getValues("location"))
                        ? "Using ZIP code for precise location lookup"
                        : "Using city name for location lookup"}
                    </p>
                  )}
                </div>

                {/* Interests */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-base font-medium dark:text-gray-200">
                    <Heart className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    What are your interests or hobbies?
                  </Label>
                  <MultiSelect
                    options={interestOptions}
                    selected={form.getValues("interests")}
                    onChange={(selected) => form.setValue("interests", selected, { shouldValidate: true })}
                    placeholder="Select your interests"
                    className="rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                  {form.formState.errors.interests && (
                    <p className="text-sm text-red-500">{form.formState.errors.interests.message}</p>
                  )}
                </div>

                {/* Food Preferences */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-base font-medium dark:text-gray-200">
                    <Utensils className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    What kind of food do you enjoy?
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {foodOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 rounded-lg border dark:border-gray-700 p-3 hover:bg-purple-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Checkbox
                          id={`food-${option.value}`}
                          checked={form.getValues("foodPreferences").includes(option.value)}
                          onCheckedChange={(checked) => {
                            const current = form.getValues("foodPreferences")
                            const updated = checked
                              ? [...current, option.value]
                              : current.filter((item) => item !== option.value)
                            form.setValue("foodPreferences", updated, { shouldValidate: true })
                          }}
                          className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                        />
                        <label
                          htmlFor={`food-${option.value}`}
                          className="text-sm font-medium leading-none cursor-pointer dark:text-gray-200"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.foodPreferences && (
                    <p className="text-sm text-red-500">{form.formState.errors.foodPreferences.message}</p>
                  )}
                </div>

                {/* Two Column Layout for Language and Housing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Language */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="language"
                      className="flex items-center gap-2 text-base font-medium dark:text-gray-200"
                    >
                      <Globe className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      Preferred language
                    </Label>
                    <Select onValueChange={(value) => form.setValue("language", value, { shouldValidate: true })}>
                      <SelectTrigger className="h-12 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-purple-500 hover:border-purple-300 transition-colors">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        {languages.map((language) => (
                          <SelectItem
                            key={language}
                            value={language}
                            className="dark:text-white dark:focus:bg-gray-700"
                          >
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.language && (
                      <p className="text-sm text-red-500">{form.formState.errors.language.message}</p>
                    )}
                  </div>

                  {/* Housing */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="housing"
                      className="flex items-center gap-2 text-base font-medium dark:text-gray-200"
                    >
                      <Home className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      Housing preference
                    </Label>
                    <Select onValueChange={(value) => form.setValue("housing", value, { shouldValidate: true })}>
                      <SelectTrigger className="h-12 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-purple-500 hover:border-purple-300 transition-colors">
                        <SelectValue placeholder="Select housing type" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        {housingOptions.map((option) => (
                          <SelectItem key={option} value={option} className="dark:text-white dark:focus:bg-gray-700">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.housing && (
                      <p className="text-sm text-red-500">{form.formState.errors.housing.message}</p>
                    )}
                  </div>
                </div>

                {/* Job Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="jobField"
                    className="flex items-center gap-2 text-base font-medium dark:text-gray-200"
                  >
                    <Briefcase className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    What type of job are you looking for?
                  </Label>
                  <Input
                    id="jobField"
                    placeholder="E.g., Healthcare, Technology, Education"
                    {...form.register("jobField")}
                    className="h-12 px-4 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus-visible:ring-purple-500 hover:border-purple-300 transition-colors"
                  />
                  {form.formState.errors.jobField && (
                    <p className="text-sm text-red-500">{form.formState.errors.jobField.message}</p>
                  )}
                </div>

                {/* Budget */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="budget"
                      className="flex items-center gap-2 text-base font-medium dark:text-gray-200"
                    >
                      <DollarSign className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      Monthly budget
                    </Label>
                    <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">${budgetDisplay}</span>
                  </div>
                  <Slider
                    id="budget"
                    min={0}
                    max={5000}
                    step={100}
                    value={[budgetDisplay]}
                    onValueChange={(value) => {
                      setBudgetDisplay(value[0])
                      form.setValue("budget", value[0], { shouldValidate: true })
                    }}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>$0</span>
                    <span>$5,000+</span>
                  </div>
                </div>

                {/* Support Needed */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-base font-medium dark:text-gray-200">
                    <HelpCircle className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    Any specific support you're looking for?
                  </Label>
                  <MultiSelect
                    options={supportOptions}
                    selected={form.getValues("support") || []}
                    onChange={(selected) => form.setValue("support", selected, { shouldValidate: true })}
                    placeholder="Select support needs"
                    className="rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 dark:from-purple-700 dark:to-pink-600 dark:hover:from-purple-800 dark:hover:to-pink-700 text-white px-10 py-6 rounded-full text-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>✨ Generate My Guide</>
                  )}
                </Button>
              </div>

              {error && (
                <div className="text-center mt-4">
                  <p className="text-red-500 dark:text-red-400">{error}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
      {guideData && (
        <div id="guide-results" className="mt-8">
          <GuideResults data={guideData} location={locationInfo?.city || form.getValues().location} />
        </div>
      )}

      <div className="w-full mt-16">
        <Footer />
      </div>
    </div>
  )
}
