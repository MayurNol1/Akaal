import crypto from "crypto";
import { errorResponse, successResponse } from "@/lib/api-responses";
import prisma from "@/lib/prisma";
import { calculateOrderTotals } from "@/lib/pricing";
import { CouponService } from "@/modules/coupons/service";
import { sendOrderConfirmationEmail } from "@/modules/orders/service";

/**
 * Razorpay webhook — server-side safety net for payment confirmation.
 * The primary flow is client-driven (/api/checkout/verify); this handler
 * covers the case where the buyer pays but never returns to the site.
 * Configure the endpoint + secret at https://dashboard.razorpay.com/app/webhooks
 * with the `payment.captured` event. Excluded from auth middleware in proxy.ts.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not set; rejecting webhook");
    return errorResponse("Webhook not configured", 503);
  }

  // Signature is computed over the raw body, so read text before parsing
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  const expected = Buffer.from(
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex")
  );
  const provided = Buffer.from(signature);
  if (
    expected.length !== provided.length ||
    !crypto.timingSafeEqual(expected, provided)
  ) {
    return errorResponse("Invalid webhook signature", 400);
  }

  let event: {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          notes?: { userId?: string; cartId?: string };
        };
      };
    };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return errorResponse("Invalid JSON payload", 400);
  }

  if (event.event !== "payment.captured") {
    // Acknowledge events we don't act on so Razorpay stops retrying
    return successResponse({ ignored: event.event });
  }

  const payment = event.payload?.payment?.entity;
  const razorpayOrderId = payment?.order_id;
  const razorpayPaymentId = payment?.id;
  const userId = payment?.notes?.userId;

  if (!razorpayOrderId || !razorpayPaymentId || !userId) {
    console.error("Webhook payment.captured missing fields:", payment);
    return successResponse({ ignored: "missing fields" });
  }

  try {
    // Already recorded via /api/checkout/verify — nothing to do
    const existing = await prisma.order.findUnique({
      where: { razorpayOrderId },
    });
    if (existing) {
      return successResponse({ orderId: existing.id, deduped: true });
    }

    const result = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
      });

      if (!cart || cart.items.length === 0) {
        return null;
      }

      const coupon = await CouponService.getUsableCoupon(cart.couponCode);
      const { total, discount } = calculateOrderTotals(
        cart.items.map((item) => ({
          price: item.product.price,
          quantity: item.quantity,
        })),
        coupon?.discountPercent ?? 0
      );

      const order = await tx.order.create({
        data: {
          userId,
          total,
          ...(coupon ? { couponCode: coupon.code, couponDiscount: discount } : {}),
          status: "PAID",
          razorpayOrderId,
          razorpayPaymentId,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.delete({ where: { id: cart.id } });

      return order;
    });

    if (!result) {
      // Cart gone but no order — likely a race with /verify; let Razorpay retry
      const raced = await prisma.order.findUnique({ where: { razorpayOrderId } });
      if (raced) {
        return successResponse({ orderId: raced.id, deduped: true });
      }
      return errorResponse("Cart not found for captured payment", 500);
    }

    await sendOrderConfirmationEmail(result.id);

    return successResponse({ orderId: result.id });
  } catch (error) {
    // Unique razorpayOrderId means a concurrent /verify won the race — that's success
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return successResponse({ deduped: true });
    }
    console.error("Razorpay webhook error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
