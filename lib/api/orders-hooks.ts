"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  AddItemsToOrderRequestDTO,
  ApplyDiscountRequestDTO,
  ChangeOrderStatusRequestDTO,
  CreateOrderBodyDTO,
  UpdateOrderItemQuantityRequestDTO,
} from "./order-dtos"
import { ordersService } from "./orders-service"

export const ordersQueryKey = ["orders"] as const

export function useOrdersQuery() {
  return useQuery({
    queryKey: ordersQueryKey,
    queryFn: () => ordersService.list(),
  })
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateOrderBodyDTO) => ordersService.create(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ordersQueryKey })
    },
  })
}

export function useCancelOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => ordersService.cancel(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ordersQueryKey })
    },
  })
}

export function useChangeOrderStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      orderId,
      body,
    }: {
      orderId: string
      body: ChangeOrderStatusRequestDTO
    }) => ordersService.changeStatus(orderId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ordersQueryKey })
    },
  })
}

export function useAddItemsToOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      orderId,
      body,
    }: {
      orderId: string
      body: AddItemsToOrderRequestDTO
    }) => ordersService.addItems(orderId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ordersQueryKey })
    },
  })
}

export function useUpdateOrderItemQuantityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      orderId,
      productId,
      body,
    }: {
      orderId: string
      productId: string
      body: UpdateOrderItemQuantityRequestDTO
    }) => ordersService.updateItemQuantity(orderId, productId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ordersQueryKey })
    },
  })
}

export function useApplyDiscountMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      orderId,
      body,
    }: {
      orderId: string
      body: ApplyDiscountRequestDTO
    }) => ordersService.applyDiscount(orderId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ordersQueryKey })
    },
  })
}

export function useRemoveOrderItemMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      orderId,
      productId,
    }: {
      orderId: string
      productId: string
    }) => ordersService.removeItem(orderId, productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ordersQueryKey })
    },
  })
}
