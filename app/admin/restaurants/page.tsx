"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import Image from "next/image"

const restaurants = [
  {
    id: 1,
    name: "Bella Italia",
    cuisine: "Italian",
    status: "active",
    rating: 4.8,
    orders: 324,
    revenue: 15420.5,
    image: "/placeholder.svg?height=50&width=50",
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Sushi Master",
    cuisine: "Japanese",
    status: "active",
    rating: 4.9,
    orders: 567,
    revenue: 28750.25,
    image: "/placeholder.svg?height=50&width=50",
    joinDate: "2023-02-20",
  },
  {
    id: 3,
    name: "Burger Palace",
    cuisine: "American",
    status: "pending",
    rating: 4.6,
    orders: 892,
    revenue: 22340.75,
    image: "/placeholder.svg?height=50&width=50",
    joinDate: "2023-03-10",
  },
  {
    id: 4,
    name: "Spice Garden",
    cuisine: "Indian",
    status: "inactive",
    rating: 4.7,
    orders: 445,
    revenue: 18920.0,
    image: "/placeholder.svg?height=50&width=50",
    joinDate: "2023-01-28",
  },
]

export default function AdminRestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || restaurant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
                <p className="text-gray-600">Manage restaurant partners and their information</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Restaurant
              </Button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Restaurant List ({filteredRestaurants.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Cuisine</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Image
                            src={restaurant.image || "/placeholder.svg"}
                            alt={restaurant.name}
                            width={50}
                            height={50}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium">{restaurant.name}</div>
                            <div className="text-sm text-gray-500">ID: {restaurant.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{restaurant.cuisine}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(restaurant.status)}>{restaurant.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">⭐ {restaurant.rating}</div>
                      </TableCell>
                      <TableCell>{restaurant.orders}</TableCell>
                      <TableCell>${restaurant.revenue.toLocaleString()}</TableCell>
                      <TableCell>{restaurant.joinDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
