import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RestaurantHeader } from "@/components/restaurant/restaurant-header"
import { MenuSection } from "@/components/restaurant/menu-section"
import { ReviewsSection } from "@/components/restaurant/reviews-section"

interface RestaurantPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <RestaurantHeader restaurantId={id} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <MenuSection restaurantId={id} />
            </div>
            <div className="lg:w-1/3">
              <ReviewsSection restaurantId={id} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
