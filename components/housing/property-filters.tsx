"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RotateCcw } from "lucide-react"
import { useState } from "react"

interface PropertyFiltersProps {
  filters: {
    minPrice: number
    maxPrice: number
    bedrooms: number
    location: string
  }
  onFilterChange: (filters: Partial<PropertyFiltersProps["filters"]>) => void
}

export function PropertyFilters({ filters, onFilterChange }: PropertyFiltersProps) {
  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice])

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
    })
  }

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
        </div>
      </CardContent>
    </Card>
  )
}
