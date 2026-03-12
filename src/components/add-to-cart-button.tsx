"use client";

import { ShoppingBag, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";

interface AddToCartButtonProps {
  productId: string;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, quantity: 1 }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(data?.error ?? "Failed to add to cart.");
          return;
        }

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="w-full bg-white text-black py-5 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-2xl shadow-white/5 active:scale-95 group relative overflow-hidden"
      >
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        <ShoppingBag
          size={20}
          className="group-hover:rotate-12 transition-transform"
        />
        <span>{isPending ? "Adding..." : "Add to Ritual Collection"}</span>
      </button>

      {showToast && (
        <div className="fixed top-20 right-8 z-50 animate-in slide-in-from-right-5 fade-in duration-500">
          <div className="glass px-8 py-4 rounded-3xl border border-gold/30 flex items-center gap-4 gold-glow">
            <div className="h-8 w-8 bg-gold/20 rounded-xl flex items-center justify-center">
              <Sparkles className="text-gold" size={18} />
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-bold uppercase tracking-widest text-gold leading-none pb-0.5">
                Added to Ritual
              </p>
              <p className="text-sm font-medium text-white">
                Your sacred artifact has been added to the cart.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 text-xs text-red-400 font-medium">
          {error}
        </div>
      )}
    </>
  );
}

