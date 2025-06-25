"use client"

import type React from "react"

import { useState } from "react"
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
import { ArrowLeft } from "lucide-react"
import { apiClient } from "@/lib/api"

interface RestaurantFormData {
  name: string
  description: string
  cuisine_type: string
  phone: string
  email: string
  website: string
  image_url: string
  cover_image_url: string
  address: string
  city: string
  state: string
  zip_code: string
  delivery_fee: number
  minimum_order: number
  delivery_time_min: number
  delivery_time_max: number
  is_featured: boolean
  is_active: boolean
}

interface OperatingHours {
  day: string
  dayIndex: number
  isOpen: boolean
  openTime: string
  closeTime: string
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

const DAYS_OF_WEEK = [
  { name: "Sunday", index: 0 },
  { name: "Monday", index: 1 },
  { name: "Tuesday", index: 2 },
  { name: "Wednesday", index: 3 },
  { name: "Thursday", index: 4 },
  { name: "Friday", index: 5 },
  { name: "Saturday", index: 6 },
]

export default function AddRestaurantPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: "",
    description: "",
    cuisine_type: "",
    phone: "",
    email: "",
    website: "",
    image_url: "",
    cover_image_url: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    delivery_fee: 2.99,
    minimum_order: 15.0,
    delivery_time_min: 30,
    delivery_time_max: 45,
    is_featured: false,
    is_active: true,
  })

  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>(
    DAYS_OF_WEEK.map((day) => ({
      day: day.name,
      dayIndex: day.index,
      isOpen: true,
      openTime: "09:00",
      closeTime: "22:00",
    })),
  )

  const handleInputChange = (field: keyof RestaurantFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleHoursChange = (dayIndex: number, field: keyof OperatingHours, value: any) => {
    setOperatingHours((prev) => prev.map((hour) => (hour.dayIndex === dayIndex ? { ...hour, [field]: value } : hour)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.cuisine_type || !formData.address) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Create restaurant
      const restaurantData = {
        ...formData,
        address: {
          street_address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
        },
        operating_hours: operatingHours,
      }

      await apiClient.createRestaurant(restaurantData)

      toast({
        title: "Success!",
        description: "Restaurant has been created successfully",
      })

      router.push("/admin/restaurants")
    } catch (error) {
      console.error("Error creating restaurant:", error)
      toast({
        title: "Error",
        description: "Failed to create restaurant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
                <h1 className="text-3xl font-bold text-gray-900">Add New Restaurant</h1>
                <p className="text-gray-600">Create a new restaurant profile</p>
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
                    <Label htmlFor="name">Restaurant Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter restaurant name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cuisine_type">Cuisine Type *</Label>
                    <Select
                      value={formData.cuisine_type}
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
                    value={formData.description}
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
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="restaurant@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://restaurant.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input
                      id="zip_code"
                      value={formData.zip_code}
                      onChange={(e) => handleInputChange("zip_code", e.target.value)}
                      placeholder="10001"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image_url">Restaurant Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange("image_url", e.target.value)}
                      placeholder="https://example.com/restaurant-image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cover_image_url">Cover Image URL</Label>
                    <Input
                      id="cover_image_url"
                      value={formData.cover_image_url}
                      onChange={(e) => handleInputChange("cover_image_url", e.target.value)}
                      placeholder="https://example.com/cover-image.jpg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="delivery_fee">Delivery Fee ($)</Label>
                    <Input
                      id="delivery_fee"
                      type="number"
                      step="0.01"
                      value={formData.delivery_fee}
                      onChange={(e) => handleInputChange("delivery_fee", Number.parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minimum_order">Minimum Order ($)</Label>
                    <Input
                      id="minimum_order"
                      type="number"
                      step="0.01"
                      value={formData.minimum_order}
                      onChange={(e) => handleInputChange("minimum_order", Number.parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery_time_min">Min Delivery Time (min)</Label>
                    <Input
                      id="delivery_time_min"
                      type="number"
                      value={formData.delivery_time_min}
                      onChange={(e) => handleInputChange("delivery_time_min", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery_time_max">Max Delivery Time (min)</Label>
                    <Input
                      id="delivery_time_max"
                      type="number"
                      value={formData.delivery_time_max}
                      onChange={(e) => handleInputChange("delivery_time_max", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Operating Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operatingHours.map((hours) => (
                    <div key={hours.dayIndex} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-24">
                        <Label className="font-medium">{hours.day}</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={hours.isOpen}
                          onCheckedChange={(checked) => handleHoursChange(hours.dayIndex, "isOpen", checked)}
                        />
                        <span className="text-sm text-gray-600">Open</span>
                      </div>
                      {hours.isOpen && (
                        <>
                          <div>
                            <Input
                              type="time"
                              value={hours.openTime}
                              onChange={(e) => handleHoursChange(hours.dayIndex, "openTime", e.target.value)}
                              className="w-32"
                            />
                          </div>
                          <span className="text-gray-500">to</span>
                          <div>
                            <Input
                              type="time"
                              value={hours.closeTime}
                              onChange={(e) => handleHoursChange(hours.dayIndex, "closeTime", e.target.value)}
                              className="w-32"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
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
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Active Status</Label>
                    <p className="text-sm text-gray-600">Restaurant is accepting orders</p>
                  </div>
                  <Switch
                    checked={formData.is_active}
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Restaurant"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
