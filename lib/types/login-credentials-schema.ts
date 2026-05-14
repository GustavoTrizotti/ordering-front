import z from "zod"

export const loginCredentialsSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(3, "Password must contain at least 3 characters"),
})

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>
