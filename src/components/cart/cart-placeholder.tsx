"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function CartPlaceholder() {
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
      style={{ position:"absolute", top:0, right:0, background:"#d4a94a", color:"#10100e", fontSize:"10px", fontWeight:700, height:"16px", width:"16px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", transform:"translate(50%,-50%)" }}
    >
      {count > 99 ? '99+' : count}
    </div>
  );
}
