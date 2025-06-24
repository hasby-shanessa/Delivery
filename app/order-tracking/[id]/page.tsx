"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, Truck, MapPin, Phone, Star } from "lucide-react"
import Image from "next/image"

interface OrderTrackingPageProps {
  params: {
    id: string
  }
}

const orderStatuses = [
  { key: "confirmed", label: "Order Confirmed", icon: CheckCircle, completed: true },
  { key: "preparing", label: "Preparing", icon: Clock, completed: true },
  { key: "ready", label: "Ready for Pickup", icon: CheckCircle, completed: true },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck, completed: false },
  { key: "delivered", label: "Delivered", icon: CheckCircle, completed: false },
]

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const [order, setOrder] = useState({
    id: params.id,
    orderNumber: "ORD-1234567890",
    status: "ready",
    restaurant: {
      name: "Bella Italia",
      phone: "+1 (555) 123-0001",
      address: "123 Italian Way, New York, NY 10001",
      image: "/placeholder.svg?height=60&width=60",
    },
    items: [
      {
        id: 1,
        name: "Spaghetti Carbonara",
        quantity: 1,
        price: 16.99,
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        id: 2,
        name: "Bruschetta",
        quantity: 2,
        price: 8.99,
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
    deliveryAddress: "123 Main St, New York, NY 10001",
    estimatedDeliveryTime: "7:45 PM",
    subtotal: 34.97,
    deliveryFee: 2.99,
    tax: 2.8,
    total: 40.76,
    createdAt: "2024-01-15T18:30:00Z",
  })

  const [currentStatusIndex, setCurrentStatusIndex] = useState(2)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (currentStatusIndex < orderStatuses.length - 1) {
        setCurrentStatusIndex((prev) => prev + 1)
        setOrder((prev) => ({
          ...prev,
          status: orderStatuses[currentStatusIndex + 1].key,
        }))
      }
    }, 30000) // Update every 30 seconds for demo

    return () => clearInterval(interval)
  }, [currentStatusIndex])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-gray-600">Order #{order.orderNumber}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderStatuses.map((status, index) => (
                    <div key={status.key} className="flex items-center space-x-4">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          index <= currentStatusIndex ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <status.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${index <= currentStatusIndex ? "text-green-600" : "text-gray-500"}`}
                        >
                          {status.label}
                        </p>
                        {index === currentStatusIndex && (
                          <p className="text-sm text-gray-600">
                            {index === 0 && "Your order has been confirmed"}
                            {index === 1 && "The restaurant is preparing your order"}
                            {index === 2 && "Your order is ready for pickup"}
                            {index === 3 && "Your order is on the way"}
                            {index === 4 && "Your order has been delivered"}
                          </p>
                        )}
                      </div>
                      {index === currentStatusIndex && <Badge className="bg-blue-100 text-blue-800">Current</Badge>}
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Estimated delivery: {order.estimatedDeliveryTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Info */}
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Image
                    src={order.restaurant.image || "/placeholder.svg"}
                    alt={order.restaurant.name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{order.restaurant.name}</h3>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {order.restaurant.address}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {order.restaurant.phone}
                    </p>
                  </div>
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Restaurant
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{order.deliveryAddress}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {order.items.map((item) => (
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
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${order.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button className="w-full" variant="outline">
                    Contact Support
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Star className="h-4 w-4 mr-2" />
                    Rate Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
