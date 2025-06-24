import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const recentOrders = [
  {
    id: "#3210",
    customer: "John Doe",
    restaurant: "Bella Italia",
    amount: "$45.99",
    status: "delivered",
    time: "2 hours ago",
  },
  {
    id: "#3209",
    customer: "Jane Smith",
    restaurant: "Sushi Master",
    amount: "$67.50",
    status: "preparing",
    time: "3 hours ago",
  },
  {
    id: "#3208",
    customer: "Mike Johnson",
    restaurant: "Burger Palace",
    amount: "$23.99",
    status: "delivered",
    time: "4 hours ago",
  },
  {
    id: "#3207",
    customer: "Sarah Wilson",
    restaurant: "Spice Garden",
    amount: "$34.75",
    status: "cancelled",
    time: "5 hours ago",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800"
    case "preparing":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">{order.id}</div>
                <div className="text-sm text-gray-600">{order.customer}</div>
                <div className="text-sm text-gray-500">{order.restaurant}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{order.amount}</div>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                <div className="text-xs text-gray-500 mt-1">{order.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
