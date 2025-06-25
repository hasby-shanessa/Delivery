import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      restaurant_id,
      items,
      deliveryAddress,
      paymentMethod,
      paymentDetails,
      subtotal,
      deliveryFee,
      tax,
      total,
      appliedPromo,
    } = body

    // Validate required fields
    if (!items || !deliveryAddress || !paymentMethod || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    if (!supabase) {
      // Mock order creation when Supabase is not configured
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
      const estimatedDeliveryTime = new Date(Date.now() + 45 * 60 * 1000).toISOString()

      return NextResponse.json({
        success: true,
        order: {
          id: Date.now().toString(),
          orderNumber,
          status: "confirmed",
          estimatedDeliveryTime,
          total,
        },
        message: "Order placed successfully (Mock Mode)",
      })
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Calculate estimated delivery time
    const estimatedDeliveryTime = new Date(Date.now() + 45 * 60 * 1000).toISOString()

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id,
        restaurant_id,
        order_number: orderNumber,
        status: "pending",
        subtotal,
        delivery_fee: deliveryFee,
        tax_amount: tax,
        total_amount: total,
        payment_method: paymentMethod,
        delivery_address: deliveryAddress,
        estimated_delivery_time: estimatedDeliveryTime,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Add order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      special_instructions: item.specialInstructions || null,
      selected_options: item.selectedOptions || [],
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    // Add order status history
    await supabase.from("order_status_history").insert({
      order_id: order.id,
      status: "pending",
      notes: "Order placed successfully",
    })

    // Update promo usage if applied
    if (appliedPromo) {
      const { data: promo, error: promoError } = await supabase
        .from("promotions")
        .select("usage_count")
        .eq("code", appliedPromo.code)
        .single()

      if (!promoError && promo) {
        await supabase
          .from("promotions")
          .update({ usage_count: promo.usage_count + 1 })
          .eq("code", appliedPromo.code)
      }
    }

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update order status to confirmed
    await supabase
      .from("orders")
      .update({
        status: "confirmed",
        payment_status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id)

    await supabase.from("order_status_history").insert({
      order_id: order.id,
      status: "confirmed",
      notes: "Payment processed successfully",
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: "confirmed",
        estimatedDeliveryTime: order.estimated_delivery_time,
        total: order.total_amount,
      },
      message: "Order placed successfully",
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const supabase = createServerClient()

    if (!supabase) {
      // Mock orders when Supabase is not configured
      return NextResponse.json({
        orders: [],
        total: 0,
        page,
        totalPages: 0,
      })
    }

    let query = supabase.from("orders").select(`
        id,
        order_number,
        status,
        total_amount,
        created_at,
        estimated_delivery_time,
        actual_delivery_time,
        restaurants!inner (
          name,
          image_url
        )
      `)

    if (userId) {
      query = query.eq("user_id", userId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    query = query.order("created_at", { ascending: false })

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: orders, error, count } = await query

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }

    const formattedOrders =
      orders?.map((order: any) => ({
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        total: order.total_amount,
        createdAt: order.created_at,
        estimatedDeliveryTime: order.estimated_delivery_time,
        actualDeliveryTime: order.actual_delivery_time,
        restaurant: order.restaurants?.name || "Unknown Restaurant",
        restaurantImage: order.restaurants?.image_url || "/placeholder.svg?height=100&width=100",
      })) || []

    return NextResponse.json({
      orders: formattedOrders,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
