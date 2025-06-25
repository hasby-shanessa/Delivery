import { canUseSupabase } from "./supabase"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Mock data for when Supabase is not configured
const MOCK_RESTAURANTS = [
  {
    id: "1",
    name: "Pizza Palace",
    cuisine_type: "Italian",
    description: "Authentic Italian pizza and pasta",
    image_url: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    delivery_time: "25-35 min",
    delivery_fee: 2.99,
    minimum_order: 15.0,
    is_featured: true,
    address: "123 Main St, City",
    phone: "+1234567890",
    hours: { open: "11:00", close: "23:00" },
  },
  {
    id: "2",
    name: "Burger Barn",
    cuisine_type: "American",
    description: "Juicy burgers and crispy fries",
    image_url: "/placeholder.svg?height=200&width=300",
    rating: 4.2,
    delivery_time: "20-30 min",
    delivery_fee: 1.99,
    minimum_order: 12.0,
    is_featured: true,
    address: "456 Oak Ave, City",
    phone: "+1234567891",
    hours: { open: "10:00", close: "22:00" },
  },
  {
    id: "3",
    name: "Sushi Zen",
    cuisine_type: "Japanese",
    description: "Fresh sushi and Japanese cuisine",
    image_url: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    delivery_time: "30-40 min",
    delivery_fee: 3.99,
    minimum_order: 20.0,
    is_featured: false,
    address: "789 Pine St, City",
    phone: "+1234567892",
    hours: { open: "12:00", close: "22:00" },
  },
  {
    id: "4",
    name: "Taco Fiesta",
    cuisine_type: "Mexican",
    description: "Authentic Mexican tacos and burritos",
    image_url: "/placeholder.svg?height=200&width=300",
    rating: 4.3,
    delivery_time: "15-25 min",
    delivery_fee: 1.49,
    minimum_order: 10.0,
    is_featured: true,
    address: "321 Elm St, City",
    phone: "+1234567893",
    hours: { open: "11:00", close: "23:00" },
  },
  {
    id: "5",
    name: "Thai Garden",
    cuisine_type: "Thai",
    description: "Spicy and flavorful Thai dishes",
    image_url: "/placeholder.svg?height=200&width=300",
    rating: 4.4,
    delivery_time: "25-35 min",
    delivery_fee: 2.49,
    minimum_order: 18.0,
    is_featured: false,
    address: "567 Maple Ave, City",
    phone: "+1234567894",
    hours: { open: "11:30", close: "22:30" },
  },
  {
    id: "6",
    name: "Indian Spice",
    cuisine_type: "Indian",
    description: "Traditional Indian curry and tandoor",
    image_url: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    delivery_time: "30-40 min",
    delivery_fee: 3.49,
    minimum_order: 22.0,
    is_featured: true,
    address: "890 Cedar St, City",
    phone: "+1234567895",
    hours: { open: "12:00", close: "23:00" },
  },
]

const MOCK_MENU_ITEMS = {
  "1": [
    {
      id: "1",
      name: "Margherita Pizza",
      description: "Fresh tomatoes, mozzarella, and basil",
      price: 14.99,
      category: "Pizza",
      image_url: "/placeholder.svg?height=150&width=200",
      is_available: true,
    },
    {
      id: "2",
      name: "Pepperoni Pizza",
      description: "Classic pepperoni with mozzarella cheese",
      price: 16.99,
      category: "Pizza",
      image_url: "/placeholder.svg?height=150&width=200",
      is_available: true,
    },
    {
      id: "3",
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with Caesar dressing",
      price: 9.99,
      category: "Salads",
      image_url: "/placeholder.svg?height=150&width=200",
      is_available: true,
    },
  ],
  "2": [
    {
      id: "4",
      name: "Classic Burger",
      description: "Beef patty with lettuce, tomato, and cheese",
      price: 12.99,
      category: "Burgers",
      image_url: "/placeholder.svg?height=150&width=200",
      is_available: true,
    },
    {
      id: "5",
      name: "Chicken Wings",
      description: "Spicy buffalo wings with ranch dip",
      price: 10.99,
      category: "Appetizers",
      image_url: "/placeholder.svg?height=150&width=200",
      is_available: true,
    },
  ],
}

export class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!canUseSupabase()) {
      // Handle mock data requests
      return this.handleMockRequest<T>(endpoint, options)
    }

    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  private async handleMockRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const url = new URL(`http://localhost${endpoint}`)
    const pathname = url.pathname
    const searchParams = url.searchParams

    // Handle different endpoints
    if (pathname === "/restaurants") {
      if (options.method === "POST") {
        return this.handleMockCreateRestaurant(options) as T
      }
      return this.getMockRestaurants(searchParams) as T
    }

    if (pathname.match(/^\/restaurants\/\d+$/)) {
      const id = pathname.split("/")[2]
      if (options.method === "PUT") {
        return this.handleMockUpdateRestaurant(id, options) as T
      }
      if (options.method === "DELETE") {
        return this.handleMockDeleteRestaurant(id) as T
      }
      return this.getMockRestaurant(id) as T
    }

    if (pathname.match(/^\/restaurants\/\d+\/menu$/)) {
      const id = pathname.split("/")[2]
      return this.getMockMenu(id) as T
    }

    if (pathname === "/auth/login" && options.method === "POST") {
      return this.handleMockLogin(options) as T
    }

    if (pathname === "/auth/register" && options.method === "POST") {
      return this.handleMockRegister(options) as T
    }

    throw new Error(`Mock endpoint not implemented: ${pathname}`)
  }

  private getMockRestaurants(searchParams: URLSearchParams) {
    let restaurants = [...MOCK_RESTAURANTS]

    const search = searchParams.get("search")
    const cuisine = searchParams.get("cuisine")
    const minRating = searchParams.get("minRating")
    const featured = searchParams.get("featured")

    if (search) {
      const searchLower = search.toLowerCase()
      restaurants = restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.cuisine_type.toLowerCase().includes(searchLower) ||
          r.description.toLowerCase().includes(searchLower),
      )
    }

    if (cuisine) {
      const cuisines = cuisine.split(",").map((c) => c.trim().toLowerCase())
      restaurants = restaurants.filter((r) => cuisines.some((c) => r.cuisine_type.toLowerCase().includes(c)))
    }

    if (minRating) {
      const rating = Number.parseFloat(minRating)
      restaurants = restaurants.filter((r) => r.rating >= rating)
    }

    if (featured === "true") {
      restaurants = restaurants.filter((r) => r.is_featured)
    }

    return { restaurants, total: restaurants.length }
  }

  private getMockRestaurant(id: string) {
    const restaurant = MOCK_RESTAURANTS.find((r) => r.id === id)
    if (!restaurant) {
      throw new Error("Restaurant not found")
    }
    return restaurant
  }

  private getMockMenu(id: string) {
    const menuItems = MOCK_MENU_ITEMS[id as keyof typeof MOCK_MENU_ITEMS] || []
    return { menuItems }
  }

  private async handleMockLogin(options: RequestInit) {
    const body = JSON.parse(options.body as string)
    const { email, password } = body

    // Mock users
    const mockUsers = [
      { id: "1", email: "john@example.com", password: "password", username: "john_doe", name: "John Doe" },
      { id: "2", email: "jane@example.com", password: "password", username: "jane_smith", name: "Jane Smith" },
      {
        id: "admin",
        email: "admin@foodie.com",
        password: "admin123",
        username: "admin",
        name: "Admin User",
        role: "admin",
      },
    ]

    const user = mockUsers.find((u) => u.email === email && u.password === password)
    if (!user) {
      throw new Error("Invalid login credentials")
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role || "user",
      },
      token: "mock-jwt-token",
    }
  }

  private async handleMockRegister(options: RequestInit) {
    const body = JSON.parse(options.body as string)
    const { username, name, email, password } = body

    // Simulate successful registration
    return {
      user: {
        id: Date.now().toString(),
        email,
        username,
        name,
      },
      token: "mock-jwt-token",
    }
  }

  private async handleMockCreateRestaurant(options: RequestInit) {
    const body = JSON.parse(options.body as string)

    // Simulate creating a restaurant
    const newRestaurant = {
      id: Date.now().toString(),
      ...body,
      rating: 0,
      review_count: 0,
      created_at: new Date().toISOString(),
    }

    // Add to mock data (in real app, this would be saved to database)
    MOCK_RESTAURANTS.push(newRestaurant)

    return { restaurant: newRestaurant }
  }

  private async handleMockUpdateRestaurant(id: string, options: RequestInit) {
    const body = JSON.parse(options.body as string)

    // Find and update restaurant in mock data
    const index = MOCK_RESTAURANTS.findIndex((r) => r.id === id)
    if (index === -1) {
      throw new Error("Restaurant not found")
    }

    MOCK_RESTAURANTS[index] = { ...MOCK_RESTAURANTS[index], ...body }
    return { restaurant: MOCK_RESTAURANTS[index] }
  }

  private async handleMockDeleteRestaurant(id: string) {
    const index = MOCK_RESTAURANTS.findIndex((r) => r.id === id)
    if (index === -1) {
      throw new Error("Restaurant not found")
    }

    MOCK_RESTAURANTS.splice(index, 1)
    return { success: true }
  }

  // Public API methods
  async getRestaurants(params?: {
    cuisine?: string
    search?: string
    minRating?: number
    featured?: boolean
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString())
        }
      })
    }

    const queryString = searchParams.toString()
    return this.request(`/restaurants${queryString ? `?${queryString}` : ""}`)
  }

  async getRestaurant(id: string) {
    return this.request(`/restaurants/${id}`)
  }

  async createRestaurant(restaurantData: any) {
    return this.request("/restaurants", {
      method: "POST",
      body: JSON.stringify(restaurantData),
    })
  }

  async updateRestaurant(id: string, restaurantData: any) {
    return this.request(`/restaurants/${id}`, {
      method: "PUT",
      body: JSON.stringify(restaurantData),
    })
  }

  async deleteRestaurant(id: string) {
    return this.request(`/restaurants/${id}`, {
      method: "DELETE",
    })
  }

  async getRestaurantMenu(id: string) {
    return this.request(`/restaurants/${id}/menu`)
  }

  async getRestaurantReviews(id: string, params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }
    const queryString = searchParams.toString()
    return this.request(`/restaurants/${id}/reviews${queryString ? `?${queryString}` : ""}`)
  }

  async createOrder(orderData: any) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  }

  async getOrders(params?: {
    userId?: string
    status?: string
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const queryString = searchParams.toString()
    return this.request(`/orders${queryString ? `?${queryString}` : ""}`)
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`)
  }

  async updateOrderStatus(id: string, status: string, notes?: string) {
    return this.request(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status, notes }),
    })
  }

  async register(username: string, name: string, email: string, password: string, phone?: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, name, email, password, phone }),
    })
  }

  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async getPromotions(active?: boolean) {
    const params = active ? "?active=true" : ""
    return this.request(`/promotions${params}`)
  }

  async validatePromoCode(code: string, orderTotal: number, restaurantId?: string) {
    return this.request("/promotions/validate", {
      method: "POST",
      body: JSON.stringify({ code, orderTotal, restaurantId }),
    })
  }
}

// Export the API client instance
export const apiClient = new ApiClient()

// Export individual functions for backward compatibility
export async function fetchRestaurants(params?: {
  search?: string
  cuisine?: string
  rating?: string
  delivery_time?: string
  featured?: boolean
}) {
  try {
    const response = await apiClient.getRestaurants({
      search: params?.search,
      cuisine: params?.cuisine,
      minRating: params?.rating ? Number.parseFloat(params.rating) : undefined,
      featured: params?.featured,
    })
    return typeof response === 'object' && response && 'restaurants' in response
      ? (response as any).restaurants
      : response
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    return []
  }
}

export async function fetchRestaurant(id: string) {
  try {
    return await apiClient.getRestaurant(id)
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    return null
  }
}

export async function fetchMenuItems(restaurantId: string) {
  try {
    const response = await apiClient.getRestaurantMenu(restaurantId)
    return typeof response === 'object' && response && 'menuItems' in response
      ? (response as any).menuItems
      : response
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return []
  }
}
