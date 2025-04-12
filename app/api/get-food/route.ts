import { NextResponse } from "next/server"
import { getLocationFromZipCode } from "@/lib/location-utils"

// Define the input type
interface FoodRequestInput {
  zipCode: string
  foodPreferences: string[]
}

// Define the restaurant type
interface Restaurant {
  name: string
  address: string
  rating: number
  type: string
  link: string
  photoUrl?: string
  priceRange?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FoodRequestInput

    // Validate required fields
    if (!body.zipCode) {
      return NextResponse.json({ error: "ZIP code is required" }, { status: 400 })
    }

    // Get location from ZIP code
    const locationInfo = await getLocationFromZipCode(body.zipCode)

    // Generate enhanced mock restaurants
    const mockRestaurants = generateEnhancedMockRestaurants(
      locationInfo.city,
      locationInfo.stateCode,
      body.foodPreferences || [],
    )

    return NextResponse.json(mockRestaurants)
  } catch (error: any) {
    console.error("Error getting food recommendations:", error)
    // Return mock data even in case of general errors
    try {
      const zipCode = (await request.json()).zipCode || "10001"
      const locationInfo = await getLocationFromZipCode(zipCode)
      const mockRestaurants = generateEnhancedMockRestaurants(locationInfo.city, locationInfo.stateCode, [])
      return NextResponse.json(mockRestaurants)
    } catch (fallbackError) {
      // If even the fallback fails, return a generic error
      return NextResponse.json({ error: "Failed to get food recommendations" }, { status: 500 })
    }
  }
}

/**
 * Generates enhanced mock restaurant data based on location and food preferences
 */
function generateEnhancedMockRestaurants(city: string, stateCode: string, preferences: string[]): Restaurant[] {
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
  const priceRanges = ["$", "$", "$$", "$$", "$$$"]

  // Map preferences to cuisines
  const relevantCuisines = mapPreferencesToCuisines(preferences)

  // Get neighborhoods for this city
  const neighborhoods = getNeighborhoods(city)

  // Generate 5 restaurants
  const restaurants: Restaurant[] = []

  for (let i = 0; i < 5; i++) {
    // Select a cuisine type for this restaurant
    const cuisineType = relevantCuisines[i % relevantCuisines.length]

    // Select a specific cuisine within that type
    const specificCuisines = cuisineTypes[cuisineType]
    const cuisine = specificCuisines[Math.floor(Math.random() * specificCuisines.length)]

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
