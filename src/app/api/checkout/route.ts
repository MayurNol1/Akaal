import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/api-responses";
import prisma from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
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

    // Calculate total in paise (INR * 100)
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    const amountInPaise = Math.round(totalAmount * 100);

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

    const order = await razorpay.orders.create(options);

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
