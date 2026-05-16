"use client"

import { create } from "zustand"

import { ShopProduct } from "./product-store"

export type CartItem = {
  product: ShopProduct
  quantity: number
}

type CartStore = {
  items: CartItem[]
  editingOrderId: string | null
  editingOrderOriginalProductIds: string[]
  addItem: (product: ShopProduct) => void
  setItems: (items: CartItem[]) => void
  startOrderEdit: (orderId: string) => void
  clearOrderEdit: () => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  editingOrderId: null,
  editingOrderOriginalProductIds: [],
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
  setItems: (items) => set({ items }),
  startOrderEdit: (orderId) =>
    set({
      editingOrderId: orderId,
      editingOrderOriginalProductIds: [],
      items: [],
    }),
  clearOrderEdit: () =>
    set({ editingOrderId: null, editingOrderOriginalProductIds: [] }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0),
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
