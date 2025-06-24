export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Restaurant {
  id: number
  name: string
  slug: string
  description: string
  cuisine: string
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: number
  image: string
  address: string
  phone: string
  isOpen: boolean
  featured: boolean
  minimumOrder?: number
}

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  popular?: boolean
  dietary?: string[]
  calories?: number
  preparationTime?: number
}

export interface MenuCategory {
  id: string
  name: string
  description?: string
  items: MenuItem[]
}

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  restaurantId: string
  image: string
  selectedOptions?: any[]
  specialInstructions?: string
}

export interface Order {
  id: number
  orderNumber: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled"
  restaurant: Restaurant
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  deliveryAddress: Address
  paymentMethod: string
  estimatedDeliveryTime?: string
  actualDeliveryTime?: string
  createdAt: string
  updatedAt: string
}

export interface Address {
  id?: number
  label?: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country?: string
  isDefault?: boolean
}

export interface Review {
  id: number
  user: {
    name: string
    avatar?: string
  }
  rating: number
  comment: string
  date: string
  helpful: number
}

export interface Promotion {
  id: number
  title: string
  description: string
  code: string
  discountType: "percentage" | "fixed_amount" | "free_delivery"
  discountValue: number
  minimumOrderAmount: number
  validFrom: string
  validUntil: string
  isActive: boolean
}
