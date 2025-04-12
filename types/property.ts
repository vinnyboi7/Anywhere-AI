export interface Property {
  id: string
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  type: string
  address: string
  coordinates: {
    latitude: number
    longitude: number
  }
  images: string[]
  amenities: string[]
  availableDate: string
  listedDate: string
  fees: Array<{
    description: string
    amount: number
  }>
  listingUrl: string
  contactPhone: string
  contactEmail: string
}
