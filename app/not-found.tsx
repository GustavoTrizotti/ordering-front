import { ArrowLeft, SearchX } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-16 text-white selection:bg-white/20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(64,64,64,0.24),transparent_32rem),radial-gradient(circle_at_bottom_right,rgba(115,115,115,0.18),transparent_28rem)]" />

      <section className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950">
          <SearchX className="h-7 w-7 text-neutral-400" />
        </div>

        <div className="mb-6 flex items-center justify-center gap-3">
          <Logo fill="#fff" />
          <span className="text-2xl font-bold tracking-tight">Ordering</span>
        </div>

        <p className="mb-3 text-xs font-medium tracking-wider text-neutral-500 uppercase">
          404
        </p>
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          Page not found
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-neutral-500">
          The route you tried to open is not available. Return to the shop and
          keep the order moving from a known page.
        </p>

        <Button
          asChild
          className="mt-10 h-12 rounded-full bg-white px-6 text-black hover:bg-neutral-200"
        >
          <Link href="/app">
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>
        </Button>
      </section>
    </main>
  )
}
