"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/multi-select"
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
  const [locationInfo, setLocationInfo] = useState<{ city: string; state: string } | null>(null)

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

      // Extract location from the response if available
      if (data.welcomeMessage) {
        const cityMatch = data.welcomeMessage.match(/Welcome to ([^,]+),/)
        if (cityMatch && cityMatch[1]) {
          setLocationInfo({
            city: cityMatch[1].trim(),
            state: data.welcomeMessage.includes(", ") ? data.welcomeMessage.split(", ")[1].split("!")[0].trim() : "",
          })
        }
      }
    } catch (err: any) {
      console.error("Error generating guide:", err)
      setError(err.message || "We couldn't generate your personalized guide at this moment. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to validate if input is a ZIP code
  const isZipCode = (value: string) => /^\d{5}$/.test(value)

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">Tell us about your needs</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-sky-600" />
                  City, State or ZIP Code
                </Label>
                <Input
                  id="location"
                  placeholder="Enter your city, state or 5-digit ZIP code"
                  {...form.register("location")}
                  className="focus-visible:ring-sky-500"
                />
                {form.formState.errors.location && (
                  <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                )}
                {!form.formState.errors.location && form.getValues("location") && (
                  <p className="text-sm text-gray-500">
                    {isZipCode(form.getValues("location"))
                      ? "Using ZIP code for precise location"
                      : "For best results, enter a 5-digit ZIP code"}
                  </p>
                )}
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-sky-600" />
                  What are your interests or hobbies?
                </Label>
                <MultiSelect
                  options={interestOptions}
                  selected={form.getValues("interests")}
                  onChange={(selected) => form.setValue("interests", selected, { shouldValidate: true })}
                  placeholder="Select your interests"
                />
                {form.formState.errors.interests && (
                  <p className="text-sm text-red-500">{form.formState.errors.interests.message}</p>
                )}
              </div>

              {/* Food Preferences */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-sky-600" />
                  What kind of food do you enjoy?
                </Label>
                <MultiSelect
                  options={foodOptions}
                  selected={form.getValues("foodPreferences")}
                  onChange={(selected) => form.setValue("foodPreferences", selected, { shouldValidate: true })}
                  placeholder="Select food preferences"
                />
                {form.formState.errors.foodPreferences && (
                  <p className="text-sm text-red-500">{form.formState.errors.foodPreferences.message}</p>
                )}
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-sky-600" />
                  Preferred language for support
                </Label>
                <Select onValueChange={(value) => form.setValue("language", value, { shouldValidate: true })}>
                  <SelectTrigger className="focus:ring-sky-500">
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
                <Label htmlFor="housing" className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-sky-600" />
                  Housing preference
                </Label>
                <Select onValueChange={(value) => form.setValue("housing", value, { shouldValidate: true })}>
                  <SelectTrigger className="focus:ring-sky-500">
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

              {/* Job Field */}
              <div className="space-y-2">
                <Label htmlFor="jobField" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-sky-600" />
                  Job field or type you're seeking
                </Label>
                <Input
                  id="jobField"
                  placeholder="E.g., Healthcare, Technology, Education"
                  {...form.register("jobField")}
                  className="focus-visible:ring-sky-500"
                />
                {form.formState.errors.jobField && (
                  <p className="text-sm text-red-500">{form.formState.errors.jobField.message}</p>
                )}
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-sky-600" />
                  Budget range per month: ${form.getValues("budget")}
                </Label>
                <Slider
                  id="budget"
                  min={0}
                  max={5000}
                  step={100}
                  value={[form.getValues("budget")]}
                  onValueChange={(value) => form.setValue("budget", value[0], { shouldValidate: true })}
                  className="py-4"
                />
              </div>

              {/* Support Needed */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-sky-600" />
                  Any specific support you're looking for?
                </Label>
                <MultiSelect
                  options={supportOptions}
                  selected={form.getValues("support") || []}
                  onChange={(selected) => form.setValue("support", selected, { shouldValidate: true })}
                  placeholder="Select support needs"
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-6 rounded-full text-lg font-medium transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate My Welcome Guide"
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

      {guideData && <GuideResults data={guideData} location={locationInfo?.city || form.getValues().location} />}
    </div>
  )
}
