"use client"

import { useState } from "react"
import Link from "next/link"
import { LayoutDashboard, Store, ShoppingBag, Users, BarChart3, Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Store, label: "Restaurants", href: "/admin/restaurants" },
  { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h2 className="text-xl font-bold">Admin Panel</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-gray-800"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  )
}
