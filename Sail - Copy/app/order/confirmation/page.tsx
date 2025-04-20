"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface OrderData {
  id: string
  grade: string
  thickness: string
  width: string
  length: string
  finish: string
  quality: string
  edge: string
  b_quantity: string
  customer: string
  ssp_ro_id: string
  release_date: string
  required_quantity: string
  mou: string
  remarks: string
  delivery_days: number
  expected_delivery_date: string
  status: string
  created_at: string
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")
  const [order, setOrder] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Order ID is missing")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(`/api/orders/${orderId}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }
        
        const data = await response.json()
        setOrder(data)
      } catch (error) {
        console.error("Error fetching order details:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch order details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading order details...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || "Order not found"}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Format the expected delivery date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
            <CardDescription>Your order has been successfully submitted.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Order Details</h3>
                <p><span className="font-medium">Order ID:</span> {order.id}</p>
                <p><span className="font-medium">Grade:</span> {order.grade}</p>
                <p><span className="font-medium">Thickness:</span> {order.thickness}</p>
                <p><span className="font-medium">Width:</span> {order.width}</p>
                <p><span className="font-medium">Length:</span> {order.length || "N/A"}</p>
                <p><span className="font-medium">Finish:</span> {order.finish || "N/A"}</p>
                <p><span className="font-medium">Quality:</span> {order.quality || "N/A"}</p>
                <p><span className="font-medium">Edge:</span> {order.edge || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Delivery Information</h3>
                <p><span className="font-medium">Customer:</span> {order.customer}</p>
                <p><span className="font-medium">Required Quantity:</span> {order.required_quantity}</p>
                <p><span className="font-medium">Delivery Days:</span> {order.delivery_days} days</p>
                <p><span className="font-medium">Expected Delivery:</span> {formatDate(order.expected_delivery_date)}</p>
                <p><span className="font-medium">Status:</span> {order.status}</p>
                <p><span className="font-medium">Order Date:</span> {formatDate(order.created_at)}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

