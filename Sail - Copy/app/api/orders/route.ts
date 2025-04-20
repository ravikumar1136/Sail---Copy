import { NextRequest, NextResponse } from "next/server"
import { db, query, execute, generateId } from "@/lib/db"

/**
 * Helper function to format a Date into MySQL datetime format:
 * "YYYY-MM-DD HH:MM:SS"
 */
function formatDateForMysql(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ")
}

// Define the stock data interface
interface StockData {
  id: string;
  grade: string;
  thickness: number;
  width: number;
  length: number;
  finish: string;
  quality: string;
  edge: string;
  quantity: number;
  created_at: string;
}

export async function GET() {
  try {
    const orders = await query("SELECT * FROM orders ORDER BY created_at DESC")
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      grade,
      thickness,
      width,
      length,
      finish,
      quality,
      edge,
      customer,
      requiredQuantity,
    } = data

    // Validate required fields
    if (!grade || !thickness || !width || !length || !finish || !quality || !edge || !customer || !requiredQuantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get stock data for delivery days calculation
    const stockData = await query<StockData>(`
      SELECT * FROM stock_data 
      WHERE grade = ? AND thickness = ? AND width = ? AND length = ? AND finish = ? AND quality = ? AND edge = ?
    `, [grade, thickness, width, length, finish, quality, edge])

    if (!stockData || stockData.length === 0) {
      return NextResponse.json(
        { error: "Stock data not found for the specified parameters" },
        { status: 404 }
      )
    }

    // Calculate delivery days based on stock data
    const deliveryDays = stockData[0].quantity >= requiredQuantity ? 1 : 7

    // Insert the order
    const orderId = generateId()
    const result = await execute(`
      INSERT INTO orders (
        id, grade, thickness, width, length, finish, quality, edge,
        customer, required_quantity, delivery_days, status, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderId,
      grade,
      thickness,
      width,
      length,
      finish,
      quality,
      edge,
      customer,
      requiredQuantity,
      deliveryDays,
      "pending",
      "anonymous"
    ])

    return NextResponse.json({ 
      message: "Order created successfully",
      orderId: orderId
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
