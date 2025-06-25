import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    if (!supabase) {
      // Mock restaurant data when Supabase is not configured
      const mockRestaurants = [
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
          restaurant_hours: [
            { day_of_week: 0, open_time: "11:00", close_time: "23:00", is_closed: false },
            { day_of_week: 1, open_time: "11:00", close_time: "23:00", is_closed: false },
            { day_of_week: 2, open_time: "11:00", close_time: "23:00", is_closed: false },
            { day_of_week: 3, open_time: "11:00", close_time: "23:00", is_closed: false },
            { day_of_week: 4, open_time: "11:00", close_time: "23:00", is_closed: false },
            { day_of_week: 5, open_time: "11:00", close_time: "23:00", is_closed: false },
            { day_of_week: 6, open_time: "11:00", close_time: "23:00", is_closed: false },
          ],
        },
      ]

      const restaurant = mockRestaurants.find((r) => r.id === params.id)
      if (!restaurant) {
        return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
      }

      return NextResponse.json(restaurant)
    }

    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .select(`
        *,
        restaurant_hours (
          day_of_week,
          open_time,
          close_time,
          is_closed
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    return NextResponse.json({ error: "Failed to fetch restaurant" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = createServerClient()

    if (!supabase) {
      // Mock update when Supabase is not configured
      return NextResponse.json({ restaurant: { id: params.id, ...body } })
    }

    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .update(body)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating restaurant:", error)
      return NextResponse.json({ error: "Failed to update restaurant" }, { status: 500 })
    }

    return NextResponse.json({ restaurant })
  } catch (error) {
    console.error("Error updating restaurant:", error)
    return NextResponse.json({ error: "Failed to update restaurant" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    if (!supabase) {
      // Mock delete when Supabase is not configured
      return NextResponse.json({ success: true })
    }

    const { error } = await supabase.from("restaurants").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting restaurant:", error)
      return NextResponse.json({ error: "Failed to delete restaurant" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting restaurant:", error)
    return NextResponse.json({ error: "Failed to delete restaurant" }, { status: 500 })
  }
}
