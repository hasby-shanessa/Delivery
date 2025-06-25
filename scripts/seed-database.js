const { neon } = require("@neondatabase/serverless")

const sql = neon(process.env.DATABASE_URL)

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...")

    // Seed users
    console.log("👥 Seeding users...")
    await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verified) VALUES
      ('john.doe@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', 'John', 'Doe', '+1234567890', true),
      ('jane.smith@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', 'Jane', 'Smith', '+1234567891', true),
      ('mike.johnson@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', 'Mike', 'Johnson', '+1234567892', true)
      ON CONFLICT (email) DO NOTHING
    `

    // Seed restaurants
    console.log("🏪 Seeding restaurants...")
    await sql`
      INSERT INTO restaurants (name, slug, description, cuisine_type, phone, email, image_url, rating, review_count, delivery_fee, minimum_order, delivery_time_min, delivery_time_max, is_featured) VALUES
      ('Bella Italia', 'bella-italia', 'Authentic Italian cuisine with fresh ingredients and traditional recipes', 'Italian', '+1555123001', 'info@bellaitalia.com', '/placeholder.svg?height=200&width=300', 4.8, 324, 2.99, 15.00, 25, 35, true),
      ('Sushi Master', 'sushi-master', 'Fresh sushi and Japanese cuisine prepared by master chefs', 'Japanese', '+1555123002', 'info@sushimaster.com', '/placeholder.svg?height=200&width=300', 4.9, 567, 3.99, 20.00, 30, 40, true),
      ('Burger Palace', 'burger-palace', 'Gourmet burgers and American classics', 'American', '+1555123003', 'info@burgerpalace.com', '/placeholder.svg?height=200&width=300', 4.6, 892, 1.99, 10.00, 20, 30, false),
      ('Spice Garden', 'spice-garden', 'Authentic Indian cuisine with aromatic spices', 'Indian', '+1555123004', 'info@spicegarden.com', '/placeholder.svg?height=200&width=300', 4.7, 445, 2.49, 12.00, 35, 45, true),
      ('Dragon Palace', 'dragon-palace', 'Traditional Chinese dishes with modern flair', 'Chinese', '+1555123005', 'info@dragonpalace.com', '/placeholder.svg?height=200&width=300', 4.5, 678, 2.99, 15.00, 25, 35, false),
      ('Taco Fiesta', 'taco-fiesta', 'Authentic Mexican street food and tacos', 'Mexican', '+1555123006', 'info@tacofiesta.com', '/placeholder.svg?height=200&width=300', 4.4, 234, 1.49, 8.00, 20, 30, false),
      ('Mediterranean Delight', 'mediterranean-delight', 'Fresh Mediterranean cuisine with healthy options', 'Mediterranean', '+1555123007', 'info@meddelight.com', '/placeholder.svg?height=200&width=300', 4.6, 156, 2.99, 18.00, 30, 40, false),
      ('Thai Orchid', 'thai-orchid', 'Authentic Thai flavors with fresh herbs and spices', 'Thai', '+1555123008', 'info@thaiorchid.com', '/placeholder.svg?height=200&width=300', 4.7, 389, 2.49, 14.00, 25, 35, false)
      ON CONFLICT (slug) DO NOTHING
    `

    console.log("✅ Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
