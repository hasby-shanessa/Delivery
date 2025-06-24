import { Star, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface ReviewsSectionProps {
  restaurantId: string
}

const reviews = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    comment: "Amazing food and great service! The pasta was perfectly cooked and the atmosphere was wonderful.",
    date: "2 days ago",
    helpful: 12,
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 4,
    comment: "Good food, but the delivery took a bit longer than expected. Overall satisfied with the quality.",
    date: "1 week ago",
    helpful: 8,
  },
  {
    id: 3,
    user: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    comment: "Best Italian restaurant in the area! Highly recommend the carbonara.",
    date: "2 weeks ago",
    helpful: 15,
  },
]

export function ReviewsSection({ restaurantId }: ReviewsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-b-0">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{review.user.name}</h4>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Helpful ({review.helpful})
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
