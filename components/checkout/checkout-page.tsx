"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, PackageCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { useQueryClient } from "@tanstack/react-query"

import { ShopNavbar } from "@/components/shop-home/shop-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ordersQueryKey,
  useAddItemsToOrderMutation,
  useCreateOrderMutation,
} from "@/lib/api/orders-hooks"
import { ListOrdersOrderResponseDTO } from "@/lib/api/order-dtos"
import { useCartStore } from "@/lib/stores/cart-store"
import { useOrdersStore } from "@/lib/stores/orders-store"

const checkoutSchema = z.object({
  customerId: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

type Customer = {
  customerId: string
  name: string
}

const customers: Customer[] = [
  {
    customerId: "0f0b3a9e-7d44-4c1b-9c1e-6a9a2b3c4d5e",
    name: "Customer Alpha",
  },
  {
    customerId: "1a2b3c4d-5e6f-4a1b-8c9d-0e1f2a3b4c5d",
    name: "Customer Beta",
  },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export function CheckoutPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const createOrderMutation = useCreateOrderMutation()
  const addItemsToOrderMutation = useAddItemsToOrderMutation()
  const updateOrder = useOrdersStore((state) => state.updateOrder)
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const editingOrderId = useCartStore((state) => state.editingOrderId)
  const editingOrderOriginalProductIds = useCartStore(
    (state) => state.editingOrderOriginalProductIds
  )
  const clearOrderEdit = useCartStore((state) => state.clearOrderEdit)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const didRedirectEmptyCart = useRef(false)
  const [selectedProductIds, setSelectedProductIds] = useState(
    () => new Set(items.map((item) => item.product.id))
  )

  const selectedItems = useMemo(
    () => items.filter((item) => selectedProductIds.has(item.product.id)),
    [items, selectedProductIds]
  )
  const selectedTotal = selectedItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerId: "",
      street: "",
      number: "",
      city: "",
      state: "",
      postalCode: "",
    },
  })

  useEffect(() => {
    if (items.length > 0 || didRedirectEmptyCart.current) return

    didRedirectEmptyCart.current = true
    toast.error("Permission denied", {
      description: "Add at least one item to your cart before checkout.",
    })
    router.replace("/app")
  }, [items.length, router])

  function toggleItem(productId: string) {
    setSelectedProductIds((currentIds) => {
      const nextIds = new Set(currentIds)

      if (nextIds.has(productId)) {
        nextIds.delete(productId)
        toast.info("Item unselected", {
          description: "It will not be included in this order.",
        })
      } else {
        nextIds.add(productId)
        toast.success("Item selected", {
          description: "It will be included in this order.",
        })
      }

      return nextIds
    })
  }

  async function onSubmit(values: CheckoutFormValues) {
    if (selectedItems.length === 0) return

    try {
      const orderItems = selectedItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }))

      if (editingOrderId) {
        const newOrderItems = orderItems.filter(
          (item) => !editingOrderOriginalProductIds.includes(item.productId)
        )

        if (newOrderItems.length === 0) {
          toast.error("No new items selected", {
            description:
              "Add at least one product that is not already in this order.",
          })
          return
        }

        const response = await addItemsToOrderMutation.mutateAsync({
          orderId: editingOrderId,
          body: {
            items: newOrderItems,
          },
        })
        updateOrder(editingOrderId, (order) => ({
          ...order,
          items: response.items,
        }))
        queryClient.setQueryData<ListOrdersOrderResponseDTO[]>(
          ordersQueryKey,
          (orders) =>
            orders?.map((order) =>
              order.orderId === editingOrderId
                ? {
                    ...order,
                    items: response.items,
                  }
                : order
            )
        )
      } else {
        const requiredValues = [
          values.customerId,
          values.street,
          values.number,
          values.city,
          values.state,
          values.postalCode,
        ]

        if (requiredValues.some((value) => !value?.trim())) {
          toast.error("Complete the order details", {
            description: "Customer and address are required for new orders.",
          })
          return
        }

        await createOrderMutation.mutateAsync({
          customerId: values.customerId!,
          street: values.street!,
          number: values.number!,
          city: values.city!,
          state: values.state!,
          postalCode: values.postalCode!,
          items: orderItems,
        })
      }
    } catch {
      toast.error(
        editingOrderId ? "Could not update order" : "Could not register order",
        {
          description: "Please review the order and try again.",
        }
      )
      return
    }

    clearCart()
    clearOrderEdit()
    toast.success(editingOrderId ? "Order updated" : "Order registered", {
      description: editingOrderId
        ? "The selected items were sent to the existing order."
        : "Your order was sent to the server.",
    })
    router.push("/app/orders")
  }

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
          <Link
            href="/app"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>
          <p className="mb-3 text-xs font-medium tracking-wider text-neutral-500 uppercase">
            {editingOrderId ? "Update order items" : "Register order"}
          </p>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
            {editingOrderId
              ? "Add products to an existing order."
              : "Confirm customer, address, and items."}
          </h1>
        </motion.div>
      </section>

      <form
        className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1fr_25rem]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="grid gap-5 p-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="customerId">Customer</Label>
                <Controller
                  control={control}
                  name="customerId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="customerId"
                        aria-invalid={Boolean(errors.customerId)}
                        className="h-10 w-full border-neutral-800 bg-black px-3 text-white focus-visible:border-white/70 focus-visible:ring-white/10 aria-invalid:border-red-500/70 aria-invalid:ring-red-500/20"
                      >
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent className="border border-neutral-800 bg-black text-white">
                        {customers.map((customer) => (
                          <SelectItem
                            key={customer.customerId}
                            value={customer.customerId}
                            className="text-white focus:bg-neutral-900 focus:text-white"
                          >
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.customerId ? (
                  <p className="text-sm text-red-400">
                    {errors.customerId.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  placeholder="Market Street"
                  aria-invalid={Boolean(errors.street)}
                  {...register("street")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Number</Label>
                <Input
                  id="number"
                  placeholder="120"
                  aria-invalid={Boolean(errors.number)}
                  {...register("number")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Sao Paulo"
                  aria-invalid={Boolean(errors.city)}
                  {...register("city")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="SP"
                  aria-invalid={Boolean(errors.state)}
                  {...register("state")}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="postalCode">Postal code</Label>
                <Input
                  id="postalCode"
                  placeholder="01000-000"
                  aria-invalid={Boolean(errors.postalCode)}
                  {...register("postalCode")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase">
                    Item selection
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                    Cart items
                  </h2>
                </div>
              </div>

              {items.length === 0 ? (
                <div className="rounded-lg border border-neutral-900 p-5 text-sm text-neutral-500">
                  Your cart is empty. Add products before registering an order.
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex flex-col gap-4 rounded-lg border border-neutral-900 p-4 sm:flex-row sm:items-center"
                    >
                      <label className="flex flex-1 items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.has(item.product.id)}
                          onChange={() => toggleItem(item.product.id)}
                          className="size-4 accent-white"
                        />
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-900">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover grayscale"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="mt-1 text-sm text-neutral-500">
                            {formatCurrency(item.product.price)}
                          </p>
                        </div>
                      </label>

                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) =>
                          updateQuantity(
                            item.product.id,
                            Number(event.target.value)
                          )
                        }
                        className="w-24"
                        aria-label={`${item.product.name} quantity`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardContent className="p-6">
            <PackageCheck className="mb-5 h-6 w-6 text-neutral-500" />
            <h2 className="text-2xl font-semibold tracking-tight">
              Order summary
            </h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Selected items</span>
                <span>{selectedItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatCurrency(selectedTotal)}</span>
              </div>
            </div>

            {createOrderMutation.isError ? (
              <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                Could not register the order.
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={
                items.length === 0 ||
                selectedItems.length === 0 ||
                createOrderMutation.isPending
              }
              className="mt-6 h-12 w-full rounded-full bg-white text-black hover:bg-neutral-200"
            >
              {createOrderMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Register order
            </Button>
          </CardContent>
        </Card>
      </form>
    </main>
  )
}
