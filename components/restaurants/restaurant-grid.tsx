"use client"

import { useState } from "react"
import { Star, Clock, Truck, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import Link from "next/link"
import type { Restaurant } from "@/lib/types"

interface RestaurantGridProps {
  restaurants: Restaurant[]
  loading: boolean
}

export function RestaurantGrid({ restaurants, loading }: RestaurantGridProps) {
  const [sortBy, setSortBy] = useState("recommended")
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (restaurantId: number) => {
    setFavorites((prev) =>
      prev.includes(restaurantId) ? prev.filter((id) => id !== restaurantId) : [...prev, restaurantId],
    )
  }

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "delivery-time":
        return Number.parseInt(a.deliveryTime) - Number.parseInt(b.deliveryTime)
      case "delivery-fee":
        return a.deliveryFee - b.deliveryFee
      default:
        return b.featured ? 1 : -1
    }
  })

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">{restaurants.length} restaurants found</p>
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recommended">Sort by: Recommended</option>
          <option value="rating">Rating (High to Low)</option>
          <option value="delivery-time">Delivery Time</option>
          <option value="delivery-fee">Delivery Fee</option>
        </select>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-lg font-semibold mb-2">No restaurants found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
              <Link href={`/restaurant/${restaurant.id}`} className="block">
                <div className="relative">
                  <Image
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-2 right-2 bg-white/80 hover:bg-white ${
                      favorites.includes(restaurant.id) ? "text-red-500" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleFavorite(restaurant.id)
                    }}
                  >
                    <Heart className={`h-4 w-4 ${favorites.includes(restaurant.id) ? "fill-current" : ""}`} />
                  </Button>
                  {restaurant.featured && <Badge className="absolute top-2 left-2 bg-orange-500">Featured</Badge>}
                  {!restaurant.isOpen && <Badge className="absolute bottom-2 left-2 bg-red-500">Closed</Badge>}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1 hover:text-primary cursor-pointer">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{restaurant.rating}</span>
                      <span className="text-gray-500">({restaurant.reviewCount})</span>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Truck className="h-4 w-4" />
                        <span>${restaurant.deliveryFee}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
