import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { StatusIndicator } from "@/components/debug/status-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Foodie - Multi Restaurant Delivery",
  description: "Order from your favorite restaurants",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster />
            <StatusIndicator />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
