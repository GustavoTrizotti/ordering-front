import "server-only"
import { AuthUser } from "../types/auth-user-scema"
import { jwtVerify, SignJWT } from "jose"
import {
  AuthSessionPayload,
  authSessionPayloadSchema,
} from "../types/auth-session-payload-schema"
import { cookies } from "next/headers"
import { authConfig } from "./auth-config"

const secret = new TextEncoder().encode(process.env.AUTH_SECRET)
if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET environment variable is not set")
}

export async function createSessionToken(payload: AuthSessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifySessionToken(
  token: string
): Promise<AuthSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    const { success, data } =
      await authSessionPayloadSchema.safeParseAsync(payload)
    if (!success) return null

    return {
      user: data.user,
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getCurrentSession(): Promise<AuthSessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(authConfig.sessionCookieName)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getCurrentSession()
  return session?.user ?? null
}
