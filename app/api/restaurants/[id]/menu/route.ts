import { type NextRequest, NextResponse } from "next/server"

// Mock menu data
const menuData = {
  1: {
    categories: [
      {
        id: "appetizers",
        name: "Appetizers",
        items: [
          {
            id: 1,
            name: "Bruschetta",
            description: "Grilled bread topped with fresh tomatoes, garlic, and basil",
            price: 8.99,
            image: "/placeholder.svg?height=100&width=100",
            popular: true,
            dietary: ["vegetarian"],
          },
          {
            id: 2,
            name: "Calamari Rings",
            description: "Crispy fried squid rings served with marinara sauce",
            price: 12.99,
            image: "/placeholder.svg?height=100&width=100",
            popular: false,
            dietary: [],
          },
        ],
      },
      {
        id: "pasta",
        name: "Pasta",
        items: [
          {
            id: 3,
            name: "Spaghetti Carbonara",
            description: "Classic pasta with eggs, cheese, pancetta, and black pepper",
            price: 16.99,
            image: "/placeholder.svg?height=100&width=100",
            popular: true,
            dietary: [],
          },
          {
            id: 4,
            name: "Fettuccine Alfredo",
            description: "Creamy pasta with parmesan cheese and butter",
            price: 15.99,
            image: "/placeholder.svg?height=100&width=100",
            popular: false,
            dietary: ["vegetarian"],
          },
        ],
      },
    ],
  },
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const menu = menuData[params.id as keyof typeof menuData]

  if (!menu) {
    return NextResponse.json({ error: "Menu not found" }, { status: 404 })
  }

  return NextResponse.json(menu)
}
