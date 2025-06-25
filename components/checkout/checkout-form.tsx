"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { useRouter } from "next/navigation"

export function CheckoutForm() {
  const { items, getTotal, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    zipCode: "",
    instructions: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!deliveryInfo.firstName.trim()) newErrors.firstName = "First name is required"
    if (!deliveryInfo.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!deliveryInfo.email.trim()) newErrors.email = "Email is required"
    if (!deliveryInfo.phone.trim()) newErrors.phone = "Phone number is required"
    if (!deliveryInfo.address.trim()) newErrors.address = "Address is required"
    if (!deliveryInfo.city.trim()) newErrors.city = "City is required"
    if (!deliveryInfo.zipCode.trim()) newErrors.zipCode = "ZIP code is required"

    if (paymentMethod === "card") {
      if (!cardInfo.cardNumber.trim()) newErrors.cardNumber = "Card number is required"
      if (!cardInfo.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required"
      if (!cardInfo.cvv.trim()) newErrors.cvv = "CVV is required"
      if (!cardInfo.cardName.trim()) newErrors.cardName = "Name on card is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check the form for missing or invalid information.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const subtotal = getTotal()
      const deliveryFee = 2.99
      const tax = subtotal * 0.08
      const total = subtotal + deliveryFee + tax

      const orderData = {
        items,
        deliveryAddress: deliveryInfo,
        paymentMethod,
        paymentDetails: paymentMethod === "card" ? cardInfo : null,
        subtotal,
        deliveryFee,
        tax,
        total,
      }

      const response = await apiClient.createOrder(orderData)
      if (
        response &&
        typeof response === 'object' &&
        'success' in response &&
        (response as any).success &&
        'order' in response &&
        typeof (response as any).order === 'object'
      ) {
        clearCart()
        toast({
          title: "Order placed successfully!",
          description: `Your order #${(response as any).order.orderNumber} has been confirmed.`,
        })
        router.push(`/order-tracking/${(response as any).order.id}`)
      }
    } catch (error) {
      console.error("Order submission error:", error)
      toast({
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeliveryInfoChange = (field: string, value: string) => {
    setDeliveryInfo((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleCardInfoChange = (field: string, value: string) => {
    setCardInfo((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={deliveryInfo.firstName}
                onChange={(e) => handleDeliveryInfoChange("firstName", e.target.value)}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={deliveryInfo.lastName}
                onChange={(e) => handleDeliveryInfoChange("lastName", e.target.value)}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={deliveryInfo.email}
              onChange={(e) => handleDeliveryInfoChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={deliveryInfo.phone}
              onChange={(e) => handleDeliveryInfoChange("phone", e.target.value)}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={deliveryInfo.address}
              onChange={(e) => handleDeliveryInfoChange("address", e.target.value)}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={deliveryInfo.city}
                onChange={(e) => handleDeliveryInfoChange("city", e.target.value)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={deliveryInfo.zipCode}
                onChange={(e) => handleDeliveryInfoChange("zipCode", e.target.value)}
                className={errors.zipCode ? "border-red-500" : ""}
              />
              {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              placeholder="Any special instructions for delivery..."
              value={deliveryInfo.instructions}
              onChange={(e) => handleDeliveryInfoChange("instructions", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card">Credit/Debit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal">PayPal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash">Cash on Delivery</Label>
            </div>
          </RadioGroup>

          {paymentMethod === "card" && (
            <div className="mt-4 space-y-4">
              <Separator />
              <div>
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardInfo.cardNumber}
                  onChange={(e) => handleCardInfoChange("cardNumber", e.target.value)}
                  className={errors.cardNumber ? "border-red-500" : ""}
                />
                {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date *</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardInfo.expiryDate}
                    onChange={(e) => handleCardInfoChange("expiryDate", e.target.value)}
                    className={errors.expiryDate ? "border-red-500" : ""}
                  />
                  {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                </div>
                <div>
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cardInfo.cvv}
                    onChange={(e) => handleCardInfoChange("cvv", e.target.value)}
                    className={errors.cvv ? "border-red-500" : ""}
                  />
                  {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="cardName">Name on Card *</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardInfo.cardName}
                  onChange={(e) => handleCardInfoChange("cardName", e.target.value)}
                  className={errors.cardName ? "border-red-500" : ""}
                />
                {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
