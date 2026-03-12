import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductService } from "@/modules/products/product.service";
import { 
  ChevronLeft, 
  Leaf, 
  Wind, 
  ShieldCheck, 
  Star,
  PackageCheck,
  PackageX
} from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product;

  try {
    product = await ProductService.getProductById(id);
  } catch {
    return notFound();
  }

  const price = parseFloat(product.price.toString()).toFixed(2);
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-black min-h-screen text-white pb-32">
       {/* Background Aesthetics */}
       <div className="fixed inset-x-0 top-0 h-[60vh] bg-linear-to-b from-zinc-900/30 to-black pointer-events-none -z-10" />

       {/* Header Spacer */}
       <div className="h-32" />

       <div className="max-w-7xl mx-auto px-6">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mb-12 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Sacred Collection
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 animate-in fade-in slide-in-from-bottom-5 duration-700">
             {/* Media Gallery */}
             <div className="space-y-6">
                <div className="aspect-5/6 w-full relative overflow-hidden rounded-[3.5rem] border border-white/5 glass shadow-2xl group">
                   <Image 
                     src={product.imageUrl || "/spiritual_products_hero_1773122562782.png"}
                     alt={product.name}
                     fill
                     priority
                     className="object-cover transition-transform duration-1000 group-hover:scale-110"
                   />
                   
                   {isOutOfStock && (
                     <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-white/40 text-xs font-bold uppercase tracking-[0.5em] border border-white/10 px-8 py-3 rounded-full">Ascended / Out of Stock</span>
                     </div>
                   )}
                </div>
                
                {/* Visual Trust Indicators */}
                <div className="grid grid-cols-3 gap-4">
                   <div className="glass aspect-square rounded-3xl flex flex-col items-center justify-center border-white/5 space-y-2 group hover:border-gold/20 transition-all">
                      <Leaf className="text-zinc-600 group-hover:text-gold transition-colors" size={20} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Pure Organic</span>
                   </div>
                   <div className="glass aspect-square rounded-3xl flex flex-col items-center justify-center border-white/5 space-y-2 group hover:border-gold/20 transition-all">
                      <Wind className="text-zinc-600 group-hover:text-gold transition-colors" size={20} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">High Vibe</span>
                   </div>
                   <div className="glass aspect-square rounded-3xl flex flex-col items-center justify-center border-white/5 space-y-2 group hover:border-gold/20 transition-all">
                      <ShieldCheck className="text-zinc-600 group-hover:text-gold transition-colors" size={20} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Hand Sourced</span>
                   </div>
                </div>
             </div>

             {/* Details Section */}
             <div className="flex flex-col space-y-12">
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                         <Star size={12} className="fill-gold text-gold" />
                         <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Sacred Tier Selection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOutOfStock ? (
                          <div className="flex items-center gap-1.5 text-zinc-600">
                             <PackageX size={14} />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Out of Stock</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-500">
                             <PackageCheck size={14} />
                             <span className="text-[10px] font-bold uppercase tracking-widest">In Stock ({product.stock})</span>
                          </div>
                        )}
                      </div>
                   </div>

                   <h1 className="text-5xl md:text-6xl font-bold tracking-tight italic gold-gradient leading-tight">
                     {product.name}
                   </h1>

                   <div className="flex items-end gap-4">
                      <span className="text-4xl font-bold text-white tracking-widest uppercase">${price}</span>
                      <span className="text-xs text-zinc-500 font-medium mb-1.5 uppercase tracking-widest italic">Sacred Offering Price</span>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">Divine Essence</h3>
                   <p className="text-xl text-zinc-400 leading-relaxed font-serif italic">
                     {product.description || "A timeless spiritual artifact curated to harmonize your energy fields and elevate your divine consciousness. Crafted with ancient intention."}
                   </p>
                </div>

                <div className="space-y-8 pt-8 border-t border-white/5">
                   <div className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Acquire Artifact</h3>
                      <AddToCartButton productId={product.id} />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                      <div className="space-y-2">
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Shipping Info</h4>
                         <p className="text-xs text-zinc-500 leading-relaxed font-medium">Secured shipping via global couriers. Arrives in 7-14 lunar cycles.</p>
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Return Policy</h4>
                         <p className="text-xs text-zinc-500 leading-relaxed font-medium">Sacred artifacts can be exchanged if the vibration doesn&apos;t align with your path.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
