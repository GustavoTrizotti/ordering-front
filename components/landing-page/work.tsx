"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const products = [
  {
    title: "Premium Headphones",
    category: "Electronics",
    price: "$299",
    originalPrice: "$399",
    image: "/product-headphones.jpg",
  },
  {
    title: "Designer Watch",
    category: "Accessories",
    price: "$549",
    originalPrice: "$699",
    image: "/product-watch.jpg",
  },
  {
    title: "Leather Jacket",
    category: "Fashion",
    price: "$189",
    originalPrice: "$249",
    image: "/product-jacket.jpg",
  },
]

export function LandingPageWork() {
  return (
    <section id="featured" className="relative overflow-hidden py-32">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[80vw] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-900/50 blur-[150px]" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 text-4xl font-bold md:text-6xl"
            >
              Featured Products
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="max-w-md text-xl text-neutral-500"
            >
              Hand-picked selections with exclusive discounts.
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-full border border-neutral-800 px-6 py-3 text-sm font-medium transition-colors hover:bg-neutral-900"
          >
            View All Products
          </motion.button>
        </div>

        <div className="space-y-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-0 transition-all duration-300 hover:border-neutral-700">
                <div className="grid gap-0 md:grid-cols-2">
                  <div className="relative flex flex-col justify-center overflow-hidden p-12">
                    <div className="relative z-10">
                      <span className="mb-4 block text-sm font-medium tracking-wider text-neutral-600 uppercase">
                        {product.category}
                      </span>
                      <h3 className="mb-6 text-4xl font-bold transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                        {product.title}
                      </h3>
                      <div className="mb-8 flex items-center gap-4">
                        <span className="text-3xl font-bold text-white">
                          {product.price}
                        </span>
                        <span className="text-xl text-neutral-600 line-through">
                          {product.originalPrice}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-black">
                          Sale
                        </span>
                      </div>
                      <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-neutral-200">
                        View Details
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="relative h-100 overflow-hidden bg-neutral-800 md:h-auto">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-neutral-900 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
