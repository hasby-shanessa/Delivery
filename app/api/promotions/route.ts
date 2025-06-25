import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get("active")

    const supabase = createServerClient()

    if (!supabase) {
      // Mock promotions when Supabase is not configured
      const mockPromotions = [
        {
          id: "1",
          title: "Welcome Offer",
          description: "Get 20% off your first order",
          code: "WELCOME20",
          discountType: "percentage",
          discountValue: 20,
          minimumOrderAmount: 15,
          maxDiscountAmount: 10,
          usageLimit: 100,
          usageCount: 25,
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          applicableRestaurants: [],
        },
      ]

      return NextResponse.json({ promotions: mockPromotions })
    }

    let query = supabase.from("promotions").select("*")

    if (active === "true") {
      const now = new Date().toISOString()
      query = query.eq("is_active", true).lte("valid_from", now).gte("valid_until", now)
    }

    query = query.order("created_at", { ascending: false })

    const { data: promotions, error } = await query

    if (error) {
      console.error("Error fetching promotions:", error)
      return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 })
    }

    const formattedPromotions =
      promotions?.map((promo) => ({
        id: promo.id,
        title: promo.title,
        description: promo.description,
        code: promo.code,
        discountType: promo.discount_type,
        discountValue: promo.discount_value,
        minimumOrderAmount: promo.minimum_order_amount,
        maxDiscountAmount: promo.max_discount_amount,
        usageLimit: promo.usage_limit,
        usageCount: promo.usage_count,
        validFrom: promo.valid_from,
        validUntil: promo.valid_until,
        isActive: promo.is_active,
        applicableRestaurants: promo.applicable_restaurants,
      })) || []

    return NextResponse.json({ promotions: formattedPromotions })
  } catch (error) {
    console.error("Error fetching promotions:", error)
    return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 })
  }
}
