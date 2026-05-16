"use client"

import { createContext, PropsWithChildren, useContext } from "react"

import { AuthUser } from "@/lib/types/auth-user-scema"

const AuthUserContext = createContext<AuthUser | null>(null)

export function AuthUserProvider({
  children,
  user,
}: PropsWithChildren<{ user: AuthUser }>) {
  return (
    <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>
  )
}

export function useAuthUser() {
  return useContext(AuthUserContext)
}
