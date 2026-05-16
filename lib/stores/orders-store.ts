"use client"

import { create } from "zustand"

import { ListOrdersOrderResponseDTO } from "@/lib/api/order-dtos"

type OrdersStore = {
  orders: ListOrdersOrderResponseDTO[]
  setOrders: (orders: ListOrdersOrderResponseDTO[]) => void
  updateOrder: (
    orderId: string,
    updater: (order: ListOrdersOrderResponseDTO) => ListOrdersOrderResponseDTO
  ) => void
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  updateOrder: (orderId, updater) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.orderId === orderId ? updater(order) : order
      ),
    })),
}))
