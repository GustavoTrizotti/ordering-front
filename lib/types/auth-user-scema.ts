import z from "zod"

export const authUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
})

export type AuthUser = z.infer<typeof authUserSchema>
