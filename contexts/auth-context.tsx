"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase, canUseSupabase, debugSupabaseConfig, testSupabaseConnection } from "@/lib/supabase"

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
  authMode: 'supabase' | 'mock'
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

// Helper functions for validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

const sanitizeInput = (input: string): string => {
  return input.trim().toLowerCase()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authMode, setAuthMode] = useState<'supabase' | 'mock'>('mock')

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🚀 Initializing auth...")
      debugSupabaseConfig()
      
      // Test Supabase connection
      const connectionTest = await testSupabaseConnection()
      
      if (connectionTest.success) {
        console.log("✅ Using Supabase authentication")
        setAuthMode('supabase')
        
        try {
          // Get current session
          const {
            data: { session },
            error: sessionError
          } = await supabase.auth.getSession()
          
          if (sessionError) {
            console.error("Session error:", sessionError)
            throw sessionError
          }

          if (session?.user) {
            console.log("Found existing session, fetching user profile...")
            const userProfile = await fetchUserProfile(session.user)
            setUser(userProfile)
          } else {
            console.log("No existing session found")
          }
          
        } catch (error) {
          console.error("Error with Supabase session:", error)
          console.log("Falling back to mock mode")
          setAuthMode('mock')
          loadMockUser()
        }
        
      } else {
        console.log("⚠️ Using mock authentication mode")
        setAuthMode('mock')
        loadMockUser()
      }
      
      setIsLoading(false)
    }

    const loadMockUser = () => {
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
    }

    initializeAuth()

    // Listen for auth changes only if Supabase is available
    let authSubscription: any = null
    
    if (canUseSupabase() && supabase) {
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
        
        authSubscription = subscription

      } catch (error) {
        console.error("Error setting up auth listener:", error)
      }
    }

    // Cleanup function
    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe()
      }
    }
  }, [])

  // Fetch user profile from Supabase
  const fetchUserProfile = async (supabaseUser: any): Promise<User | null> => {
    if (!canUseSupabase() || !supabase) return null

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single()

      if (error) {
        console.warn("Profile not found, creating basic user info:", error.message)
        // Return basic user info from auth if profile fetch fails
        return {
          id: supabaseUser.id,
          username: supabaseUser.email?.split('@')[0] || 'user',
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email || 'User',
          email: supabaseUser.email,
          role: "user",
        }
      }

      return {
        id: profile.id,
        username: profile.username || profile.email?.split('@')[0] || 'user',
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
        email: profile.email,
        phone: profile.phone,
        avatar: profile.avatar_url,
        role: profile.role || "user",
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
      // Return basic user info as fallback
      return {
        id: supabaseUser.id,
        username: supabaseUser.email?.split('@')[0] || 'user',
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email || 'User',
        email: supabaseUser.email,
        role: "user",
      }
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    console.log(`🔐 Attempting login with ${authMode} mode for:`, email)
    
    try {
      if (authMode === 'mock' || !canUseSupabase() || !supabase) {
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
        console.log("✅ Mock login successful")
        return
      }

      // Supabase login
      console.log("Attempting Supabase login...")
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        console.error("Supabase login error:", error)
        // Provide more user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error("Invalid email or password. Please try again.")
        } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
          throw new Error("Network error. Please check your connection and try again.")
        } else {
          throw new Error(error.message)
        }
      }

      if (data.user) {
        console.log("✅ Supabase login successful, fetching profile...")
        const userProfile = await fetchUserProfile(data.user)
        setUser(userProfile)
      }
    } catch (error: any) {
      console.error("❌ Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, name: string, email: string, phone: string, password: string) => {
    setIsLoading(true)
    console.log(`📝 Attempting registration with ${authMode} mode for:`, email)
    
    try {
      // Validation
      if (!username.trim()) {
        throw new Error("Username is required.")
      }
      if (!name.trim()) {
        throw new Error("Name is required.")
      }
      if (!email.trim()) {
        throw new Error("Email is required.")
      }
      if (!isValidEmail(email)) {
        throw new Error("Please enter a valid email address.")
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long.")
      }

      if (authMode === 'mock' || !canUseSupabase() || !supabase) {
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
          username: username.trim(),
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
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
        console.log("✅ Mock registration successful")
        return
      }

      // Supabase registration
      console.log("Attempting Supabase registration...")
      
      // Clean inputs
      const cleanEmail = sanitizeInput(email)
      const cleanUsername = sanitizeInput(username)
      const cleanName = name.trim()
      const cleanPhone = phone.trim()

      // Create auth user first
      console.log("Creating auth user...")
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            username: cleanUsername,
            full_name: cleanName,
            phone: cleanPhone || null,
          },
        },
      })

      if (error) {
        console.error("Supabase auth registration error:", error)
        
        // Handle specific errors
        if (error.message.includes('User already registered')) {
          throw new Error("An account with this email already exists.")
        } else if (error.message.includes('Invalid email')) {
          throw new Error("Please enter a valid email address.")
        } else if (error.message.includes('Password')) {
          throw new Error("Password must be at least 6 characters long.")
        } else {
          throw new Error(error.message)
        }
      }

      if (data.user && !data.user.email_confirmed_at) {
        // For email confirmation flow
        console.log("✅ Registration successful! Please check your email to confirm your account.")
        
        // Create a basic user object for immediate login (if auto-confirm is enabled)
        const userProfile = {
          id: data.user.id,
          username: cleanUsername,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone || undefined,
          role: "user",
        }
        
        // Try to create profile, but don't fail if it doesn't work
        try {
          const [firstName, ...lastNameParts] = cleanName.split(" ")
          const lastName = lastNameParts.join(" ")

          const profileData = {
            id: data.user.id,
            username: cleanUsername,
            email: cleanEmail,
            first_name: firstName,
            last_name: lastName || "",
            phone: cleanPhone || null,
            email_verified: false,
            role: "user",
          }

          console.log("Creating user profile...")
          const { error: profileError } = await supabase
            .from("profiles")
            .insert(profileData)

          if (profileError) {
            console.warn("Profile creation failed, but auth user created:", profileError.message)
            // Don't throw error here, user can still be logged in
          } else {
            console.log("✅ Profile created successfully")
          }
        } catch (profileError) {
          console.warn("Profile creation error:", profileError)
          // Continue anyway
        }
        
        setUser(userProfile)
        console.log("✅ Registration completed successfully")
        
      } else if (data.user && data.user.email_confirmed_at) {
        // Auto-confirmed user
        console.log("✅ User auto-confirmed, creating profile...")
        const userProfile = await fetchUserProfile(data.user)
        setUser(userProfile)
      }
      
    } catch (error: any) {
      console.error("❌ Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    console.log(`🚪 Logging out from ${authMode} mode`)
    try {
      if (authMode === 'supabase' && canUseSupabase() && supabase) {
        await supabase.auth.signOut()
      }
      setUser(null)
      if (typeof window !== "undefined") {
        localStorage.removeItem("mockUser")
      }
      console.log("✅ Logout successful")
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
        authMode,
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