"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export function LikeButton({ productId }: { productId: string }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Standard LocalStorage Persistence for MVP liking system
    const isLiked = localStorage.getItem(`liked_${productId}`) === "true";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLiked(isLiked);
  }, [productId]);

  const toggleLike = () => {
    const newState = !liked;
    setLiked(newState);
    if (newState) {
      localStorage.setItem(`liked_${productId}`, "true");
    } else {
      localStorage.removeItem(`liked_${productId}`);
    }
  };

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
