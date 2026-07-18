import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/api-responses";
import prisma from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";
import { calculateOrderTotals, toPaise } from "@/lib/pricing";
import { ShippingAddressSchema } from "@/modules/orders/validation";
import { CouponService } from "@/modules/coupons/service";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    // Fail fast on a bad address before any payment is taken
    const body = await req.json().catch(() => null);
    const parsedAddress = ShippingAddressSchema.safeParse(body?.shippingAddress);
    if (!parsedAddress.success) {
      return errorResponse(
        "Please fill in your shipping details",
        400,
        parsedAddress.error.flatten().fieldErrors
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return errorResponse("Cart is empty", 400);
    }

    // Charge the same grand total the UI shows (subtotal − coupon + shipping + GST)
    const coupon = await CouponService.getUsableCoupon(cart.couponCode);
    const totals = calculateOrderTotals(
      cart.items.map((item) => ({ price: item.product.price, quantity: item.quantity })),
      coupon?.discountPercent ?? 0
    );
    const amountInPaise = toPaise(totals.total);

    // Create Razorpay Order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${cart.id}`,
      notes: {
        userId: session.user.id,
        cartId: cart.id,
      },
    };

    const order = await getRazorpay().orders.create(options);

    return successResponse({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      user: {
        name: session.user.name,
        email: session.user.email,
      }
    });
  } catch (error) {
    console.error("POST /api/checkout error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
