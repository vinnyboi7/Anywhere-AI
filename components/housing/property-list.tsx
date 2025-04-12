"use client"

import type { Property } from "@/types/property"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bed, Bath, Home, MapPin } from "lucide-react"
import Image from "next/image"

interface PropertyListProps {
  properties: Property[]
  selectedProperty: Property | null
  onPropertySelect: (property: Property) => void
}

export function PropertyList({ properties, selectedProperty, onPropertySelect }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center p-4 border rounded-lg bg-muted">
        No properties match your current filters. Try adjusting your search criteria.
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{properties.length} Properties Available</h2>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {properties.map((property) => (
            <Card
              key={property.id}
              className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                selectedProperty?.id === property.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onPropertySelect(property)}
            >
              <div className="relative h-40">
                <Image
                  src={property.images[0] || "/placeholder.svg?height=300&width=400&query=apartment"}
                  alt={property.title}
                  fill
                  className="object-cover"
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
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
