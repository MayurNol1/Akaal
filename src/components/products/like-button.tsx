"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  productId: string;
  variant?: "default" | "card";
}

export function LikeButton({ productId, variant = "default" }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const isLiked = localStorage.getItem(`liked_${productId}`) === "true";
    setLiked(isLiked);
  }, [productId]);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a link
    const newState = !liked;
    setLiked(newState);
    if (newState) {
      localStorage.setItem(`liked_${productId}`, "true");
      window.dispatchEvent(new Event("wishlist-updated"));
    } else {
      localStorage.removeItem(`liked_${productId}`);
      window.dispatchEvent(new Event("wishlist-updated"));
    }
  };

  if (variant === "card") {
    return (
      <button 
        onClick={toggleLike}
        className={`absolute top-5 right-5 z-20 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/5 transition-all ${
          liked ? 'text-red-500 hover:text-red-400' : 'text-zinc-400 hover:text-primary'
        }`}
      >
        <Heart size={16} fill={liked ? "currentColor" : "none"} className={liked ? "scale-110" : "scale-100"} />
      </button>
    );
  }

  return (
    <button 
      onClick={toggleLike}
      className={`h-[60px] w-[60px] rounded-xl border flex items-center justify-center transition-all duration-300 ${
        liked 
          ? 'bg-red-500/10 border-red-500/30 text-red-500' 
          : 'border-primary/20 text-primary hover:bg-primary/5'
      }`}
    >
      <Heart 
        size={20} 
        fill={liked ? "currentColor" : "none"} 
        className={liked ? "scale-110 transition-transform" : "scale-100 transition-transform"} 
      />
    </button>
  );
}
