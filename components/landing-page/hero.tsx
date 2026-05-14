"use client"

import { motion } from "framer-motion"
import { ArrowRight, Truck, Shield, CreditCard } from "lucide-react"

export function LandingPageHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-neutral-800/30 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[40vw] w-[40vw] rounded-full bg-neutral-700/20 blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
            <span className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
              Free shipping on orders over $50
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-gradient mb-8 text-5xl font-bold tracking-tighter md:text-7xl lg:text-9xl"
        >
          Shop
          <br />
          Smarter
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-neutral-500 md:text-xl"
        >
          Discover curated collections, exclusive deals, and a seamless shopping
          experience. Your perfect purchase is just a click away.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-semibold text-black transition-all hover:scale-105">
            <span className="relative z-10 flex items-center gap-2">
              Start Shopping{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          <button className="rounded-full border border-neutral-800 bg-neutral-900 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:bg-neutral-800">
            View Collections
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-neutral-900 pt-16"
        >
          <div className="flex items-center gap-3 text-neutral-500">
            <Truck className="h-5 w-5" />
            <span className="text-sm">Fast Delivery</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-500">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Secure Checkout</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-500">
            <CreditCard className="h-5 w-5" />
            <span className="text-sm">Easy Returns</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest text-neutral-600 uppercase">
          Scroll
        </span>
        <div className="h-12 w-px bg-linear-to-b from-transparent via-neutral-600 to-transparent" />
      </motion.div>
    </section>
  )
}
