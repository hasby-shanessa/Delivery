"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  restaurantId: string
  image: string
}

interface PromoCode {
  code: string
  discountType: "percentage" | "free_delivery" | "fixed_amount"
  discountValue: number
  minOrder: number
}

interface CartState {
  items: CartItem[]
  appliedPromo: PromoCode | null
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "APPLY_PROMO"; payload: PromoCode }
  | { type: "REMOVE_PROMO" }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  items: CartItem[]
  appliedPromo: PromoCode | null
  addItem: (item: CartItem) => void
  updateQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  applyPromo: (promo: PromoCode) => void
  removePromo: () => void
  clearCart: () => void
  getSubtotal: () => number
  getDeliveryFee: () => number
  getDiscount: () => number
  getTotal: () => number
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + action.payload.quantity } : item,
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      }

    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
        ),
      }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      }

    case "APPLY_PROMO":
      return {
        ...state,
        appliedPromo: action.payload,
      }

    case "REMOVE_PROMO":
      return {
        ...state,
        appliedPromo: null,
      }

    case "CLEAR_CART":
      return {
        items: [],
        appliedPromo: null,
      }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], appliedPromo: null })

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } })
  }

  const applyPromo = (promo: PromoCode) => {
    dispatch({ type: "APPLY_PROMO", payload: promo })
  }

  const removePromo = () => {
    dispatch({ type: "REMOVE_PROMO" })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getSubtotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getDeliveryFee = () => {
    if (state.appliedPromo?.discountType === "free_delivery") {
      return 0
    }
    return 2.99
  }

  const getDiscount = () => {
    if (!state.appliedPromo) return 0

    const subtotal = getSubtotal()

    if (subtotal < state.appliedPromo.minOrder) return 0

    switch (state.appliedPromo.discountType) {
      case "percentage":
        return subtotal * (state.appliedPromo.discountValue / 100)
      case "fixed_amount":
        return Math.min(state.appliedPromo.discountValue, subtotal)
      case "free_delivery":
        return 2.99 // Standard delivery fee
      default:
        return 0
    }
  }

  const getTotal = () => {
    const subtotal = getSubtotal()
    const deliveryFee = getDeliveryFee()
    const discount = getDiscount()
    const tax = subtotal * 0.08

    return Math.max(0, subtotal + deliveryFee + tax - discount)
  }

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        appliedPromo: state.appliedPromo,
        addItem,
        updateQuantity,
        removeItem,
        applyPromo,
        removePromo,
        clearCart,
        getSubtotal,
        getDeliveryFee,
        getDiscount,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
