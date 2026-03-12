import { Sparkles } from "lucide-react";

export function Logo({ className = "", iconClassName = "" }: { className?: string; iconClassName?: string }) {
  return (
    <div className={`flex items-center gap-3 group transition-all duration-300 ${className}`}>
      <div className={`h-10 w-10 bg-black border border-gold/30 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg shadow-gold/5 ${iconClassName}`}>
        <Sparkles className="text-gold w-6 h-6 animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-white tracking-widest uppercase leading-none italic font-serif">Akaal</span>
        <span className="text-[8px] text-gold uppercase tracking-[0.3em] mt-1 font-bold">Infinite Soul</span>
      </div>
    </div>
  );
}
