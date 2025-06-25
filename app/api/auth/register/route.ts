import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, name, email, phone, password } = body

    // Validate required fields
    if (!username || !name || !email || !password) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    const supabase = createServerClient()

    if (!supabase) {
      // Mock registration when Supabase is not configured
      return NextResponse.json(
        {
          user: {
            id: Date.now().toString(),
            username,
            name,
            email,
            phone: phone || null,
            role: "user",
          },
          message: "User created successfully",
        },
        { status: 201 },
      )
    }

    // Check if username is already taken
    const { data: existingUser } = await supabase.from("users").select("username").eq("username", username).single()

    if (existingUser) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 })
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        full_name: name,
        phone: phone || null,
      },
    })

    if (authError) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create user profile in our users table
    const [firstName, ...lastNameParts] = name.split(" ")
    const lastName = lastNameParts.join(" ")

    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      username,
      email,
      first_name: firstName,
      last_name: lastName || "",
      phone: phone || null,
      email_verified: true,
      role: "user",
    })

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
    }

    return NextResponse.json(
      {
        user: {
          id: authData.user.id,
          username,
          name,
          email,
          phone: phone || null,
          role: "user",
        },
        message: "User created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
