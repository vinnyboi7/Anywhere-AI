"use client"

import { useState, useEffect } from "react"
import { PropertyMap } from "./property-map"
import { PropertyList } from "./property-list"
import { FilterControls } from "./filter-controls"
import { fetchProperties } from "@/lib/housing-api"
import type { Property } from "@/types/property"
import { Loader2 } from "lucide-react"

export function HousingRecommendationSystem() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    bedrooms: 0,
    location: "",
    amenities: [] as string[],
    sortBy: "price",
    sortDirection: "asc" as "asc" | "desc",
  })

  // Fetch properties on component mount
  useEffect(() => {
    const getProperties = async () => {
      try {
        setLoading(true)
        const data = await fetchProperties()
        setProperties(data)
        setFilteredProperties(data)
      } catch (err) {
        setError("Failed to load properties. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getProperties()

    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(getProperties, 30000)

    return () => clearInterval(intervalId)
  }, [])

  // Apply filters when filters change
  useEffect(() => {
    if (properties.length === 0) return

    let result = [...properties]

    // Apply price filter
    result = result.filter((property) => property.price >= filters.minPrice && property.price <= filters.maxPrice)

    // Apply bedrooms filter
    if (filters.bedrooms > 0) {
      result = result.filter((property) => property.bedrooms >= filters.bedrooms)
    }

    // Apply location filter
    if (filters.location) {
      result = result.filter((property) => property.address.toLowerCase().includes(filters.location.toLowerCase()))
    }

    // Apply amenities filter
    if (filters.amenities.length > 0) {
      result = result.filter((property) =>
        filters.amenities.every((amenity) =>
          property.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase())),
        ),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      if (filters.sortBy === "price") {
        return filters.sortDirection === "asc" ? a.price - b.price : b.price - a.price
      } else if (filters.sortBy === "bedrooms") {
        return filters.sortDirection === "asc" ? a.bedrooms - b.bedrooms : b.bedrooms - a.bedrooms
      } else if (filters.sortBy === "date") {
        return filters.sortDirection === "asc"
          ? new Date(a.listedDate).getTime() - new Date(b.listedDate).getTime()
          : new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime()
      }
      return 0
    })

    setFilteredProperties(result)
  }, [properties, filters])

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading properties...</span>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <FilterControls filters={filters} onFilterChange={handleFilterChange} />
        <PropertyList
          properties={filteredProperties}
          selectedProperty={selectedProperty}
          onPropertySelect={handlePropertySelect}
        />
      </div>
      <div className="lg:col-span-2">
        <PropertyMap
          properties={filteredProperties}
          selectedProperty={selectedProperty}
          onPropertySelect={handlePropertySelect}
        />
      </div>
    </div>
  )
}
