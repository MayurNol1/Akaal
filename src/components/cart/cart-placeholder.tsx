"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function CartPlaceholder({ className = "" }: { className?: string }) {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Re-fetch cart whenever pathname changes or on mount
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.data?.items) {
          const total = data.data.items.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);
          setCount(total);
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    };
    
    fetchCart();

    // Listen to our custom event for cart updates
    window.addEventListener("cart-updated", fetchCart);
    return () => window.removeEventListener("cart-updated", fetchCart);
  }, [pathname]);

  if (count === 0) return null;

  return (
    <div 
      className={`absolute top-0 right-0 bg-primary text-background-dark text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 ${className}`}
    >
      {count > 99 ? '99+' : count}
    </div>
  );
}
