"use client"

import { create } from "zustand"

import { ListOrdersOrderResponseDTO } from "@/lib/api/order-dtos"

type OrdersStore = {
  orders: ListOrdersOrderResponseDTO[]
  setOrders: (orders: ListOrdersOrderResponseDTO[]) => void
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
}))
