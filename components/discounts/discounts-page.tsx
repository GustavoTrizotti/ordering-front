"use client"

import { useMemo } from "react"
import { useQueries } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { BadgePercent, Loader2, TicketPercent } from "lucide-react"
import Link from "next/link"

import { ShopNavbar } from "@/components/shop-home/shop-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { discountsService } from "@/lib/api/discounts-service"
import { useOrdersQuery } from "@/lib/api/orders-hooks"
import { ListOrdersOrderResponseDTO } from "@/lib/api/order-dtos"

function normalizeStatus(status: string) {
  return status.trim().toUpperCase()
}

function isActiveOrder(order: ListOrdersOrderResponseDTO) {
  const status = normalizeStatus(order.status)

  return (
    status !== "CANCELLED" &&
    status !== "CANCELED" &&
    status !== "COMPLETED" &&
    status !== "SHIPPED" &&
    status !== "INVOICED"
  )
}

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

function getItemCount(order: ListOrdersOrderResponseDTO) {
  return order.items.reduce((total, item) => total + item.quantity, 0)
}

export function DiscountsPage() {
  const ordersQuery = useOrdersQuery()
  const activeOrders = useMemo(
    () => (ordersQuery.data ?? []).filter(isActiveOrder),
    [ordersQuery.data]
  )
  const discountQueries = useQueries({
    queries: activeOrders.map((order) => ({
      queryKey: ["discounts", "eligible", order.orderId],
      queryFn: () =>
        discountsService.getEligibleDiscounts({ orderId: order.orderId }),
      enabled: !ordersQuery.isLoading,
    })),
  })

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
            Eligible savings
          </p>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
                Discounts
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-500">
                Coupon-ready discounts for active orders only. Canceled and
                completed, shipped, or invoiced orders stay out of this view.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-neutral-800 bg-black px-5 text-white hover:bg-neutral-900"
              >
                <Link href="/app/orders">My orders</Link>
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
        {ordersQuery.isLoading ? (
          <div className="flex items-center gap-3 rounded-lg border border-neutral-900 p-5 text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading active orders
          </div>
        ) : null}

        {ordersQuery.isError ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
            Could not load orders from the server.
          </div>
        ) : null}

        {!ordersQuery.isLoading && activeOrders.length === 0 ? (
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <TicketPercent className="h-5 w-5 text-neutral-500" />
              <div>
                <p className="font-medium text-white">No active orders</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Eligible discounts appear here while an order is still active.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="space-y-8">
          {activeOrders.map((order, orderIndex) => {
            const discountQuery = discountQueries[orderIndex]
            const discounts = discountQuery.data?.items ?? []
            const subtotal = getOrderSubtotal(order)

            return (
              <section key={order.orderId} className="space-y-4">
                <div className="flex flex-col justify-between gap-3 border-b border-neutral-900 pb-4 md:flex-row md:items-end">
                  <div>
                    <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase">
                      Active order ID
                    </p>
                    <p className="mt-1 max-w-xl font-mono text-xs break-all text-neutral-500">
                      {order.orderId}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      {order.name}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-neutral-400">
                    <span className="rounded-full border border-neutral-800 px-3 py-1">
                      {order.status}
                    </span>
                    <span className="rounded-full border border-neutral-800 px-3 py-1">
                      {getItemCount(order)} items
                    </span>
                    <span className="rounded-full border border-neutral-800 px-3 py-1">
                      {formatCurrency(subtotal)} subtotal
                    </span>
                  </div>
                </div>

                {discountQuery.isLoading ? (
                  <div className="flex items-center gap-3 rounded-lg border border-neutral-900 p-5 text-neutral-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking discounts
                  </div>
                ) : null}

                {discountQuery.isError ? (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
                    Could not load eligible discounts for this order.
                  </div>
                ) : null}

                {!discountQuery.isLoading &&
                !discountQuery.isError &&
                discounts.length === 0 ? (
                  <div className="rounded-lg border border-neutral-900 p-5 text-sm text-neutral-500">
                    No eligible discounts for this active order yet.
                  </div>
                ) : null}

                {discounts.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {discounts.map((discount) => (
                      <article
                        key={discount.discountId}
                        className="coupon-card min-h-48 p-5"
                      >
                        <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold tracking-wider text-[var(--coupon-muted)] uppercase">
                                Eligible coupon
                              </p>
                              <h3 className="mt-2 text-4xl font-black tracking-tight text-[var(--coupon-ink)]">
                                {discount.percentage}% off
                              </h3>
                            </div>
                            <BadgePercent className="h-8 w-8 shrink-0 text-[var(--coupon-accent)]" />
                          </div>

                          <div>
                            <p className="text-xs font-medium tracking-widest text-[var(--coupon-muted)] uppercase">
                              Code
                            </p>
                            <p className="mt-1 font-mono text-sm font-semibold break-all text-[var(--coupon-ink)]">
                              {discount.discountId}
                            </p>
                            <p className="mt-3 text-sm text-[var(--coupon-muted)]">
                              Estimated savings:{" "}
                              {formatCurrency(
                                subtotal * (discount.percentage / 100)
                              )}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </section>
            )
          })}
        </div>
      </section>
    </main>
  )
}
