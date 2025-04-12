"use server"

import { z } from "zod"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Define the schema for the form data
const formSchema = z.object({
  location: z.string().min(2),
  interests: z.array(z.string()).min(1),
  foodPreferences: z.array(z.string()).min(1),
  language: z.string().min(1),
  housing: z.string().min(1),
  jobField: z.string().min(2),
  budget: z.number().min(0),
  support: z.array(z.string()).optional(),
})

// Define the job listing type
export type JobListing = {
  title: string
  company: string
  location: string
  salary: string
  description: string
  link: string
}

// Define the event type
export type Event = {
  name: string
  date: string
  location: string
  description: string
  category: string
  link: string
}

// Define the response type
export type GuideResponse = {
  welcomeMessage: string
  housingInfo: string
  jobSuggestions: string
  eventsOrHobbySpots: string
  foodRecommendations: string
  languageLearningHelp: string
  supportServices: string
  jobListings: JobListing[]
  events: Event[]
}

/**
 * Returns mock job listings based on location and job type
 * @param location The user's location
 * @param jobType The type of job the user is looking for
 * @returns An array of job listings
 */
function getMockJobs(location: string, jobType: string): JobListing[] {
  // Normalize job type to lowercase for matching
  const normalizedJobType = jobType.toLowerCase()

  // Define job categories and related job titles
  const techJobs = [
    {
      title: "Software Engineer",
      company: "TechCorp",
      description: "Develop and maintain web applications using modern frameworks.",
    },
    {
      title: "Data Scientist",
      company: "Analytics Inc",
      description: "Analyze large datasets and build predictive models.",
    },
    { title: "UX Designer", company: "DesignHub", description: "Create user-centered designs for digital products." },
    {
      title: "DevOps Engineer",
      company: "CloudSystems",
      description: "Implement and manage CI/CD pipelines and cloud infrastructure.",
    },
  ]

  const healthcareJobs = [
    {
      title: "Registered Nurse",
      company: "City Hospital",
      description: "Provide patient care in a fast-paced environment.",
    },
    {
      title: "Physical Therapist",
      company: "Wellness Center",
      description: "Help patients recover from injuries and improve mobility.",
    },
    {
      title: "Medical Assistant",
      company: "Family Practice",
      description: "Support physicians and handle administrative tasks.",
    },
    {
      title: "Healthcare Administrator",
      company: "Health Services",
      description: "Manage healthcare facility operations and staff.",
    },
  ]

  const educationJobs = [
    {
      title: "Elementary Teacher",
      company: "Public School District",
      description: "Teach core subjects to elementary students.",
    },
    {
      title: "College Professor",
      company: "State University",
      description: "Teach courses and conduct research in your field of expertise.",
    },
    {
      title: "Education Coordinator",
      company: "Learning Center",
      description: "Develop and implement educational programs.",
    },
    {
      title: "School Counselor",
      company: "Private Academy",
      description: "Provide academic and personal guidance to students.",
    },
  ]

  const businessJobs = [
    {
      title: "Marketing Manager",
      company: "Brand Solutions",
      description: "Develop and execute marketing strategies.",
    },
    {
      title: "Financial Analyst",
      company: "Investment Firm",
      description: "Analyze financial data and prepare reports.",
    },
    {
      title: "HR Specialist",
      company: "Corporate Services",
      description: "Manage recruitment and employee relations.",
    },
    {
      title: "Business Consultant",
      company: "Strategy Partners",
      description: "Help businesses improve operations and profitability.",
    },
  ]

  // Select job category based on job type
  let relevantJobs = businessJobs // Default

  if (
    normalizedJobType.includes("tech") ||
    normalizedJobType.includes("software") ||
    normalizedJobType.includes("developer") ||
    normalizedJobType.includes("engineer") ||
    normalizedJobType.includes("data") ||
    normalizedJobType.includes("design")
  ) {
    relevantJobs = techJobs
  } else if (
    normalizedJobType.includes("health") ||
    normalizedJobType.includes("medical") ||
    normalizedJobType.includes("nurse") ||
    normalizedJobType.includes("doctor") ||
    normalizedJobType.includes("care")
  ) {
    relevantJobs = healthcareJobs
  } else if (
    normalizedJobType.includes("teach") ||
    normalizedJobType.includes("education") ||
    normalizedJobType.includes("school") ||
    normalizedJobType.includes("professor") ||
    normalizedJobType.includes("instructor")
  ) {
    relevantJobs = educationJobs
  }

  // Select 3 random jobs from the relevant category
  const shuffled = [...relevantJobs].sort(() => 0.5 - Math.random())
  const selected = shuffled.slice(0, 3)

  // Format the selected jobs with location-specific details
  return selected.map((job) => ({
    title: job.title,
    company: `${job.company} ${location}`,
    location: `${location}`,
    salary: `$${60000 + Math.floor(Math.random() * 60000)}`,
    description: job.description,
    link: `https://jobs.example.com/${location.toLowerCase().replace(/\s+/g, "-")}/${job.title.toLowerCase().replace(/\s+/g, "-")}`,
  }))
}

/**
 * Returns mock events based on location and hobbies
 * @param location The user's location
 * @param hobbies The user's hobbies and interests
 * @returns An array of events
 */
function getMockEvents(location: string, hobbies: string[]): Event[] {
  // Define event categories
  const categories = {
    sports: [
      { name: "Community Basketball League", description: "Join local teams for friendly basketball competition." },
      { name: "5K Fun Run", description: "Annual charity run through scenic parts of the city." },
      { name: "Yoga in the Park", description: "Free weekly yoga sessions for all skill levels." },
      { name: "Tennis Tournament", description: "Singles and doubles tournament for amateur players." },
    ],
    arts: [
      { name: "Art Gallery Opening", description: "Exhibition featuring works from local artists." },
      { name: "Community Theater Production", description: "Local performance of a popular Broadway show." },
      { name: "Photography Workshop", description: "Learn composition and lighting techniques from professionals." },
      { name: "Poetry Reading Night", description: "Open mic night for poetry enthusiasts." },
    ],
    music: [
      { name: "Jazz in the Park", description: "Free outdoor jazz concert series." },
      { name: "Local Band Showcase", description: "Featuring up-and-coming musicians from the area." },
      { name: "Classical Music Concert", description: "Symphony orchestra performing classical masterpieces." },
      { name: "Music Production Workshop", description: "Learn the basics of digital music production." },
    ],
    technology: [
      { name: "Tech Meetup", description: "Network with local tech professionals and entrepreneurs." },
      { name: "Coding Workshop", description: "Hands-on session for beginners and intermediate coders." },
      { name: "Startup Pitch Night", description: "Local startups present their ideas to the community." },
      { name: "AI and Machine Learning Talk", description: "Expert discussion on the latest AI developments." },
    ],
    outdoor: [
      { name: "Hiking Group Expedition", description: "Guided hike through nearby natural areas." },
      { name: "Farmers Market", description: "Weekly market featuring local produce and crafts." },
      { name: "Community Garden Day", description: "Help plant and maintain the local community garden." },
      { name: "Outdoor Movie Night", description: "Family-friendly films screened in the park." },
    ],
    food: [
      { name: "Food Festival", description: "Taste dishes from the best local restaurants." },
      { name: "Cooking Class", description: "Learn to prepare regional specialties from local chefs." },
      { name: "Wine Tasting Event", description: "Sample wines from local and regional vineyards." },
      { name: "Baking Competition", description: "Show off your baking skills or just enjoy the treats." },
    ],
    community: [
      { name: "Neighborhood Cleanup", description: "Volunteer to help keep the community beautiful." },
      { name: "Cultural Heritage Festival", description: "Celebration of the diverse cultures in the area." },
      { name: "Charity Fundraiser", description: "Support local causes while enjoying entertainment and food." },
      { name: "Community Council Meeting", description: "Get involved in local decision-making." },
    ],
  }

  // Map user hobbies to event categories
  const relevantCategories = new Set<keyof typeof categories>()

  hobbies.forEach((hobby) => {
    const normalizedHobby = hobby.toLowerCase()

    if (
      normalizedHobby.includes("sport") ||
      normalizedHobby.includes("basketball") ||
      normalizedHobby.includes("soccer") ||
      normalizedHobby.includes("tennis") ||
      normalizedHobby.includes("fitness")
    ) {
      relevantCategories.add("sports")
    }

    if (
      normalizedHobby.includes("art") ||
      normalizedHobby.includes("paint") ||
      normalizedHobby.includes("draw") ||
      normalizedHobby.includes("craft") ||
      normalizedHobby.includes("theater") ||
      normalizedHobby.includes("drama")
    ) {
      relevantCategories.add("arts")
    }

    if (
      normalizedHobby.includes("music") ||
      normalizedHobby.includes("concert") ||
      normalizedHobby.includes("sing") ||
      normalizedHobby.includes("instrument") ||
      normalizedHobby.includes("band")
    ) {
      relevantCategories.add("music")
    }

    if (
      normalizedHobby.includes("tech") ||
      normalizedHobby.includes("code") ||
      normalizedHobby.includes("program") ||
      normalizedHobby.includes("computer") ||
      normalizedHobby.includes("software") ||
      normalizedHobby.includes("digital")
    ) {
      relevantCategories.add("technology")
    }

    if (
      normalizedHobby.includes("outdoor") ||
      normalizedHobby.includes("hike") ||
      normalizedHobby.includes("nature") ||
      normalizedHobby.includes("garden") ||
      normalizedHobby.includes("camp")
    ) {
      relevantCategories.add("outdoor")
    }

    if (
      normalizedHobby.includes("food") ||
      normalizedHobby.includes("cook") ||
      normalizedHobby.includes("bake") ||
      normalizedHobby.includes("cuisine") ||
      normalizedHobby.includes("restaurant")
    ) {
      relevantCategories.add("food")
    }

    if (
      normalizedHobby.includes("volunteer") ||
      normalizedHobby.includes("community") ||
      normalizedHobby.includes("social") ||
      normalizedHobby.includes("help") ||
      normalizedHobby.includes("charity")
    ) {
      relevantCategories.add("community")
    }
  })

  // If no relevant categories found, add some default ones
  if (relevantCategories.size === 0) {
    relevantCategories.add("community")
    relevantCategories.add("outdoor")
  }

  // Get events from relevant categories
  const selectedEvents: Event[] = []
  const categoryArray = Array.from(relevantCategories)

  // Ensure we get 3 events, even if there are fewer relevant categories
  for (let i = 0; i < 3; i++) {
    const categoryIndex = i % categoryArray.length
    const category = categoryArray[categoryIndex]
    const eventPool = categories[category]
    const event = eventPool[Math.floor(Math.random() * eventPool.length)]

    // Generate random date within the next 30 days
    const daysFromNow = Math.floor(Math.random() * 30) + 1
    const eventDate = new Date()
    eventDate.setDate(eventDate.getDate() + daysFromNow)
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })

    selectedEvents.push({
      name: event.name,
      date: formattedDate,
      location: `${location} ${["Park", "Community Center", "Downtown", "Convention Center", "Library"][Math.floor(Math.random() * 5)]}`,
      description: event.description,
      category: category,
      link: `https://events.example.com/${location.toLowerCase().replace(/\s+/g, "-")}/${event.name.toLowerCase().replace(/\s+/g, "-")}`,
    })
  }

  return selectedEvents
}

// Function to generate mock data for demonstration purposes
function generateMockGuide(location: string, jobType: string, hobbies: string[]): GuideResponse {
  // Get mock jobs and events
  const jobListings = getMockJobs(location, jobType)
  const events = getMockEvents(location, hobbies)

  return {
    welcomeMessage: `Welcome to ${location}! We're excited to help you settle into your new home. This guide has been customized based on your preferences to help you navigate the city and find resources that match your needs.`,
    housingInfo: `Based on your preferences, you might want to check out neighborhoods like Downtown, Riverside, and Oakwood in ${location}. These areas offer a variety of housing options within your budget range. Local real estate websites like ${location}Homes.com and ApartmentFinder can help you find specific listings.`,
    jobSuggestions: `${location} has a growing job market in your field. Check out the job listings below for opportunities that match your experience. You can also attend the monthly networking events at the Innovation Hub to connect with local professionals.`,
    eventsOrHobbySpots: `For your interests, ${location} offers several options. Check out the upcoming events section below for activities that match your hobbies. The Community Center also hosts weekly meetups, while the ${location} Park has great trails for outdoor activities.`,
    foodRecommendations: `Based on your food preferences, you might enjoy restaurants like Green Plate (vegetarian), Spice Garden (offers halal options), and The Local Table (farm-to-table with diverse menu). The ${location} Farmers Market on weekends is also worth checking out.`,
    languageLearningHelp: `For language resources, the ${location} Community College offers affordable classes. The International Center provides conversation partners, and the public library has free language learning software and meetups.`,
    supportServices: `For support services, you can contact the ${location} Welcome Center at 555-123-4567. They offer orientation sessions for newcomers. The Community Services Office can connect you with specific resources based on your needs.`,
    jobListings,
    events,
  }
}

// This function formats our internal response to match the expected API format
function formatResponseForAPI(data: GuideResponse): any {
  return {
    welcomeMessage: data.welcomeMessage,
    housing: data.housingInfo,
    jobs: data.jobListings.map((job) => ({
      title: job.title,
      company: job.company,
      link: job.link,
    })),
    events: data.events.map((event) => ({
      name: event.name,
      location: event.location,
      time: event.date,
    })),
    food: [data.foodRecommendations],
    languageHelp: data.languageLearningHelp,
    support: data.supportServices,
  }
}

export async function generateGuide(formData: z.infer<typeof formSchema>): Promise<GuideResponse> {
  try {
    // Generate mock jobs and events
    const jobListings = getMockJobs(formData.location, formData.jobField)
    const events = getMockEvents(formData.location, formData.interests)

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "99") {
      console.warn("Valid OpenAI API key not found. Using mock data instead.")
      return generateMockGuide(formData.location, formData.jobField, formData.interests)
    }

    // Format job listings and events for the prompt
    const jobListingsText = jobListings
      .map((job) => `- ${job.title} at ${job.company}: ${job.description} Salary: ${job.salary}`)
      .join("\n")

    const eventsText = events
      .map((event) => `- ${event.name} on ${event.date} at ${event.location}: ${event.description}`)
      .join("\n")

    // Create prompt for OpenAI with job listings and events
    const prompt = `
      Generate a personalized city guide for someone moving to ${formData.location}.
      
      About the person:
      - Hobbies and interests: ${formData.interests.join(", ")}
      - Food preferences: ${formData.foodPreferences.join(", ")}
      - Preferred language: ${formData.language}
      - Housing preference: ${formData.housing}
      - Job type they're looking for: ${formData.jobField}
      - Monthly budget: ${formData.budget}
      ${formData.support && formData.support.length > 0 ? `- Support needs: ${formData.support.join(", ")}` : ""}
      
      Here are some job listings in the area that match their interests:
      ${jobListingsText}
      
      Here are some upcoming events in the area that match their hobbies:
      ${eventsText}
      
      Create a comprehensive guide with the following sections:
      1. Welcome Message: A personalized welcome to the city
      2. Housing Info: Recommendations for neighborhoods and housing options that match their preferences and budget
      3. Job Suggestions: Local opportunities in their field (reference the job listings provided)
      4. Events or Hobby Spots: Places and events related to their interests (reference the events provided)
      5. Food Recommendations: Local restaurants and food options matching their preferences
      6. Language Learning Help: Resources for language learning if needed
      7. Support Services: Information about relevant support services they might need
      
      Format the response as a JSON object with these sections as keys.
    `

    try {
      // Generate response using OpenAI
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        system:
          "You are a helpful assistant that creates personalized city guides. Your responses should be informative, welcoming, and structured as JSON. Include specific, actionable recommendations based on the user's preferences.",
      })

      // Parse the response as JSON
      try {
        // The AI might return text with markdown code blocks, so we need to extract just the JSON
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || [null, text]
        const jsonString = jsonMatch[1] || text
        const guideData = JSON.parse(jsonString.trim())

        // Add the job listings and events to the response
        return {
          ...guideData,
          jobListings,
          events,
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError)
        // If parsing fails, use mock data
        return generateMockGuide(formData.location, formData.jobField, formData.interests)
      }
    } catch (aiError) {
      console.error("Error calling OpenAI API:", aiError)
      // If OpenAI API call fails, use mock data
      return generateMockGuide(formData.location, formData.jobField, formData.interests)
    }
  } catch (error) {
    console.error("Error generating guide:", error)
    throw new Error("Failed to generate guide. Please try again later.")
  }
}

// This API route handler can be used if you want to expose the guide generation as a REST API
export async function GET(request: Request) {
  // This is a placeholder for a REST API endpoint
  return new Response(JSON.stringify({ message: "Use POST method with form data to generate a guide" }), {
    headers: {
      "Content-Type": "application/json",
      // Add CORS headers
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const formData = {
      location: body.location || "",
      interests: body.interests || [],
      foodPreferences: body.foodPreferences || [],
      language: body.language || "",
      housing: body.housing || "",
      jobField: body.jobType || "", // Map jobType to jobField
      budget: body.budget || 1000,
      support: body.supportNeeds || [],
    }

    // Generate the guide
    const guideData = await generateGuide(formData as any)

    // Format the response to match the expected API format
    const formattedResponse = formatResponseForAPI(guideData)

    return new Response(JSON.stringify(formattedResponse), {
      headers: {
        "Content-Type": "application/json",
        // Add CORS headers
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("Error handling POST request:", error)
    return new Response(JSON.stringify({ error: "Failed to generate guide" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        // Add CORS headers
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
