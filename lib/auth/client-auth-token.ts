import { decodeJwt } from "jose"

export const authTokenStorageKey = "ordering.auth.token"
export const refreshTokenStorageKey = "ordering.auth.refresh-token"

export function getClientAuthToken() {
  if (typeof window === "undefined") return null

  return window.localStorage.getItem(authTokenStorageKey)
}

export function getClientRefreshToken() {
  if (typeof window === "undefined") return null

  return window.localStorage.getItem(refreshTokenStorageKey)
}

export function saveClientAuthTokens(tokens: {
  accessToken: string
  refreshToken?: string
}) {
  window.localStorage.setItem(authTokenStorageKey, tokens.accessToken)

  if (tokens.refreshToken) {
    window.localStorage.setItem(refreshTokenStorageKey, tokens.refreshToken)
  }
}

export function removeClientAuthTokens() {
  window.localStorage.removeItem(authTokenStorageKey)
  window.localStorage.removeItem(refreshTokenStorageKey)
}

export function formatAuthorizationToken(token: string) {
  return token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`
}

export function isJwtExpired(token: string, leewayInMs = 30_000) {
  try {
    const { exp } = decodeJwt(token)
    if (!exp) return true

    return exp * 1000 <= Date.now() + leewayInMs
  } catch {
    return true
  }
}
