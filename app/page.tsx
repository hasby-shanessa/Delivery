import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedRestaurants } from "@/components/home/featured-restaurants"
import { CategoriesSection } from "@/components/home/categories-section"
import { PromotionsSection } from "@/components/home/promotions-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedRestaurants />
        <PromotionsSection />
      </main>
      <Footer />
    </div>
  )
}
