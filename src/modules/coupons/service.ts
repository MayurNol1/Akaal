import { CouponRepository } from "./repository";

export interface ValidCoupon {
  code: string;
  /** Percentage off the subtotal, 1–100. */
  discountPercent: number;
}

export class CouponService {
  /**
   * Returns the coupon if it is usable right now, otherwise null.
   * Use `validateCode` when you need the failure reason.
   */
  static async getUsableCoupon(code: string | null | undefined): Promise<ValidCoupon | null> {
    if (!code) return null;
    try {
      const result = await CouponService.validateCode(code);
      return result.ok ? result.coupon : null;
    } catch {
      return null;
    }
  }

  static async validateCode(
    rawCode: string
  ): Promise<{ ok: true; coupon: ValidCoupon } | { ok: false; reason: string }> {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      return { ok: false, reason: "Enter a coupon code" };
    }

    const coupon = await CouponRepository.findByCode(code);
    if (!coupon) {
      return { ok: false, reason: "This coupon does not exist" };
    }
    if (!coupon.isActive) {
      return { ok: false, reason: "This coupon is no longer active" };
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return { ok: false, reason: "This coupon has expired" };
    }

    return {
      ok: true,
      coupon: { code: coupon.code, discountPercent: coupon.discount },
    };
  }
}
