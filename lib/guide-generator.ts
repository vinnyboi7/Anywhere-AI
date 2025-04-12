import { getLocationFromZipCode } from "./location-utils"

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
    stateCode: string
    fullAddress: string
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

    // Step 2: Generate mock data based on the location and user preferences
    return generateMockGuideData(city, state, stateCode, fullAddress, input)
  } catch (error: any) {
    console.error("Error generating guide:", error)
    // Even if there's an error with the location lookup, try to generate a generic guide
    try {
      // Attempt to create a generic guide with default values
      return generateMockGuideData(
        "New York", // Default city
        "New York", // Default state
        "NY", // Default state code
        "New York, NY", // Default address
        input,
      )
    } catch (fallbackError) {
      // If everything else fails, throw the original error
      throw new Error(`Failed to generate guide: ${error.message}`)
    }
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
  // Create housing links with accurate URLs
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

  // Create job search links with accurate URLs
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

  // Generate food places based on preferences
  const foodPlaces = input.foodPreferences.map((preference) => {
    let name = `${city} Eatery`
    let cuisine = preference
    let description = "Local restaurant with diverse menu options."

    // Customize based on food preference
    if (preference.toLowerCase() === "vegetarian") {
      name = `Green Table ${city}`
      description = "Farm-to-table vegetarian restaurant with seasonal ingredients."
    } else if (preference.toLowerCase() === "vegan") {
      name = `Plant Power ${city}`
      description = "100% plant-based menu with creative vegan dishes."
    } else if (preference.toLowerCase() === "halal") {
      name = `Halal Grill ${city}`
      description = "Authentic halal cuisine with a variety of options."
    } else if (preference.toLowerCase() === "non-veg") {
      name = `${city} Steakhouse`
      cuisine = "Steakhouse"
      description = "Premium steaks and seafood in an upscale setting."
    } else if (preference.toLowerCase() === "anything") {
      name = `${city} Food Hall`
      cuisine = "Various"
      description = "Food hall featuring multiple vendors and cuisine types."
    }

    return {
      name,
      cuisine,
      description,
    }
  })

  // If no food preferences were provided, add a default option
  if (foodPlaces.length === 0) {
    foodPlaces.push({
      name: `${city} Bistro`,
      cuisine: "American",
      description: "Popular local restaurant with a diverse menu.",
    })
  }

  // Generate events based on hobbies
  const events = input.hobbies.slice(0, 3).map((hobby) => {
    let eventName = `${city} Community Event`
    let description = "Local gathering for residents."
    let link = `https://www.eventbrite.com/d/${stateCode.toLowerCase()}--${city.toLowerCase().replace(/\s+/g, "-")}/events/`

    // Customize based on hobby
    if (hobby.toLowerCase() === "sports") {
      eventName = `${city} Sports League`
      description = "Join local teams for friendly competition in various sports."
      link = `https://www.meetup.com/find/?keywords=sports&source=EVENTS&location=${city}%2C%20${stateCode}`
    } else if (hobby.toLowerCase() === "arts") {
      eventName = `${city} Art Gallery Opening`
      description = "Exhibition featuring works from local and regional artists."
      link = `https://www.eventbrite.com/d/${stateCode.toLowerCase()}--${city.toLowerCase().replace(/\s+/g, "-")}/art/`
    } else if (hobby.toLowerCase() === "music") {
      eventName = `${city} Music Festival`
      description = "Annual music celebration featuring local and touring bands."
      link = `https://www.eventbrite.com/d/${stateCode.toLowerCase()}--${city.toLowerCase().replace(/\s+/g, "-")}/music/`
    } else if (hobby.toLowerCase() === "technology") {
      eventName = `${city} Tech Meetup`
      description = "Network with local tech professionals and entrepreneurs."
      link = `https://www.meetup.com/find/?keywords=technology&source=EVENTS&location=${city}%2C%20${stateCode}`
    } else if (hobby.toLowerCase() === "outdoor") {
      eventName = `${city} Hiking Group`
      description = "Guided hikes through nearby parks and natural areas."
      link = `https://www.meetup.com/find/?keywords=hiking&source=EVENTS&location=${city}%2C%20${stateCode}`
    } else if (hobby.toLowerCase() === "reading") {
      eventName = `${city} Book Club`
      description = "Monthly meetings to discuss selected books."
      link = `https://www.meetup.com/find/?keywords=book%20club&source=EVENTS&location=${city}%2C%20${stateCode}`
    } else if (hobby.toLowerCase() === "cooking") {
      eventName = `${city} Cooking Class`
      description = "Learn to prepare various cuisines from local chefs."
      link = `https://www.eventbrite.com/d/${stateCode.toLowerCase()}--${city.toLowerCase().replace(/\s+/g, "-")}/cooking-class/`
    } else if (hobby.toLowerCase() === "volunteering") {
      eventName = `${city} Volunteer Day`
      description = "Community service opportunities throughout the city."
      link = `https://www.volunteermatch.org/search?l=${city}%2C%20${stateCode}`
    }

    return {
      name: eventName,
      description,
      link,
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

  // Generate support services based on needs
  const services = input.supportNeeds.slice(0, 3).map((need) => {
    let serviceName = `${city} Community Services`
    let description = "General assistance for residents."
    let contact = "211"

    // Customize based on need
    if (need === "legal") {
      serviceName = `${city} Legal Aid`
      description = "Free or low-cost legal assistance for eligible residents."
      contact = `https://www.lawhelp.org/find-help/state-content/${stateCode.toLowerCase()}`
    } else if (need === "mental-health") {
      serviceName = `${city} Mental Health Center`
      description = "Counseling and mental health services for individuals and families."
      contact = "988"
    } else if (need === "esl") {
      serviceName = `${city} Language Center`
      description = "ESL classes and language learning resources for newcomers."
      contact = `https://www.findhelp.org/education/esl-classes?postal=${input.zipCode}`
    } else if (need === "childcare") {
      serviceName = `${city} Childcare Resources`
      description = "Information on childcare options and assistance programs."
      contact = `https://childcare.gov/state-resources?state=${stateCode.toLowerCase()}`
    } else if (need === "immigration") {
      serviceName = `${city} Immigration Services`
      description = "Legal assistance and resources for immigrants and refugees."
      contact = `https://www.immigrationadvocates.org/nonprofit/legaldirectory/search?state=${stateCode}`
    } else if (need === "financial") {
      serviceName = `${city} Financial Counseling`
      description = "Free financial education and counseling services."
      contact = `https://www.consumerfinance.gov/find-a-housing-counselor/?zipcode=${input.zipCode}`
    } else if (need === "healthcare") {
      serviceName = `${city} Community Health Center`
      description = "Affordable healthcare services for all residents."
      contact = `https://findahealthcenter.hrsa.gov/widget/result?zipCode=${input.zipCode}`
    } else if (need === "community") {
      serviceName = `${city} Community Center`
      description = "Programs, events, and resources for community members."
      contact = `https://www.google.com/maps/search/community+center+${city}+${stateCode}`
    }

    return {
      name: serviceName,
      description,
      contact,
    }
  })

  // Generate housing recommendations based on preferences
  let housingRecommendations = `Based on your preference for ${input.housingPreference} housing and a budget of $${input.budgetRange}, you might want to check out neighborhoods like Downtown, Riverside, and Oakwood in ${city}. These areas offer a variety of housing options within your budget range.`

  // Customize based on housing preference
  if (input.housingPreference === "Apartment") {
    housingRecommendations = `For apartments in ${city} within your $${input.budgetRange} budget, consider looking in the Downtown, Midtown, and University areas. These neighborhoods offer good amenities and are typically well-connected to public transportation.`
  } else if (input.housingPreference === "Shared Room") {
    housingRecommendations = `For shared housing in ${city} within your $${input.budgetRange} budget, check out listings in the University District and Midtown areas. These neighborhoods are popular for roommate situations and offer affordable options.`
  } else if (input.housingPreference === "Family Home") {
    housingRecommendations = `For family homes in ${city} within your $${input.budgetRange} budget, the suburbs like Oakwood, Riverside, and Pinecrest offer good school districts and family-friendly amenities.`
  } else if (input.housingPreference === "Temporary Stay") {
    housingRecommendations = `For temporary housing in ${city}, consider extended-stay hotels in the Downtown and Airport areas, or look for short-term rentals on Airbnb and VRBO. Many offer monthly rates within your $${input.budgetRange} budget.`
  } else if (input.housingPreference === "Student Housing") {
    housingRecommendations = `For student housing in ${city}, check out options near the local universities and colleges. The University District offers both on-campus and off-campus housing within your $${input.budgetRange} budget.`
  }

  // Generate job recommendations based on job type
  let jobRecommendations = `${city} has opportunities in the ${input.jobType} field. The local job market is diverse, with positions available in various industries. Check out the job listings below and consider attending networking events to connect with potential employers.`

  // Customize based on job type
  if (
    input.jobType.toLowerCase().includes("tech") ||
    input.jobType.toLowerCase().includes("software") ||
    input.jobType.toLowerCase().includes("developer")
  ) {
    jobRecommendations = `${city} has a growing tech scene with companies ranging from startups to established firms. Look for opportunities at the ${city} Tech Hub and Innovation Center. The average salary for ${input.jobType} positions in this area is competitive, and many companies offer remote or hybrid work options.`
  } else if (
    input.jobType.toLowerCase().includes("health") ||
    input.jobType.toLowerCase().includes("medical") ||
    input.jobType.toLowerCase().includes("nurse")
  ) {
    jobRecommendations = `${city} has several hospitals and healthcare facilities, including ${city} General Hospital and ${state} Medical Center. Healthcare professionals are in high demand, and many facilities offer sign-on bonuses and relocation assistance.`
  } else if (input.jobType.toLowerCase().includes("education") || input.jobType.toLowerCase().includes("teach")) {
    jobRecommendations = `${city} has a strong education system with public and private schools, as well as higher education institutions. The ${city} School District regularly hires teachers and support staff, and there are opportunities at local colleges and universities as well.`
  }

  // Generate language help recommendations
  let languageHelp = `For ${input.preferredLanguage} language resources, the ${city} Community College offers affordable classes. The International Center provides conversation partners, and the public library has free language learning software and meetups.`

  // Customize based on language
  if (input.preferredLanguage.toLowerCase() === "english") {
    languageHelp = `For English language resources in ${city}, the ${city} Adult Education Center offers ESL classes at various levels. The International Center hosts weekly conversation groups, and the ${city} Public Library provides free access to language learning software like Mango Languages and Rosetta Stone.`
  } else if (input.preferredLanguage.toLowerCase() === "spanish") {
    languageHelp = `For Spanish language resources in ${city}, check out the Hispanic Cultural Center which offers language classes and cultural events. The ${city} Community College has Spanish courses for all levels, and there are several Spanish conversation groups that meet at local cafes and the public library.`
  } else if (input.preferredLanguage.toLowerCase() === "french") {
    languageHelp = `For French language resources in ${city}, the Alliance Française offers classes and cultural events. The ${city} Community College has French courses, and there's a French conversation group that meets weekly at Café Paris in Downtown ${city}.`
  } else if (
    input.preferredLanguage.toLowerCase() === "mandarin" ||
    input.preferredLanguage.toLowerCase() === "chinese"
  ) {
    languageHelp = `For Mandarin/Chinese language resources in ${city}, the Chinese Cultural Center offers language classes for all levels. The ${city} Community College has Mandarin courses, and there are several language exchange meetups organized through the Asian American Cultural Association.`
  } else if (input.preferredLanguage.toLowerCase() === "arabic") {
    languageHelp = `For Arabic language resources in ${city}, the Islamic Cultural Center offers language classes and cultural events. The ${city} Community College has Arabic courses, and there's an Arabic language meetup group that gathers weekly at the International Coffee House.`
  }

  // Generate a welcome message
  const welcomeMessage = `Welcome to ${city}, ${state}! We're excited to help you settle into your new home. This guide has been customized based on your preferences to help you navigate the city and find resources that match your needs. ${city} is known for its ${getLocationCharacteristics(city, state)} and offers a great quality of life for newcomers.`

  return {
    welcomeMessage,
    housingResources: {
      recommendations: housingRecommendations,
      links: housingLinks,
    },
    jobResources: {
      recommendations: jobRecommendations,
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
    languageHelp,
    supportServices: {
      recommendations: `For support services, you can contact the ${city} Welcome Center at 211. They offer orientation sessions for newcomers. The Community Services Office can connect you with specific resources based on your needs.`,
      services,
    },
    locationInfo: {
      city,
      state,
      stateCode,
      fullAddress,
    },
  }
}

/**
 * Returns characteristics for a given location to make the welcome message more personalized
 */
function getLocationCharacteristics(city: string, state: string): string {
  // Define characteristics for major cities
  const cityCharacteristics: Record<string, string> = {
    "New York": "vibrant culture, diverse neighborhoods, and world-class dining",
    "Los Angeles": "beautiful beaches, entertainment industry, and year-round sunshine",
    Chicago: "stunning architecture, lakefront parks, and rich cultural scene",
    Houston: "diverse culinary scene, space industry, and southern hospitality",
    Phoenix: "desert landscapes, outdoor activities, and southwestern charm",
    Philadelphia: "historic sites, passionate sports fans, and authentic food scene",
    "San Antonio": "rich history, River Walk, and Tex-Mex cuisine",
    "San Diego": "perfect weather, beautiful beaches, and relaxed lifestyle",
    Dallas: "booming job market, sports culture, and Texas pride",
    "San Jose": "tech innovation, diverse communities, and proximity to nature",
    Austin: "live music, tech scene, and unique local culture",
    Jacksonville: "beautiful beaches, outdoor activities, and southern charm",
    "San Francisco": "iconic landmarks, tech innovation, and diverse neighborhoods",
    Columbus: "college town atmosphere, arts scene, and growing tech industry",
    Indianapolis: "sports culture, friendly communities, and affordable living",
    Charlotte: "banking industry, southern hospitality, and growing urban center",
    Seattle: "coffee culture, tech industry, and stunning natural surroundings",
    Denver: "mountain views, outdoor recreation, and craft beer scene",
    Washington: "historic landmarks, free museums, and international community",
    Boston: "rich history, prestigious universities, and distinct neighborhoods",
    Nashville: "country music, southern cuisine, and friendly atmosphere",
    Portland: "quirky culture, food trucks, and environmental consciousness",
    "Las Vegas": "entertainment options, dining experiences, and desert landscape",
    Miami: "beautiful beaches, vibrant nightlife, and Latin American influence",
    Atlanta: "southern hospitality, civil rights history, and thriving film industry",
  }

  // Define characteristics for states
  const stateCharacteristics: Record<string, string> = {
    "New York": "diverse communities, cultural attractions, and natural beauty",
    California: "beautiful coastlines, diverse landscapes, and innovation",
    Texas: "friendly people, diverse cities, and strong economy",
    Florida: "beautiful beaches, tropical climate, and diverse communities",
    Illinois: "agricultural heritage, diverse landscapes, and midwestern values",
    Pennsylvania: "rich history, beautiful countryside, and diverse cities",
    Ohio: "midwestern hospitality, affordable living, and changing seasons",
    Georgia: "southern charm, growing industries, and diverse landscapes",
    "North Carolina": "beautiful mountains, growing tech scene, and coastal beauty",
    Michigan: "Great Lakes, automotive heritage, and outdoor recreation",
    "New Jersey": "proximity to major cities, diverse communities, and shore towns",
    Virginia: "rich history, beautiful landscapes, and strong economy",
    Washington: "natural beauty, tech industry, and outdoor lifestyle",
    Arizona: "desert landscapes, outdoor activities, and growing communities",
    Massachusetts: "rich history, educational excellence, and distinct seasons",
    Tennessee: "music heritage, southern hospitality, and natural beauty",
    Indiana: "midwestern values, sports culture, and manufacturing heritage",
    Missouri: "midwestern hospitality, diverse landscapes, and rich history",
    Maryland: "coastal beauty, proximity to DC, and diverse communities",
    Wisconsin: "lakes, cheese culture, and friendly communities",
    Colorado: "mountain landscapes, outdoor lifestyle, and growing economy",
    Minnesota: "lakes, progressive values, and strong community ties",
    "South Carolina": "southern hospitality, coastal beauty, and historic charm",
    Alabama: "southern traditions, college football, and growing industries",
    Louisiana: "unique culture, food traditions, and musical heritage",
    Kentucky: "bourbon heritage, horse country, and southern hospitality",
    Oregon: "natural beauty, progressive values, and outdoor lifestyle",
    Oklahoma: "native heritage, energy industry, and friendly communities",
    Connecticut: "New England charm, proximity to major cities, and rich history",
    Utah: "stunning national parks, outdoor recreation, and family-friendly communities",
    Iowa: "agricultural heritage, friendly communities, and political importance",
    Nevada: "desert landscapes, entertainment options, and growing communities",
    Arkansas: "natural beauty, affordable living, and southern hospitality",
    Mississippi: "southern traditions, musical heritage, and warm hospitality",
    Kansas: "agricultural heritage, friendly communities, and open spaces",
    "New Mexico": "diverse cultural heritage, artistic communities, and stunning landscapes",
    Nebraska: "agricultural heritage, friendly communities, and midwestern values",
    Idaho: "natural beauty, outdoor recreation, and growing communities",
    "West Virginia": "mountain landscapes, outdoor recreation, and strong community ties",
    Hawaii: "tropical paradise, unique culture, and natural beauty",
    "New Hampshire": "New England charm, no sales tax, and natural beauty",
    Maine: "coastal beauty, lobster industry, and outdoor lifestyle",
    Montana: "big sky country, outdoor recreation, and western heritage",
    "Rhode Island": "coastal charm, historic sites, and compact size",
    Delaware: "tax advantages, coastal areas, and proximity to major cities",
    "South Dakota": "Mount Rushmore, open spaces, and western heritage",
    "North Dakota": "energy industry, agricultural heritage, and friendly communities",
    Alaska: "stunning wilderness, outdoor adventure, and unique lifestyle",
    Vermont: "maple syrup, beautiful landscapes, and progressive values",
    Wyoming: "wide-open spaces, national parks, and western heritage",
  }

  // Try to get city-specific characteristics first
  if (city in cityCharacteristics) {
    return cityCharacteristics[city]
  }

  // Fall back to state characteristics
  if (state in stateCharacteristics) {
    return stateCharacteristics[state]
  }

  // Default characteristics if neither city nor state is found
  return "friendly communities, local attractions, and unique character"
}
