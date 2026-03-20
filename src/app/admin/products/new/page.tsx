"use client";

import ProductForm from "@/components/admin/product-form";

export default function CreateProductPage() {
  return (
    <div className="space-y-12 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
           <div className="h-px w-12 bg-primary/50" />
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">Ritual of Summoning</p>
           <h1 className="text-5xl font-serif italic text-white tracking-tight">Forge <span className="text-primary not-italic">Artifact</span></h1>
        </div>
      </header>

      <div className="bg-white/2 border border-white/5 p-10 rounded-[40px] shadow-2xl">
         <ProductForm />
      </div>
    </div>
  );
}
