import z from "zod"

const tokenSchema = z.string().min(1)

export const loginRequestSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(3, "Password must contain at least 3 characters"),
  })
  .strict()

export const registerRequestSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(3, "Password must contain at least 3 characters"),
  })
  .strict()

export const refreshRequestSchema = z
  .object({
    accessToken: tokenSchema,
  })
  .strict()

export const authTokenResponseSchema = z
  .object({
    accessToken: tokenSchema,
  })
  .passthrough()

export type LoginRequestDTO = z.input<typeof loginRequestSchema>
export type RegisterRequestDTO = z.input<typeof registerRequestSchema>
export type RefreshRequestDTO = z.infer<typeof refreshRequestSchema>
export type AuthTokenResponseDTO = z.infer<typeof authTokenResponseSchema>
