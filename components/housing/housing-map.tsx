"use client"

import { useState, useEffect } from "react"
import { PropertyList } from "./property-list"
import { PropertyFilters } from "./property-filters"
import { PropertyMap } from "./property-map"
import { PropertyDetail } from "./property-detail"
import { fetchProperties } from "@/lib/housing-api"
import type { Property } from "@/types/property"
import { Loader2 } from "lucide-react"

export function HousingMap() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    bedrooms: 0,
    location: "",
  })

  // Fetch properties on component mount
  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true)
        const data = await fetchProperties()
        setProperties(data)
        setFilteredProperties(data)
      } catch (err) {
        console.error("Failed to load properties:", err)
        setError("Failed to load properties. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  // Apply filters when they change
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
      <div className="lg:col-span-1 space-y-6">
        <PropertyFilters filters={filters} onFilterChange={handleFilterChange} />
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
        {selectedProperty && <PropertyDetail property={selectedProperty} onClose={() => setSelectedProperty(null)} />}
      </div>
    </div>
  )
}
