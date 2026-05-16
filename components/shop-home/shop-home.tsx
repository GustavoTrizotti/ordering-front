"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, ShoppingBag, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ordersQueryKey,
  useAddItemsToOrderMutation,
} from "@/lib/api/orders-hooks"
import { ListOrdersOrderResponseDTO } from "@/lib/api/order-dtos"
import { useCartStore } from "@/lib/stores/cart-store"
import { useOrdersStore } from "@/lib/stores/orders-store"
import {
  ProductSection,
  ShopProduct,
  useProductStore,
} from "@/lib/stores/product-store"
import { cn } from "@/lib/utils"

import { ShopNavbar } from "./shop-navbar"

const productSections: Array<{
  id: string
  title: string
  eyebrow: string
  section: ProductSection
}> = [
  {
    id: "featured",
    title: "Featured products",
    eyebrow: "Curated now",
    section: "featured",
  },
  {
    id: "sale",
    title: "In sale",
    eyebrow: "Limited drops",
    section: "sale",
  },
  {
    id: "new",
    title: "New arrivals",
    eyebrow: "Fresh stock",
    section: "new-arrival",
  },
  {
    id: "best-sellers",
    title: "Best sellers",
    eyebrow: "Most ordered",
    section: "best-seller",
  },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function ProductCard({ product }: { product: ShopProduct }) {
  const addItem = useCartStore((state) => state.addItem)

  function handleAddToCart() {
    addItem(product)
    toast.success("Added to cart", {
      description: `${product.name} is ready for checkout.`,
    })
  }

  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-4/3 overflow-hidden bg-neutral-900">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-xs font-medium text-neutral-300 backdrop-blur">
          {product.category}
        </span>
      </div>

      <CardContent className="space-y-4 p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight text-white">
              {product.name}
            </h3>
            <div className="shrink-0 text-right">
              <p className="font-semibold text-white">
                {formatCurrency(product.price)}
              </p>
              {product.previousPrice ? (
                <p className="text-xs text-neutral-600 line-through">
                  {formatCurrency(product.previousPrice)}
                </p>
              ) : null}
            </div>
          </div>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            {product.description}
          </p>
        </div>

        <Button
          type="button"
          onClick={handleAddToCart}
          className="h-10 w-full rounded-full bg-white text-black hover:bg-neutral-200"
        >
          Add to cart
          <ShoppingBag className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

function ProductFilterList() {
  const [selectedFilter, setSelectedFilter] = useState(productSections[0].id)
  const filters = [
    ...productSections.map((section) => ({
      id: section.id,
      label: section.title,
    })),
    { id: "categories", label: "Categories" },
  ]

  function handleFilterClick(id: string) {
    setSelectedFilter(id)
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <section
      aria-label="Shop product filters"
      className="sticky top-[73px] z-30 -mx-6 border-y border-neutral-900 bg-black/85 px-6 py-4 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            type="button"
            variant="outline"
            onClick={() => handleFilterClick(filter.id)}
            className={cn(
              "h-10 shrink-0 rounded-full border-neutral-800 bg-neutral-950 px-4 text-neutral-200 hover:bg-neutral-900 hover:text-white",
              selectedFilter === filter.id &&
                "border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:text-secondary-foreground"
            )}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </section>
  )
}

function ProductSectionBlock({
  id,
  title,
  eyebrow,
  products,
}: {
  id: string
  title: string
  eyebrow: string
  products: ShopProduct[]
}) {
  return (
    <section id={id} className="scroll-mt-24 py-12">
      <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-medium tracking-wider text-neutral-500 uppercase">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            {title}
          </h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="w-fit rounded-full text-neutral-300 hover:bg-neutral-900 hover:text-white"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.45,
              delay: index * 0.05,
              ease: "easeOut",
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function CartPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const addItemsToOrderMutation = useAddItemsToOrderMutation()
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const editingOrderId = useCartStore((state) => state.editingOrderId)
  const clearOrderEdit = useCartStore((state) => state.clearOrderEdit)
  const subtotal = useCartStore((state) => state.getSubtotal())
  const updateOrder = useOrdersStore((state) => state.updateOrder)

  function handleRemoveItem(productId: string, productName: string) {
    removeItem(productId)
    toast.info("Removed from cart", {
      description: `${productName} was removed from your cart.`,
    })
  }

  function handleClearCart() {
    clearCart()
    clearOrderEdit()
    toast.info("Cart cleared", {
      description: "All cart items were removed.",
    })
  }

  async function handleUpdateExistingOrder() {
    if (!editingOrderId || items.length === 0) return

    try {
      const response = await addItemsToOrderMutation.mutateAsync({
        orderId: editingOrderId,
        body: {
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
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
      clearCart()
      clearOrderEdit()
      onClose()
      toast.success("Order updated", {
        description: "The selected items were added to the order.",
      })
      router.push("/app/orders")
    } catch {
      toast.error("Could not update order", {
        description: "Please review the cart and try again.",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col border-l border-neutral-800 bg-black p-6 text-white shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase">
              {editingOrderId ? "Add items to order" : "Current order"}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">Cart</h2>
            {editingOrderId ? (
              <p className="mt-1 font-mono text-xs text-neutral-600">
                {editingOrderId}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-full text-neutral-400 hover:bg-neutral-900 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {items.length === 0 ? (
            <div className="rounded-lg border border-neutral-900 p-5 text-sm leading-6 text-neutral-500">
              Your cart is empty. Add a product and it will appear here.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 rounded-lg border border-neutral-900 p-3"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-900">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover grayscale"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{item.product.name}</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Qty {item.quantity} · {formatCurrency(item.product.price)}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem(item.product.id, item.product.name)
                    }
                    className="mt-2 text-xs font-medium text-neutral-500 transition-colors hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 border-t border-neutral-900 pt-5">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-neutral-500">Subtotal</span>
            <span className="font-semibold text-white">
              {formatCurrency(subtotal)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearCart}
              disabled={items.length === 0}
              className="h-11 rounded-full border-neutral-800 bg-black text-white hover:bg-neutral-900"
            >
              Clear
            </Button>
            <Button
              type="button"
              disabled={items.length === 0}
              onClick={() => {
                if (editingOrderId) {
                  void handleUpdateExistingOrder()
                  return
                }

                onClose()
                toast.message("Review your order", {
                  description: "Confirm customer, address, and selected items.",
                })
                router.push("/app/checkout")
              }}
              className="h-11 rounded-full bg-white text-black hover:bg-neutral-200"
            >
              {addItemsToOrderMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {editingOrderId ? "Update order" : "Checkout"}
            </Button>
          </div>
        </div>
      </motion.aside>
    </div>
  )
}

function CategoriesBlock() {
  const categories = useProductStore((state) => state.categories)

  return (
    <section id="categories" className="py-12">
      <p className="mb-2 text-xs font-medium tracking-wider text-neutral-500 uppercase">
        Collections
      </p>
      <h2 className="mb-7 text-3xl font-bold tracking-tight text-white md:text-4xl">
        Collections/categories
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((category) => (
          <div
            key={category}
            className="rounded-lg border border-neutral-900 bg-neutral-950/70 p-5 transition-colors hover:border-neutral-700"
          >
            <p className="text-lg font-semibold text-white">{category}</p>
            <p className="mt-2 text-sm text-neutral-500">
              Browse the latest {category.toLowerCase()} picks.
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ShopHome() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const getProductsBySection = useProductStore(
    (state) => state.getProductsBySection
  )

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20">
      <ShopNavbar onCartClick={() => setIsCartOpen(true)} />
      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <section className="relative overflow-hidden border-b border-neutral-900 px-6 py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(82,82,82,0.32),transparent_32rem),radial-gradient(circle_at_80%_20%,rgba(38,38,38,0.42),transparent_28rem)]" />
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 mx-auto max-w-7xl"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-4 py-2">
            <span className="size-2 rounded-full bg-white" />
            <span className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
              Private shop
            </span>
          </div>
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
            Shop the essentials, ordered with intent.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-500">
            Explore featured products, markdowns, new arrivals, best sellers,
            and focused collections from one protected storefront.
          </p>
        </motion.div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <ProductFilterList />
        {productSections.map((section) => (
          <ProductSectionBlock
            key={section.id}
            id={section.id}
            title={section.title}
            eyebrow={section.eyebrow}
            products={getProductsBySection(section.section)}
          />
        ))}
        <CategoriesBlock />
      </div>
    </main>
  )
}
