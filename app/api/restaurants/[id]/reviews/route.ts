import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const restaurantId = params.id
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const reviews = await sql`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.helpful_count as helpful,
        r.created_at,
        u.first_name || ' ' || u.last_name as user_name,
        u.avatar_url as user_avatar,
        EXTRACT(EPOCH FROM (NOW() - r.created_at)) as seconds_ago
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.restaurant_id = ${restaurantId}
      ORDER BY r.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    // Format the reviews
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      user: {
        name: review.user_name,
        avatar: review.user_avatar,
      },
      rating: review.rating,
      comment: review.comment,
      helpful: review.helpful,
      date: formatTimeAgo(review.seconds_ago),
    }))

    // Get total count
    const [{ total }] = await sql`
      SELECT COUNT(*) as total
      FROM reviews
      WHERE restaurant_id = ${restaurantId}
    `

    return NextResponse.json({
      reviews: formattedReviews,
      total: Number.parseInt(total),
      page,
      totalPages: Math.ceil(Number.parseInt(total) / limit),
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const restaurantId = params.id
    const body = await request.json()
    const { user_id, order_id, rating, comment } = body

    // Check if user already reviewed this order
    const existingReview = await sql`
      SELECT id FROM reviews 
      WHERE user_id = ${user_id} AND order_id = ${order_id}
    `

    if (existingReview.length > 0) {
      return NextResponse.json({ error: "You have already reviewed this order" }, { status: 400 })
    }

    const [review] = await sql`
      INSERT INTO reviews (user_id, restaurant_id, order_id, rating, comment)
      VALUES (${user_id}, ${restaurantId}, ${order_id}, ${rating}, ${comment})
      RETURNING *
    `

    // Update restaurant rating
    await updateRestaurantRating(restaurantId)

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

function formatTimeAgo(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)

  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  return "Just now"
}

async function updateRestaurantRating(restaurantId: string) {
  const [stats] = await sql`
    SELECT 
      AVG(rating)::NUMERIC(3,1) as avg_rating,
      COUNT(*) as review_count
    FROM reviews 
    WHERE restaurant_id = ${restaurantId}
  `

  await sql`
    UPDATE restaurants 
    SET 
      rating = ${stats.avg_rating},
      review_count = ${stats.review_count},
      updated_at = NOW()
    WHERE id = ${restaurantId}
  `
}
