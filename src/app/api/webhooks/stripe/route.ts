import { NextRequest } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2025-01-27.acacia" as any })
  : null;

export async function POST(req: NextRequest) {
  if (!stripe || !stripeWebhookSecret) {
    return new Response("Stripe not configured", { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret,
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const stripeSessionId = session.id;
    const userId = session.metadata?.userId;
    const cartId = session.metadata?.cartId;

    if (!userId || !cartId) {
      return new Response("Missing metadata", { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        return;
      }

      const total = cart.items.reduce((sum, item) => {
        const priceNumber = Number(item.product.price);
        return sum + priceNumber * item.quantity;
      }, 0);

      const order = await tx.order.create({
        data: {
          userId,
          total,
          status: "PAID",
          stripeSessionId,
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

      console.log("Created order from Stripe session", order.id);
    });
  }

  return new Response("ok", { status: 200 });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

