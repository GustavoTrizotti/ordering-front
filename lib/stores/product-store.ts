"use client"

import { create } from "zustand"

export type ProductSection =
  | "featured"
  | "sale"
  | "new-arrival"
  | "best-seller"

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
    id: "urban-field-jacket",
    name: "Urban Field Jacket",
    description: "Weather-ready layers with a clean everyday silhouette.",
    price: 128,
    previousPrice: 160,
    category: "Outerwear",
    image: "/product-jacket.jpg",
    sections: ["featured", "sale", "best-seller"],
  },
  {
    id: "signal-headphones",
    name: "Signal Headphones",
    description: "Low-profile wireless audio tuned for focused workdays.",
    price: 96,
    category: "Audio",
    image: "/product-headphones.jpg",
    sections: ["featured", "new-arrival"],
  },
  {
    id: "mono-watch",
    name: "Mono Watch",
    description: "A minimal steel watch with crisp contrast and quiet detail.",
    price: 142,
    previousPrice: 178,
    category: "Accessories",
    image: "/product-watch.jpg",
    sections: ["sale", "best-seller"],
  },
  {
    id: "commuter-pack",
    name: "Commuter Pack",
    description: "Compact storage for daily routes, devices, and essentials.",
    price: 88,
    category: "Bags",
    image: "/product-jacket.jpg",
    sections: ["new-arrival", "best-seller"],
  },
  {
    id: "studio-tee",
    name: "Studio Tee",
    description: "Soft heavyweight cotton with a structured black finish.",
    price: 42,
    previousPrice: 56,
    category: "Essentials",
    image: "/product-headphones.jpg",
    sections: ["sale", "new-arrival"],
  },
  {
    id: "travel-organizer",
    name: "Travel Organizer",
    description: "Slim modular carry for chargers, cards, and small gear.",
    price: 38,
    category: "Accessories",
    image: "/product-watch.jpg",
    sections: ["featured", "best-seller"],
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
