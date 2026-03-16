import Link from "next/link";
import Image from "next/image";
import { Product } from "@prisma/client";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { LikeButton } from "./like-button";

export function ProductCardStitch({ product }: { product: Product }) {
  const price = parseFloat(product.price.toString()).toFixed(2);
  
  return (
    <div className="product-card flex flex-col rounded-2xl group animate-fade-in relative z-10 h-full">
      {/* Stardust particles */}
      <div className="stardust stardust-1" />
      <div className="stardust stardust-2" />
      <div className="stardust stardust-3" />
      <div className="stardust stardust-4" />
      <div className="stardust stardust-5" />
      
      <div className="aspect-square relative overflow-hidden bg-black/60 flex items-center justify-center">
        <div className="aura-effect" />
        <Link href={`/products/${product.id}`} className="w-full h-full relative z-10 block">
          <Image 
            src={product.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuC2twSVAOXjZdzCFiaaztJDcLEzGlPds0YTe_hdPNq4mkQeQZn0P2UHpnlvS9Ar9OpH3rzzcFZap-fiq4A5oVCPHvxZiPyj0MqhR3TruAwl1Y6UKtfly_FpHs2NAzPZUhFK1qHwd0qP_Y9HHCQ54jzA-sLEd2AkjHALpRlndFajV3z18YbaJDQ4w7kjXYIRlqGMwqspYLVozmU79nazaqtSQOT7maA_wt6KK8a3YEGY2ZvuqiBTPvNXUrBoIr2WpdsTnahducj-snk"} 
            alt={product.name} 
            fill 
            className="product-image-stitch object-cover" 
          />
        </Link>
        
        <LikeButton productId={product.id} variant="card" />
        
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-5 left-5 z-20">
            <span className="bg-primary text-background-dark text-[9px] font-black px-3 py-1.5 rounded-lg shadow-2xl uppercase tracking-widest">
              Rare Core
            </span>
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-1 relative z-10 space-y-4">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-black">Sacred Relic</span>
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-serif text-2xl text-white group-hover:text-primary transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-zinc-500 font-light leading-relaxed line-clamp-2">
            Ancient vibrations captured in a physical vessel, hand-crafted for the modern sanctuary.
          </p>
        </div>
        
        <div className="mt-auto pt-4 flex items-center justify-between gap-4">
          <span className="font-serif text-2xl text-primary font-bold tracking-tight">${price}</span>
          <AddToCartButton productId={product.id} variant="minimal" />
        </div>
      </div>
    </div>
  );
}
