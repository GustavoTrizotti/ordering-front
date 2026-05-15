"use client"

import { authTokenResponseSchema } from "@/lib/types/auth-dtos"

import {
  isJwtExpired,
  removeClientAuthTokens,
  saveClientAuthTokens,
} from "./client-auth-token"

export function getAuthErrorMessage(status: number) {
  if (status === 400) return "Check the fields and try again."
  if (status === 401) return "Invalid credentials or expired authorization."
  if (status === 404) return "The requested auth resource was not found."
  if (status === 409) return "This account already exists."
  if (status >= 500) return "The server could not finish the request."

  return "The server rejected the request."
}

export async function readAuthResponse(response: Response) {
  const payload = await response.json().catch(() => undefined)

  if (!response.ok) {
    throw new Error(getAuthErrorMessage(response.status))
  }

  const tokens = authTokenResponseSchema.parse(payload)

  if (isJwtExpired(tokens.accessToken, 0)) {
    throw new Error("The server returned an expired access token.")
  }

  saveClientAuthTokens(tokens)

  return tokens
}

export async function logoutClient() {
  removeClientAuthTokens()
  await fetch("/api/auth/logout", {
    method: "POST",
  }).catch(() => undefined)
  window.location.reload()
}
