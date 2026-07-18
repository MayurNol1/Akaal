import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/api-responses";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { calculateOrderTotals } from "@/lib/pricing";
import { ShippingAddressSchema } from "@/modules/orders/validation";
import { CouponService } from "@/modules/coupons/service";
import { sendOrderConfirmationEmail } from "@/modules/orders/service";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartId,
      shippingAddress,
    } = await req.json();

    // Payment already happened by the time we get here — a malformed address
    // must not block order creation, so store it only when valid.
    const parsedAddress = ShippingAddressSchema.safeParse(shippingAddress);

    // Verify Signature (constant-time comparison)
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const expected = Buffer.from(hmac.digest("hex"));
    const provided = Buffer.from(String(razorpay_signature ?? ""));

    if (
      expected.length !== provided.length ||
      !crypto.timingSafeEqual(expected, provided)
    ) {
      return errorResponse("Invalid payment signature", 400);
    }

    // Check if order already exists to avoid duplication
    const existingOrder = await prisma.order.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (existingOrder) {
      return successResponse({ orderId: existingOrder.id });
    }

    // Create Order and Clear Cart
    const result = await prisma.$transaction(async (tx) => {
      // Scope to the session user so one user can't consume another's cart
      const cart = await tx.cart.findFirst({
        where: { id: cartId, userId: session.user.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart not found or empty");
      }

      // Same math as /api/checkout — the stored total must match the amount charged
      const coupon = await CouponService.getUsableCoupon(cart.couponCode);
      const { total, discount } = calculateOrderTotals(
        cart.items.map((item) => ({ price: item.product.price, quantity: item.quantity })),
        coupon?.discountPercent ?? 0
      );

      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          total,
          ...(coupon ? { couponCode: coupon.code, couponDiscount: discount } : {}),
          status: "PAID",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          ...(parsedAddress.success ? { shippingAddress: parsedAddress.data } : {}),
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      // Clear Cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.delete({ where: { id: cart.id } });

      return order;
    });

    await sendOrderConfirmationEmail(result.id);

    return successResponse({ orderId: result.id });
  } catch (error) {
    console.error("Payment verification error:", error);
    return errorResponse(error instanceof Error ? error.message : "Internal Server Error", 500);
  }
}
