import z from "zod"

const idSchema = z.string().min(1)
const moneySchema = z.number().nonnegative()
const quantitySchema = z.number().int().positive()

export const createOrderItemBodySchema = z
  .object({
    productId: idSchema,
    quantity: quantitySchema,
    price: moneySchema,
  })
  .strict()

export const createOrderBodySchema = z
  .object({
    customerId: idSchema,
    street: z.string().min(1),
    number: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    items: z.array(createOrderItemBodySchema).min(1),
  })
  .strict()

export const createOrderResponseSchema = z
  .object({
    orderId: idSchema,
  })
  .strict()

export const changeOrderStatusRequestSchema = z
  .object({
    newStatus: z.string().min(1),
  })
  .strict()

export const changeOrderStatusResponseSchema = z
  .object({
    orderId: idSchema,
    previousStatus: z.string().min(1),
    currentStatus: z.string().min(1),
  })
  .strict()

export const addItemsToOrderItemRequestSchema = createOrderItemBodySchema

export const addItemsToOrderRequestSchema = z
  .object({
    items: z.array(addItemsToOrderItemRequestSchema).min(1),
  })
  .strict()

export const orderItemResponseSchema = z
  .object({
    productId: idSchema,
    quantity: quantitySchema,
    price: moneySchema,
  })
  .strict()

export const addItemsToOrderResponseSchema = z
  .object({
    orderId: idSchema,
    items: z.array(orderItemResponseSchema),
  })
  .strict()

export const updateOrderItemQuantityRequestSchema = z
  .object({
    quantity: quantitySchema,
  })
  .strict()

export const updateOrderItemQuantityResponseSchema =
  addItemsToOrderResponseSchema

export const applyDiscountRequestSchema = z
  .object({
    discountIds: z.array(idSchema).min(1),
  })
  .strict()

export const appliedDiscountSchema = z
  .object({
    discountId: idSchema,
    discountType: z.string().min(1),
    active: z.boolean(),
    expiration: z.string().min(1),
    createdAt: z.string().datetime(),
  })
  .strict()

export const applyDiscountResponseSchema = z
  .object({
    orderId: idSchema,
    appliedDiscounts: z.array(appliedDiscountSchema),
  })
  .strict()

export const listOrdersDiscountResponseSchema = z
  .object({
    discountId: idSchema,
    percentage: z.number().nonnegative(),
    discountType: z.string().min(1),
  })
  .strict()

export const listOrdersItemResponseSchema = orderItemResponseSchema

export const listOrdersOrderResponseSchema = z
  .object({
    orderId: idSchema,
    status: z.string().min(1),
    items: z.array(listOrdersItemResponseSchema),
    discounts: z.array(listOrdersDiscountResponseSchema),
  })
  .strict()

export const listOrdersResponseSchema = z.array(listOrdersOrderResponseSchema)

export const getEligibleDiscountsRequestParamsSchema = z
  .object({
    orderId: idSchema,
  })
  .strict()

export const getEligibleDiscountsItemResponseSchema = z
  .object({
    discountId: idSchema,
    percentage: z.number().nonnegative(),
  })
  .strict()

export const getEligibleDiscountsResponseSchema = z
  .object({
    items: z.array(getEligibleDiscountsItemResponseSchema),
  })
  .strict()

export const removeItemFromOrderResponseSchema = addItemsToOrderResponseSchema

export type CreateOrderBodyDTO = z.infer<typeof createOrderBodySchema>
export type CreateOrderResponseDTO = z.infer<typeof createOrderResponseSchema>
export type ChangeOrderStatusRequestDTO = z.infer<
  typeof changeOrderStatusRequestSchema
>
export type ChangeOrderStatusResponseDTO = z.infer<
  typeof changeOrderStatusResponseSchema
>
export type AddItemsToOrderRequestDTO = z.infer<
  typeof addItemsToOrderRequestSchema
>
export type AddItemsToOrderResponseDTO = z.infer<
  typeof addItemsToOrderResponseSchema
>
export type UpdateOrderItemQuantityRequestDTO = z.infer<
  typeof updateOrderItemQuantityRequestSchema
>
export type UpdateOrderItemQuantityResponseDTO = z.infer<
  typeof updateOrderItemQuantityResponseSchema
>
export type ApplyDiscountRequestDTO = z.infer<typeof applyDiscountRequestSchema>
export type ApplyDiscountResponseDTO = z.infer<typeof applyDiscountResponseSchema>
export type ListOrdersOrderResponseDTO = z.infer<
  typeof listOrdersOrderResponseSchema
>
export type GetEligibleDiscountsRequestParamsDTO = z.infer<
  typeof getEligibleDiscountsRequestParamsSchema
>
export type GetEligibleDiscountsResponseDTO = z.infer<
  typeof getEligibleDiscountsResponseSchema
>
export type RemoveItemFromOrderResponseDTO = z.infer<
  typeof removeItemFromOrderResponseSchema
>
