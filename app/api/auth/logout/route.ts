import { authConfig } from "@/lib/auth/auth-config"
import { authService } from "@/lib/auth/auth-service"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await authService.logout()
  } catch {
    // The local session should still be removed if the upstream logout fails.
  }

  const response = NextResponse.json({
    success: true,
  })

  response.cookies.delete(authConfig.sessionCookieName)
  return response
}
