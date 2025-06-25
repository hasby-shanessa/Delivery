"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Star } from "lucide-react"
import { apiClient } from "@/lib/api"
import Image from "next/image"

export default function AdminRestaurantsPage() {
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadRestaurants()
  }, [])

  const loadRestaurants = async () => {
    try {
      const response = await apiClient.getRestaurants()
      setRestaurants(Array.isArray(response) ? response : (typeof response === 'object' && response && 'restaurants' in response ? (response as any).restaurants : []))
    } catch (error) {
      console.error("Error loading restaurants:", error)
      toast({
        title: "Error",
        description: "Failed to load restaurants",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRestaurant = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await apiClient.deleteRestaurant(id)
      toast({
        title: "Success",
        description: "Restaurant deleted successfully",
      })
      loadRestaurants() // Reload the list
    } catch (error) {
      console.error("Error deleting restaurant:", error)
      toast({
        title: "Error",
        description: "Failed to delete restaurant",
        variant: "destructive",
      })
    }
  }

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.updateRestaurant(id, { is_featured: !currentStatus })
      toast({
        title: "Success",
        description: `Restaurant ${!currentStatus ? "featured" : "unfeatured"} successfully`,
      })
      loadRestaurants()
    } catch (error) {
      console.error("Error updating restaurant:", error)
      toast({
        title: "Error",
        description: "Failed to update restaurant",
        variant: "destructive",
      })
    }
  }

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine_type?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && restaurant.is_active !== false) ||
      (statusFilter === "inactive" && restaurant.is_active === false) ||
      (statusFilter === "featured" && restaurant.featured === true)

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (isActive: boolean) => {
    return isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getStatusText = (isActive: boolean) => {
    return isActive !== false ? "Active" : "Inactive"
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 flex items-center justify-center">
            <div>Loading restaurants...</div>
          </main>
        </div>
      </div>
    )
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
              <Button onClick={() => router.push("/admin/restaurants/add")}>
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
                <option value="inactive">Inactive</option>
                <option value="featured">Featured</option>
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
                    <TableHead>Featured</TableHead>
                    <TableHead>Delivery Fee</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Image
                            src={restaurant.image || restaurant.image_url || "/placeholder.svg?height=50&width=50"}
                            alt={restaurant.name}
                            width={50}
                            height={50}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium">{restaurant.name}</div>
                            <div className="text-sm text-gray-500">{restaurant.address}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{restaurant.cuisine || restaurant.cuisine_type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(restaurant.is_active)}>
                          {getStatusText(restaurant.is_active)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          ⭐ {restaurant.rating || 0}
                          {restaurant.reviewCount && (
                            <span className="text-sm text-gray-500 ml-1">({restaurant.reviewCount})</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFeatured(restaurant.id, restaurant.featured)}
                          className={restaurant.featured ? "text-yellow-600" : "text-gray-400"}
                        >
                          <Star className={`h-4 w-4 ${restaurant.featured ? "fill-current" : ""}`} />
                        </Button>
                      </TableCell>
                      <TableCell>${restaurant.deliveryFee || restaurant.delivery_fee || 0}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/restaurant/${restaurant.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/restaurants/${restaurant.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteRestaurant(restaurant.id, restaurant.name)}
                            >
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
