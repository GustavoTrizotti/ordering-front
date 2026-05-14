import { apiRequest } from "./api-client"
import {
  GetEligibleDiscountsRequestParamsDTO,
  GetEligibleDiscountsResponseDTO,
  getEligibleDiscountsRequestParamsSchema,
  getEligibleDiscountsResponseSchema,
} from "./order-dtos"

export const discountsService = {
  getEligibleDiscounts(params: GetEligibleDiscountsRequestParamsDTO) {
    const parsedParams = getEligibleDiscountsRequestParamsSchema.parse(params)
    const query = new URLSearchParams(parsedParams)

    return apiRequest<undefined, GetEligibleDiscountsResponseDTO>({
      path: `/discounts/eligible?${query.toString()}`,
      responseSchema: getEligibleDiscountsResponseSchema,
    })
  },
}
