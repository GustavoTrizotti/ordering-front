import "server-only"
import { LoginCredentials } from "../types/login-credentials-schema"
import { LoginResult } from "../types/login-result-schema"

// TODO: call api login endpoint sending credentials and return the result
export const authService = {
  async loginWithCredentials(
    credentials: LoginCredentials
  ): Promise<LoginResult> {
    return {
      user: {
        id: "1",
        email: credentials.email,
        name: "mocked-user-name",
      },
    }
  },
}
