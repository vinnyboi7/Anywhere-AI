import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// Define the input type for the guide generator
export interface GuideInput {
  zipCode: string
  hobbies: string[]
  foodPreferences: string[]
  preferredLanguage: string
  housingPreference: string
  jobType: string
  budgetRange: number
  supportNeeds: string[]
}

// Define the response type
export interface GuideResponse {
  welcomeMessage: string
  housingResources: {
    recommendations: string
    links: Array<{ title: string; url: string }>
  }
  jobResources: {
    recommendations: string
    links: Array<{ title: string; url: string }>
  }
  eventsOrHobbies: {
    recommendations: string
    events: Array<{ name: string; description: string; link?: string }>
  }
  foodSuggestions: {
    recommendations: string
    places: Array<{ name: string; cuisine: string; description: string }>
  }
  languageHelp: string
  supportServices: {
    recommendations: string
    services: Array<{ name: string; description: string; contact?: string }>
  }
  locationInfo: {
    city: string
    state: string
    fullAddress: string
  }
}

/**
 * Converts a ZIP code to location information using the Zippopotam.us API
 */
async function getLocationFromZipCode(zipCode: string): Promise<{
  city: string
  state: string
  stateCode: string
  fullAddress: string
}> {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Invalid ZIP code: ${zipCode}`)
      }
      throw new Error(`Failed to fetch location data: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.places || data.places.length === 0) {
      throw new Error(`No location found for ZIP code: ${zipCode}`)
    }

    const place = data.places[0]
    const city = place["place name"]
    const state = place["state"]
    const stateCode = place["state abbreviation"]
    const fullAddress = `${city}, ${state} ${zipCode}`

    return { city, state, stateCode, fullAddress }
  } catch (error: any) {
    console.error("Error fetching location from ZIP code:", error)
    throw new Error(`Could not resolve location from ZIP code: ${error.message}`)
  }
}

/**
 * Generates mock data for a specific location
 */
function generateMockGuideData(
  city: string,
  state: string,
  stateCode: string,
  fullAddress: string,
  input: GuideInput,
): GuideResponse {
  // Create housing and job search links
  const housingLinks = [
    {
      title: "Apartments.com",
      url: `https://www.apartments.com/${city.toLowerCase().replace(/\s+/g, "-")}-${stateCode.toLowerCase()}`,
    },
    {
      title: "Zillow",
      url: `https://www.zillow.com/homes/${city}-${state}_rb/`,
    },
    {
      title: "Trulia",
      url: `https://www.trulia.com/for_rent/${city.toLowerCase().replace(/\s+/g, "_")},${stateCode.toLowerCase()}`,
    },
  ]

  const jobLinks = [
    {
      title: "Indeed",
      url: `https://www.indeed.com/jobs?q=${encodeURIComponent(input.jobType)}&l=${encodeURIComponent(city)}%2C+${stateCode}`,
    },
    {
      title: "LinkedIn Jobs",
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(input.jobType)}&location=${encodeURIComponent(city)}%2C%20${stateCode}`,
    },
    {
      title: "Glassdoor",
      url: `https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=${encodeURIComponent(input.jobType)}&sc.keyword=${encodeURIComponent(input.jobType)}&locT=C&locId=&jobType=`,
    },
  ]

  // Generate mock food places
  const foodPlaces = [
    {
      name: `${city} Fresh Market`,
      cuisine: input.foodPreferences.includes("vegetarian") ? "Vegetarian" : "American",
      description: "Local market with fresh produce and prepared foods.",
    },
    {
      name: `${city} Grill`,
      cuisine: "American",
      description: "Popular local restaurant with a diverse menu.",
    },
    {
      name: input.foodPreferences.includes("vegan") ? `Green Leaf Cafe` : `Main Street Diner`,
      cuisine: input.foodPreferences.includes("vegan") ? "Vegan" : "Traditional",
      description: input.foodPreferences.includes("vegan")
        ? "Plant-based cafe with creative dishes."
        : "Classic diner serving comfort food.",
    },
  ]

  // Generate mock events based on hobbies
  const events = input.hobbies.slice(0, 3).map((hobby) => {
    let eventName = "Community Event"
    let description = "Local gathering for residents."

    if (hobby === "sports") {
      eventName = `${city} Sports League`
      description = "Join local teams for friendly competition."
    } else if (hobby === "arts") {
      eventName = `${city} Art Gallery Opening`
      description = "Exhibition featuring works from local artists."
    } else if (hobby === "music") {
      eventName = `${city} Music Festival`
      description = "Annual music celebration with local bands."
    } else if (hobby === "technology") {
      eventName = `${city} Tech Meetup`
      description = "Network with local tech professionals."
    }

    return {
      name: eventName,
      description,
      link: `https://www.eventbrite.com/d/${stateCode.toLowerCase()}--${city.toLowerCase().replace(/\s+/g, "-")}/events/`,
    }
  })

  // If no hobbies were provided, add a default event
  if (events.length === 0) {
    events.push({
      name: `${city} Community Festival`,
      description: "Annual celebration of local culture and community.",
      link: `https://www.eventbrite.com/d/${stateCode.toLowerCase()}--${city.toLowerCase().replace(/\s+/g, "-")}/events/`,
    })
  }

  // Generate mock support services
  const services = input.supportNeeds.slice(0, 3).map((need) => {
    let serviceName = `${city} Community Services`
    let description = "General assistance for residents."

    if (need === "legal") {
      serviceName = `${city} Legal Aid`
      description = "Free or low-cost legal assistance for eligible residents."
    } else if (need === "mental-health") {
      serviceName = `${city} Mental Health Center`
      description = "Counseling and mental health services."
    } else if (need === "esl") {
      serviceName = `${city} Language Center`
      description = "ESL classes and language learning resources."
    }

    return {
      name: serviceName,
      description,
      contact: "555-123-4567",
    }
  })

  return {
    welcomeMessage: `Welcome to ${city}, ${state}! We're excited to help you settle into your new home. This guide has been customized based on your preferences to help you navigate the city and find resources that match your needs.`,
    housingResources: {
      recommendations: `Based on your preference for ${input.housingPreference} housing and a budget of $${input.budgetRange}, you might want to check out neighborhoods like Downtown, Riverside, and Oakwood in ${city}. These areas offer a variety of housing options within your budget range. Local real estate websites can help you find specific listings.`,
      links: housingLinks,
    },
    jobResources: {
      recommendations: `${city} has a growing job market in ${input.jobType}. Check out the job listings below for opportunities that match your experience. You can also attend the monthly networking events at the ${city} Innovation Hub to connect with local professionals.`,
      links: jobLinks,
    },
    eventsOrHobbies: {
      recommendations: `For your interests in ${input.hobbies.join(", ")}, ${city} offers several options. Check out the upcoming events section below for activities that match your hobbies. The Community Center also hosts weekly meetups, while the ${city} Park has great trails for outdoor activities.`,
      events,
    },
    foodSuggestions: {
      recommendations: `Based on your food preferences (${input.foodPreferences.join(", ")}), you might enjoy restaurants like Green Plate (vegetarian), Spice Garden (offers halal options), and The Local Table (farm-to-table with diverse menu). The ${city} Farmers Market on weekends is also worth checking out.`,
      places: foodPlaces,
    },
    languageHelp: `For ${input.preferredLanguage} language resources, the ${city} Community College offers affordable classes. The International Center provides conversation partners, and the public library has free language learning software and meetups.`,
    supportServices: {
      recommendations: `For support services, you can contact the ${city} Welcome Center at 555-123-4567. They offer orientation sessions for newcomers. The Community Services Office can connect you with specific resources based on your needs.`,
      services,
    },
    locationInfo: {
      city,
      state,
      fullAddress,
    },
  }
}

/**
 * Generates a personalized guide based on user preferences and location
 */
export async function generateGuide(input: GuideInput): Promise<GuideResponse> {
  try {
    // Step 1: Convert ZIP code to location
    const locationInfo = await getLocationFromZipCode(input.zipCode)
    const { city, state, stateCode, fullAddress } = locationInfo

    // Step 2: Check if OpenAI API key is valid
    // If the API key is "99" or not available, use mock data
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "99") {
      console.warn("Valid OpenAI API key not found. Using mock data instead.")
      return generateMockGuideData(city, state, stateCode, fullAddress, input)
    }

    // Step 3: Create housing and job search links
    const housingLinks = [
      {
        title: "Apartments.com",
        url: `https://www.apartments.com/${city.toLowerCase().replace(/\s+/g, "-")}-${stateCode.toLowerCase()}`,
      },
      {
        title: "Zillow",
        url: `https://www.zillow.com/homes/${city}-${state}_rb/`,
      },
      {
        title: "Trulia",
        url: `https://www.trulia.com/for_rent/${city.toLowerCase().replace(/\s+/g, "_")},${stateCode.toLowerCase()}`,
      },
    ]

    const jobLinks = [
      {
        title: "Indeed",
        url: `https://www.indeed.com/jobs?q=${encodeURIComponent(input.jobType)}&l=${encodeURIComponent(city)}%2C+${stateCode}`,
      },
      {
        title: "LinkedIn Jobs",
        url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(input.jobType)}&location=${encodeURIComponent(city)}%2C%20${stateCode}`,
      },
      {
        title: "Glassdoor",
        url: `https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=${encodeURIComponent(input.jobType)}&sc.keyword=${encodeURIComponent(input.jobType)}&locT=C&locId=&jobType=`,
      },
    ]

    // Step 4: Create a detailed prompt for GPT-4
    const prompt = `
      Generate a personalized welcome guide for someone moving to ${city}, ${state} (ZIP code: ${input.zipCode}).
      
      About the person:
      - Hobbies and interests: ${input.hobbies.join(", ")}
      - Food preferences: ${input.foodPreferences.join(", ")}
      - Preferred language: ${input.preferredLanguage}
      - Housing preference: ${input.housingPreference}
      - Job type they're looking for: ${input.jobType}
      - Monthly budget: ${input.budgetRange}
      ${input.supportNeeds.length > 0 ? `- Support needs: ${input.supportNeeds.join(", ")}` : ""}
      
      Please create a comprehensive, location-specific guide with the following sections:
      
      1. Welcome Message: A warm, personalized welcome to ${city}, highlighting what makes this location special.
      
      2. Housing Resources: Specific neighborhoods in ${city} that would match their housing preference and budget. Include actual neighborhood names and characteristics.
      
      3. Job Resources: Advice for finding jobs in the ${input.jobType} field specifically in ${city}. Include local companies or industries that are prominent in this area.
      
      4. Events or Hobbies: Local events, venues, or groups in ${city} related to their hobbies. Include actual names of parks, venues, clubs, or organizations.
      
      5. Food Suggestions: Local restaurants or food options in ${city} that match their preferences. Include actual restaurant names and locations when possible.
      
      6. Language Help: Resources for ${input.preferredLanguage} language learning or practice in ${city} if needed.
      
      7. Support Services: Information about relevant support services in ${city} based on their needs.
      
      Format the response as a JSON object with these sections as keys. For each section, provide specific, actionable information that is unique to ${city}, ${state}.
    `

    try {
      // Step 5: Generate the guide using GPT-4
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        system:
          "You are a helpful assistant that creates personalized city guides. Your responses should be informative, welcoming, and structured as JSON. Include specific, actionable recommendations based on the user's preferences and the actual location provided. Always include real neighborhood names, local businesses, and location-specific details.",
      })

      // Step 6: Parse the GPT response
      let gptResponse
      try {
        // The AI might return text with markdown code blocks, so we need to extract just the JSON
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || [null, text]
        const jsonString = jsonMatch[1] || text
        gptResponse = JSON.parse(jsonString.trim())
      } catch (error) {
        console.error("Error parsing AI response:", error)
        // If parsing fails, use mock data
        return generateMockGuideData(city, state, stateCode, fullAddress, input)
      }

      // Step 7: Combine GPT response with our pre-generated links
      return {
        welcomeMessage: gptResponse.welcomeMessage || `Welcome to ${city}, ${state}!`,
        housingResources: {
          recommendations:
            gptResponse.housingResources || `Here are some housing options in ${city} that match your preferences.`,
          links: housingLinks,
        },
        jobResources: {
          recommendations:
            gptResponse.jobResources || `Here are some job opportunities in ${city} for ${input.jobType}.`,
          links: jobLinks,
        },
        eventsOrHobbies: {
          recommendations:
            gptResponse.eventsOrHobbies || `Here are some activities in ${city} that match your interests.`,
          events: gptResponse.events || [],
        },
        foodSuggestions: {
          recommendations:
            gptResponse.foodSuggestions || `Here are some food options in ${city} that match your preferences.`,
          places: gptResponse.foodPlaces || [],
        },
        languageHelp:
          gptResponse.languageHelp || `Language resources for ${input.preferredLanguage} speakers in ${city}.`,
        supportServices: {
          recommendations: gptResponse.supportServices || `Support services in ${city} that might be helpful for you.`,
          services: gptResponse.services || [],
        },
        locationInfo: {
          city,
          state,
          fullAddress,
        },
      }
    } catch (aiError) {
      console.error("Error calling OpenAI API:", aiError)
      // If OpenAI API call fails, use mock data
      return generateMockGuideData(city, state, stateCode, fullAddress, input)
    }
  } catch (error: any) {
    console.error("Error generating guide:", error)
    throw new Error(`Failed to generate guide: ${error.message}`)
  }
}
