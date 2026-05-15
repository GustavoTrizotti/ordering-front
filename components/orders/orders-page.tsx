"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, PackageX, RotateCcw } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { ShopNavbar } from "@/components/shop-home/shop-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCancelOrderMutation, useOrdersQuery } from "@/lib/api/orders-hooks"
import { ListOrdersOrderResponseDTO } from "@/lib/api/order-dtos"
import { useOrdersStore } from "@/lib/stores/orders-store"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function getOrderTotal(order: ListOrdersOrderResponseDTO) {
  const subtotal = order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const discountTotal = order.discounts.reduce(
    (total, discount) => total + subtotal * (discount.percentage / 100),
    0
  )

  return Math.max(0, subtotal - discountTotal)
}

export function OrdersPage() {
  const ordersQuery = useOrdersQuery()
  const cancelOrderMutation = useCancelOrderMutation()
  const orders = useOrdersStore((state) => state.orders)
  const setOrders = useOrdersStore((state) => state.setOrders)

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

  useEffect(() => {
    if (ordersQuery.data) {
      setOrders(ordersQuery.data)
    }
  }, [ordersQuery.data, setOrders])

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20">
      <ShopNavbar onCartClick={() => undefined} />

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
            <Button
              asChild
              className="h-11 w-fit rounded-full bg-white px-5 text-black hover:bg-neutral-200"
            >
              <Link href="/app">Back to shop</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
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
          {orders.map((order) => (
            <Card key={order.orderId}>
              <CardContent className="p-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase">
                      Order
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                      {order.orderId}
                    </h2>
                    <span className="mt-3 inline-flex rounded-full border border-neutral-800 px-3 py-1 text-xs font-medium text-neutral-300">
                      {order.status}
                    </span>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-sm text-neutral-500">Total</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {formatCurrency(getOrderTotal(order))}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="rounded-lg border border-neutral-900 p-3 text-sm"
                    >
                      <p className="font-medium text-white">{item.productId}</p>
                      <p className="mt-1 text-neutral-500">
                        Qty {item.quantity} · {formatCurrency(item.price)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={cancelOrderMutation.isPending}
                    onClick={() => handleCancelOrder(order.orderId)}
                    className="h-10 rounded-full border-neutral-800 bg-black text-white hover:bg-neutral-900"
                  >
                    {cancelOrderMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RotateCcw className="h-4 w-4" />
                    )}
                    Cancel order
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
