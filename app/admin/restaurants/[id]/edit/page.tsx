"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api"

interface EditRestaurantPageProps {
  params: Promise<{
    id: string
  }>
}

const CUISINE_TYPES = [
  "Italian",
  "American",
  "Japanese",
  "Mexican",
  "Thai",
  "Indian",
  "Chinese",
  "Mediterranean",
  "French",
  "Korean",
  "Vietnamese",
  "Greek",
  "Lebanese",
  "Other",
]

export default async function EditRestaurantPage({ params }: EditRestaurantPageProps) {
  const { id } = await params

  // This will be a client component for the interactive parts
  return <EditRestaurantClient restaurantId={id} />
}

function EditRestaurantClient({ restaurantId }: { restaurantId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [restaurant, setRestaurant] = useState<any>(null)

  useEffect(() => {
    loadRestaurant()
  }, [restaurantId])

  const loadRestaurant = async () => {
    try {
      const data = await apiClient.getRestaurant(restaurantId)
      setRestaurant(data)
    } catch (error) {
      console.error("Error loading restaurant:", error)
      toast({
        title: "Error",
        description: "Failed to load restaurant data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setRestaurant((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await apiClient.updateRestaurant(restaurantId, restaurant)

      toast({
        title: "Success!",
        description: "Restaurant has been updated successfully",
      })

      router.push("/admin/restaurants")
    } catch (error) {
      console.error("Error updating restaurant:", error)
      toast({
        title: "Error",
        description: "Failed to update restaurant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading restaurant data...</span>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h2>
              <p className="text-gray-600 mb-4">The restaurant you're looking for doesn't exist.</p>
              <Button onClick={() => router.push("/admin/restaurants")}>Back to Restaurants</Button>
            </div>
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
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Restaurant</h1>
                <p className="text-gray-600">Update restaurant information</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Restaurant Name</Label>
                    <Input
                      id="name"
                      value={restaurant.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter restaurant name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cuisine_type">Cuisine Type</Label>
                    <Select
                      value={restaurant.cuisine_type || ""}
                      onValueChange={(value) => handleInputChange("cuisine_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cuisine type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CUISINE_TYPES.map((cuisine) => (
                          <SelectItem key={cuisine} value={cuisine}>
                            {cuisine}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={restaurant.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the restaurant..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={restaurant.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={restaurant.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="restaurant@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={restaurant.website || ""}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://restaurant.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Featured Restaurant</Label>
                    <p className="text-sm text-gray-600">Show this restaurant in featured section</p>
                  </div>
                  <Switch
                    checked={restaurant.is_featured || false}
                    onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Active Status</Label>
                    <p className="text-sm text-gray-600">Restaurant is accepting orders</p>
                  </div>
                  <Switch
                    checked={restaurant.is_active !== false}
                    onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
