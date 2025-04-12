"use client"

import type { Property } from "@/types/property"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bed, Bath, Home, ExternalLink, MapPin, X } from "lucide-react"
import Image from "next/image"

interface PropertyDetailProps {
  property: Property
  onClose: () => void
}

export function PropertyDetail({ property, onClose }: PropertyDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{property.title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="relative h-60 mb-4">
              <Image
                src={property.images[0] || "/placeholder.svg?height=400&width=600&query=apartment"}
                alt={property.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex items-center text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.address}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center text-sm bg-muted px-2 py-1 rounded">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center text-sm bg-muted px-2 py-1 rounded">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms} Baths</span>
              </div>
              <div className="flex items-center text-sm bg-muted px-2 py-1 rounded">
                <Home className="h-4 w-4 mr-1" />
                <span>{property.squareFeet} sqft</span>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{property.description}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Price:</span>{" "}
                  <span className="font-medium">${property.price.toLocaleString()}/month</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  <span className="font-medium">{property.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Available:</span>{" "}
                  <span className="font-medium">{formatDate(property.availableDate)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Listed:</span>{" "}
                  <span className="font-medium">{formatDate(property.listedDate)}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-1">
                {property.amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Fees</h3>
              <ul className="text-sm space-y-1">
                {property.fees.map((fee, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-muted-foreground">{fee.description}:</span>
                    <span className="font-medium">${fee.amount.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" size="sm" asChild>
                <a href={property.listingUrl} target="_blank" rel="noopener noreferrer">
                  View Listing <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
              <Button variant="default" size="sm">
                Contact Agent
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
