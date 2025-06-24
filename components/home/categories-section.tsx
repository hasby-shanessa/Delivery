import { Pizza, Coffee, Salad, Sandwich, IceCream, Fish } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const categories = [
  { name: "Pizza", icon: Pizza, color: "bg-red-100 text-red-600" },
  { name: "Coffee", icon: Coffee, color: "bg-amber-100 text-amber-600" },
  { name: "Healthy", icon: Salad, color: "bg-green-100 text-green-600" },
  { name: "Sandwiches", icon: Sandwich, color: "bg-yellow-100 text-yellow-600" },
  { name: "Desserts", icon: IceCream, color: "bg-pink-100 text-pink-600" },
  { name: "Seafood", icon: Fish, color: "bg-blue-100 text-blue-600" },
]

export function CategoriesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
          <p className="text-gray-600 text-lg">Find exactly what you're craving</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={`/restaurants?cuisine=${encodeURIComponent(category.name)}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
