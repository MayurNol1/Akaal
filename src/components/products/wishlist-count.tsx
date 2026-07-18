"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getServerWishlist, getLocalLikedIds } from "@/lib/wishlist-client";

export function WishlistCount() {
  const { status } = useSession();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const updateCount = () => {
      if (status === "authenticated") {
        getServerWishlist().then((ids) => {
          if (!cancelled) setCount(ids.size);
        });
      } else if (status === "unauthenticated") {
        setCount(getLocalLikedIds().length);
      }
    };

    updateCount();
    window.addEventListener("wishlist-updated", updateCount);
    // storage events cover guest likes changed in another tab
    window.addEventListener("storage", updateCount);

    return () => {
      cancelled = true;
      window.removeEventListener("wishlist-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, [status]);

  if (count === 0) return null;

  return (
    <span
      style={{ position: "absolute", top: 0, right: 0, background: "#d4a94a", color: "#10100e", fontSize: "10px", fontWeight: 700, height: "16px", width: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transform: "translate(50%,-50%)" }}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
