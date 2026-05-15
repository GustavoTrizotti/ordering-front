import z from "zod"

import { authUserSchema } from "./auth-user-scema"

export const loginResultSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1).optional(),
  user: authUserSchema,
})

export type LoginResult = z.infer<typeof loginResultSchema>
