// This file contains the API client for communicating with the Flask backend

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function for making API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "An error occurred while fetching data")
  }

  return response.json()
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  signup: async (name: string, email: string, password: string) => {
    return fetchAPI("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  },

  logout: async () => {
    return fetchAPI("/auth/logout", {
      method: "POST",
    })
  },
}

// Order API
export const orderAPI = {
  createOrder: async (orderData: any) => {
    return fetchAPI("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  },

  getOrders: async () => {
    return fetchAPI("/orders")
  },

  getOrderById: async (orderId: string) => {
    return fetchAPI(`/orders/${orderId}`)
  },

  checkStockAvailability: async (grade: string) => {
    return fetchAPI(`/stock/check?grade=${grade}`)
  },
}

// User API
export const userAPI = {
  getProfile: async () => {
    return fetchAPI("/users/profile")
  },

  updateProfile: async (userData: any) => {
    return fetchAPI("/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  },
}

