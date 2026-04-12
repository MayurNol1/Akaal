import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/api-responses";
import prisma from "@/lib/prisma";
import crypto from "crypto";

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
      cartId 
    } = await req.json();

    // Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
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
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart not found or empty");
      }

      const total = cart.items.reduce((sum, item) => {
        return sum + Number(item.product.price) * item.quantity;
      }, 0);

      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          total,
          status: "PAID",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
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

    return successResponse({ orderId: result.id });
  } catch (error) {
    console.error("Payment verification error:", error);
    return errorResponse(error instanceof Error ? error.message : "Internal Server Error", 500);
  }
}
