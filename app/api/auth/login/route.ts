import { authConfig } from "@/lib/auth/auth-config"
import { authService } from "@/lib/auth/auth-service"
import { createSessionToken } from "@/lib/auth/auth-session"
import { loginCredentialsSchema } from "@/lib/types/login-credentials-schema"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const credentials = loginCredentialsSchema.parse(body)

    const result = await authService.loginWithCredentials(credentials)
    const token = await createSessionToken({ user: result.user })
    const response = NextResponse.json({
      user: result.user,
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
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      {
        message: error,
      },
      { status: 500 }
    )
  }
}
