"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    
    // Artificial delay for effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStatus("success");
    setEmail("");
    
    // Reset after some time
    setTimeout(() => setStatus("idle"), 5000);
  };

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto animate-in fade-in zoom-in duration-700 bg-primary/10 border border-primary/20 p-8 rounded-[32px] text-center space-y-4">
        <div className="size-16 bg-primary/20 rounded-full mx-auto flex items-center justify-center">
          <CheckCircle2 className="text-primary" size={32} />
        </div>
        <h3 className="text-xl font-serif font-black text-white italic">Welcome to the Path</h3>
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest leading-relaxed">
          Your celestial email has been recognized. Prepare for high-vibration insights.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative group">
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:ring-1 focus:ring-primary focus:border-primary text-white outline-none transition-all focus:bg-white/10 placeholder:text-zinc-600 font-serif italic" 
        placeholder="vibration@eternal.com" 
        type="email"
        required
        disabled={status === "loading"}
      />
      <button 
        type="submit"
        disabled={status === "loading"}
        className="bg-primary text-background-dark font-black px-10 py-5 rounded-2xl hover:shadow-[0_0_30px_rgba(236,149,19,0.4)] hover:bg-white transition-all whitespace-nowrap uppercase text-[10px] tracking-[0.2em] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <span className="animate-pulse">Resonating...</span>
        ) : (
          <>
            Enlighten Me <Sparkles size={14} />
          </>
        )}
      </button>
    </form>
  );
}
