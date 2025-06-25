import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    if (!supabase) {
      // Mock menu data when Supabase is not configured
      const mockMenus: Record<string, any[]> = {
        "1": [
          {
            id: "1",
            name: "Pizza",
            description: "Delicious pizzas",
            display_order: 1,
            is_active: true,
            menu_items: [
              {
                id: "1",
                name: "Margherita Pizza",
                description: "Fresh tomatoes, mozzarella, and basil",
                price: 14.99,
                image_url: "/placeholder.svg?height=150&width=200",
                is_available: true,
                is_popular: true,
                is_vegetarian: true,
                is_vegan: false,
                is_gluten_free: false,
                calories: 280,
                prep_time: 15,
                display_order: 1,
              },
              {
                id: "2",
                name: "Pepperoni Pizza",
                description: "Classic pepperoni with mozzarella cheese",
                price: 16.99,
                image_url: "/placeholder.svg?height=150&width=200",
                is_available: true,
                is_popular: true,
                is_vegetarian: false,
                is_vegan: false,
                is_gluten_free: false,
                calories: 320,
                prep_time: 15,
                display_order: 2,
              },
            ],
          },
        ],
        "2": [
          {
            id: "2",
            name: "Burgers",
            description: "Juicy burgers",
            display_order: 1,
            is_active: true,
            menu_items: [
              {
                id: "3",
                name: "Classic Burger",
                description: "Beef patty with lettuce, tomato, and cheese",
                price: 12.99,
                image_url: "/placeholder.svg?height=150&width=200",
                is_available: true,
                is_popular: true,
                is_vegetarian: false,
                is_vegan: false,
                is_gluten_free: false,
                calories: 450,
                prep_time: 12,
                display_order: 1,
              },
            ],
          },
        ],
      }

      const categories = mockMenus[params.id] || []
      return NextResponse.json(categories)
    }

    // Fetch menu categories with items
    const { data: categories, error } = await supabase
      .from("menu_categories")
      .select(
        `
        *,
        menu_items (
          id,
          name,
          description,
          price,
          image_url,
          is_available,
          is_popular,
          is_vegetarian,
          is_vegan,
          is_gluten_free,
          calories,
          prep_time,
          display_order
        )
      `,
      )
      .eq("restaurant_id", params.id)
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("display_order", { foreignTable: "menu_items", ascending: true })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 })
    }

    // Filter out unavailable items
    const filteredCategories = categories.map((category) => ({
      ...category,
      menu_items: category.menu_items.filter((item: any) => item.is_available),
    }))

    return NextResponse.json(filteredCategories)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
