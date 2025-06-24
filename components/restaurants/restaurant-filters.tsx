"use client"

import { useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const cuisineTypes = [
  "Italian",
  "Chinese",
  "Mexican",
  "Indian",
  "Japanese",
  "American",
  "Thai",
  "Mediterranean",
  "Pizza",
  "Coffee",
  "Healthy",
  "Sandwiches",
  "Desserts",
  "Seafood",
]
const deliveryTimes = ["15-30 min", "30-45 min", "45-60 min", "60+ min"]

interface RestaurantFiltersProps {
  filters: {
    search: string
    cuisines: string[]
    deliveryTimes: string[]
    priceRange: [number, number]
    minRating: number
  }
  onFiltersChange: (filters: any) => void
}

export function RestaurantFilters({ filters, onFiltersChange }: RestaurantFiltersProps) {
  const handleCuisineChange = useCallback(
    (cuisine: string, checked: boolean) => {
      const newCuisines = checked ? [...filters.cuisines, cuisine] : filters.cuisines.filter((c) => c !== cuisine)
      onFiltersChange({ cuisines: newCuisines })
    },
    [filters.cuisines, onFiltersChange],
  )

  const handleDeliveryTimeChange = useCallback(
    (time: string, checked: boolean) => {
      const newDeliveryTimes = checked
        ? [...filters.deliveryTimes, time]
        : filters.deliveryTimes.filter((t) => t !== time)
      onFiltersChange({ deliveryTimes: newDeliveryTimes })
    },
    [filters.deliveryTimes, onFiltersChange],
  )

  const handlePriceRangeChange = useCallback(
    (value: number[]) => {
      onFiltersChange({ priceRange: value as [number, number] })
    },
    [onFiltersChange],
  )

  const handleRatingChange = useCallback(
    (value: number[]) => {
      onFiltersChange({ minRating: value[0] })
    },
    [onFiltersChange],
  )

  const clearFilters = useCallback(() => {
    onFiltersChange({
      cuisines: [],
      deliveryTimes: [],
      priceRange: [0, 50],
      minRating: 0,
    })
  }, [onFiltersChange])

  const hasActiveFilters = filters.cuisines.length > 0 || filters.deliveryTimes.length > 0 || filters.minRating > 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Filters
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Cuisine Type</h3>
            <div className="space-y-2">
              {cuisineTypes.map((cuisine) => (
                <div key={cuisine} className="flex items-center space-x-2">
                  <Checkbox
                    id={cuisine}
                    checked={filters.cuisines.includes(cuisine)}
                    onCheckedChange={(checked) => handleCuisineChange(cuisine, checked as boolean)}
                  />
                  <label htmlFor={cuisine} className="text-sm cursor-pointer">
                    {cuisine}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Delivery Time</h3>
            <div className="space-y-2">
              {deliveryTimes.map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <Checkbox
                    id={time}
                    checked={filters.deliveryTimes.includes(time)}
                    onCheckedChange={(checked) => handleDeliveryTimeChange(time, checked as boolean)}
                  />
                  <label htmlFor={time} className="text-sm cursor-pointer">
                    {time}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Price Range</h3>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                max={100}
                step={5}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}+</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Minimum Rating</h3>
            <div className="px-2">
              <Slider
                value={[filters.minRating]}
                onValueChange={handleRatingChange}
                min={0}
                max={5}
                step={0.5}
                className="mb-2"
              />
              <div className="text-sm text-gray-600">
                {filters.minRating > 0 ? `${filters.minRating}+ stars` : "Any rating"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasActiveFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filters.cuisines.map((cuisine) => (
                <Badge key={cuisine} variant="secondary" className="cursor-pointer">
                  {cuisine}
                  <button onClick={() => handleCuisineChange(cuisine, false)} className="ml-1 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              ))}
              {filters.deliveryTimes.map((time) => (
                <Badge key={time} variant="secondary" className="cursor-pointer">
                  {time}
                  <button onClick={() => handleDeliveryTimeChange(time, false)} className="ml-1 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              ))}
              {filters.minRating > 0 && (
                <Badge variant="secondary" className="cursor-pointer">
                  {filters.minRating}+ stars
                  <button onClick={() => handleRatingChange([0])} className="ml-1 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
