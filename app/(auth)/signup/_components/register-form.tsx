"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/ui/logo"
import {
  getAuthErrorMessage,
  readAuthResponse,
} from "@/lib/auth/client-auth-actions"
import {
  RegisterRequestDTO,
  registerRequestSchema,
} from "@/lib/types/auth-dtos"

export function RegisterForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequestDTO>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  })

  async function onSubmit(credentials: RegisterRequestDTO) {
    setServerError(null)

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      setServerError(getAuthErrorMessage(response.status))
      return
    }

    try {
      await readAuthResponse(response)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save auth session."
      setServerError(message)
      return
    }

    toast.success("Account created", {
      description: "Your session is ready.",
    })
    router.replace("/app")
    router.refresh()
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-16 text-white selection:bg-white/20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(64,64,64,0.24),transparent_32rem),radial-gradient(circle_at_bottom_right,rgba(115,115,115,0.18),transparent_28rem)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-neutral-900/50 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>

        <Card>
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="mb-3 flex items-center gap-3"
            >
              <Logo fill="#fff" />
              <span className="text-2xl font-bold tracking-tight">
                Ordering
              </span>
            </motion.div>
            <CardTitle>Create account</CardTitle>
            <CardDescription>
              Register to start ordering and keep your checkout session ready.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                {errors.password ? (
                  <p className="text-sm text-red-400">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              {serverError ? (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{serverError}</p>
                </div>
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full rounded-full bg-white text-base font-semibold text-black hover:bg-neutral-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account
                  </>
                ) : (
                  <>
                    Sign up
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
