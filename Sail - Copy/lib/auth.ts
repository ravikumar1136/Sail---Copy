import type { JWTPayload } from "jose"
import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Extend jose's JWTPayload so we can have custom fields (id, email, name).
export interface UserJwtPayload extends JWTPayload {
  id: string
  email: string
  name: string
}

// Create a JWT token
export async function createToken(payload: UserJwtPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(JWT_SECRET))
  return token
}

// Verify a JWT token
export async function verifyToken(token: string): Promise<UserJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return payload as UserJwtPayload
  } catch (error) {
    return null
  }
}

/**
 * Set the auth cookie on a NextResponse by manipulating Set-Cookie header.
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  const cookieValue = `auth_token=${token}; HttpOnly; Path=/; Max-Age=${
    60 * 60 * 24
  }; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`
  response.headers.set("Set-Cookie", cookieValue)
}

/**
 * Remove the auth cookie from a NextResponse by setting Max-Age=0.
 */
export function removeAuthCookie(response: NextResponse): void {
  response.headers.set("Set-Cookie", "auth_token=; HttpOnly; Path=/; Max-Age=0")
}

/**
 * Get auth cookie by awaiting cookies().
 * This removes the \"cookies() should be awaited\" warning.
 */
export async function getAuthCookie(): Promise<string | undefined> {
  // Next.js wants us to await cookies() in certain route contexts
  const cookieStore = await cookies()
  return cookieStore.get("auth_token")?.value
}

/**
 * Get current user from token.
 */
export async function getCurrentUser(): Promise<UserJwtPayload | null> {
  const token = await getAuthCookie()
  if (!token) {
    return null
  }
  return verifyToken(token)
}

/**
 * Middleware to protect routes. If no valid token, redirect to /login.
 */
export async function authMiddleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  const user = await verifyToken(token)
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
