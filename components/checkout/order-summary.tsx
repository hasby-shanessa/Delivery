"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"

export function OrderSummary() {
  const { items, getTotal } = useCart()

  const subtotal = getTotal()
  const deliveryFee = 2.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={50}
                height={50}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
              </div>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
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

        <Button className="w-full" size="lg">
          Place Order
        </Button>

        <p className="text-xs text-gray-600 text-center">
          By placing your order, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardContent>
    </Card>
  )
}
