"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { Product } from "@prisma/client";
import { ProductCardStitch } from "@/components/products/product-card";

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      const likedIds: string[] = [];
      
      // Collect all liked IDs from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("liked_")) {
          const id = key.replace("liked_", "");
          likedIds.push(id);
        }
      }

      if (likedIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/products?ids=${likedIds.join(",")}`);
        const data = await res.json();
        
        // Handle both cases: raw array or wrapped { success, data }
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();

    // Listen for custom event to refresh when items are unliked from within cards
    window.addEventListener("wishlist-updated", loadWishlist);
    return () => window.removeEventListener("wishlist-updated", loadWishlist);
  }, []);

  return (
    <div className="bg-background-dark text-white min-h-screen">
      <main className="max-w-7xl mx-auto pt-32 pb-20 px-6 space-y-12">
        <header className="space-y-6 border-b border-primary/10 pb-10">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-primary/50" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Divine Desires</p>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-black bg-linear-to-r from-primary via-white to-white bg-clip-text text-transparent transform -translate-x-1">
            Sacred <span className="italic text-white">Wishlist</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl font-serif italic text-lg leading-relaxed">
            Artifacts that have resonated with your spirit. Revisit the vibrations you&apos;ve felt before they transcend this realm.
          </p>
        </header>

        {loading ? (
          <div className="h-[40vh] flex flex-col items-center justify-center space-y-4">
             <Loader2 className="text-primary animate-spin" size={40} />
             <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Summoning your collection...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="h-[50vh] flex flex-col items-center justify-center bg-white/2 border border-white/5 rounded-[40px] space-y-10 text-center px-6 transition-all hover:border-primary/10 group overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,149,19,0.03),transparent_70%)]" />
            
            <div className="relative group/icon">
               <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150 group-hover/icon:scale-200 transition-transform duration-1000" />
               <Heart size={80} strokeWidth={1} className="relative z-10 text-zinc-900 group-hover/icon:text-primary/20 transition-colors duration-700" />
            </div>
            
            <div className="space-y-4 relative z-10">
               <h2 className="font-serif italic text-3xl tracking-widest text-white">Your spirit is currently unburdened.</h2>
               <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-[0.4em] max-w-md mx-auto leading-loose">No artifacts have yet captured your gaze. Explore the collections and listen for a resonance.</p>
            </div>
            
            <Link 
              href="/products" 
              className="px-12 py-5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-gold transition-all duration-700 active:scale-95 group relative overflow-hidden"
            >
               <span className="relative z-10">Listen to the Call</span>
               <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCardStitch key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
