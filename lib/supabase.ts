import { createClient } from "@supabase/supabase-js"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("Supabase URL:", supabaseUrl ? "Set" : "Missing")
console.log("Supabase Anon Key:", supabaseAnonKey ? "Set" : "Missing")

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

// Create a mock client for when Supabase is not configured
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Mock mode - use mock login" } }),
    signUp: () => Promise.resolve({ data: null, error: { message: "Mock mode - use mock registration" } }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: "Mock mode" } }) }) }),
    insert: () => Promise.resolve({ error: { message: "Mock mode" } }),
    update: () => Promise.resolve({ error: { message: "Mock mode" } }),
    delete: () => Promise.resolve({ error: { message: "Mock mode" } }),
  }),
})

// Create Supabase client or mock client
export const supabase = canUseSupabase()
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createMockClient()

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
