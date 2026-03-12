import Link from "next/link";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import type { CartWithItems } from "@/modules/cart/types";
import { CartItems } from "@/components/cart-items";

export const dynamic = "force-dynamic";

async function getCartForUser(userId: string): Promise<CartWithItems | null> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return cart as CartWithItems | null;
}

export default async function CartPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="text-zinc-400">
            You need to be signed in to view your sacred cart.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black text-sm font-bold uppercase tracking-widest"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const cart = await getCartForUser(session.user.id);
  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => {
    const priceNumber = Number(item.product.price);
    return sum + priceNumber * item.quantity;
  }, 0);

  return (
    <div className="bg-black min-h-screen pb-24 text-white">
      <div className="h-24" />
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold italic gold-gradient">
            Your Ritual Cart
          </h1>
          <Link
            href="/products"
            className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors"
          >
            Continue Exploring
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="glass border border-white/5 rounded-[3rem] py-16 flex flex-col items-center justify-center space-y-6">
            <p className="text-zinc-400">
              Your sacred cart is currently empty.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-10">
            {cart && <CartItems cart={cart} />}

            <aside className="glass border border-white/5 rounded-3xl p-6 space-y-6">
              <h2 className="text-lg font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Summary
              </h2>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="font-semibold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-zinc-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <span className="text-sm text-zinc-400">Total</span>
                <span className="text-xl font-bold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center bg-white text-black py-3 rounded-2xl text-xs font-bold uppercase tracking-[0.25em] hover:bg-zinc-200 transition-colors"
              >
                Proceed to Sacred Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

