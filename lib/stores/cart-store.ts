"use client"

import { create } from "zustand"

import { ShopProduct } from "./product-store"

export type CartItem = {
  product: ShopProduct
  quantity: number
}

type CartStore = {
  items: CartItem[]
  addItem: (product: ShopProduct) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      )

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }

      return {
        items: [...state.items, { product, quantity: 1 }],
      }
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),
  clearCart: () => set({ items: [] }),
  getItemCount: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
  getSubtotal: () =>
    get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ),
}))
