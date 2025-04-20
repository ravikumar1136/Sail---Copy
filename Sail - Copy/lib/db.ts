import { v4 as uuidv4 } from 'uuid';

// Mock data for orders
let orders: any[] = [
  {
    id: "1",
    user_id: "anonymous",
    grade: "304",
    thickness: 2.0,
    width: 1000,
    length: 2000,
    finish: "2B",
    quality: "Prime",
    edge: "Mill",
    customer: "ABC Corp",
    required_quantity: 5,
    delivery_days: 1,
    expected_delivery: "2023-05-15",
    status: "pending",
    created_at: "2023-05-10"
  }
];

// Mock data for stock
let stockData: any[] = [
  {
    id: "1",
    grade: "304",
    thickness: 2.0,
    width: 1000,
    length: 2000,
    finish: "2B",
    quality: "Prime",
    edge: "Mill",
    quantity: 10,
    created_at: "2023-05-01"
  }
];

// Track initialization state
let isDbInitialized = false;

// Function to initialize the database (mock)
export async function initDatabase() {
  // Skip if already initialized
  if (isDbInitialized) {
    return true;
  }
  
  try {
    // Simulate database initialization
    await new Promise(resolve => setTimeout(resolve, 100));
    isDbInitialized = true;
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
}

// Helper function to execute queries (mock)
export function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  // Simple mock implementation
  if (sql.includes("SELECT * FROM orders")) {
    return Promise.resolve(orders as T[]);
  } else if (sql.includes("SELECT * FROM stock_data")) {
    return Promise.resolve(stockData as T[]);
  } else if (sql.includes("WHERE id = ?")) {
    const id = params[0];
    const result = orders.filter(order => order.id === id);
    return Promise.resolve(result as T[]);
  } else if (sql.includes("WHERE grade = ?")) {
    // Mock stock data query
    const [grade, thickness, width, length, finish, quality, edge] = params;
    const result = stockData.filter(item => 
      item.grade === grade && 
      item.thickness === thickness && 
      item.width === width && 
      item.length === length && 
      item.finish === finish && 
      item.quality === quality && 
      item.edge === edge
    );
    return Promise.resolve(result as T[]);
  }
  
  return Promise.resolve([] as T[]);
}

// Helper function to execute statements (mock)
export function execute(sql: string, params: any[] = []): Promise<{ changes: number; lastInsertRowid: number }> {
  if (sql.includes("INSERT INTO orders")) {
    const newOrder = {
      id: params[0],
      user_id: params[12],
      grade: params[1],
      thickness: params[2],
      width: params[3],
      length: params[4],
      finish: params[5],
      quality: params[6],
      edge: params[7],
      customer: params[8],
      required_quantity: params[9],
      delivery_days: params[10],
      status: params[11],
      created_at: new Date().toISOString().split('T')[0]
    };
    orders.push(newOrder);
    return Promise.resolve({ changes: 1, lastInsertRowid: 1 });
  }
  
  return Promise.resolve({ changes: 0, lastInsertRowid: 0 });
}

// Helper function to generate UUID
export function generateId(): string {
  return uuidv4();
}

// Export mock database instance
export const db = {
  prepare: (sql: string) => ({
    all: () => Promise.resolve([]),
    get: () => Promise.resolve(null),
    run: () => Promise.resolve({ changes: 0, lastInsertRowid: 0 })
  })
};

