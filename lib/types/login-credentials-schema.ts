import { loginRequestSchema } from "./auth-dtos"
import type { LoginRequestDTO } from "./auth-dtos"

export const loginCredentialsSchema = loginRequestSchema

export type LoginCredentials = LoginRequestDTO
