import { type NextRequest, NextResponse } from "next/server"

// Mock restaurant data
const restaurantData = {
  1: {
    id: 1,
    name: "Bella Italia",
    slug: "bella-italia",
    description: "Authentic Italian cuisine with fresh ingredients and traditional recipes",
    cuisine: "Italian",
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: "25-35 min",
    deliveryFee: 2.99,
    image: "/placeholder.svg?height=300&width=800",
    address: "123 Italian Way, New York, NY 10001",
    phone: "+1 (555) 123-0001",
    isOpen: true,
    featured: true,
    hours: {
      monday: "11:00 AM - 10:00 PM",
      tuesday: "11:00 AM - 10:00 PM",
      wednesday: "11:00 AM - 10:00 PM",
      thursday: "11:00 AM - 10:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "11:00 AM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM",
    },
  },
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const restaurant = restaurantData[params.id as keyof typeof restaurantData]

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
  }

  return NextResponse.json(restaurant)
}
