"use client"

import { useState } from "react"
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

const formSchema = z.object({
  location: z.string().min(2, { message: "Please enter a valid location" }),
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
    } catch (err) {
      console.error("Error generating guide:", err)
      setError("We couldn't generate your personalized guide at this moment. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 py-12">
        <div className="text-6xl mb-4 inline-block">🏙️</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Moving to a New City?
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Let us create your personalized welcome guide.</p>
      </div>

      {/* Form Card */}
      <div>
        <Card className="shadow-lg border-0 overflow-hidden bg-white rounded-xl">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2 text-base font-medium">
                    <MapPin className="h-5 w-5 text-purple-500" />
                    Where are you moving to?
                  </Label>
                  <Input
                    id="location"
                    placeholder="Enter city or zip code"
                    {...form.register("location")}
                    className="h-12 px-4 rounded-lg border-gray-200 focus-visible:ring-purple-500"
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                  )}
                </div>

                {/* Interests */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-base font-medium">
                    <Heart className="h-5 w-5 text-purple-500" />
                    What are your interests or hobbies?
                  </Label>
                  <MultiSelect
                    options={interestOptions}
                    selected={form.getValues("interests")}
                    onChange={(selected) => form.setValue("interests", selected, { shouldValidate: true })}
                    placeholder="Select your interests"
                    className="rounded-lg"
                  />
                  {form.formState.errors.interests && (
                    <p className="text-sm text-red-500">{form.formState.errors.interests.message}</p>
                  )}
                </div>

                {/* Food Preferences */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-base font-medium">
                    <Utensils className="h-5 w-5 text-purple-500" />
                    What kind of food do you enjoy?
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {foodOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 rounded-lg border p-3">
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
                          className="text-sm font-medium leading-none cursor-pointer"
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
                    <Label htmlFor="language" className="flex items-center gap-2 text-base font-medium">
                      <Globe className="h-5 w-5 text-purple-500" />
                      Preferred language
                    </Label>
                    <Select onValueChange={(value) => form.setValue("language", value, { shouldValidate: true })}>
                      <SelectTrigger className="h-12 rounded-lg border-gray-200 focus:ring-purple-500">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language} value={language}>
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
                    <Label htmlFor="housing" className="flex items-center gap-2 text-base font-medium">
                      <Home className="h-5 w-5 text-purple-500" />
                      Housing preference
                    </Label>
                    <Select onValueChange={(value) => form.setValue("housing", value, { shouldValidate: true })}>
                      <SelectTrigger className="h-12 rounded-lg border-gray-200 focus:ring-purple-500">
                        <SelectValue placeholder="Select housing type" />
                      </SelectTrigger>
                      <SelectContent>
                        {housingOptions.map((option) => (
                          <SelectItem key={option} value={option}>
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
                  <Label htmlFor="jobField" className="flex items-center gap-2 text-base font-medium">
                    <Briefcase className="h-5 w-5 text-purple-500" />
                    What type of job are you looking for?
                  </Label>
                  <Input
                    id="jobField"
                    placeholder="E.g., Healthcare, Technology, Education"
                    {...form.register("jobField")}
                    className="h-12 px-4 rounded-lg border-gray-200 focus-visible:ring-purple-500"
                  />
                  {form.formState.errors.jobField && (
                    <p className="text-sm text-red-500">{form.formState.errors.jobField.message}</p>
                  )}
                </div>

                {/* Budget */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="budget" className="flex items-center gap-2 text-base font-medium">
                      <DollarSign className="h-5 w-5 text-purple-500" />
                      Monthly budget
                    </Label>
                    <span className="text-lg font-semibold text-purple-600">${budgetDisplay}</span>
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
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>$0</span>
                    <span>$5,000+</span>
                  </div>
                </div>

                {/* Support Needed */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-base font-medium">
                    <HelpCircle className="h-5 w-5 text-purple-500" />
                    Any specific support you're looking for?
                  </Label>
                  <MultiSelect
                    options={supportOptions}
                    selected={form.getValues("support") || []}
                    onChange={(selected) => form.setValue("support", selected, { shouldValidate: true })}
                    placeholder="Select support needs"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-10 py-6 rounded-full text-lg font-medium transition-all shadow-md hover:shadow-lg"
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
                  <p className="text-red-500">{error}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {guideData && (
        <div className="mt-8">
          <GuideResults data={guideData} location={form.getValues().location} />
        </div>
      )}
    </div>
  )
}
