import "server-only"
import { apiRequest } from "../api/api-client"
import {
  AuthTokenResponseDTO,
  LoginRequestDTO,
  RefreshRequestDTO,
  RegisterRequestDTO,
  authTokenResponseSchema,
  loginRequestSchema,
  refreshRequestSchema,
  registerRequestSchema,
} from "../types/auth-dtos"
import { AuthUser } from "../types/auth-user-scema"
import { LoginCredentials } from "../types/login-credentials-schema"
import { LoginResult } from "../types/login-result-schema"

function getFallbackUser(
  credentials: Pick<LoginCredentials, "email">
): AuthUser {
  return {
    id: credentials.email,
    email: credentials.email,
    name: credentials.email,
  }
}

export const authService = {
  async loginWithCredentials(
    credentials: LoginCredentials
  ): Promise<LoginResult> {
    const result = await apiRequest<LoginRequestDTO, AuthTokenResponseDTO>({
      method: "POST",
      path: "/auth/login",
      requestSchema: loginRequestSchema,
      responseSchema: authTokenResponseSchema,
      body: credentials,
      auth: false,
    })

    return {
      ...result,
      user: getFallbackUser(credentials),
    }
  },

  async register(credentials: RegisterRequestDTO): Promise<LoginResult> {
    const result = await apiRequest<RegisterRequestDTO, AuthTokenResponseDTO>({
      method: "POST",
      path: "/auth/register",
      requestSchema: registerRequestSchema,
      responseSchema: authTokenResponseSchema,
      body: credentials,
      auth: false,
    })

    return {
      ...result,
      user: getFallbackUser(credentials),
    }
  },

  refresh(body: RefreshRequestDTO): Promise<AuthTokenResponseDTO> {
    return apiRequest<RefreshRequestDTO, AuthTokenResponseDTO>({
      method: "POST",
      path: "/auth/refresh",
      requestSchema: refreshRequestSchema,
      responseSchema: authTokenResponseSchema,
      body,
      auth: false,
    })
  },

  async logout(): Promise<{ success: true }> {
    return { success: true }
  },
}
