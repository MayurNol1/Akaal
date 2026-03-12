"use client";

import { ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";

export function CartPlaceholder({ className = "" }: { className?: string }) {
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <button 
        onClick={handleClick}
        className={`relative group ${className}`}
      >
        <ShoppingBag size={20} className="text-zinc-400 group-hover:text-gold transition-colors" />
        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-gold text-black italic text-[8px] font-black rounded-full flex items-center justify-center border border-black group-hover:scale-125 transition-transform">0</span>
      </button>

      {showToast && (
        <div className="fixed top-20 right-8 z-50 animate-in slide-in-from-right-5 fade-in duration-500">
          <div className="glass px-8 py-4 rounded-[2.5rem] border border-gold/30 flex items-center gap-4 gold-glow">
            <div className="h-8 w-8 bg-gold/20 rounded-xl flex items-center justify-center">
              <Sparkles className="text-gold" size={18} />
            </div>
            <div className="flex flex-col">
               <p className="text-xs font-bold uppercase tracking-widest text-gold leading-none pb-0.5">Sacred Market</p>
               <p className="text-xs font-medium text-white italic">Cart logic is arriving in Sprint 3.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
