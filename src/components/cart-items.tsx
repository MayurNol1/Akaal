"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { CartWithItems } from "@/modules/cart/types";

interface CartItemsProps {
  cart: CartWithItems;
}

export function CartItems({ cart }: CartItemsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    startTransition(async () => {
      await fetch("/api/cart/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });
      router.refresh();
    });
  };

  const handleRemove = (productId: string) => {
    startTransition(async () => {
      await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {cart.items.map((item) => {
        const priceNumber = Number(item.product.price);
        const lineTotal = priceNumber * item.quantity;

        return (
          <div
            key={item.id}
            className="glass border border-white/5 rounded-3xl p-4 flex gap-4 items-center"
          >
            <div className="relative h-24 w-24 rounded-2xl overflow-hidden border border-white/10">
              <Image
                src={
                  item.product.imageUrl ||
                  "/spiritual_products_hero_1773122562782.png"
                }
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    ${priceNumber.toFixed(2)} each
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-gold">
                    ${lineTotal.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-3 py-1 border border-white/10">
                  <button
                    type="button"
                    disabled={isPending || item.quantity <= 1}
                    onClick={() =>
                      handleUpdateQuantity(item.productId, item.quantity - 1)
                    }
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 text-xs"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      handleUpdateQuantity(item.productId, item.quantity + 1)
                    }
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-zinc-200 text-black text-xs disabled:opacity-60"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleRemove(item.productId)}
                  className="text-xs text-zinc-500 hover:text-red-400 font-semibold uppercase tracking-[0.25em]"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

