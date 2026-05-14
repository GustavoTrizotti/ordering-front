import z from "zod"

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

type ApiRequestOptions<TRequest> = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  path: string
  requestSchema?: z.ZodType<TRequest>
  responseSchema?: z.ZodType
  body?: TRequest
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

export async function apiRequest<TRequest, TResponse>({
  method = "GET",
  path,
  requestSchema,
  responseSchema,
  body,
}: ApiRequestOptions<TRequest>): Promise<TResponse> {
  const headers = new Headers()
  let requestBody: string | undefined

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
    credentials: "include",
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
