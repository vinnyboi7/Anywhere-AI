"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import type { Property } from "@/types/property"
import { Loader2 } from "lucide-react"

interface PropertyMapProps {
  properties: Property[]
  selectedProperty: Property | null
  onPropertySelect: (property: Property) => void
}

export function PropertyMap({ properties, selectedProperty, onPropertySelect }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // Initialize map when component mounts
  useEffect(() => {
    // In a real application, we would initialize a map library here
    // For this demo, we'll create a simple visual representation
    if (!mapRef.current) return

    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (mapError) {
    return (
      <Card className="w-full h-[500px] flex items-center justify-center bg-red-50">
        <div className="text-red-500 text-center p-4">
          <p className="font-semibold">Map Error</p>
          <p>{mapError}</p>
        </div>
      </Card>
    )
  }

  if (!mapLoaded) {
    return (
      <Card className="w-full h-[500px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading map...</span>
      </Card>
    )
  }

  return (
    <Card className="w-full h-[500px] overflow-hidden relative">
      {/* Simplified map visualization */}
      <div className="absolute inset-0 bg-blue-50 p-4">
        <div className="text-center mb-4 text-blue-700 font-medium">Interactive Property Map</div>

        {/* Property markers */}
        <div className="relative w-full h-full" ref={mapRef}>
          {/* Map background with grid */}
          <div
            className="absolute inset-0 bg-white"
            style={{
              backgroundImage:
                "linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          {/* City center marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs">
              NYC
            </div>
          </div>

          {/* Property markers */}
          {properties.map((property) => {
            // Generate random positions for demo purposes
            // In a real app, these would be based on actual coordinates
            const randomAngle = Math.random() * Math.PI * 2
            const randomDistance = 30 + Math.random() * 150
            const top = `calc(50% + ${Math.sin(randomAngle) * randomDistance}px)`
            const left = `calc(50% + ${Math.cos(randomAngle) * randomDistance}px)`

            const isSelected = selectedProperty?.id === property.id

            return (
              <div
                key={property.id}
                className={`absolute w-5 h-5 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-xs transition-all duration-200 ${isSelected ? "w-6 h-6 z-10" : ""}`}
                style={{
                  top,
                  left,
                  backgroundColor: isSelected ? "#3b82f6" : "#ef4444",
                  border: "2px solid white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
                onClick={() => onPropertySelect(property)}
              >
                {property.bedrooms}
              </div>
            )
          })}

          {/* Property count */}
          <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded shadow text-sm">
            {properties.length} properties found
          </div>
        </div>
      </div>
    </Card>
  )
}
