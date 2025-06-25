import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, orderTotal, restaurantId } = body

    if (!code || !orderTotal) {
      return NextResponse.json({ error: "Code and order total are required" }, { status: 400 })
    }

    const supabase = createServerClient()

    if (!supabase) {
      // Mock promo validation when Supabase is not configured
      if (code === "WELCOME20" && orderTotal >= 15) {
        return NextResponse.json({
          valid: true,
          promotion: {
            code: "WELCOME20",
            title: "Welcome Offer",
            discountType: "percentage",
            discountValue: 20,
            discountAmount: Math.min(orderTotal * 0.2, 10),
            minOrder: 15,
          },
        })
      }

      return NextResponse.json({ error: "Invalid or expired promo code" }, { status: 400 })
    }

    const now = new Date().toISOString()

    // Find the promotion
    const { data: promotion, error } = await supabase
      .from("promotions")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .lte("valid_from", now)
      .gte("valid_until", now)
      .single()

    if (error || !promotion) {
      return NextResponse.json({ error: "Invalid or expired promo code" }, { status: 400 })
    }

    // Check usage limit
    if (promotion.usage_limit && promotion.usage_count >= promotion.usage_limit) {
      return NextResponse.json({ error: "Promo code usage limit exceeded" }, { status: 400 })
    }

    // Check minimum order amount
    if (orderTotal < promotion.minimum_order_amount) {
      return NextResponse.json(
        {
          error: `Minimum order amount is $${promotion.minimum_order_amount}`,
          minimumOrder: promotion.minimum_order_amount,
        },
        { status: 400 },
      )
    }

    // Check restaurant applicability
    if (restaurantId && promotion.applicable_restaurants && promotion.applicable_restaurants.length > 0) {
      if (!promotion.applicable_restaurants.includes(Number.parseInt(restaurantId))) {
        return NextResponse.json({ error: "Promo code not valid for this restaurant" }, { status: 400 })
      }
    }

    // Calculate discount
    let discountAmount = 0
    switch (promotion.discount_type) {
      case "percentage":
        discountAmount = orderTotal * (promotion.discount_value / 100)
        if (promotion.max_discount_amount) {
          discountAmount = Math.min(discountAmount, promotion.max_discount_amount)
        }
        break
      case "fixed_amount":
        discountAmount = Math.min(promotion.discount_value, orderTotal)
        break
      case "free_delivery":
        discountAmount = 2.99 // Standard delivery fee
        break
    }

    return NextResponse.json({
      valid: true,
      promotion: {
        code: promotion.code,
        title: promotion.title,
        discountType: promotion.discount_type,
        discountValue: promotion.discount_value,
        discountAmount,
        minOrder: promotion.minimum_order_amount,
      },
    })
  } catch (error) {
    console.error("Error validating promo code:", error)
    return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 })
  }
}
