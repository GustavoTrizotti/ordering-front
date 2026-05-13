import { authConfig } from "@/lib/auth/auth-config"
import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({
    success: true,
  })

  response.cookies.delete(authConfig.sessionCookieName)
  return response
}
