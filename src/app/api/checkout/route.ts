import { auth } from "@/auth";
import { errorResponse } from "@/lib/api-responses";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2025-01-27.acacia" as any })
  : null;

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    if (!stripe) {
      return errorResponse("Stripe is not configured", 500);
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

    const lineItems = cart.items.map((item) => {
      const priceNumber = Number(item.product.price);

      return {
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
          },
          unit_amount: Math.round(priceNumber * 100),
        },
      };
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?canceled=1`,
      metadata: {
        userId: session.user.id,
        cartId: cart.id,
      },
    });

    return new Response(null, {
      status: 303,
      headers: {
        Location: checkoutSession.url ?? "/cart",
      },
    });
  } catch (error) {
    console.error("POST /api/checkout error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

