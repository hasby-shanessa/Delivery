"use client"

import type React from "react"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  const [location, setLocation] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Build search parameters
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim())
    }
    if (location.trim()) {
      params.set("location", location.trim())
    }

    // Navigate to restaurants page with search parameters
    window.location.href = `/restaurants?${params.toString()}`
  }

  return (
    <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Delicious Food, Delivered Fast</h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Order from your favorite restaurants and get it delivered in minutes
        </p>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg p-4 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Enter your delivery address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 h-12 text-gray-900"
              />
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for restaurants or dishes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-gray-900"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8 bg-orange-500 hover:bg-orange-600">
              Find Food
            </Button>
          </div>
        </form>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">1000+</div>
            <div className="text-lg opacity-90">Restaurants</div>
          </div>
          <div>
            <div className="text-3xl font-bold">30 min</div>
            <div className="text-lg opacity-90">Average Delivery</div>
          </div>
          <div>
            <div className="text-3xl font-bold">50k+</div>
            <div className="text-lg opacity-90">Happy Customers</div>
          </div>
        </div>
      </div>
    </section>
  )
}
