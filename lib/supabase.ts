import { createClient } from "@supabase/supabase-js"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("Supabase URL:", supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "Missing")
console.log("Supabase Anon Key:", supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : "Missing")

// Helper function to check if we can use Supabase
export function canUseSupabase(): boolean {
  const canUse = !!(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "your_supabase_url" &&
    supabaseAnonKey !== "your_supabase_anon_key" &&
    supabaseUrl.includes("supabase.co")
  )
  console.log("Can use Supabase:", canUse)
  return canUse
}

// Create Supabase client only if properly configured
let supabaseClient: any = null

if (canUseSupabase()) {
  try {
    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
    })
    console.log("✅ Supabase client created successfully")
  } catch (error) {
    console.error("❌ Error creating Supabase client:", error)
    supabaseClient = null
  }
} else {
  console.log("⚠️ Supabase not configured - will use mock mode")
}

export const supabase = supabaseClient

// Server-side client for API routes
export const createServerClient = () => {
  if (!canUseSupabase()) {
    return null
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey!
  return createClient(supabaseUrl!, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export const isSupabaseConfigured = canUseSupabase()

// Debug function to test connection
export async function testSupabaseConnection() {
  if (!canUseSupabase() || !supabase) {
    console.log("🔧 Supabase not available - using mock mode")
    return { success: false, mode: 'mock' }
  }

  try {
    console.log("🔍 Testing Supabase connection...")
    
    // Test basic connectivity
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      console.error("❌ Supabase connection test failed:", error.message)
      return { success: false, error: error.message, mode: 'supabase' }
    }

    console.log("✅ Supabase connection test successful")
    return { success: true, mode: 'supabase' }
  } catch (error) {
    console.error("❌ Network error testing Supabase:", error)
    return { success: false, error: 'Network error', mode: 'supabase' }
  }
}

// Debug function for troubleshooting
export function debugSupabaseConfig() {
  console.log("=== Supabase Debug Info ===")
  console.log("URL configured:", !!supabaseUrl)
  console.log("Key configured:", !!supabaseAnonKey)
  console.log("Can use Supabase:", canUseSupabase())
  console.log("Client created:", !!supabase)
  
  if (supabaseUrl) {
    console.log("URL format check:", supabaseUrl.includes("supabase.co"))
    console.log("URL preview:", `${supabaseUrl.substring(0, 30)}...`)
  }
  
  console.log("=== End Debug Info ===")
}