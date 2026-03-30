import { apiFetch } from "@/services/api";
import type { CouponValidation } from "@/types/coupon";

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidation> {
  return apiFetch<CouponValidation>("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}
