import { Star, Clock, Truck, Heart, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface RestaurantHeaderProps {
  restaurantId: string
}

export function RestaurantHeader({ restaurantId }: RestaurantHeaderProps) {
  // In a real app, you'd fetch restaurant data based on the ID
  const restaurant = {
    id: restaurantId,
    name: "Bella Italia",
    cuisine: "Italian Restaurant",
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: "25-35 min",
    deliveryFee: 2.99,
    image: "/placeholder.svg?height=300&width=800",
    description:
      "Authentic Italian cuisine with fresh ingredients and traditional recipes passed down through generations.",
    address: "123 Main Street, Downtown",
    phone: "+1 (555) 123-4567",
    isOpen: true,
    featured: true,
  }

  return (
    <div className="relative">
      <div className="h-64 md:h-80 relative">
        <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button variant="secondary" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                {restaurant.featured && <Badge className="bg-orange-500">Featured</Badge>}
                {restaurant.isOpen ? (
                  <Badge className="bg-green-500">Open</Badge>
                ) : (
                  <Badge variant="destructive">Closed</Badge>
                )}
              </div>
              <p className="text-gray-600 text-lg mb-2">{restaurant.cuisine}</p>
              <p className="text-gray-700 mb-4">{restaurant.description}</p>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{restaurant.rating}</span>
                  <span className="text-gray-500">({restaurant.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>${restaurant.deliveryFee} delivery</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">{restaurant.address}</p>
              <p className="text-sm text-gray-600">{restaurant.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
