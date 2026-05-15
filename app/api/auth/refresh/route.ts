import { ApiError } from "@/lib/api/api-client"
import { authService } from "@/lib/auth/auth-service"
import { refreshRequestSchema } from "@/lib/types/auth-dtos"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const refreshRequest = refreshRequestSchema.parse(body)
    const result = await authService.refresh(refreshRequest)

    return NextResponse.json(result)
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
        message: "Unable to refresh session",
      },
      { status: 500 }
    )
  }
}
