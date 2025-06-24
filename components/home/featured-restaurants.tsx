import { Star, Clock, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

const featuredRestaurants = [
  {
    id: 1,
    name: "Bella Italia",
    cuisine: "Italian",
    rating: 4.8,
    deliveryTime: "25-35 min",
    deliveryFee: 2.99,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
  },
  {
    id: 2,
    name: "Sushi Master",
    cuisine: "Japanese",
    rating: 4.9,
    deliveryTime: "30-40 min",
    deliveryFee: 3.99,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
  },
  {
    id: 3,
    name: "Burger Palace",
    cuisine: "American",
    rating: 4.6,
    deliveryTime: "20-30 min",
    deliveryFee: 1.99,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
  {
    id: 4,
    name: "Spice Garden",
    cuisine: "Indian",
    rating: 4.7,
    deliveryTime: "35-45 min",
    deliveryFee: 2.49,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
  },
]

export function FeaturedRestaurants() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Restaurants</h2>
          <p className="text-gray-600 text-lg">Top-rated restaurants in your area</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRestaurants.map((restaurant) => (
            <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                  <Image
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {restaurant.featured && <Badge className="absolute top-2 left-2 bg-orange-500">Featured</Badge>}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Truck className="h-4 w-4" />
                      <span>${restaurant.deliveryFee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
