"use client"

import { motion } from "framer-motion"
import { Shirt, Watch, Headphones, Gift } from "lucide-react"

const categories = [
  {
    icon: <Shirt className="h-8 w-8 text-white" />,
    title: "Fashion",
    description:
      "Discover the latest trends in clothing and accessories. From casual wear to formal attire.",
    count: "2,500+ items",
  },
  {
    icon: <Watch className="h-8 w-8 text-white" />,
    title: "Accessories",
    description:
      "Elevate your style with premium watches, jewelry, and fashion accessories.",
    count: "1,200+ items",
  },
  {
    icon: <Headphones className="h-8 w-8 text-white" />,
    title: "Electronics",
    description:
      "Latest gadgets and tech essentials for your modern lifestyle.",
    count: "800+ items",
  },
  {
    icon: <Gift className="h-8 w-8 text-white" />,
    title: "Gifts",
    description:
      "Perfect presents for every occasion. Curated gift sets and exclusive bundles.",
    count: "500+ items",
  },
]

export function LandingPageServices() {
  return (
    <section id="categories" className="relative py-32">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-4xl font-bold md:text-6xl"
          >
            Shop by Category
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "100px" }}
            viewport={{ once: true }}
            className="h-1 rounded-full bg-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="group flex h-full cursor-pointer flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700">
                <div>
                  <div className="mb-6 w-fit rounded-xl bg-neutral-800 p-4 transition-colors group-hover:bg-neutral-700">
                    {category.icon}
                  </div>
                  <h3 className="mb-4 text-2xl font-semibold">
                    {category.title}
                  </h3>
                  <p className="leading-relaxed text-neutral-500">
                    {category.description}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-sm text-neutral-600">
                    {category.count}
                  </span>
                  <div className="flex items-center gap-2 text-sm font-medium text-neutral-400 transition-colors group-hover:text-white">
                    Explore{" "}
                    <div className="h-px w-4 bg-current transition-all group-hover:w-8" />
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
