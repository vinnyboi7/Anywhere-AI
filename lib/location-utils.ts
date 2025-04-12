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
