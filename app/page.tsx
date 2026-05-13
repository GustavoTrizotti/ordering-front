import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Public Home</h1>

      <p className="mt-4 max-w-xl text-muted-foreground">
        This page is public. Private pages are under the /app route.
      </p>

      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/app">Go to dashboard</Link>
        </Button>
      </div>
    </main>
  )
}
