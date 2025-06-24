"use client"

import { Minus, Plus, Trash2, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"
import Link from "next/link"

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const {
    items,
    appliedPromo,
    updateQuantity,
    removeItem,
    removePromo,
    getSubtotal,
    getDeliveryFee,
    getDiscount,
    getTotal,
  } = useCart()

  const subtotal = getSubtotal()
  const deliveryFee = getDeliveryFee()
  const discount = getDiscount()
  const tax = subtotal * 0.08
  const total = getTotal()

  if (items.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-4">Add some delicious items to get started!</p>
            <Button onClick={() => onOpenChange(false)}>Continue Shopping</Button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({items.length} items)</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">${item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          {appliedPromo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-green-100 text-green-800 mb-1">{appliedPromo.code}</Badge>
                  <p className="text-sm text-green-700">
                    {appliedPromo.discountType === "percentage" && `${appliedPromo.discountValue}% off`}
                    {appliedPromo.discountType === "free_delivery" && "Free delivery"}
                    {appliedPromo.discountType === "fixed_amount" && `$${appliedPromo.discountValue} off`}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removePromo}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className={deliveryFee === 0 ? "line-through text-gray-500" : ""}>${deliveryFee.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Link href="/checkout" onClick={() => onOpenChange(false)}>
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
