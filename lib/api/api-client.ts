import z from "zod"

import {
  formatAuthorizationToken,
  getClientAuthToken,
  isJwtExpired,
  removeClientAuthTokens,
  saveClientAuthTokens,
} from "@/lib/auth/client-auth-token"
import {
  AuthTokenResponseDTO,
  authTokenResponseSchema,
  refreshRequestSchema,
} from "@/lib/types/auth-dtos"

const serverApiBaseUrl =
  process.env.API_INTERNAL_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8080"

const browserApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

const apiBaseUrl =
  typeof window === "undefined" ? serverApiBaseUrl : browserApiBaseUrl

type ApiRequestOptions<TRequest> = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  path: string
  requestSchema?: z.ZodType<TRequest>
  responseSchema?: z.ZodType
  body?: TRequest
  auth?: boolean
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message)
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const accessToken = getClientAuthToken()
  if (!accessToken) return null

  const body = refreshRequestSchema.parse({ accessToken })
  const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    mode: "cors",
  })

  const contentType = response.headers.get("content-type") ?? ""
  const hasJsonResponse = contentType.includes("application/json")
  const data = hasJsonResponse ? await response.json() : undefined

  if (!response.ok) {
    removeClientAuthTokens()
    throw new ApiError("Session refresh failed", response.status, data)
  }

  const tokens: AuthTokenResponseDTO = authTokenResponseSchema.parse(data)
  saveClientAuthTokens(tokens)

  return tokens.accessToken
}

async function getValidAccessToken() {
  const token = getClientAuthToken()
  if (!token) return null

  if (!isJwtExpired(token)) {
    return token
  }

  const refreshedToken = await refreshAccessToken()
  if (!refreshedToken) {
    removeClientAuthTokens()
    throw new ApiError("Session expired", 401)
  }

  return refreshedToken
}

export async function apiRequest<TRequest, TResponse>({
  method = "GET",
  path,
  requestSchema,
  responseSchema,
  body,
  auth = true,
}: ApiRequestOptions<TRequest>): Promise<TResponse> {
  const headers = new Headers()
  const token = auth ? await getValidAccessToken() : null
  let requestBody: string | undefined

  if (token) {
    headers.set("authorization", formatAuthorizationToken(token))
  }

  if (body !== undefined) {
    const parsedBody = requestSchema ? requestSchema.parse(body) : body
    headers.set("Content-Type", "application/json")
    requestBody = JSON.stringify(parsedBody)
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers,
    body: requestBody,
    mode: "cors",
  })

  const contentType = response.headers.get("content-type") ?? ""
  const hasJsonResponse = contentType.includes("application/json")
  const data = hasJsonResponse ? await response.json() : undefined

  if (!response.ok) {
    throw new ApiError("API request failed", response.status, data)
  }

  if (!responseSchema) {
    return undefined as TResponse
  }

  return responseSchema.parse(data) as TResponse
}
