"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react"

interface FilterControlsProps {
  filters: {
    minPrice: number
    maxPrice: number
    bedrooms: number
    location: string
    amenities: string[]
    sortBy: string
    sortDirection: "asc" | "desc"
  }
  onFilterChange: (filters: Partial<FilterControlsProps["filters"]>) => void
}

export function FilterControls({ filters, onFilterChange }: FilterControlsProps) {
  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice])
  const [isExpanded, setIsExpanded] = useState(false)

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    onFilterChange({ minPrice: value[0], maxPrice: value[1] })
  }

  const handleReset = () => {
    setPriceRange([0, 10000])
    onFilterChange({
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: 0,
      location: "",
      amenities: [],
      sortBy: "price",
      sortDirection: "asc",
    })
  }

  const amenitiesList = [
    { id: "parking", label: "Parking" },
    { id: "pool", label: "Pool" },
    { id: "gym", label: "Gym" },
    { id: "pets", label: "Pet Friendly" },
    { id: "furnished", label: "Furnished" },
    { id: "laundry", label: "In-unit Laundry" },
    { id: "ac", label: "Air Conditioning" },
    { id: "dishwasher", label: "Dishwasher" },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Filter Properties</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Location Search */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="City, neighborhood, or address"
                className="pl-8"
                value={filters.location}
                onChange={(e) => onFilterChange({ location: e.target.value })}
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Price Range</Label>
              <span className="text-sm text-muted-foreground">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
            <Slider
              min={0}
              max={10000}
              step={100}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="py-4"
            />
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Select
              value={filters.bedrooms.toString()}
              onValueChange={(value) => onFilterChange({ bedrooms: Number.parseInt(value) })}
            >
              <SelectTrigger id="bedrooms">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label htmlFor="sortBy">Sort By</Label>
            <div className="flex gap-2">
              <Select value={filters.sortBy} onValueChange={(value) => onFilterChange({ sortBy: value })}>
                <SelectTrigger id="sortBy" className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="bedrooms">Bedrooms</SelectItem>
                  <SelectItem value="date">Date Listed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.sortDirection}
                onValueChange={(value) => onFilterChange({ sortDirection: value as "asc" | "desc" })}
              >
                <SelectTrigger id="sortDirection" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Toggle Advanced Filters */}
          <Button variant="outline" className="w-full" onClick={() => setIsExpanded(!isExpanded)}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {isExpanded ? "Hide" : "Show"} Advanced Filters
          </Button>

          {/* Advanced Filters */}
          {isExpanded && (
            <div className="pt-2 space-y-4">
              {/* Amenities */}
              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={filters.amenities.includes(amenity.label)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onFilterChange({
                              amenities: [...filters.amenities, amenity.label],
                            })
                          } else {
                            onFilterChange({
                              amenities: filters.amenities.filter((a) => a !== amenity.label),
                            })
                          }
                        }}
                      />
                      <label
                        htmlFor={amenity.id}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
