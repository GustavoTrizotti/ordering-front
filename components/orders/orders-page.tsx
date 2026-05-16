"use client"

import { useEffect, useMemo, useState } from "react"
import { useQueries } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  Ban,
  Boxes,
  CheckCircle2,
  CircleDashed,
  FileCheck2,
  ListFilter,
  Loader2,
  PackageX,
  ReceiptText,
  RotateCcw,
  ShoppingBag,
  Trash2,
  Truck,
  TicketPercent,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { ShopNavbar } from "@/components/shop-home/shop-navbar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { discountsService } from "@/lib/api/discounts-service"
import {
  ordersQueryKey,
  useApplyDiscountMutation,
  useCancelOrderMutation,
  useRemoveOrderItemMutation,
  useUpdateOrderItemQuantityMutation,
  useOrdersQuery,
} from "@/lib/api/orders-hooks"
import { ListOrdersOrderResponseDTO } from "@/lib/api/order-dtos"
import { useCartStore } from "@/lib/stores/cart-store"
import { useOrdersStore } from "@/lib/stores/orders-store"
import { cn } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"

type OrderStatusFilter = "ALL" | string

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function getOrderSubtotal(order: ListOrdersOrderResponseDTO) {
  return order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
}

function getOrderTotal(order: ListOrdersOrderResponseDTO) {
  const subtotal = getOrderSubtotal(order)
  const discountTotal = order.discounts.reduce(
    (total, discount) => total + subtotal * (discount.percentage / 100),
    0
  )

  return Math.max(0, subtotal - discountTotal)
}

function normalizeStatus(status: string) {
  return status.trim().toUpperCase()
}

function canFetchEligibleDiscounts(status: string) {
  return ![
    "CANCELLED",
    "CANCELED",
    "COMPLETED",
    "SHIPPED",
    "INVOICED",
  ].includes(normalizeStatus(status))
}

function getOrderCardClassName(status: string) {
  const normalizedStatus = normalizeStatus(status)

  if (normalizedStatus === "CANCELLED" || normalizedStatus === "CANCELED") {
    return "border-neutral-900 bg-neutral-950/45 opacity-55 shadow-none"
  }

  if (normalizedStatus === "SHIPPED") {
    return "border-white/40 bg-neutral-900 shadow-2xl shadow-white/10"
  }

  return undefined
}

function getOrderStatusBadgeClassName(status: string) {
  const normalizedStatus = normalizeStatus(status)

  if (normalizedStatus === "CANCELLED" || normalizedStatus === "CANCELED") {
    return "border-neutral-700 text-neutral-500"
  }

  if (normalizedStatus === "SHIPPED") {
    return "border-white/50 bg-white text-black"
  }

  return "border-neutral-800 text-neutral-300"
}

function getStatusIcon(status: OrderStatusFilter) {
  const normalizedStatus = normalizeStatus(status)

  if (normalizedStatus === "ALL") return ListFilter
  if (normalizedStatus === "CANCELLED" || normalizedStatus === "CANCELED") {
    return Ban
  }
  if (normalizedStatus === "COMPLETED") return CheckCircle2
  if (normalizedStatus === "SHIPPED") return Truck
  if (normalizedStatus === "INVOICED") return FileCheck2
  if (normalizedStatus === "PENDING") return CircleDashed

  return Boxes
}

export function OrdersPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const ordersQuery = useOrdersQuery()
  const cancelOrderMutation = useCancelOrderMutation()
  const applyDiscountMutation = useApplyDiscountMutation()
  const updateItemQuantityMutation = useUpdateOrderItemQuantityMutation()
  const removeOrderItemMutation = useRemoveOrderItemMutation()
  const orders = useOrdersStore((state) => state.orders)
  const setOrders = useOrdersStore((state) => state.setOrders)
  const updateOrder = useOrdersStore((state) => state.updateOrder)
  const startOrderEdit = useCartStore((state) => state.startOrderEdit)
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("ALL")
  const [quantityDrafts, setQuantityDrafts] = useState<Record<string, number>>(
    {}
  )

  const statusFilters = useMemo(
    () =>
      Array.from(new Set(orders.map((order) => normalizeStatus(order.status)))),
    [orders]
  )

  const filteredOrders = useMemo(() => {
    if (statusFilter === "ALL") return orders

    return orders.filter(
      (order) => normalizeStatus(order.status) === statusFilter
    )
  }, [orders, statusFilter])

  const discountEligibleOrders = useMemo(
    () => orders.filter((order) => canFetchEligibleDiscounts(order.status)),
    [orders]
  )

  const discountQueries = useQueries({
    queries: discountEligibleOrders.map((order) => ({
      queryKey: ["discounts", "eligible", order.orderId],
      queryFn: () =>
        discountsService.getEligibleDiscounts({ orderId: order.orderId }),
      enabled: !ordersQuery.isLoading,
    })),
  })

  const eligibleDiscountsByOrderId = useMemo(() => {
    return new Map(
      discountEligibleOrders.map((order, index) => [
        order.orderId,
        {
          isError: discountQueries[index]?.isError ?? false,
          isLoading: discountQueries[index]?.isLoading ?? false,
          discounts: discountQueries[index]?.data?.items ?? [],
        },
      ])
    )
  }, [discountEligibleOrders, discountQueries])

  function handleCancelOrder(orderId: string) {
    cancelOrderMutation.mutate(orderId, {
      onSuccess: () => {
        toast.success("Order canceled", {
          description: `Order ${orderId} was canceled.`,
        })
      },
      onError: () => {
        toast.error("Could not cancel order", {
          description: "Please try again in a moment.",
        })
      },
    })
  }

  function mergeOrder(orderId: string, nextOrder: ListOrdersOrderResponseDTO) {
    setOrders(
      orders.map((order) => (order.orderId === orderId ? nextOrder : order))
    )
    queryClient.setQueryData<ListOrdersOrderResponseDTO[]>(
      ordersQueryKey,
      (currentOrders) =>
        currentOrders?.map((order) =>
          order.orderId === orderId ? nextOrder : order
        )
    )
  }

  function handleApplyDiscount(
    order: ListOrdersOrderResponseDTO,
    discountId: string,
    percentage: number
  ) {
    const nextDiscountIds = Array.from(
      new Set([
        ...order.discounts.map((discount) => discount.discountId),
        discountId,
      ])
    )

    applyDiscountMutation.mutate(
      {
        orderId: order.orderId,
        body: {
          discountIds: nextDiscountIds,
        },
      },
      {
        onSuccess: () => {
          const nextOrder = {
            ...order,
            discounts: [
              ...order.discounts.filter(
                (discount) => discount.discountId !== discountId
              ),
              {
                discountId,
                percentage,
                discountType: "APPLIED",
              },
            ],
          }

          mergeOrder(order.orderId, nextOrder)
          queryClient.setQueryData(
            ["discounts", "eligible", order.orderId],
            (
              data:
                | { items: Array<{ discountId: string; percentage: number }> }
                | undefined
            ) =>
              data
                ? {
                    ...data,
                    items: data.items.filter(
                      (discount) => discount.discountId !== discountId
                    ),
                  }
                : data
          )
          void queryClient.invalidateQueries({
            queryKey: ["discounts", "eligible", order.orderId],
          })
          toast.success("Coupon applied", {
            description: `Discount ${discountId} was added to the order.`,
          })
        },
        onError: () => {
          toast.error("Could not apply coupon", {
            description: "Please try another coupon in a moment.",
          })
        },
      }
    )
  }

  function handleRemoveDiscount(
    order: ListOrdersOrderResponseDTO,
    discountId: string
  ) {
    applyDiscountMutation.mutate(
      {
        orderId: order.orderId,
        body: {
          discountIds: order.discounts
            .filter((discount) => discount.discountId !== discountId)
            .map((discount) => discount.discountId),
        },
      },
      {
        onSuccess: () => {
          updateOrder(order.orderId, (currentOrder) => ({
            ...currentOrder,
            discounts: currentOrder.discounts.filter(
              (discount) => discount.discountId !== discountId
            ),
          }))
          queryClient.setQueryData<ListOrdersOrderResponseDTO[]>(
            ordersQueryKey,
            (currentOrders) =>
              currentOrders?.map((currentOrder) =>
                currentOrder.orderId === order.orderId
                  ? {
                      ...currentOrder,
                      discounts: currentOrder.discounts.filter(
                        (discount) => discount.discountId !== discountId
                      ),
                    }
                  : currentOrder
              )
          )
          void queryClient.invalidateQueries({
            queryKey: ["discounts", "eligible", order.orderId],
          })
          toast.success("Coupon removed", {
            description: `Discount ${discountId} was removed from the order.`,
          })
        },
        onError: () => {
          toast.error("Could not remove coupon", {
            description: "Please try again in a moment.",
          })
        },
      }
    )
  }

  function handleUpdateItemQuantity(
    order: ListOrdersOrderResponseDTO,
    productId: string,
    quantity: number
  ) {
    updateItemQuantityMutation.mutate(
      {
        orderId: order.orderId,
        productId,
        body: { quantity },
      },
      {
        onSuccess: (response) => {
          mergeOrder(order.orderId, {
            ...order,
            items: response.items,
          })
          void queryClient.invalidateQueries({
            queryKey: ["discounts", "eligible", order.orderId],
          })
          toast.success("Quantity updated")
        },
        onError: () => {
          toast.error("Could not update quantity")
        },
      }
    )
  }

  function handleRemoveItem(
    order: ListOrdersOrderResponseDTO,
    productId: string
  ) {
    removeOrderItemMutation.mutate(
      {
        orderId: order.orderId,
        productId,
      },
      {
        onSuccess: (response) => {
          mergeOrder(order.orderId, {
            ...order,
            items: response.items,
          })
          void queryClient.invalidateQueries({
            queryKey: ["discounts", "eligible", order.orderId],
          })
          toast.success("Item removed")
        },
        onError: () => {
          toast.error("Could not remove item")
        },
      }
    )
  }

  function handleAddItems(order: ListOrdersOrderResponseDTO) {
    startOrderEdit(order.orderId)
    toast.info("Add-items mode enabled", {
      description:
        "Add products to the cart, then update this order from the cart.",
    })
    router.push("/app")
  }

  useEffect(() => {
    if (ordersQuery.data) {
      setOrders(ordersQuery.data)
    }
  }, [ordersQuery.data, setOrders])

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20">
      <ShopNavbar />

      <section className="border-b border-neutral-900 px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-7xl"
        >
          <p className="mb-3 text-xs font-medium tracking-wider text-neutral-500 uppercase">
            Incoming orders
          </p>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
                Orders
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-500">
                Review incoming orders, item totals, discounts, and cancel
                orders that should not proceed.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-neutral-800 bg-black px-5 text-white hover:bg-neutral-900"
              >
                <Link href="/app/discounts">View discounts</Link>
              </Button>
              <Button
                asChild
                className="h-11 rounded-full bg-white px-5 text-black hover:bg-neutral-200"
              >
                <Link href="/app">Back to shop</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {orders.length > 0 ? (
          <ToggleGroup
            type="single"
            value={statusFilter}
            onValueChange={(value) => {
              if (value) setStatusFilter(value)
            }}
            aria-label="Filter orders by status"
            className="mb-6"
          >
            {["ALL", ...statusFilters].map((status) => {
              const StatusIcon = getStatusIcon(status)

              return (
                <ToggleGroupItem
                  key={status}
                  value={status}
                  aria-label={`Show ${status.toLowerCase()} orders`}
                >
                  <StatusIcon className="h-4 w-4" />
                  {status === "ALL" ? "All" : status}
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        ) : null}

        {ordersQuery.isLoading ? (
          <div className="flex items-center gap-3 rounded-lg border border-neutral-900 p-5 text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading orders
          </div>
        ) : null}

        {ordersQuery.isError ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
            Could not load orders from the server.
          </div>
        ) : null}

        {!ordersQuery.isLoading && orders.length === 0 ? (
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <PackageX className="h-5 w-5 text-neutral-500" />
              <div>
                <p className="font-medium text-white">No orders yet</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Completed checkout orders will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const orderSubtotal = getOrderSubtotal(order)
            const discountState = eligibleDiscountsByOrderId.get(order.orderId)
            const eligibleDiscounts = discountState?.discounts ?? []
            const canShowCouponButton =
              canFetchEligibleDiscounts(order.status) &&
              !discountState?.isLoading &&
              !discountState?.isError &&
              eligibleDiscounts.length > 0

            return (
              <Card
                key={order.orderId}
                className={cn(
                  "overflow-hidden border-dashed",
                  getOrderCardClassName(order.status)
                )}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col justify-between gap-4 border-b border-dashed border-neutral-800 pb-5 md:flex-row md:items-start">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-neutral-500 uppercase">
                        <ReceiptText className="h-4 w-4" />
                        Receipt
                      </div>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                        {order.name}
                      </h2>
                      <p className="mt-1 max-w-xl font-mono text-xs break-all text-neutral-500">
                        ID {order.orderId}
                      </p>
                      <span
                        className={cn(
                          "mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                          getOrderStatusBadgeClassName(order.status)
                        )}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm text-neutral-500">Receipt total</p>
                      <p className="mt-1 text-2xl font-semibold">
                        {formatCurrency(getOrderTotal(order))}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-b border-dashed border-neutral-800 pb-5">
                    <p className="mb-3 text-xs font-medium tracking-wider text-neutral-500 uppercase">
                      Items
                    </p>
                    <ul className="space-y-3">
                      {order.items.map((item, itemIndex) => (
                        <li
                          key={item.productId}
                          className="grid gap-2 border-l border-neutral-800 pl-4 text-sm md:grid-cols-[1fr_auto]"
                        >
                          <div>
                            <p className="font-medium text-white">
                              • Product {itemIndex + 1}
                            </p>
                            <p className="mt-1 font-mono text-xs break-all text-neutral-500">
                              ID {item.productId}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-3 md:justify-end">
                            <p className="text-neutral-500 md:text-right">
                              Qty {item.quantity} x {formatCurrency(item.price)}
                            </p>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-8 rounded-full border-neutral-800 bg-black px-3 text-white hover:bg-neutral-900"
                                >
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Edit Product {itemIndex + 1}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Update the quantity or remove this item from{" "}
                                    {order.name}.
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-2">
                                  <p className="font-mono text-xs break-all text-neutral-500">
                                    ID {item.productId}
                                  </p>
                                  <Input
                                    type="number"
                                    min={1}
                                    value={
                                      quantityDrafts[
                                        `${order.orderId}:${item.productId}`
                                      ] ?? item.quantity
                                    }
                                    onChange={(event) =>
                                      setQuantityDrafts((drafts) => ({
                                        ...drafts,
                                        [`${order.orderId}:${item.productId}`]:
                                          Number(event.target.value),
                                      }))
                                    }
                                    className="h-10"
                                    aria-label={`Product ${itemIndex + 1} quantity`}
                                  />
                                </div>

                                <DialogFooter>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        disabled={
                                          removeOrderItemMutation.isPending
                                        }
                                        className="h-10 rounded-full border-neutral-800 bg-black text-white hover:bg-neutral-900"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        Delete item
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Delete Product {itemIndex + 1}?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This removes the item from{" "}
                                          {order.name}.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="h-10 rounded-full border-neutral-800 bg-black text-white hover:bg-neutral-900">
                                          Keep item
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleRemoveItem(
                                              order,
                                              item.productId
                                            )
                                          }
                                          className="h-10 rounded-full bg-white px-5 text-black hover:bg-neutral-200"
                                        >
                                          Delete item
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>

                                  <Button
                                    type="button"
                                    disabled={
                                      updateItemQuantityMutation.isPending
                                    }
                                    onClick={() =>
                                      handleUpdateItemQuantity(
                                        order,
                                        item.productId,
                                        quantityDrafts[
                                          `${order.orderId}:${item.productId}`
                                        ] ?? item.quantity
                                      )
                                    }
                                    className="h-10 rounded-full bg-white px-5 text-black hover:bg-neutral-200"
                                  >
                                    {updateItemQuantityMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : null}
                                    Save quantity
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Subtotal</span>
                      <span>{formatCurrency(orderSubtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Discounts</span>
                      <span>{order.discounts.length}</span>
                    </div>
                    {order.discounts.length > 0 ? (
                      <div className="space-y-2 border-t border-dashed border-neutral-800 pt-3">
                        {order.discounts.map((discount) => (
                          <div
                            key={discount.discountId}
                            className="flex flex-wrap items-center justify-between gap-2"
                          >
                            <span className="font-mono text-xs text-neutral-500">
                              {discount.discountId} · {discount.percentage}% off
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              disabled={applyDiscountMutation.isPending}
                              onClick={() =>
                                handleRemoveDiscount(order, discount.discountId)
                              }
                              className="h-8 rounded-full text-neutral-300 hover:bg-neutral-900 hover:text-white"
                            >
                              Remove coupon
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      {discountState?.isLoading ? (
                        <span className="text-sm text-neutral-500">
                          Checking coupons...
                        </span>
                      ) : canShowCouponButton ? (
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 rounded-full border-neutral-800 bg-black text-white hover:bg-neutral-900"
                            >
                              <TicketPercent className="h-4 w-4" />
                              Add discounts
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>Available coupons</DrawerTitle>
                              <DrawerDescription>
                                Eligible discounts for {order.name}.
                              </DrawerDescription>
                            </DrawerHeader>

                            <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                              {eligibleDiscounts.map((discount) => (
                                <article
                                  key={discount.discountId}
                                  className="coupon-card min-h-48 w-72 shrink-0 p-5"
                                >
                                  <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                                    <div>
                                      <p className="text-xs font-semibold tracking-wider text-[var(--coupon-muted)] uppercase">
                                        Eligible coupon
                                      </p>
                                      <h3 className="mt-2 text-4xl font-black tracking-tight text-[var(--coupon-ink)]">
                                        {discount.percentage}% off
                                      </h3>
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium tracking-widest text-[var(--coupon-muted)] uppercase">
                                        Code
                                      </p>
                                      <p className="mt-1 font-mono text-sm font-semibold break-all text-[var(--coupon-ink)]">
                                        {discount.discountId}
                                      </p>
                                      <Button
                                        type="button"
                                        onClick={() =>
                                          handleApplyDiscount(
                                            order,
                                            discount.discountId,
                                            discount.percentage
                                          )
                                        }
                                        disabled={
                                          applyDiscountMutation.isPending
                                        }
                                        className="mt-4 h-9 rounded-full bg-black px-4 text-white hover:bg-neutral-800"
                                      >
                                        {applyDiscountMutation.isPending ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : null}
                                        Apply coupon
                                      </Button>
                                    </div>
                                  </div>
                                </article>
                              ))}
                            </div>
                          </DrawerContent>
                        </Drawer>
                      ) : (
                        <span className="text-sm text-neutral-500">
                          No available coupons
                        </span>
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddItems(order)}
                        className="h-10 rounded-full border-neutral-800 bg-black text-white hover:bg-neutral-900"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add items
                      </Button>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={cancelOrderMutation.isPending}
                          className="h-10 rounded-full border-neutral-800 bg-black text-white hover:bg-neutral-900"
                        >
                          {cancelOrderMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                          Cancel order
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Cancel this order?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will mark {order.name} as canceled. You can
                            still review the receipt afterward, but it will no
                            longer be eligible for coupons.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="h-10 rounded-full border-neutral-800 bg-black text-white hover:bg-neutral-900">
                            Keep order
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancelOrder(order.orderId)}
                            className="h-10 rounded-full bg-white px-5 text-black hover:bg-neutral-200"
                          >
                            Confirm cancellation
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </main>
  )
}
