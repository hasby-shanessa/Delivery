import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      restaurant_id,
      category_id,
      name,
      description,
      price,
      image_url,
      is_popular,
      preparation_time,
      calories,
      allergens,
      dietary_tags,
      sort_order,
    } = body

    const [menuItem] = await sql`
      INSERT INTO menu_items (
        restaurant_id, category_id, name, description, price,
        image_url, is_popular, preparation_time, calories,
        allergens, dietary_tags, sort_order
      ) VALUES (
        ${restaurant_id}, ${category_id}, ${name}, ${description}, ${price},
        ${image_url || null}, ${is_popular || false}, ${preparation_time || 15},
        ${calories || null}, ${allergens || []}, ${dietary_tags || []}, ${sort_order || 0}
      ) RETURNING *
    `

    return NextResponse.json({ menuItem }, { status: 201 })
  } catch (error) {
    console.error("Error creating menu item:", error)
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 })
  }
}
