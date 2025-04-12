"use server"

import { z } from "zod"
import { generateGuide as generateGuideFromLib } from "@/lib/guide-generator"

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

// Update the GuideResponse type to include restaurants
export type Restaurant = {
  name: string
  address: string
  rating: number
  type: string
  link: string
  photoUrl?: string
  priceRange?: string
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
  restaurants: Restaurant[]
}

// Update the generateGuide function to include restaurant data
export async function generateGuide(formData: z.infer<typeof formSchema>): Promise<GuideResponse> {
  try {
    // Check if the location is a ZIP code (5 digits)
    const isZipCode = /^\d{5}$/.test(formData.location)
    const zipCode = isZipCode ? formData.location : "75201" // Default to Dallas if not a ZIP

    // Generate the guide using our new library function
    const guideData = await generateGuideFromLib({
      zipCode,
      hobbies: formData.interests,
      foodPreferences: formData.foodPreferences,
      preferredLanguage: formData.language,
      housingPreference: formData.housing,
      jobType: formData.jobField,
      budgetRange: formData.budget,
      supportNeeds: formData.support || [],
    })

    // Generate mock job listings based on the location and job type
    const jobListings = getMockJobs(guideData.locationInfo.city, formData.jobField)

    // Generate mock events based on the location and hobbies
    const events = getMockEvents(guideData.locationInfo.city, formData.interests)

    // Get restaurant recommendations
    let restaurants: Restaurant[] = []
    try {
      // Generate restaurants directly without API call to avoid client-side fetch issues
      restaurants = generateMockRestaurants(
        guideData.locationInfo.city,
        guideData.locationInfo.stateCode,
        formData.foodPreferences,
      )
    } catch (error) {
      console.error("Error generating restaurant data:", error)
      // If there's an error, generate restaurants with fallback data
      restaurants = generateMockRestaurants(
        guideData.locationInfo.city,
        guideData.locationInfo.stateCode || guideData.locationInfo.state.substring(0, 2).toUpperCase(),
        formData.foodPreferences,
      )
    }

    // Format the response to match the expected GuideResponse type
    return {
      welcomeMessage: guideData.welcomeMessage,
      housingInfo: guideData.housingResources.recommendations,
      jobSuggestions: guideData.jobResources.recommendations,
      eventsOrHobbySpots: guideData.eventsOrHobbies.recommendations,
      foodRecommendations: guideData.foodSuggestions.recommendations,
      languageLearningHelp: guideData.languageHelp,
      supportServices: guideData.supportServices.recommendations,
      jobListings,
      events,
      restaurants,
    }
  } catch (error: any) {
    console.error("Error generating guide:", error)
    throw new Error(`Failed to generate guide: ${error.message}`)
  }
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
    link: `https://www.indeed.com/jobs?q=${encodeURIComponent(job.title)}&l=${encodeURIComponent(location)}`,
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

    // Create a more location-specific event name
    const locationSpecificName = `${location} ${event.name}`

    selectedEvents.push({
      name: locationSpecificName,
      date: formattedDate,
      location: `${location} ${["Park", "Community Center", "Downtown", "Convention Center", "Library"][Math.floor(Math.random() * 5)]}`,
      description: event.description,
      category: category,
      link: `https://www.eventbrite.com/d/${encodeURIComponent(location)}/events/`,
    })
  }

  return selectedEvents
}

/**
 * Generates enhanced mock restaurant data based on location and food preferences
 */
function generateMockRestaurants(city: string, stateCode: string, preferences: string[]): Restaurant[] {
  // Define cuisine types with more specific options
  const cuisineTypes = {
    american: ["American", "Burgers", "BBQ", "Southern", "Diner", "Steakhouse"],
    italian: ["Italian", "Pizza", "Pasta", "Mediterranean"],
    mexican: ["Mexican", "Tex-Mex", "Latin American", "Tacos"],
    asian: ["Chinese", "Japanese", "Thai", "Vietnamese", "Korean", "Sushi"],
    indian: ["Indian", "South Asian", "Curry House"],
    middleEastern: ["Middle Eastern", "Lebanese", "Turkish", "Falafel"],
    vegetarian: ["Vegetarian", "Vegan", "Plant-based", "Health Food"],
    seafood: ["Seafood", "Fish & Chips", "Oyster Bar"],
    breakfast: ["Breakfast", "Brunch", "Cafe", "Bakery"],
    dessert: ["Dessert", "Ice Cream", "Bakery", "Chocolate"],
    fastFood: ["Fast Food", "Burgers", "Chicken", "Sandwiches"],
    fineDining: ["Fine Dining", "Gourmet", "Contemporary"],
  }

  // Define restaurant name templates by cuisine
  const nameTemplatesByCuisine = {
    american: ["{City} Grill", "The {City} Diner", "{City} Smokehouse", "Main Street Burgers", "Downtown BBQ"],
    italian: ["Bella {City}", "Pasta Palace", "{City} Trattoria", "Mamma's Kitchen", "Luigi's Pizza"],
    mexican: ["El {City}", "Taqueria {City}", "Casa {City}", "Fiesta Mexican Grill", "Jalapeño's"],
    asian: ["Golden Dragon", "{City} Wok", "Sakura Japanese", "Thai Spice", "Pho {City}"],
    indian: ["Taj {City}", "Spice of India", "Curry House", "Delhi Palace", "Bombay Bistro"],
    middleEastern: ["Aladdin's", "{City} Kebab", "Mediterranean Delight", "Falafel King", "Olive Tree"],
    vegetarian: ["Green Table", "Plant Power {City}", "Fresh & Healthy", "Veggie Delight", "Sprout & Root"],
    seafood: ["{City} Fish Market", "Oceanside", "Captain's Catch", "Lobster Shack", "Blue Water Grill"],
    breakfast: ["Rise & Shine", "{City} Breakfast Club", "Morning Glory", "Sunny Side Up", "The Biscuit House"],
    dessert: ["Sweet Treats", "{City} Creamery", "Sugar Rush", "Chocolate Dreams", "The Cupcake Corner"],
    fastFood: ["Quick Bite", "{City} Express", "Fast & Tasty", "Burger Junction", "Chicken Shack"],
    fineDining: ["{City} Fine Dining", "Elegant Eats", "The {City} Room", "Gourmet {City}", "Chef's Table"],
  }

  // Define neighborhoods by city size
  const getNeighborhoods = (city: string) => {
    // For simplicity, we'll use generic neighborhood names
    // In a real app, you might want to use a database of actual neighborhoods
    const downtownArea = [`Downtown ${city}`, `Central ${city}`, `${city} Center`]
    const residentialAreas = [`North ${city}`, `South ${city}`, `East ${city}`, `West ${city}`]
    const trendyAreas = [`${city} Heights`, `${city} Park`, `Old ${city}`, `${city} Village`]

    return [...downtownArea, ...residentialAreas, ...trendyAreas]
  }

  // Map food preferences to cuisine types
  const mapPreferencesToCuisines = (prefs: string[]) => {
    const cuisineMap: Record<string, keyof typeof cuisineTypes> = {
      vegetarian: "vegetarian",
      vegan: "vegetarian",
      halal: "middleEastern",
      kosher: "middleEastern",
      "gluten-free": "vegetarian",
      mexican: "mexican",
      italian: "italian",
      chinese: "asian",
      japanese: "asian",
      thai: "asian",
      indian: "indian",
      american: "american",
      seafood: "seafood",
      breakfast: "breakfast",
      dessert: "dessert",
      "fast food": "fastFood",
      "fine dining": "fineDining",
    }

    const mappedCuisines = new Set<keyof typeof cuisineTypes>()

    // Map each preference to a cuisine type
    prefs.forEach((pref) => {
      const normalizedPref = pref.toLowerCase()

      // Check for direct matches
      if (cuisineMap[normalizedPref]) {
        mappedCuisines.add(cuisineMap[normalizedPref])
        return
      }

      // Check for partial matches
      for (const [key, value] of Object.entries(cuisineMap)) {
        if (normalizedPref.includes(key) || key.includes(normalizedPref)) {
          mappedCuisines.add(value)
          return
        }
      }
    })

    // If no matches found, add some default cuisines
    if (mappedCuisines.size === 0) {
      mappedCuisines.add("american")
      mappedCuisines.add("italian")
      mappedCuisines.add("asian")
    }

    return Array.from(mappedCuisines)
  }

  // Generate price ranges
  const priceRanges = ["$", "$", "$$"]

  // Map preferences to cuisines
  const relevantCuisines = mapPreferencesToCuisines(preferences)

  // Get neighborhoods for this city
  const neighborhoods = getNeighborhoods(city)

  // Generate restaurants
  const restaurants: Restaurant[] = []

  // If we have specific preferences, make sure we prioritize those
  if (preferences.length > 0) {
    // Create a mapping of preference to restaurant type for more accurate matching
    const preferenceToType: Record<string, string[]> = {
      vegetarian: ["Vegetarian", "Plant-based", "Health Food"],
      vegan: ["Vegan", "Plant-based", "Health Food"],
      halal: ["Halal", "Middle Eastern", "Lebanese", "Turkish"],
      "non-veg": ["Steakhouse", "BBQ", "Seafood", "Burgers"],
      anything: ["American", "Italian", "Chinese", "Mexican", "Indian"],
    }

    // For each preference, add at least one matching restaurant
    for (const pref of preferences) {
      const normalizedPref = pref.toLowerCase()
      const types = preferenceToType[normalizedPref] || ["Fusion", "International"]

      // Select a random type from the matching types
      const cuisineType = types[Math.floor(Math.random() * types.length)]

      // Add a restaurant of this type
      addRestaurantOfType(restaurants, city, stateCode, neighborhoods, normalizedPref, cuisineType)

      // If we have enough restaurants, stop adding more
      if (restaurants.length >= 5) break
    }
  }

  // Fill remaining slots with restaurants from relevant cuisines
  while (restaurants.length < 5) {
    // Select a cuisine type for this restaurant
    const cuisineType = relevantCuisines[restaurants.length % relevantCuisines.length]

    // Select a specific cuisine within that type
    const specificCuisines = cuisineTypes[cuisineType]
    const cuisine = specificCuisines[Math.floor(Math.random() * specificCuisines.length)]

    // Add a restaurant with this cuisine
    addRestaurantWithCuisine(restaurants, city, stateCode, neighborhoods, cuisineType, cuisine)
  }

  /**
   * Adds a restaurant of a specific type to the restaurants array
   */
  function addRestaurantOfType(
    restaurants: Restaurant[],
    city: string,
    stateCode: string,
    neighborhoods: string[],
    preference: string,
    cuisineType: string,
  ) {
    // Select a name template based on preference
    let name = ""
    let priceRange = "$"

    if (preference === "vegetarian") {
      name = ["Green Table", "Seasons Garden", "Fresh Harvest", `${city} Vegetarian`][Math.floor(Math.random() * 4)]
      priceRange = "$$"
    } else if (preference === "vegan") {
      name = ["Plant Power", "Pure Kitchen", "Green Life", `${city} Vegan Cafe`][Math.floor(Math.random() * 4)]
      priceRange = "$$"
    } else if (preference === "halal") {
      name = ["Halal Grill", "Spice Garden", "Authentic Halal", `${city} Halal Kitchen`][Math.floor(Math.random() * 4)]
      priceRange = "$$"
    } else if (preference === "non-veg") {
      name = [`${city} Steakhouse`, "Meat & Grill", "Seafood Harbor", "Prime Cuts"][Math.floor(Math.random() * 4)]
      priceRange = "$$$"
    } else {
      name = [`${city} Eatery`, "Local Table", "Fusion Kitchen", "City Diner"][Math.floor(Math.random() * 4)]
      priceRange = "$$"
    }

    // Select a neighborhood
    const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)]

    // Generate a street address
    const streetNumber = Math.floor(Math.random() * 1000) + 100
    const streets = ["Main St", "Oak Ave", "Maple Rd", "Broadway", "Park Ave", "1st St", "Washington Blvd", "Market St"]
    const street = streets[Math.floor(Math.random() * streets.length)]

    // Generate a rating (3.5 to 5.0)
    const rating = Number.parseFloat((3.5 + Math.random() * 1.5).toFixed(1))

    // Create the restaurant object
    restaurants.push({
      name,
      address: `${streetNumber} ${street}, ${neighborhood}, ${stateCode}`,
      rating,
      type: cuisineType,
      priceRange,
      link: `https://www.google.com/maps/search/${encodeURIComponent(name)}+${encodeURIComponent(city)}+${stateCode}`,
      photoUrl: `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(cuisineType)} restaurant food`,
    })
  }

  /**
   * Adds a restaurant with a specific cuisine to the restaurants array
   */
  function addRestaurantWithCuisine(
    restaurants: Restaurant[],
    city: string,
    stateCode: string,
    neighborhoods: string[],
    cuisineType: keyof typeof cuisineTypes,
    cuisine: string,
  ) {
    // Select a name template and generate a name
    const nameTemplates = nameTemplatesByCuisine[cuisineType]
    const nameTemplate = nameTemplates[Math.floor(Math.random() * nameTemplates.length)]
    const name = nameTemplate.replace("{City}", city)

    // Select a neighborhood
    const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)]

    // Generate a street address
    const streetNumber = Math.floor(Math.random() * 1000) + 100
    const streets = ["Main St", "Oak Ave", "Maple Rd", "Broadway", "Park Ave", "1st St", "Washington Blvd", "Market St"]
    const street = streets[Math.floor(Math.random() * streets.length)]

    // Generate a rating (3.5 to 5.0)
    const rating = Number.parseFloat((3.5 + Math.random() * 1.5).toFixed(1))

    // Generate a price range
    const priceRanges = ["$", "$$", "$$$"]
    const priceRange = priceRanges[Math.floor(Math.random() * priceRanges.length)]

    // Create the restaurant object
    restaurants.push({
      name,
      address: `${streetNumber} ${street}, ${neighborhood}, ${stateCode}`,
      rating,
      type: cuisine,
      priceRange,
      link: `https://www.google.com/maps/search/${encodeURIComponent(name)}+${encodeURIComponent(city)}+${stateCode}`,
      photoUrl: `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(cuisine)} restaurant food`,
    })
  }

  return restaurants
}
