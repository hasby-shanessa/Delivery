"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"

interface MenuSectionProps {
  restaurantId: string
}

const menuCategories = [
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
      },
      {
        id: 2,
        name: "Calamari Rings",
        description: "Crispy fried squid rings served with marinara sauce",
        price: 12.99,
        image: "/placeholder.svg?height=100&width=100",
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
      },
      {
        id: 4,
        name: "Fettuccine Alfredo",
        description: "Creamy pasta with parmesan cheese and butter",
        price: 15.99,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "pizza",
    name: "Pizza",
    items: [
      {
        id: 5,
        name: "Margherita Pizza",
        description: "Fresh mozzarella, tomato sauce, and basil",
        price: 14.99,
        image: "/placeholder.svg?height=100&width=100",
        popular: true,
      },
      {
        id: 6,
        name: "Pepperoni Pizza",
        description: "Classic pepperoni with mozzarella cheese",
        price: 17.99,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
]

export function MenuSection({ restaurantId }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState("appetizers")
  const { addItem } = useCart()

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantId,
      image: item.image,
    })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Menu</h2>

      <div className="flex space-x-4 mb-8 overflow-x-auto">
        {menuCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => setActiveCategory(category.id)}
            className="whitespace-nowrap"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {menuCategories.map((category) => (
        <div key={category.id} className={activeCategory === category.id ? "block" : "hidden"}>
          <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
          <div className="space-y-4">
            {category.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-lg">{item.name}</h4>
                        {item.popular && <Badge className="bg-orange-500">Popular</Badge>}
                      </div>
                      <p className="text-gray-600 mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">${item.price}</span>
                        <Button onClick={() => handleAddToCart(item)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
