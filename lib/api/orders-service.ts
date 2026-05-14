import { apiRequest } from "./api-client"
import {
  AddItemsToOrderRequestDTO,
  AddItemsToOrderResponseDTO,
  ApplyDiscountRequestDTO,
  ApplyDiscountResponseDTO,
  ChangeOrderStatusRequestDTO,
  ChangeOrderStatusResponseDTO,
  CreateOrderBodyDTO,
  CreateOrderResponseDTO,
  ListOrdersOrderResponseDTO,
  RemoveItemFromOrderResponseDTO,
  UpdateOrderItemQuantityRequestDTO,
  UpdateOrderItemQuantityResponseDTO,
  addItemsToOrderRequestSchema,
  addItemsToOrderResponseSchema,
  applyDiscountRequestSchema,
  applyDiscountResponseSchema,
  changeOrderStatusRequestSchema,
  changeOrderStatusResponseSchema,
  createOrderBodySchema,
  createOrderResponseSchema,
  listOrdersResponseSchema,
  removeItemFromOrderResponseSchema,
  updateOrderItemQuantityRequestSchema,
  updateOrderItemQuantityResponseSchema,
} from "./order-dtos"

export const ordersService = {
  list() {
    return apiRequest<undefined, ListOrdersOrderResponseDTO[]>({
      path: "/orders",
      responseSchema: listOrdersResponseSchema,
    })
  },

  create(body: CreateOrderBodyDTO) {
    return apiRequest<CreateOrderBodyDTO, CreateOrderResponseDTO>({
      method: "POST",
      path: "/orders",
      requestSchema: createOrderBodySchema,
      responseSchema: createOrderResponseSchema,
      body,
    })
  },

  cancel(orderId: string) {
    return apiRequest<undefined, void>({
      method: "PUT",
      path: `/orders/${encodeURIComponent(orderId)}/cancel`,
    })
  },

  changeStatus(orderId: string, body: ChangeOrderStatusRequestDTO) {
    return apiRequest<
      ChangeOrderStatusRequestDTO,
      ChangeOrderStatusResponseDTO
    >({
      method: "PATCH",
      path: `/orders/${encodeURIComponent(orderId)}/status`,
      requestSchema: changeOrderStatusRequestSchema,
      responseSchema: changeOrderStatusResponseSchema,
      body,
    })
  },

  addItems(orderId: string, body: AddItemsToOrderRequestDTO) {
    return apiRequest<AddItemsToOrderRequestDTO, AddItemsToOrderResponseDTO>({
      method: "PATCH",
      path: `/orders/${encodeURIComponent(orderId)}/items`,
      requestSchema: addItemsToOrderRequestSchema,
      responseSchema: addItemsToOrderResponseSchema,
      body,
    })
  },

  updateItemQuantity(
    orderId: string,
    productId: string,
    body: UpdateOrderItemQuantityRequestDTO
  ) {
    return apiRequest<
      UpdateOrderItemQuantityRequestDTO,
      UpdateOrderItemQuantityResponseDTO
    >({
      method: "PATCH",
      path: `/orders/${encodeURIComponent(orderId)}/items/${encodeURIComponent(
        productId
      )}/quantity`,
      requestSchema: updateOrderItemQuantityRequestSchema,
      responseSchema: updateOrderItemQuantityResponseSchema,
      body,
    })
  },

  applyDiscount(orderId: string, body: ApplyDiscountRequestDTO) {
    return apiRequest<ApplyDiscountRequestDTO, ApplyDiscountResponseDTO>({
      method: "PATCH",
      path: `/orders/${encodeURIComponent(orderId)}/discounts`,
      requestSchema: applyDiscountRequestSchema,
      responseSchema: applyDiscountResponseSchema,
      body,
    })
  },

  removeItem(orderId: string, productId: string) {
    return apiRequest<undefined, RemoveItemFromOrderResponseDTO>({
      method: "DELETE",
      path: `/orders/${encodeURIComponent(orderId)}/items/${encodeURIComponent(
        productId
      )}`,
      responseSchema: removeItemFromOrderResponseSchema,
    })
  },
}
