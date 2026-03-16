"use client";

import { useEffect, useState } from "react";

export function WishlistCount() {
  const [count, setCount] = useState(0);

  const updateCount = () => {
    let likedCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("liked_")) {
          likedCount++;
        }
    }
    setCount(likedCount);
  };

  useEffect(() => {
    updateCount();

    // Listen to our custom event for clicks across the app
    window.addEventListener("wishlist-updated", updateCount);
    
    // Also listen to storage events (case where user has multiple tabs)
    window.addEventListener("storage", updateCount);
    
    return () => {
        window.removeEventListener("wishlist-updated", updateCount);
        window.removeEventListener("storage", updateCount);
    };
  }, []);

  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-black text-[8px] font-black border border-background-dark shadow-2xl animate-fade-in">
      {count}
    </span>
  );
}
