export type CouponDiscountType = "percent" | "fixed";

export interface CouponValidation {
  code: string;
  valid: boolean;
  discountType?: CouponDiscountType;
  discountValue?: number;
  message?: string;
}
