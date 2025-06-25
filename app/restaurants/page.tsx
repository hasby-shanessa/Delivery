"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RestaurantFilters } from "@/components/restaurants/restaurant-filters"
import { RestaurantGrid } from "@/components/restaurants/restaurant-grid"
import { SearchBar } from "@/components/ui/search-bar"
import { apiClient } from "@/lib/api"
import type { Restaurant } from "@/lib/types"
import { useSearchParams } from "next/navigation"

export default function RestaurantsPage() {
  const searchParams = useSearchParams()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [cuisines, setCuisines] = useState<string[]>(searchParams.get("cuisine") ? [searchParams.get("cuisine")!] : [])
  const [deliveryTimes, setDeliveryTimes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50])
  const [minRating, setMinRating] = useState(0)

  const filters = useMemo(
    () => ({
      search,
      cuisines,
      deliveryTimes,
      priceRange,
      minRating,
    }),
    [search, cuisines, deliveryTimes, priceRange, minRating],
  )

  const fetchRestaurants = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiClient.getRestaurants({
        search: filters.search,
        cuisine: filters.cuisines.join(","),
        minRating: filters.minRating > 0 ? filters.minRating : undefined,
      }) as unknown
      if (response && typeof response === 'object' && 'restaurants' in response) {
        setRestaurants((response as { restaurants: Restaurant[] }).restaurants)
      }
    } catch (error) {
      console.error("Failed to fetch restaurants:", error)
    } finally {
      setLoading(false)
    }
  }, [filters.search, filters.cuisines, filters.minRating])

  useEffect(() => {
    fetchRestaurants()
  }, [fetchRestaurants])

  const handleSearch = useCallback((query: string) => {
    setSearch(query)
  }, [])

  const handleFiltersChange = useCallback((newFilters: any) => {
    if (newFilters.cuisines !== undefined) setCuisines(newFilters.cuisines)
    if (newFilters.deliveryTimes !== undefined) setDeliveryTimes(newFilters.deliveryTimes)
    if (newFilters.priceRange !== undefined) setPriceRange(newFilters.priceRange)
    if (newFilters.minRating !== undefined) setMinRating(newFilters.minRating)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">All Restaurants</h1>
          <SearchBar
            placeholder="Search restaurants, cuisines, or dishes..."
            onSearch={handleSearch}
            defaultValue={search}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <RestaurantFilters filters={filters} onFiltersChange={handleFiltersChange} />
          </aside>
          <div className="lg:w-3/4">
            <RestaurantGrid restaurants={restaurants} loading={loading} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
