import { NextRequest, NextResponse } from "next/server"
import { authConfig } from "./lib/auth/auth-config"
import { verifySessionToken } from "./lib/auth/auth-session"

function isPrivatePath(pathname: string): boolean {
  return authConfig.privateRoutePrefixes.some(
    (prefix) =>
      pathname.startsWith(prefix) ||
      prefix === pathname ||
      pathname.startsWith(`${prefix}/`)
  )
}

function isAuthPath(pathname: string): boolean {
  return pathname === "/login" || pathname === "/signup"
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const token = request.cookies.get(authConfig.sessionCookieName)?.value
  const session = token ? await verifySessionToken(token) : null

  const isAlreadyAuthenticated = session && isAuthPath(pathname)
  if (isAlreadyAuthenticated) {
    const appUrl = request.nextUrl.clone()
    appUrl.pathname = authConfig.appPath
    appUrl.search = ""
    return NextResponse.redirect(appUrl)
  }

  const isNextUrlInvalid = isPrivatePath(pathname) && !session
  if (isNextUrlInvalid) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = authConfig.loginPath
    loginUrl.searchParams.set("redirect_to", `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
