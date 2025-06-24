"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Search, Clock, CreditCard, Truck, Shield, Phone, Mail } from "lucide-react"

const faqCategories = [
  {
    id: "ordering",
    name: "Ordering",
    icon: Truck,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "payment",
    name: "Payment",
    icon: CreditCard,
    color: "bg-green-100 text-green-800",
  },
  {
    id: "delivery",
    name: "Delivery",
    icon: Clock,
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: "account",
    name: "Account",
    icon: Shield,
    color: "bg-purple-100 text-purple-800",
  },
]

const faqs = [
  {
    id: 1,
    category: "ordering",
    question: "How do I place an order?",
    answer:
      "To place an order, simply browse restaurants in your area, select items from their menu, add them to your cart, and proceed to checkout. You'll need to provide your delivery address and payment information to complete the order.",
  },
  {
    id: 2,
    category: "ordering",
    question: "What's the minimum order amount?",
    answer:
      "Minimum order amounts vary by restaurant, typically ranging from $8 to $20. You can see each restaurant's minimum order requirement on their page before placing an order.",
  },
  {
    id: 3,
    category: "ordering",
    question: "Can I modify my order after placing it?",
    answer:
      "You can modify your order within 2-3 minutes of placing it, depending on the restaurant's preparation time. After that, the restaurant begins preparing your food and changes may not be possible. Contact customer support immediately if you need to make changes.",
  },
  {
    id: 4,
    category: "ordering",
    question: "Can I schedule an order for later?",
    answer:
      "Yes! Many restaurants offer scheduled ordering. You can select a future delivery time during checkout, up to 7 days in advance. This feature is perfect for planning meals or special occasions.",
  },
  {
    id: 5,
    category: "delivery",
    question: "How long does delivery take?",
    answer:
      "Delivery times typically range from 25-45 minutes, depending on the restaurant's preparation time, your location, and current demand. You'll see an estimated delivery time before placing your order.",
  },
  {
    id: 6,
    category: "delivery",
    question: "How much does delivery cost?",
    answer:
      "Delivery fees vary by restaurant and distance, typically ranging from $1.99 to $4.99. Many restaurants offer free delivery on orders over $25. You'll see the exact delivery fee before completing your order.",
  },
  {
    id: 7,
    category: "delivery",
    question: "Do you deliver to my area?",
    answer:
      "We deliver to most areas within our service zones. Enter your address on our homepage or app to see available restaurants in your area. We're constantly expanding to new neighborhoods!",
  },
  {
    id: 8,
    category: "delivery",
    question: "Can I track my order?",
    answer:
      "Once your order is confirmed, you'll receive real-time updates via SMS and email. You can also track your order status in real-time through our website or app, from preparation to delivery.",
  },
  {
    id: 9,
    category: "delivery",
    question: "What if my order is late?",
    answer:
      "If your order is significantly delayed, we'll notify you with an updated delivery time. For orders more than 15 minutes late, you may be eligible for credits or refunds. Contact our support team for assistance.",
  },
  {
    id: 10,
    category: "payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and cash on delivery in select areas.",
  },
  {
    id: 11,
    category: "payment",
    question: "Is my payment information secure?",
    answer:
      "Yes, we use industry-standard encryption and security measures to protect your payment information. We're PCI DSS compliant and never store your full credit card details on our servers.",
  },
  {
    id: 12,
    category: "payment",
    question: "Can I get a refund?",
    answer:
      "Yes, we offer refunds for various reasons including order cancellations, missing items, or quality issues. Refunds are typically processed within 3-5 business days to your original payment method.",
  },
  {
    id: 13,
    category: "payment",
    question: "Do you charge tips automatically?",
    answer:
      "No, tipping is optional and at your discretion. You can add a tip during checkout or give cash directly to your delivery driver. Suggested tip amounts are provided for your convenience.",
  },
  {
    id: 14,
    category: "account",
    question: "Do I need to create an account to order?",
    answer:
      "While you can place orders as a guest, creating an account allows you to save addresses, payment methods, track order history, and receive personalized recommendations and exclusive offers.",
  },
  {
    id: 15,
    category: "account",
    question: "How do I reset my password?",
    answer:
      "Click 'Forgot Password' on the sign-in page and enter your email address. We'll send you a secure link to reset your password. If you don't receive the email, check your spam folder or contact support.",
  },
  {
    id: 16,
    category: "account",
    question: "Can I save multiple addresses?",
    answer:
      "Yes! You can save multiple delivery addresses in your account, such as home, work, or friends' places. This makes ordering faster and more convenient for your regular locations.",
  },
  {
    id: 17,
    category: "account",
    question: "How do I delete my account?",
    answer:
      "You can delete your account by going to Account Settings and selecting 'Delete Account'. Please note that this action is permanent and will remove all your order history and saved information.",
  },
  {
    id: 18,
    category: "ordering",
    question: "What if an item is out of stock?",
    answer:
      "If an item becomes unavailable after you order, the restaurant will contact you to suggest alternatives or remove the item from your order with a refund for that item.",
  },
  {
    id: 19,
    category: "delivery",
    question: "Can I change my delivery address after ordering?",
    answer:
      "Address changes are only possible within the first few minutes of placing an order and only if the new address is within the same delivery zone. Contact support immediately if you need to change your address.",
  },
  {
    id: 20,
    category: "ordering",
    question: "Do you have vegetarian/vegan options?",
    answer:
      "Yes! Many of our restaurant partners offer vegetarian, vegan, and other dietary options. You can filter restaurants and menu items by dietary preferences to find options that suit your needs.",
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<number[]>([])

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const getCategoryName = (categoryId: string) => {
    return faqCategories.find((cat) => cat.id === categoryId)?.name || categoryId
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Find answers to common questions about ordering, delivery, and more
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-gray-900 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Browse by Category</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-3 rounded-full border transition-colors ${
                  !selectedCategory
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-orange-500"
                }`}
              >
                All Questions
              </button>
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full border transition-colors flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-orange-500"
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Results */}
          <div className="max-w-4xl mx-auto">
            {searchQuery && (
              <div className="mb-6">
                <p className="text-gray-600">
                  {filteredFAQs.length} result{filteredFAQs.length !== 1 ? "s" : ""} found for "{searchQuery}"
                </p>
              </div>
            )}

            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search terms or browse by category</p>
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory(null)
                  }}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => {
                  const category = faqCategories.find((cat) => cat.id === faq.category)
                  const isOpen = openItems.includes(faq.id)

                  return (
                    <Card key={faq.id} className="overflow-hidden">
                      <Collapsible open={isOpen} onOpenChange={() => toggleItem(faq.id)}>
                        <CollapsibleTrigger className="w-full">
                          <CardContent className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-start space-x-4 text-left">
                                {category && (
                                  <Badge className={category.color}>
                                    <category.icon className="h-3 w-3 mr-1" />
                                    {category.name}
                                  </Badge>
                                )}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                                </div>
                              </div>
                              <ChevronDown
                                className={`h-5 w-5 text-gray-500 transition-transform ${
                                  isOpen ? "transform rotate-180" : ""
                                }`}
                              />
                            </div>
                          </CardContent>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-6 pb-6">
                            <div className="border-t pt-4">
                              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-8">Can't find what you're looking for? Our support team is here to help!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 text-orange-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-gray-600 mb-4">Speak with our support team</p>
                  <p className="font-medium">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9am-6pm EST</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 text-orange-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-gray-600 mb-4">Get help via email</p>
                  <p className="font-medium">support@foodieexpress.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
