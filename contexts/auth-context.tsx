"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase, canUseSupabase } from "@/lib/supabase"

interface User {
  id: string
  username: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (username: string, name: string, email: string, phone: string, password: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

// Mock users for development
const mockUsers = [
  { id: "1", email: "john@example.com", password: "password", username: "john_doe", name: "John Doe", role: "user" },
  {
    id: "2",
    email: "jane@example.com",
    password: "password",
    username: "jane_smith",
    name: "Jane Smith",
    role: "user",
  },
  {
    id: "admin",
    email: "admin@foodie.com",
    password: "admin123",
    username: "admin",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "admin2",
    email: "admin@gmail.com",
    password: "admin123",
    username: "admin2",
    name: "Admin User",
    role: "admin",
  },
]

// Mock registered users storage (in real app, this would be in database)
const mockRegisteredUsers = [...mockUsers]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("Initializing auth, canUseSupabase:", canUseSupabase())

      try {
        if (!canUseSupabase()) {
          console.log("Using mock authentication mode")
          // Check if user was previously logged in (mock localStorage)
          if (typeof window !== "undefined") {
            const savedUser = localStorage.getItem("mockUser")
            if (savedUser) {
              try {
                setUser(JSON.parse(savedUser))
              } catch (e) {
                console.error("Error parsing saved user:", e)
                localStorage.removeItem("mockUser")
              }
            }
          }
          setIsLoading(false)
          return
        }

        // Supabase initialization
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user)
          setUser(userProfile)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        console.log("Falling back to mock mode")
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes only if Supabase is available
    if (canUseSupabase()) {
      try {
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
          console.log("Auth state change:", event)
          if (event === "SIGNED_IN" && session?.user) {
            const userProfile = await fetchUserProfile(session.user)
            setUser(userProfile)
          } else if (event === "SIGNED_OUT") {
            setUser(null)
          }
          setIsLoading(false)
        })

        return () => subscription.unsubscribe()
      } catch (error) {
        console.error("Error setting up auth listener:", error)
      }
    }
  }, [])

  // Fetch user profile from Supabase
  const fetchUserProfile = async (supabaseUser: any) => {
    if (!canUseSupabase()) return null

    try {
      const { data: profile, error } = await supabase.from("users").select("*").eq("id", supabaseUser.id).single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return null
      }

      return {
        id: profile.id,
        username: profile.username,
        name: `${profile.first_name} ${profile.last_name}`.trim(),
        email: profile.email,
        phone: profile.phone,
        avatar: profile.avatar_url,
        role: profile.role || "user",
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
      return null
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      if (!canUseSupabase()) {
        // Mock login
        console.log("Using mock login for:", email)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        const foundUser = mockRegisteredUsers.find((u) => u.email === email && u.password === password)
        if (!foundUser) {
          throw new Error("Invalid email or password. Please try again.")
        }

        const loggedInUser = {
          id: foundUser.id,
          username: foundUser.username,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        }

        setUser(loggedInUser)
        if (typeof window !== "undefined") {
          localStorage.setItem("mockUser", JSON.stringify(loggedInUser))
        }
        return
      }

      // Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user)
        setUser(userProfile)
      }
    } catch (error: any) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, name: string, email: string, phone: string, password: string) => {
    setIsLoading(true)
    try {
      if (!canUseSupabase()) {
        // Mock registration
        console.log("Using mock registration for:", email)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check if email already exists
        const existingUser = mockRegisteredUsers.find((u) => u.email === email)
        if (existingUser) {
          throw new Error("An account with this email already exists.")
        }

        // Check if username already exists
        const existingUsername = mockRegisteredUsers.find((u) => u.username === username)
        if (existingUsername) {
          throw new Error("This username is already taken.")
        }

        const newUser = {
          id: Date.now().toString(),
          username,
          name,
          email,
          phone,
          password, // In real app, this would be hashed
          role: "user",
        }

        // Add to mock database
        mockRegisteredUsers.push(newUser)

        const registeredUser = {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
        }

        setUser(registeredUser)
        if (typeof window !== "undefined") {
          localStorage.setItem("mockUser", JSON.stringify(registeredUser))
        }
        return
      }

      // Supabase registration logic...
      const { data: existingUser } = await supabase.from("users").select("username").eq("username", username).single()

      if (existingUser) {
        throw new Error("Username is already taken")
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: name,
            phone: phone || null,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        const [firstName, ...lastNameParts] = name.split(" ")
        const lastName = lastNameParts.join(" ")

        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
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
          throw new Error("Failed to create user profile")
        }

        const userProfile = {
          id: data.user.id,
          username,
          name,
          email,
          phone: phone || undefined,
          role: "user",
        }
        setUser(userProfile)
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (canUseSupabase()) {
        await supabase.auth.signOut()
      }
      setUser(null)
      if (typeof window !== "undefined") {
        localStorage.removeItem("mockUser")
      }
    } catch (error) {
      console.error("Logout error:", error)
      setUser(null)
      if (typeof window !== "undefined") {
        localStorage.removeItem("mockUser")
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
