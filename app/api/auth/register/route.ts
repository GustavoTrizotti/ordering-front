import { ApiError } from "@/lib/api/api-client"
import { authConfig } from "@/lib/auth/auth-config"
import { authService } from "@/lib/auth/auth-service"
import { createSessionToken } from "@/lib/auth/auth-session"
import { registerRequestSchema } from "@/lib/types/auth-dtos"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const credentials = registerRequestSchema.parse(body)

    const result = await authService.register(credentials)
    const token = await createSessionToken({ user: result.user })
    const response = NextResponse.json({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    })

    response.cookies.set(authConfig.sessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: authConfig.sessionDurationInSeconds,
    })

    return response
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          message: error.message,
          details: error.details,
        },
        { status: error.status }
      )
    }

    return NextResponse.json(
      {
        message: "Unable to register",
      },
      { status: 500 }
    )
  }
}
