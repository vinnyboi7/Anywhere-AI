import type { Property } from "@/types/property"

// Mock data for properties
const mockProperties: Property[] = [
  {
    id: "prop-001",
    title: "Modern Downtown Apartment",
    description: "Luxurious 2-bedroom apartment in the heart of downtown with stunning city views.",
    price: 2200,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1100,
    type: "Apartment",
    address: "123 Main St, New York, NY 10001",
    coordinates: {
      latitude: 40.7128,
      longitude: -74.006,
    },
    images: ["/minimalist-loft.png", "/sleek-urban-kitchen.png", "/minimalist-urban-bedroom.png"],
    amenities: ["In-unit Laundry", "Gym", "Pool", "Parking", "Pet Friendly"],
    availableDate: "2023-07-15",
    listedDate: "2023-06-01",
    fees: [
      { description: "Application Fee", amount: 50 },
      { description: "Security Deposit", amount: 2200 },
      { description: "Pet Deposit", amount: 500 },
    ],
    listingUrl: "https://example.com/listings/modern-downtown-apartment",
    contactPhone: "(555) 123-4567",
    contactEmail: "leasing@example.com",
  },
  {
    id: "prop-002",
    title: "Spacious Family Home",
    description: "Beautiful 4-bedroom house with a large backyard in a family-friendly neighborhood.",
    price: 3500,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2200,
    type: "House",
    address: "456 Oak Ave, New York, NY 10002",
    coordinates: {
      latitude: 40.7282,
      longitude: -73.9942,
    },
    images: ["/welcoming-suburban-home.png", "/cozy-family-gathering.png", "/sunlit-family-kitchen.png"],
    amenities: ["Backyard", "Garage", "Dishwasher", "Air Conditioning", "Fireplace"],
    availableDate: "2023-08-01",
    listedDate: "2023-06-15",
    fees: [
      { description: "Application Fee", amount: 75 },
      { description: "Security Deposit", amount: 3500 },
      { description: "Cleaning Fee", amount: 300 },
    ],
    listingUrl: "https://example.com/listings/spacious-family-home",
    contactPhone: "(555) 234-5678",
    contactEmail: "homes@example.com",
  },
  {
    id: "prop-003",
    title: "Cozy Studio Apartment",
    description: "Charming studio apartment in a historic building, perfect for singles or couples.",
    price: 1500,
    bedrooms: 0,
    bathrooms: 1,
    squareFeet: 550,
    type: "Studio",
    address: "789 Pine St, New York, NY 10003",
    coordinates: {
      latitude: 40.7318,
      longitude: -73.9865,
    },
    images: ["/cozy-urban-studio.png", "/cozy-studio-kitchen.png", "/cozy-studio-bathroom.png"],
    amenities: ["Furnished", "Utilities Included", "Laundry in Building", "Hardwood Floors"],
    availableDate: "2023-07-01",
    listedDate: "2023-06-10",
    fees: [
      { description: "Application Fee", amount: 50 },
      { description: "Security Deposit", amount: 1500 },
    ],
    listingUrl: "https://example.com/listings/cozy-studio-apartment",
    contactPhone: "(555) 345-6789",
    contactEmail: "rentals@example.com",
  },
  {
    id: "prop-004",
    title: "Luxury Waterfront Condo",
    description: "Stunning 3-bedroom condo with panoramic water views and high-end finishes.",
    price: 4200,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 1800,
    type: "Condo",
    address: "101 Harbor Dr, New York, NY 10004",
    coordinates: {
      latitude: 40.7023,
      longitude: -74.0156,
    },
    images: [
      "/modern-penthouse-view.png",
      "/placeholder.svg?height=400&width=600&query=luxury condo kitchen",
      "/placeholder.svg?height=400&width=600&query=luxury condo bedroom",
    ],
    amenities: ["Doorman", "Gym", "Pool", "Balcony", "In-unit Laundry", "Parking"],
    availableDate: "2023-09-01",
    listedDate: "2023-06-20",
    fees: [
      { description: "Application Fee", amount: 100 },
      { description: "Security Deposit", amount: 8400 },
      { description: "Move-in Fee", amount: 500 },
    ],
    listingUrl: "https://example.com/listings/luxury-waterfront-condo",
    contactPhone: "(555) 456-7890",
    contactEmail: "luxury@example.com",
  },
  {
    id: "prop-005",
    title: "Charming Brownstone Apartment",
    description: "Classic 1-bedroom apartment in a historic brownstone with original details.",
    price: 2000,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 750,
    type: "Apartment",
    address: "222 Elm St, New York, NY 10005",
    coordinates: {
      latitude: 40.7412,
      longitude: -73.989,
    },
    images: [
      "/placeholder.svg?height=400&width=600&query=brownstone apartment living room",
      "/placeholder.svg?height=400&width=600&query=brownstone apartment kitchen",
      "/placeholder.svg?height=400&width=600&query=brownstone apartment bedroom",
    ],
    amenities: ["Hardwood Floors", "High Ceilings", "Fireplace", "Laundry in Building"],
    availableDate: "2023-08-15",
    listedDate: "2023-06-25",
    fees: [
      { description: "Application Fee", amount: 50 },
      { description: "Security Deposit", amount: 2000 },
      { description: "Broker Fee", amount: 2000 },
    ],
    listingUrl: "https://example.com/listings/charming-brownstone-apartment",
    contactPhone: "(555) 567-8901",
    contactEmail: "historic@example.com",
  },
  {
    id: "prop-006",
    title: "Modern Loft in Arts District",
    description: "Spacious open-concept loft with industrial finishes in the vibrant Arts District.",
    price: 2800,
    bedrooms: 1,
    bathrooms: 1.5,
    squareFeet: 1200,
    type: "Loft",
    address: "333 Gallery Way, New York, NY 10006",
    coordinates: {
      latitude: 40.72,
      longitude: -74.005,
    },
    images: [
      "/placeholder.svg?height=400&width=600&query=modern loft interior",
      "/placeholder.svg?height=400&width=600&query=modern loft kitchen",
      "/placeholder.svg?height=400&width=600&query=modern loft bedroom",
    ],
    amenities: ["High Ceilings", "Exposed Brick", "Stainless Steel Appliances", "In-unit Laundry", "Pet Friendly"],
    availableDate: "2023-07-30",
    listedDate: "2023-06-05",
    fees: [
      { description: "Application Fee", amount: 75 },
      { description: "Security Deposit", amount: 2800 },
      { description: "Pet Deposit", amount: 500 },
    ],
    listingUrl: "https://example.com/listings/modern-loft-arts-district",
    contactPhone: "(555) 678-9012",
    contactEmail: "lofts@example.com",
  },
  {
    id: "prop-007",
    title: "Renovated Garden Apartment",
    description: "Beautifully renovated 2-bedroom apartment with private garden access.",
    price: 2600,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 950,
    type: "Apartment",
    address: "444 Garden Ave, New York, NY 10007",
    coordinates: {
      latitude: 40.735,
      longitude: -73.98,
    },
    images: [
      "/placeholder.svg?height=400&width=600&query=garden apartment living room",
      "/placeholder.svg?height=400&width=600&query=garden apartment kitchen",
      "/placeholder.svg?height=400&width=600&query=garden apartment outdoor",
    ],
    amenities: ["Private Garden", "Renovated Kitchen", "Dishwasher", "Laundry in Building", "Storage"],
    availableDate: "2023-08-01",
    listedDate: "2023-06-15",
    fees: [
      { description: "Application Fee", amount: 50 },
      { description: "Security Deposit", amount: 2600 },
    ],
    listingUrl: "https://example.com/listings/renovated-garden-apartment",
    contactPhone: "(555) 789-0123",
    contactEmail: "garden@example.com",
  },
  {
    id: "prop-008",
    title: "Penthouse with Rooftop Terrace",
    description: "Luxurious 3-bedroom penthouse with private rooftop terrace and panoramic city views.",
    price: 6500,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2200,
    type: "Penthouse",
    address: "555 Skyline Blvd, New York, NY 10008",
    coordinates: {
      latitude: 40.718,
      longitude: -73.995,
    },
    images: [
      "/placeholder.svg?height=400&width=600&query=penthouse living room",
      "/placeholder.svg?height=400&width=600&query=penthouse kitchen",
      "/placeholder.svg?height=400&width=600&query=penthouse rooftop terrace",
    ],
    amenities: ["Private Terrace", "Doorman", "Elevator", "Gym", "In-unit Laundry", "Parking", "Storage"],
    availableDate: "2023-09-15",
    listedDate: "2023-06-10",
    fees: [
      { description: "Application Fee", amount: 100 },
      { description: "Security Deposit", amount: 13000 },
      { description: "Move-in Fee", amount: 1000 },
    ],
    listingUrl: "https://example.com/listings/penthouse-rooftop-terrace",
    contactPhone: "(555) 890-1234",
    contactEmail: "luxury@example.com",
  },
]

// Function to simulate fetching properties from an API
export async function fetchProperties(): Promise<Property[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real application, this would be an API call
  return mockProperties
}

// Function to simulate fetching a single property by ID
export async function fetchPropertyById(id: string): Promise<Property | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Find the property with the matching ID
  const property = mockProperties.find((p) => p.id === id)

  return property || null
}

// Function to simulate searching for properties
export async function searchProperties(query: string): Promise<Property[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Filter properties based on the search query
  const results = mockProperties.filter((property) => {
    const searchString = `${property.title} ${property.description} ${property.address}`.toLowerCase()
    return searchString.includes(query.toLowerCase())
  })

  return results
}
