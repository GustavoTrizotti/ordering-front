"use client"

import { create } from "zustand"

export type ProductSection = "featured" | "sale" | "new-arrival" | "best-seller"

export type ShopProduct = {
  id: string
  name: string
  description: string
  price: number
  previousPrice?: number
  category: string
  image: string
  sections: ProductSection[]
}

type ProductStore = {
  products: ShopProduct[]
  categories: string[]
  getProductsBySection: (section: ProductSection) => ShopProduct[]
}

const initialProducts: ShopProduct[] = [
  {
    id: "2b3c4d5e-6f70-4b2c-9d0e-1f2a3b4c5d6e",
    name: "Urban Field Jacket",
    description: "Weather-ready layers with a clean everyday silhouette.",
    price: 128,
    previousPrice: 160,
    category: "Outerwear",
    image: "/product-jacket.jpg",
    sections: ["featured", "sale", "best-seller"],
  },
  {
    id: "3c4d5e6f-7081-4c3d-0e1f-2a3b4c5d6e7f",
    name: "Signal Headphones",
    description: "Low-profile wireless audio tuned for focused workdays.",
    price: 96,
    category: "Audio",
    image: "/product-headphones.jpg",
    sections: ["featured", "new-arrival"],
  },
  {
    id: "4d5e6f70-8192-4d4e-1f2a-3b4c5d6e7f80",
    name: "Mono Watch",
    description: "A minimal steel watch with crisp contrast and quiet detail.",
    price: 142,
    previousPrice: 178,
    category: "Accessories",
    image: "/product-watch.jpg",
    sections: ["sale", "best-seller"],
  },
]

const categories = Array.from(
  new Set(initialProducts.map((product) => product.category))
)

export const useProductStore = create<ProductStore>((_set, get) => ({
  products: initialProducts,
  categories,
  getProductsBySection: (section) =>
    get().products.filter((product) => product.sections.includes(section)),
}))
