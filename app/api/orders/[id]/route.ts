import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Get order details
    const [order] = await sql`
      SELECT 
        o.*,
        r.name as restaurant_name,
        r.phone as restaurant_phone,
        r.image_url as restaurant_image,
        ra.street_address as restaurant_address,
        ra.city as restaurant_city,
        ra.state as restaurant_state,
        ra.zip_code as restaurant_zip
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      LEFT JOIN restaurant_addresses ra ON r.id = ra.restaurant_id
      WHERE o.id = ${orderId}
    `

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Get order items
    const items = await sql`
      SELECT 
        oi.*,
        mi.name as item_name,
        mi.image_url as item_image
      FROM order_items oi
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ${orderId}
    `

    // Get order status history
    const statusHistory = await sql`
      SELECT status, notes, created_at
      FROM order_status_history
      WHERE order_id = ${orderId}
      ORDER BY created_at ASC
    `

    const formattedOrder = {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      restaurant: {
        name: order.restaurant_name,
        phone: order.restaurant_phone,
        image: order.restaurant_image,
        address: `${order.restaurant_address}, ${order.restaurant_city}, ${order.restaurant_state} ${order.restaurant_zip}`,
      },
      items: items.map((item) => ({
        id: item.id,
        name: item.item_name,
        quantity: item.quantity,
        price: item.unit_price,
        total: item.total_price,
        image: item.item_image,
        specialInstructions: item.special_instructions,
        selectedOptions: item.selected_options,
      })),
      deliveryAddress: order.delivery_address,
      subtotal: order.subtotal,
      deliveryFee: order.delivery_fee,
      tax: order.tax_amount,
      total: order.total_amount,
      paymentMethod: order.payment_method,
      estimatedDeliveryTime: order.estimated_delivery_time,
      actualDeliveryTime: order.actual_delivery_time,
      createdAt: order.created_at,
      statusHistory,
    }

    return NextResponse.json(formattedOrder)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    const body = await request.json()
    const { status, notes } = body

    // Update order status
    await sql`
      UPDATE orders 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${orderId}
    `

    // Add status history
    await sql`
      INSERT INTO order_status_history (order_id, status, notes)
      VALUES (${orderId}, ${status}, ${notes || ""})
    `

    // If status is delivered, set actual delivery time
    if (status === "delivered") {
      await sql`
        UPDATE orders 
        SET actual_delivery_time = NOW()
        WHERE id = ${orderId}
      `
    }

    return NextResponse.json({ message: "Order status updated successfully" })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
