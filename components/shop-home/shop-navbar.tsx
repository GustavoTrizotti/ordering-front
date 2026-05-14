"use client"

import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { useCartStore } from "@/lib/stores/cart-store"

type ShopNavbarProps = {
  onCartClick: () => void
}

export function ShopNavbar({ onCartClick }: ShopNavbarProps) {
  const itemCount = useCartStore((state) => state.getItemCount())

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

        <div className="hidden items-center gap-7 text-sm font-medium text-neutral-500 md:flex">
          <a className="transition-colors hover:text-white" href="#featured">
            Featured
          </a>
          <a className="transition-colors hover:text-white" href="#sale">
            Sale
          </a>
          <a className="transition-colors hover:text-white" href="#new">
            New arrivals
          </a>
          <a className="transition-colors hover:text-white" href="#categories">
            Categories
          </a>
        </div>

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
      </div>
    </motion.nav>
  )
}
