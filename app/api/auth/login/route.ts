import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = createServerClient()

    if (!supabase) {
      // Mock authentication when Supabase is not configured
      const mockUsers = [
        { id: "1", email: "john@example.com", password: "password", username: "john_doe", name: "John Doe" },
        { id: "2", email: "jane@example.com", password: "password", username: "jane_smith", name: "Jane Smith" },
        {
          id: "admin",
          email: "admin@foodie.com",
          password: "admin123",
          username: "admin",
          name: "Admin User",
          role: "admin",
        },
      ]

      const user = mockUsers.find((u) => u.email === email && u.password === password)
      if (!user) {
        return NextResponse.json(
          {
            error: "No account found with these credentials. Please sign up first.",
          },
          { status: 401 },
        )
      }

      return NextResponse.json({
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role || "user",
        },
        message: "Login successful",
      })
    }

    // Attempt to sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Check if it's an invalid credentials error
      if (error.message.includes("Invalid login credentials")) {
        return NextResponse.json(
          {
            error: "No account found with these credentials. Please sign up first.",
          },
          { status: 401 },
        )
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({ error: "Login failed" }, { status: 400 })
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError) {
      console.error("Profile fetch error:", profileError)
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: profile.id,
        username: profile.username,
        name: `${profile.first_name} ${profile.last_name}`.trim(),
        email: profile.email,
        phone: profile.phone,
        role: profile.role || "user",
      },
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
