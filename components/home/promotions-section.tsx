"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { PromoCodeModal } from "@/components/promotions/promo-code-modal"
import Image from "next/image"

const promotions = [
  {
    id: 1,
    title: "Free Delivery Weekend",
    description: "Get free delivery on all orders above $25",
    code: "FREEDEL",
    discount: "Free Delivery",
    image: "/placeholder.svg?height=150&width=300",
    validUntil: "2024-01-31",
    minOrder: 25,
    discountType: "free_delivery" as const,
    discountValue: 0,
  },
  {
    id: 2,
    title: "20% Off First Order",
    description: "New customers get 20% off their first order",
    code: "WELCOME20",
    discount: "20% OFF",
    image: "/placeholder.svg?height=150&width=300",
    validUntil: "2024-02-15",
    minOrder: 15,
    discountType: "percentage" as const,
    discountValue: 20,
  },
]

export function PromotionsSection() {
  const [selectedPromo, setSelectedPromo] = useState<(typeof promotions)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  const handleUseCode = (promo: (typeof promotions)[0]) => {
    setSelectedPromo(promo)
    setIsModalOpen(true)
  }

  const handleCodeApplied = (code: string) => {
    // Copy code to clipboard
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast({
          title: "Code copied!",
          description: `Promo code "${code}" has been copied to your clipboard. Use it at checkout!`,
        })
      })
      .catch(() => {
        toast({
          title: "Code ready!",
          description: `Use promo code "${code}" at checkout to get your discount.`,
        })
      })
    setIsModalOpen(false)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
          <p className="text-gray-600 text-lg">Don't miss out on these amazing deals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promotions.map((promo) => (
            <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <Image
                    src={promo.image || "/placeholder.svg"}
                    alt={promo.title}
                    width={300}
                    height={150}
                    className="w-full h-32 md:h-full object-cover"
                  />
                </div>
                <CardContent className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-xl">{promo.title}</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {promo.discount}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{promo.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Code: <span className="font-mono font-bold">{promo.code}</span>
                      </p>
                      <p className="text-xs text-gray-400">Valid until {promo.validUntil}</p>
                      <p className="text-xs text-gray-400">Min order: ${promo.minOrder}</p>
                    </div>
                    <Button onClick={() => handleUseCode(promo)}>Use Code</Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <PromoCodeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        promotion={selectedPromo}
        onCodeApplied={handleCodeApplied}
      />
    </section>
  )
}
