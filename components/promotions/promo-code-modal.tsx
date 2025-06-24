"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Check, Gift, Clock, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PromoCodeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promotion: {
    id: number
    title: string
    description: string
    code: string
    discount: string
    validUntil: string
    minOrder: number
    discountType: "percentage" | "free_delivery" | "fixed_amount"
    discountValue: number
  } | null
  onCodeApplied: (code: string) => void
}

export function PromoCodeModal({ open, onOpenChange, promotion, onCodeApplied }: PromoCodeModalProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  if (!promotion) return null

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(promotion.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Code copied!",
        description: "Promo code has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the code manually.",
        variant: "destructive",
      })
    }
  }

  const handleApplyCode = () => {
    onCodeApplied(promotion.code)
  }

  const getDiscountDescription = () => {
    switch (promotion.discountType) {
      case "percentage":
        return `Get ${promotion.discountValue}% off your order`
      case "free_delivery":
        return "Get free delivery on your order"
      case "fixed_amount":
        return `Get $${promotion.discountValue} off your order`
      default:
        return promotion.description
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5 text-orange-500" />
            <span>Special Offer</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2 mb-3">{promotion.discount}</Badge>
            <h3 className="text-xl font-bold mb-2">{promotion.title}</h3>
            <p className="text-gray-600">{getDiscountDescription()}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Promo Code</span>
                <Button variant="ghost" size="sm" onClick={handleCopyCode} className="h-8 px-2">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="font-mono text-lg font-bold text-center py-2 bg-white rounded border-2 border-dashed border-gray-300">
                {promotion.code}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Minimum Order</p>
                  <p className="text-gray-600">${promotion.minOrder}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Valid Until</p>
                  <p className="text-gray-600">{promotion.validUntil}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Button onClick={handleApplyCode} className="w-full" size="lg">
              Apply Code & Start Shopping
            </Button>
            <Button variant="outline" onClick={handleCopyCode} className="w-full">
              {copied ? "Code Copied!" : "Copy Code Only"}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>Terms and conditions apply. Code can be used once per customer.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
