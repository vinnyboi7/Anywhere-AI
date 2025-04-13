/**
 * Converts a ZIP code to location information using the Zippopotam.us API
 */
export async function getLocationFromZipCode(zipCode: string): Promise<{
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
 * Gets location information from a city name
 * In a real app, this would use a geocoding service
 */
export async function getLocationFromCityName(cityName: string): Promise<{
  city: string
  state: string
  stateCode: string
  fullAddress: string
  zipCode: string // Added zipCode to the return type
}> {
  try {
    // Simple mapping of some major cities to states and zip codes
    const cityToStateAndZip: Record<string, [string, string, string]> = {
      "new york": ["New York", "NY", "10001"],
      "los angeles": ["California", "CA", "90001"],
      chicago: ["Illinois", "IL", "60601"],
      houston: ["Texas", "TX", "77001"],
      phoenix: ["Arizona", "AZ", "85001"],
      philadelphia: ["Pennsylvania", "PA", "19101"],
      "san antonio": ["Texas", "TX", "78201"],
      "san diego": ["California", "CA", "92101"],
      dallas: ["Texas", "TX", "75201"],
      austin: ["Texas", "TX", "78701"],
      "san francisco": ["California", "CA", "94101"],
      seattle: ["Washington", "WA", "98101"],
      denver: ["Colorado", "CO", "80201"],
      boston: ["Massachusetts", "MA", "02201"],
      miami: ["Florida", "FL", "33101"],
      atlanta: ["Georgia", "GA", "30301"],
      detroit: ["Michigan", "MI", "48201"],
      minneapolis: ["Minnesota", "MN", "55401"],
      portland: ["Oregon", "OR", "97201"],
      "las vegas": ["Nevada", "NV", "89101"],
    }

    // Check if the input contains a comma (likely city, state format)
    let normalizedCity = cityName.toLowerCase().trim()
    let state = "New York"
    let stateCode = "NY"
    let zipCode = "10001" // Default ZIP code

    if (cityName.includes(",")) {
      const parts = cityName.split(",").map((part) => part.trim())
      normalizedCity = parts[0].toLowerCase()

      // If state is provided, try to match it
      if (parts.length > 1) {
        const stateInput = parts[1].toLowerCase()

        // Map of state names and codes
        const stateMap: Record<string, [string, string]> = {
          alabama: ["Alabama", "AL"],
          alaska: ["Alaska", "AK"],
          arizona: ["Arizona", "AZ"],
          arkansas: ["Arkansas", "AR"],
          california: ["California", "CA"],
          colorado: ["Colorado", "CO"],
          connecticut: ["Connecticut", "CT"],
          delaware: ["Delaware", "DE"],
          florida: ["Florida", "FL"],
          georgia: ["Georgia", "GA"],
          hawaii: ["Hawaii", "HI"],
          idaho: ["Idaho", "ID"],
          illinois: ["Illinois", "IL"],
          indiana: ["Indiana", "IN"],
          iowa: ["Iowa", "IA"],
          kansas: ["Kansas", "KS"],
          kentucky: ["Kentucky", "KY"],
          louisiana: ["Louisiana", "LA"],
          maine: ["Maine", "ME"],
          maryland: ["Maryland", "MD"],
          massachusetts: ["Massachusetts", "MA"],
          michigan: ["Michigan", "MI"],
          minnesota: ["Minnesota", "MN"],
          mississippi: ["Mississippi", "MS"],
          missouri: ["Missouri", "MO"],
          montana: ["Montana", "MT"],
          nebraska: ["Nebraska", "NE"],
          nevada: ["Nevada", "NV"],
          "new hampshire": ["New Hampshire", "NH"],
          "new jersey": ["New Jersey", "NJ"],
          "new mexico": ["New Mexico", "NM"],
          "new york": ["New York", "NY"],
          "north carolina": ["North Carolina", "NC"],
          "north dakota": ["North Dakota", "ND"],
          ohio: ["Ohio", "OH"],
          oklahoma: ["Oklahoma", "OK"],
          oregon: ["Oregon", "OR"],
          pennsylvania: ["Pennsylvania", "PA"],
          "rhode island": ["Rhode Island", "RI"],
          "south carolina": ["South Carolina", "SC"],
          "south dakota": ["South Dakota", "SD"],
          tennessee: ["Tennessee", "TN"],
          texas: ["Texas", "TX"],
          utah: ["Utah", "UT"],
          vermont: ["Vermont", "VT"],
          virginia: ["Virginia", "VA"],
          washington: ["Washington", "WA"],
          "west virginia": ["West Virginia", "WV"],
          wisconsin: ["Wisconsin", "WI"],
          wyoming: ["Wyoming", "WY"],
          // Add state codes as keys too
          al: ["Alabama", "AL"],
          ak: ["Alaska", "AK"],
          az: ["Arizona", "AZ"],
          ar: ["Arkansas", "AR"],
          ca: ["California", "CA"],
          co: ["Colorado", "CO"],
          ct: ["Connecticut", "CT"],
          de: ["Delaware", "DE"],
          fl: ["Florida", "FL"],
          ga: ["Georgia", "GA"],
          hi: ["Hawaii", "HI"],
          id: ["Idaho", "ID"],
          il: ["Illinois", "IL"],
          in: ["Indiana", "IN"],
          ia: ["Iowa", "IA"],
          ks: ["Kansas", "KS"],
          ky: ["Kentucky", "KY"],
          la: ["Louisiana", "LA"],
          me: ["Maine", "ME"],
          md: ["Maryland", "MD"],
          ma: ["Massachusetts", "MA"],
          mi: ["Michigan", "MI"],
          mn: ["Minnesota", "MN"],
          ms: ["Mississippi", "MS"],
          mo: ["Missouri", "MO"],
          mt: ["Montana", "MT"],
          ne: ["Nebraska", "NE"],
          nv: ["Nevada", "NV"],
          nh: ["New Hampshire", "NH"],
          nj: ["New Jersey", "NJ"],
          nm: ["New Mexico", "NM"],
          ny: ["New York", "NY"],
          nc: ["North Carolina", "NC"],
          nd: ["North Dakota", "ND"],
          oh: ["Ohio", "OH"],
          ok: ["Oklahoma", "OK"],
          or: ["Oregon", "OR"],
          pa: ["Pennsylvania", "PA"],
          ri: ["Rhode Island", "RI"],
          sc: ["South Carolina", "SC"],
          sd: ["South Dakota", "SD"],
          tn: ["Tennessee", "TN"],
          tx: ["Texas", "TX"],
          ut: ["Utah", "UT"],
          vt: ["Vermont", "VT"],
          va: ["Virginia", "VA"],
          wa: ["Washington", "WA"],
          wv: ["West Virginia", "WV"],
          wi: ["Wisconsin", "WI"],
          wy: ["Wyoming", "WY"],
        }

        // Try to match the state
        if (stateMap[stateInput]) {
          ;[state, stateCode] = stateMap[stateInput]
        }
      }
    }

    // Try to find an exact match for the city
    if (cityToStateAndZip[normalizedCity]) {
      ;[state, stateCode, zipCode] = cityToStateAndZip[normalizedCity]
    } else {
      // Try to find a partial match
      for (const [key, value] of Object.entries(cityToStateAndZip)) {
        if (normalizedCity.includes(key) || key.includes(normalizedCity)) {
          ;[state, stateCode, zipCode] = value
          break
        }
      }
    }

    // Format the city name properly (capitalize first letter of each word)
    const formattedCity = cityName
      .split(",")[0] // Take only the city part if there's a comma
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")

    return {
      city: formattedCity,
      state,
      stateCode,
      fullAddress: `${formattedCity}, ${state}`,
      zipCode,
    }
  } catch (error: any) {
    console.error("Error getting location from city name:", error)
    throw new Error(`Could not resolve location from city name: ${error.message}`)
  }
}

/**
 * Unified function to get location information from either a ZIP code or city name
 * Always returns a consistent location object with city name and ZIP code
 */
export async function getLocationFromInput(input: string): Promise<{
  city: string
  state: string
  stateCode: string
  fullAddress: string
  zipCode: string
}> {
  // Check if input is a ZIP code (5 digits)
  const isZipCode = /^\d{5}$/.test(input)

  if (isZipCode) {
    // If it's a ZIP code, convert to location info
    const locationInfo = await getLocationFromZipCode(input)
    return {
      ...locationInfo,
      zipCode: input, // Include the original ZIP code
    }
  } else {
    // If it's not a ZIP code, treat as city name
    return getLocationFromCityName(input)
  }
}
