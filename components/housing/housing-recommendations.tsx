"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Bed, Bath, Home, DollarSign, ExternalLink } from "lucide-react"
import { FallbackImage } from "@/components/fallback-image"

interface HousingProperty {
  id: string
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  type: string
  image: string
  link: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface HousingRecommendationsProps {
  location: string
  budget: number
  housingType: string
}

// Declare google variable
declare global {
  interface Window {
    google: any
  }
}

// And change the map and markers state variables:
//const [map, setMap] = useState<any | null>(null)
//const [markers, setMarkers] = useState<any[]>([])

export function HousingRecommendations({ location, budget, housingType }: HousingRecommendationsProps) {
  const [properties, setProperties] = useState<HousingProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<any | null>(null)
  const [markers, setMarkers] = useState<any[]>([])

  // Generate mock properties based on location and budget
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)

        // In a real app, this would be an API call
        // For now, we'll generate mock data
        const mockProperties = generateMockProperties(location, budget, housingType)
        setProperties(mockProperties)

        // Initialize map after properties are loaded
        initializeMap(mockProperties)
      } catch (err) {
        console.error("Error fetching properties:", err)
        setError("Failed to load housing recommendations")
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()

    // Cleanup function
    return () => {
      if (markers.length > 0) {
        markers.forEach((marker) => marker.setMap(null))
      }
    }
  }, [location, budget, housingType])

  const initializeMap = async (properties: HousingProperty[]) => {
    // Load Google Maps script
    if (!window.google || !window.google.maps) {
      try {
        // In a real app, you would use a proper script loader
        // For this demo, we'll simulate map loading
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setMapLoaded(true)
      } catch (err) {
        console.error("Error loading Google Maps:", err)
        setError("Failed to load map")
        return
      }
    } else {
      setMapLoaded(true)
    }
  }

  // Create map and markers when map is loaded and properties are available
  useEffect(() => {
    if (!mapLoaded || properties.length === 0) return

    const mapElement = document.getElementById("housing-map")
    if (!mapElement) return

    // Create a simple map visualization
    const mapDiv = document.createElement("div")
    mapDiv.className = "w-full h-full bg-blue-50 relative"
    mapElement.innerHTML = ""
    mapElement.appendChild(mapDiv)

    // Add property markers
    properties.forEach((property, index) => {
      const marker = document.createElement("div")
      marker.className = `absolute w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md flex items-center justify-center text-white text-xs cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${selectedProperty === property.id ? "ring-2 ring-blue-500 z-10" : ""}`

      // Position markers in a grid pattern for the demo
      const row = Math.floor(index / 3)
      const col = index % 3
      marker.style.top = `${20 + row * 25}%`
      marker.style.left = `${20 + col * 30}%`

      marker.textContent = property.bedrooms.toString()
      marker.onclick = () => setSelectedProperty(property.id)

      mapDiv.appendChild(marker)
    })

    // Add map title
    const mapTitle = document.createElement("div")
    mapTitle.className = "absolute top-2 left-2 bg-white px-2 py-1 rounded shadow text-sm font-medium"
    mapTitle.textContent = `Housing in ${location}`
    mapDiv.appendChild(mapTitle)

    // Add property count
    const propertyCount = document.createElement("div")
    propertyCount.className = "absolute bottom-2 right-2 bg-white px-2 py-1 rounded shadow text-sm"
    propertyCount.textContent = `${properties.length} properties found`
    mapDiv.appendChild(propertyCount)
  }, [mapLoaded, properties, selectedProperty])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Loading housing recommendations...</p>
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (properties.length === 0) {
    return <p>No housing options found for your criteria. Try adjusting your budget or preferences.</p>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Map */}
        <Card className="overflow-hidden">
          <div id="housing-map" className="h-[300px] w-full bg-gray-100"></div>
        </Card>

        {/* Selected property or instructions */}
        <Card>
          <CardContent className="p-4">
            {selectedProperty ? (
              <PropertyDetail property={properties.find((p) => p.id === selectedProperty)!} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Property</h3>
                <p className="text-muted-foreground">
                  Click on a property marker on the map or in the list below to view details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Property list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isSelected={selectedProperty === property.id}
            onClick={() => setSelectedProperty(property.id)}
          />
        ))}
      </div>
    </div>
  )
}

function PropertyCard({
  property,
  isSelected,
  onClick,
}: {
  property: HousingProperty
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={onClick}
    >
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        <FallbackImage
          src={property.image}
          alt={property.title}
          fallbackSrc="/cozy-city-apartment.png"
          className="w-full h-full object-cover"
          style={{ display: "block" }}
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/70">
            {property.type}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
        <div className="flex items-center text-muted-foreground text-sm mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span className="line-clamp-1">{property.address}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-sm">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center text-sm">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center text-sm">
            <Home className="h-4 w-4 mr-1" />
            <span>{property.squareFeet} sqft</span>
          </div>
        </div>
        <div className="font-bold text-lg text-primary">${property.price.toLocaleString()}/mo</div>
      </CardContent>
    </Card>
  )
}

function PropertyDetail({ property }: { property: HousingProperty }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{property.title}</h3>
      <div className="flex items-center text-muted-foreground">
        <MapPin className="h-4 w-4 mr-1" />
        <span>{property.address}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md">
          <Bed className="h-5 w-5 mb-1" />
          <span className="font-medium">{property.bedrooms} Beds</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md">
          <Bath className="h-5 w-5 mb-1" />
          <span className="font-medium">{property.bathrooms} Baths</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md">
          <Home className="h-5 w-5 mb-1" />
          <span className="font-medium">{property.squareFeet} sqft</span>
        </div>
      </div>

      <div className="flex items-center text-lg font-bold text-primary">
        <DollarSign className="h-5 w-5" />
        <span>{property.price.toLocaleString()}/month</span>
      </div>

      <Button className="w-full" asChild>
        <a href={property.link} target="_blank" rel="noopener noreferrer">
          View Listing <ExternalLink className="h-4 w-4 ml-2" />
        </a>
      </Button>
    </div>
  )
}

// Helper function to generate mock properties
function generateMockProperties(location: string, budget: number, housingType: string): HousingProperty[] {
  // Normalize housing type
  const normalizedType = housingType.toLowerCase()

  // Determine property types based on housing preference
  let propertyTypes = ["Apartment"]
  if (normalizedType.includes("house") || normalizedType.includes("family")) {
    propertyTypes = ["House", "Townhouse"]
  } else if (normalizedType.includes("shared") || normalizedType.includes("room")) {
    propertyTypes = ["Shared Room", "Apartment"]
  } else if (normalizedType.includes("student")) {
    propertyTypes = ["Student Housing", "Shared Room"]
  }

  // Generate neighborhoods based on location
  const neighborhoods = [
    `Downtown ${location}`,
    `Midtown ${location}`,
    `University District`,
    `North ${location}`,
    `West ${location}`,
    `${location} Heights`,
  ]

  // Generate street names
  const streets = [
    "Main St",
    "Oak Ave",
    "University Blvd",
    "Park Rd",
    "Washington Ave",
    "Broadway",
    "Market St",
    "College Dr",
  ]

  // Generate properties
  const properties: HousingProperty[] = []

  // Number of properties to generate (5-8)
  const count = Math.floor(Math.random() * 4) + 5

  for (let i = 0; i < count; i++) {
    // Randomize property attributes
    const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)]
    const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)]
    const street = streets[Math.floor(Math.random() * streets.length)]
    const streetNumber = Math.floor(Math.random() * 2000) + 100

    // Adjust price based on budget (70-100% of budget)
    const pricePercentage = 0.7 + Math.random() * 0.3
    const price = Math.round((budget * pricePercentage) / 100) * 100

    // Bedrooms based on type
    let bedrooms = 1
    if (type === "House" || type === "Townhouse") {
      bedrooms = Math.floor(Math.random() * 3) + 2 // 2-4 bedrooms
    } else if (type === "Apartment") {
      bedrooms = Math.floor(Math.random() * 2) + 1 // 1-2 bedrooms
    } else if (type === "Shared Room") {
      bedrooms = 1
    }

    // Bathrooms based on bedrooms
    const bathrooms = Math.max(1, Math.round(bedrooms * 0.75))

    // Square feet based on type and bedrooms
    let squareFeet = 500
    if (type === "House") {
      squareFeet = 1000 + bedrooms * 400
    } else if (type === "Townhouse") {
      squareFeet = 800 + bedrooms * 300
    } else if (type === "Apartment") {
      squareFeet = 600 + bedrooms * 250
    } else if (type === "Shared Room") {
      squareFeet = 800
    }

    // Generate property title
    let title = ""
    if (type === "House") {
      title = `Spacious ${bedrooms}-Bedroom House in ${neighborhood}`
    } else if (type === "Townhouse") {
      title = `Modern ${bedrooms}-Bedroom Townhouse`
    } else if (type === "Apartment") {
      title = `${bedrooms}-Bedroom Apartment in ${neighborhood}`
    } else if (type === "Shared Room") {
      title = `Shared Room in ${neighborhood} Apartment`
    } else if (type === "Student Housing") {
      title = `Student Housing near University`
    }

    // Generate image query based on property type
    const imageQuery = `${type.toLowerCase()} in ${location}`

    properties.push({
      id: `property-${i}`,
      title,
      address: `${streetNumber} ${street}, ${neighborhood}, ${location}`,
      price,
      bedrooms,
      bathrooms,
      squareFeet,
      type,
      image: `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(imageQuery)}`,
      link: `https://www.google.com/maps/search/${encodeURIComponent(title + " " + location)}`,
      coordinates: {
        lat: 0, // In a real app, these would be actual coordinates
        lng: 0,
      },
    })
  }

  return properties
}
