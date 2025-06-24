import { type NextRequest, NextResponse } from "next/server"

// Mock data - replace with actual database queries
const restaurants = [
  {
    id: 1,
    name: "Bella Italia",
    slug: "bella-italia",
    cuisine: "Italian",
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: "25-35 min",
    deliveryFee: 2.99,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
    isOpen: true,
    minimumOrder: 15.0,
  },
  {
    id: 2,
    name: "Sushi Master",
    slug: "sushi-master",
    cuisine: "Japanese",
    rating: 4.9,
    reviewCount: 567,
    deliveryTime: "30-40 min",
    deliveryFee: 3.99,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
    isOpen: true,
    minimumOrder: 20.0,
  },
  {
    id: 3,
    name: "Burger Palace",
    slug: "burger-palace",
    cuisine: "American",
    rating: 4.6,
    reviewCount: 892,
    deliveryTime: "20-30 min",
    deliveryFee: 1.99,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
    isOpen: true,
    minimumOrder: 10.0,
  },
  {
    id: 4,
    name: "Spice Garden",
    slug: "spice-garden",
    cuisine: "Indian",
    rating: 4.7,
    reviewCount: 445,
    deliveryTime: "35-45 min",
    deliveryFee: 2.49,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
    isOpen: false,
    minimumOrder: 12.0,
  },
  {
    id: 5,
    name: "Dragon Palace",
    slug: "dragon-palace",
    cuisine: "Chinese",
    rating: 4.5,
    reviewCount: 678,
    deliveryTime: "25-35 min",
    deliveryFee: 2.99,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
    isOpen: true,
    minimumOrder: 15.0,
  },
  {
    id: 6,
    name: "Taco Fiesta",
    slug: "taco-fiesta",
    cuisine: "Mexican",
    rating: 4.4,
    reviewCount: 234,
    deliveryTime: "20-30 min",
    deliveryFee: 1.49,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
    isOpen: true,
    minimumOrder: 8.0,
  },
  {
    id: 7,
    name: "Mediterranean Delight",
    slug: "mediterranean-delight",
    cuisine: "Mediterranean",
    rating: 4.6,
    reviewCount: 156,
    deliveryTime: "30-40 min",
    deliveryFee: 2.99,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
    isOpen: true,
    minimumOrder: 18.0,
  },
  {
    id: 8,
    name: "Thai Orchid",
    slug: "thai-orchid",
    cuisine: "Thai",
    rating: 4.7,
    reviewCount: 389,
    deliveryTime: "25-35 min",
    deliveryFee: 2.49,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
    isOpen: true,
    minimumOrder: 14.0,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cuisine = searchParams.get("cuisine")
  const search = searchParams.get("search")
  const minRating = searchParams.get("minRating")
  const featured = searchParams.get("featured")
  const isOpen = searchParams.get("isOpen")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  let filteredRestaurants = restaurants

  // Filter by search query
  if (search) {
    const searchLower = search.toLowerCase()
    filteredRestaurants = filteredRestaurants.filter(
      (r) => r.name.toLowerCase().includes(searchLower) || r.cuisine.toLowerCase().includes(searchLower),
    )
  }

  // Filter by cuisine (can be comma-separated)
  if (cuisine) {
    const cuisines = cuisine.split(",").map((c) => c.trim().toLowerCase())
    filteredRestaurants = filteredRestaurants.filter((r) => cuisines.includes(r.cuisine.toLowerCase()))
  }

  // Filter by minimum rating
  if (minRating) {
    const rating = Number.parseFloat(minRating)
    filteredRestaurants = filteredRestaurants.filter((r) => r.rating >= rating)
  }

  // Filter by featured status
  if (featured === "true") {
    filteredRestaurants = filteredRestaurants.filter((r) => r.featured)
  }

  // Filter by open status
  if (isOpen === "true") {
    filteredRestaurants = filteredRestaurants.filter((r) => r.isOpen)
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex)

  return NextResponse.json({
    restaurants: paginatedRestaurants,
    total: filteredRestaurants.length,
    page,
    limit,
    totalPages: Math.ceil(filteredRestaurants.length / limit),
  })
}
