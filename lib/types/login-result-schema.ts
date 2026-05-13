import { authSessionPayloadSchema } from "./auth-session-payload-schema"

export const loginResultSchema = authSessionPayloadSchema
export type LoginResult = ReturnType<typeof loginResultSchema.parse>
