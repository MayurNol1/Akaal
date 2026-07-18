export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 99;
export const GST_RATE = 0.05;

export interface OrderTotals {
  subtotal: number;
  /** Amount taken off the subtotal by a coupon (0 when none). */
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

interface PricedItem {
  quantity: number;
  // Prisma Decimal or number — always convert with Number() before arithmetic
  price: unknown;
}

/**
 * Single source of truth for order money math. The amount charged via
 * Razorpay, the total stored on Order, and every totals UI (cart, checkout,
 * order detail) must all derive from this to stay consistent.
 *
 * Discount applies to the subtotal; shipping eligibility and GST are then
 * computed on the discounted amount.
 */
export function totalsFromSubtotal(subtotal: number, discountPercent = 0): OrderTotals {
  const discount = roundMoney((subtotal * clampPercent(discountPercent)) / 100);
  return totalsWithDiscountAmount(subtotal, discount);
}

/** Same math, but from a known discount amount (e.g. the value stored on an Order). */
export function totalsWithDiscountAmount(subtotal: number, discountAmount: number): OrderTotals {
  const discount = roundMoney(Math.min(Math.max(discountAmount, 0), subtotal));
  const discounted = subtotal - discount;
  const shipping = discounted >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = roundMoney(discounted * GST_RATE);
  const total = roundMoney(discounted + shipping + tax);
  return { subtotal: roundMoney(subtotal), discount, shipping, tax, total };
}

export function calculateOrderTotals(items: PricedItem[], discountPercent = 0): OrderTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  return totalsFromSubtotal(subtotal, discountPercent);
}

/** INR → paise for Razorpay. */
export function toPaise(amount: number): number {
  return Math.round(amount * 100);
}

function clampPercent(pct: number): number {
  if (!Number.isFinite(pct) || pct < 0) return 0;
  return Math.min(pct, 100);
}

function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}
