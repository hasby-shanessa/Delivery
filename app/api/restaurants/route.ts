import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, canUseSupabase } from "@/lib/supabase"

// Mock data for when Supabase is not available
const MOCK_RESTAURANTS = [
  {
    id: "1",
    name: "Pizza Palace",
    cuisine_type: "Italian",
    description: "Authentic Italian pizza and pasta",
    image_url: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    delivery_time: "25-35 min",
    delivery_fee: 2.99,
    minimum_order: 15.0,
    is_featured: true,
    address: "123 Main St, City",
    phone: "+1234567890",
    hours: { open: "11:00", close: "23:00" },
  },
  {
    id: "2",
    name: "Burger Barn",
    cuisine_type: "American",
    description: "Juicy burgers and crispy fries",
    image_url: "/placeholder.svg?height=200&width=300",
    rating: 4.2,
    delivery_time: "20-30 min",
    delivery_fee: 1.99,
    minimum_order: 12.0,
    is_featured: true,
    address: "456 Oak Ave, City",
    phone: "+1234567891",
    hours: { open: "10:00", close: "22:00" },
  },
]

export async function GET(request: NextRequest) {
  try {
    if (!canUseSupabase()) {
      console.log("Using mock restaurants data")
      return NextResponse.json({ restaurants: MOCK_RESTAURANTS, total: MOCK_RESTAURANTS.length })
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ restaurants: MOCK_RESTAURANTS, total: MOCK_RESTAURANTS.length })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const cuisine = searchParams.get("cuisine")
    const minRating = searchParams.get("minRating")
    const featured = searchParams.get("featured")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let query = supabase.from("restaurants").select("*", { count: "exact" })

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,cuisine_type.ilike.%${search}%`)
    }

    if (cuisine) {
      const cuisines = cuisine.split(",").map((c) => c.trim())
      query = query.in("cuisine_type", cuisines)
    }

    if (minRating) {
      query = query.gte("rating", Number.parseFloat(minRating))
    }

    if (featured === "true") {
      query = query.eq("is_featured", true)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: restaurants, error, count } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ restaurants: MOCK_RESTAURANTS, total: MOCK_RESTAURANTS.length })
    }

    return NextResponse.json({
      restaurants: restaurants || [],
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ restaurants: MOCK_RESTAURANTS, total: MOCK_RESTAURANTS.length })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!canUseSupabase()) {
      const body = await request.json()
      const newRestaurant = {
        id: Date.now().toString(),
        ...body,
        rating: 0,
        review_count: 0,
        created_at: new Date().toISOString(),
      }
      return NextResponse.json({ restaurant: newRestaurant })
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 })
    }

    const body = await request.json()

    const { data: restaurant, error } = await supabase.from("restaurants").insert([body]).select().single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ restaurant })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
