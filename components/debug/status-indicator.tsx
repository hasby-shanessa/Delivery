"use client"

import { canUseSupabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

export function StatusIndicator() {
  const { user } = useAuth()
  const supabaseConfigured = canUseSupabase()

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${supabaseConfigured ? "bg-green-500" : "bg-red-500"}`} />
          <span>Supabase: {supabaseConfigured ? "Connected" : "Mock Mode"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${user ? "bg-green-500" : "bg-gray-500"}`} />
          <span>Auth: {user ? `${user.name} (${user.role || "user"})` : "Not logged in"}</span>
        </div>
      </div>
    </div>
  )
}
