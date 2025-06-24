import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, Shield, Heart, Users, Award } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get your food delivered in 30 minutes or less",
  },
  {
    icon: Clock,
    title: "24/7 Service",
    description: "Order anytime, anywhere with our round-the-clock service",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your payments and personal data are always protected",
  },
  {
    icon: Heart,
    title: "Quality Food",
    description: "We partner with the best restaurants to ensure quality",
  },
]

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Former restaurant owner with 15 years of experience in the food industry.",
  },
  {
    name: "Mike Chen",
    role: "CTO",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Tech veteran who previously built delivery platforms for major companies.",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Operations",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Logistics expert ensuring smooth operations across all our markets.",
  },
]

const stats = [
  { label: "Happy Customers", value: "50,000+" },
  { label: "Partner Restaurants", value: "1,000+" },
  { label: "Cities Served", value: "25+" },
  { label: "Orders Delivered", value: "500,000+" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About FoodieExpress</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            We're on a mission to connect people with great food and make dining more accessible, convenient, and
            enjoyable for everyone.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2020, FoodieExpress started with a simple idea: everyone deserves access to great food,
                delivered fast and fresh. What began as a small startup has grown into a platform that connects
                thousands of restaurants with hungry customers across the country.
              </p>
              <p className="text-gray-600 mb-4">
                We believe that food brings people together, and our technology makes it easier than ever to discover
                new flavors, support local businesses, and enjoy meals with the people you love.
              </p>
              <p className="text-gray-600">
                Today, we're proud to serve over 50,000 customers and partner with more than 1,000 restaurants,
                delivering not just food, but experiences that matter.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Our story"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose FoodieExpress?</h2>
            <p className="text-gray-600 text-lg">We're committed to providing the best food delivery experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-gray-600 text-lg">Numbers that show our commitment to excellence</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 text-lg">The people behind FoodieExpress</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">
                    {member.role}
                  </Badge>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 mb-8">
              To revolutionize the way people discover, order, and enjoy food by creating seamless connections between
              restaurants and customers while supporting local communities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Users className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="font-semibold mb-2">Community First</h3>
                <p className="text-gray-600 text-sm">
                  Supporting local restaurants and bringing communities together through food
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Award className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="font-semibold mb-2">Excellence</h3>
                <p className="text-gray-600 text-sm">
                  Committed to providing exceptional service and quality in everything we do
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Heart className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="font-semibold mb-2">Passion</h3>
                <p className="text-gray-600 text-sm">
                  Driven by our love for food and dedication to customer satisfaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
