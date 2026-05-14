"use client"

import { useQuery } from "@tanstack/react-query"

import { GetEligibleDiscountsRequestParamsDTO } from "./order-dtos"
import { discountsService } from "./discounts-service"

export function useEligibleDiscountsQuery(
  params: GetEligibleDiscountsRequestParamsDTO,
  enabled = true
) {
  return useQuery({
    queryKey: ["discounts", "eligible", params.orderId],
    queryFn: () => discountsService.getEligibleDiscounts(params),
    enabled,
  })
}
