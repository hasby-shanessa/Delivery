import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Get total revenue
    const [revenueResult] = await sql`
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders 
      WHERE status = 'delivered' AND created_at >= CURRENT_DATE - INTERVAL '30 days'
    `

    // Get total orders
    const [ordersResult] = await sql`
      SELECT COUNT(*) as total_orders
      FROM orders 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `

    // Get active users
    const [usersResult] = await sql`
      SELECT COUNT(DISTINCT user_id) as active_users
      FROM orders 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `

    // Get active restaurants
    const [restaurantsResult] = await sql`
      SELECT COUNT(*) as active_restaurants
      FROM restaurants 
      WHERE is_active = true
    `

    // Get revenue trend (last 7 days)
    const revenueTrend = await sql`
      SELECT 
        DATE(created_at) as date,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM orders 
      WHERE status = 'delivered' 
        AND created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `

    return NextResponse.json({
      totalRevenue: Number.parseFloat(revenueResult.total_revenue),
      totalOrders: Number.parseInt(ordersResult.total_orders),
      activeUsers: Number.parseInt(usersResult.active_users),
      activeRestaurants: Number.parseInt(restaurantsResult.active_restaurants),
      revenueTrend,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
