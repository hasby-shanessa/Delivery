const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

export class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Restaurants
  async getRestaurants(params?: {
    cuisine?: string
    search?: string
    minRating?: number
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

    return this.request(`/restaurants?${searchParams}`)
  }

  async getRestaurant(id: string) {
    return this.request(`/restaurants/${id}`)
  }

  async getRestaurantMenu(id: string) {
    return this.request(`/restaurants/${id}/menu`)
  }

  // Orders
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

    return this.request(`/orders?${searchParams}`)
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`)
  }

  // Reviews
  async getRestaurantReviews(restaurantId: string) {
    return this.request(`/restaurants/${restaurantId}/reviews`)
  }

  async createReview(reviewData: any) {
    return this.request("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    })
  }

  // Promotions
  async getPromotions() {
    return this.request("/promotions")
  }

  async validatePromoCode(code: string, orderTotal: number) {
    return this.request("/promotions/validate", {
      method: "POST",
      body: JSON.stringify({ code, orderTotal }),
    })
  }
}

export const apiClient = new ApiClient()
