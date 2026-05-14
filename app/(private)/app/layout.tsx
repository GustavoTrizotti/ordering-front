import { authConfig } from "@/lib/auth/auth-config"
import { getCurrentUser } from "@/lib/auth/auth-session"
import { redirect } from "next/navigation"
import { PropsWithChildren } from "react"

export default async function AppLayout({ children }: PropsWithChildren) {
  const user = await getCurrentUser()
  if (!user) {
    redirect(authConfig.loginPath)
  }

  return <>{children}</>
}
