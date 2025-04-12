"use client"

import type React from "react"

import type { Property } from "@/types/property"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bed, Bath, Home, Calendar, ExternalLink, MapPin, Heart } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

interface PropertyCardProps {
  property: Property
  isSelected: boolean
  onClick: () => void
}

export function PropertyCard({ property, isSelected, onClick }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <Card
      className={`overflow-hidden transition-all cursor-pointer hover:shadow-md ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative h-48">
        <Image src={property.images[0] || "/placeholder.svg"} alt={property.title} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white rounded-full"
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
            <span className="sr-only">Add to favorites</span>
          </Button>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/70">
            {property.type}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
          <span className="font-bold text-lg text-primary">${property.price.toLocaleString()}/mo</span>
        </div>

        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span className="line-clamp-1">{property.address}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
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

        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Available {formatDate(property.availableDate)}</span>
        </div>

        {property.fees.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Additional Fees:</p>
            <ul className="text-xs text-muted-foreground">
              {property.fees.map((fee, index) => (
                <li key={index}>
                  • {fee.description}: ${fee.amount}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-4">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {property.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{property.amenities.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <a href={property.listingUrl} target="_blank" rel="noopener noreferrer">
              View Listing <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
          <Button variant="default" size="sm" className="text-xs">
            Contact Agent
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
