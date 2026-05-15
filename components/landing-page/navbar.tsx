"use client"

import { useState } from "react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { LogIn, Menu, UserPlus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Logo } from "../ui/logo"

export function LandingPageNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  const navLinks = [
    { name: "Shop", href: "#shop" },
    { name: "Categories", href: "#categories" },
    { name: "Featured", href: "#featured" },
    { name: "About", href: "#about" },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 right-0 left-0 z-50 px-6 py-4 transition-all duration-300",
        isScrolled ? "py-4" : "py-6"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-full px-6 py-3 transition-all duration-300",
          "border border-neutral-800 bg-black/80 backdrop-blur-xl"
        )}
      >
        <div className="flex flex-row items-center justify-center space-x-4">
          <Link href="/">
            <Logo fill="#fff" />
          </Link>
          <Link
            href="/"
            className="relative z-50 text-2xl font-bold tracking-tight"
          >
            Ordering
          </Link>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full border border-neutral-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-900"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
            >
              <UserPlus className="h-4 w-4" />
              Sign up
            </Link>
          </div>
        </div>

        <button
          className="relative z-50 text-white md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 md:hidden"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-light text-white transition-colors hover:text-neutral-400"
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full border border-neutral-800 px-8 py-3 text-lg font-semibold text-white"
                >
                  <LogIn className="h-5 w-5" />
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-lg font-semibold text-black"
                >
                  <UserPlus className="h-5 w-5" />
                  Sign up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
