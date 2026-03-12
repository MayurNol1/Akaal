import Link from "next/link";
import Image from "next/image";
import { ProductService } from "@/modules/products/product.service";
import { ShoppingBag, Star, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductListingPage() {
  const products = await ProductService.getProducts({ isActive: true });

  return (
    <div className="bg-black min-h-screen pb-24">
      {/* Header Spacer */}
      <div className="h-24" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest">
              Sacred Inventory
            </div>
            <h1 className="text-5xl md:text-6xl font-bold italic gold-gradient tracking-tight">
              Akaal Collection
            </h1>
            <p className="text-zinc-500 max-w-xl text-lg leading-relaxed font-medium">
              Carefully curated spiritual artifacts, harvested and crafted with intention 
              to support your journey toward inner clarity.
            </p>
          </div>
          
          <div className="glass px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-4 text-xs font-bold text-zinc-400">
            <span>{products.length} Products Found</span>
            <div className="w-px h-4 bg-white/10" />
            <select className="bg-transparent border-none focus:outline-none text-zinc-200 cursor-pointer">
              <option>Newest Arrivals</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="h-[40vh] flex flex-col items-center justify-center glass rounded-[4rem] border border-white/5 space-y-6">
            <div className="h-16 w-16 bg-white/5 rounded-3xl flex items-center justify-center">
              <ShoppingBag className="text-zinc-600" size={32} />
            </div>
            <p className="text-zinc-500 font-medium">The collection is currently quiet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <div className="group space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="aspect-4/5 w-full relative overflow-hidden rounded-[3rem] border border-white/10 glass transition-all duration-500 group-hover:border-gold/20 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.05)]">
        <Image 
          src={product.imageUrl || "/spiritual_products_hero_1773122562782.png"} 
          alt={product.name} 
          fill 
          className="object-cover transition-transform duration-1000 group-hover:scale-110" 
        />
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3">
          <Link 
            href={`/products/${product.id}`}
            className="h-12 w-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
          >
            <Eye size={20} />
          </Link>
          <button className="h-12 px-6 bg-gold text-black rounded-full text-xs font-bold leading-none hover:scale-110 active:scale-95 transition-all shadow-xl flex items-center gap-2">
            <ShoppingBag size={18} />
            Add to Ritual
          </button>
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-6 left-6 bg-saffron text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
            Few Left
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
             <span className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] border border-white/10 px-6 py-2 rounded-full">Coming Soon</span>
          </div>
        )}
      </div>

      <div className="px-2 space-y-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg font-bold leading-tight group-hover:text-gold transition-colors duration-300">
            {product.name}
          </h3>
          <span className="text-gold font-bold text-lg whitespace-nowrap">
            ${parseFloat(product.price.toString()).toFixed(2)}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 overflow-hidden">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className="fill-gold text-gold" />
            ))}
          </div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">Verified Origin</span>
        </div>
      </div>
    </div>
  );
}
