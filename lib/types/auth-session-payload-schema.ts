import z from "zod"
import { authUserSchema } from "./auth-user-scema"

export const authSessionPayloadSchema = z.object({
  user: authUserSchema,
})

export type AuthSessionPayload = z.infer<typeof authSessionPayloadSchema>
