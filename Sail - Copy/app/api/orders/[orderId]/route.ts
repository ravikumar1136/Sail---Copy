import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const orders = await query("SELECT * FROM orders WHERE id = ?", [orderId])
    
    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(orders[0])
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
} 