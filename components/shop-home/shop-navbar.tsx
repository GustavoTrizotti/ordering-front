"use client"

import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useAuthUser } from "@/components/auth-user-provider"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutClient } from "@/lib/auth/client-auth-actions"
import { useCartStore } from "@/lib/stores/cart-store"
import { cn } from "@/lib/utils"

type ShopNavbarProps = {
  onCartClick?: () => void
}

export function ShopNavbar({ onCartClick }: ShopNavbarProps) {
  const itemCount = useCartStore((state) => state.getItemCount())
  const pathname = usePathname()
  const user = useAuthUser()
  const avatarInitials = (user?.email.slice(0, 2) ?? "??").toUpperCase()
  const navLinks = [
    { href: "/app", label: "Shop", active: pathname === "/app" },
    {
      href: "/app/orders",
      label: "My orders",
      active: pathname.startsWith("/app/orders"),
    },
    {
      href: "/app/discounts",
      label: "Discounts",
      active: pathname.startsWith("/app/discounts"),
    },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-neutral-900 bg-black/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/app" className="flex items-center gap-3">
          <Logo fill="#fff" />
          <span className="text-xl font-bold tracking-tight text-white">
            Ordering
          </span>
        </Link>

        <div className="flex items-center gap-2 text-sm font-medium text-neutral-500">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className={cn(
                "rounded-full px-3 py-2 transition-colors hover:bg-neutral-900 hover:text-white",
                link.active &&
                  "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:text-secondary-foreground"
              )}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {onCartClick ? (
            <Button
              type="button"
              size="lg"
              onClick={onCartClick}
              className="relative h-10 rounded-full bg-white px-4 text-black hover:bg-neutral-200"
              aria-label={`Open cart with ${itemCount} items`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 ? (
                <span className="ml-1 flex min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-xs leading-5 text-white">
                  {itemCount}
                </span>
              ) : null}
            </Button>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10 rounded-full border border-neutral-800 p-0 hover:bg-neutral-900"
                aria-label="Open profile menu"
              >
                <Avatar className="size-9">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {avatarInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase">
                  Signed in as
                </p>
                <p className="mt-1 font-normal break-all text-neutral-200">
                  {user?.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => void logoutClient()}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.nav>
  )
}
