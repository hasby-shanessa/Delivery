"use client"

import { useEffect, useState } from "react"
import { canUseSupabase } from "@/lib/supabase"

export function EnvCheck() {
  const [envStatus, setEnvStatus] = useState<any>({})

  useEffect(() => {
    setEnvStatus({
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      apiUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
      canUseSupabase: canUseSupabase(),
    })
  }, [])

  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs">
      <h4 className="font-bold mb-2">Environment Status</h4>
      <div className="space-y-1">
        <div>Supabase URL: {envStatus.supabaseUrl ? "✅" : "❌"}</div>
        <div>Supabase Key: {envStatus.supabaseKey ? "✅" : "❌"}</div>
        <div>API URL: {envStatus.apiUrl}</div>
        <div>Can Use Supabase: {envStatus.canUseSupabase ? "✅" : "❌"}</div>
      </div>
      {!envStatus.canUseSupabase && <div className="mt-2 text-yellow-300">Using mock data - check .env.local</div>}
    </div>
  )
}
