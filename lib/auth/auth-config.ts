export const authConfig = {
  sessionCookieName: "auth.ordering.session",
  loginPath: "/login",
  appPath: "/app",
  publicRoutes: ["/", "/login", "/signup"],
  privateRoutePrefixes: ["/app"],
  sessionDurationInSeconds: 60 * 60 * 24 * 7, // 7 days
} as const
