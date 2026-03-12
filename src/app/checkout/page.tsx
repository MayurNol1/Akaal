import Link from "next/link";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-zinc-400">
            You need to be signed in to complete your order.
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

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => {
    const priceNumber = Number(item.product.price);
    return sum + priceNumber * item.quantity;
  }, 0);

  return (
    <div className="bg-black min-h-screen pb-24 text-white">
      <div className="h-24" />
      <div className="max-w-5xl mx-auto px-6 space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold italic gold-gradient">
            Sacred Checkout
          </h1>
          <Link
            href="/cart"
            className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors"
          >
            Back to Cart
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="glass border border-white/5 rounded-[3rem] py-16 flex flex-col items-center justify-center space-y-6">
            <p className="text-zinc-400">
              Your cart is empty. Add some sacred items first.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-10">
            <div className="space-y-4">
              {items.map((item) => {
                const priceNumber = Number(item.product.price);
                const lineTotal = priceNumber * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="glass border border-white/5 rounded-3xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-xs text-zinc-500">
                        Qty {item.quantity} · $
                        {priceNumber.toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-right text-gold font-semibold">
                      ${lineTotal.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

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
                <span>Calculated at Stripe</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <span className="text-sm text-zinc-400">Total</span>
                <span className="text-xl font-bold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <form action="/api/checkout" method="POST">
                <button
                  type="submit"
                  className="w-full bg-white text-black py-3 rounded-2xl text-xs font-bold uppercase tracking-[0.25em] hover:bg-zinc-200 transition-colors"
                >
                  Proceed to Stripe
                </button>
              </form>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

