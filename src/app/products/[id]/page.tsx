import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductService } from "@/modules/products/service";
import { 
  ChevronRight,
  ShieldCheck,
  Zap,
  Leaf,
  Info,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { LikeButton } from "@/components/products/like-button";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product;
  let relatedProducts = [];

  try {
    product = await ProductService.getProductById(id);
    relatedProducts = await ProductService.getProducts({ isActive: true, limit: 4 });
  } catch {
    return notFound();
  }

  const price = parseFloat(product.price.toString()).toFixed(2);
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-background-dark min-h-screen text-white pb-20">
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-12">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight size={10} />
          <span className="text-white">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
          {/* Media Column */}
          <div className="relative group">
            <div className="aspect-4/5 rounded-2xl overflow-hidden bg-white/5 border border-primary/10 flex items-center justify-center p-8 relative">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,149,19,0.1),transparent_70%)] opacity-50" />
               <Image 
                  src={product.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDhUoQEqkA_Om7CkOE64DQkjxkQPVHY0m6kCVlGMqoa27iyAsb1tNY2oEznkAdBjGDHarZRnkOZAClq7cDZbCbsnGcugUpKtKzddOm_AkZrOGrCdyfUIfDuT7oYFN35Qxpmw9O1_noM9nCLDQgNcar9aAOw4riOnly6gAJNlGux8KA0cg-AO9O5jSOpnO2splk7K60h0xzHKGPDHrCX42ZIxNDIynPEo-6tMLFHSVw9Mk6eYcDcfRFOcpztZCVX-xzCWlD_s3sYqRE"}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-[0_0_40px_rgba(236,149,19,0.2)] p-12"
                  priority
               />
               {isOutOfStock && (
                 <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-md flex items-center justify-center z-20">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] border border-white/10 px-8 py-3 rounded-full">Transcended State</span>
                 </div>
               )}
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-4">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square rounded-xl bg-white/5 border border-primary/5 hover:border-primary/20 cursor-pointer transition-all overflow-hidden relative">
                    <Image src={product.imageUrl || ""} alt="thumbnail" fill className="object-cover opacity-60 hover:opacity-100 transition-opacity" />
                  </div>
               ))}
            </div>
          </div>

          {/* Info Column */}
          <div className="flex flex-col gap-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={14} />
                Sacred Origins Verified
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-black leading-tight text-white">{product.name}</h1>
              <div className="flex items-center gap-6">
                <p className="text-4xl font-serif font-bold text-primary">${price}</p>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Manifestation ID</span>
                  <span className="text-xs font-mono text-zinc-400">#AK-{id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </div>

            <p className="text-lg text-slate-400 leading-relaxed font-light italic">
              {product.description || "A divine instrument for meditation and spiritual alignment. Sourced with ancient intention, this piece resonates with the energy of the eternal."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-primary/10">
               <FeatureItem icon={<Zap size={18} className="text-primary" />} label="Pure Energy" sub="Ritualized Sourcing" />
               <FeatureItem icon={<Leaf size={18} className="text-primary" />} label="Sustainable" sub="Eco-Conscious Path" />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <AddToCartButton productId={product.id} />
              </div>
              <LikeButton productId={product.id} />
            </div>

            {/* Accordions */}
            <div className="space-y-2">
              <ProductAccordion 
                title="Spiritual Essence" 
                content={product.spiritualEssence || "This artifact is governed by cosmic principles that enhance mental peace, spiritual growth, and meditative focus."} 
              />
              <ProductAccordion 
                title="Specifications" 
                content={product.specifications || "Hand-crafted using traditional methods. Each unit is unique in its physical manifestation yet identical in energy."} 
              />
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-32 space-y-12">
           <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-white uppercase tracking-widest text-lg px-2 border-l-4 border-primary ml-2 pl-6">Sacred Pairings</h2>
              <div className="flex gap-4">
                <button className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-primary hover:border-primary transition-all">
                  <ArrowLeft size={18} />
                </button>
                <button className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-primary hover:border-primary transition-all">
                  <ArrowRight size={18} />
                </button>
              </div>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.slice(0, 4).map((rp: import('@prisma/client').Product) => (
                <Link key={rp.id} href={`/products/${rp.id}`} className="group space-y-4">
                   <div className="aspect-square rounded-2xl bg-white/5 border border-white/5 overflow-hidden transition-all group-hover:border-primary/30 relative">
                     <Image src={rp.imageUrl || ""} alt={rp.name} fill className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                   </div>
                   <div className="space-y-1 px-2">
                     <h3 className="font-serif text-lg text-white group-hover:text-primary transition-colors">{rp.name}</h3>
                     <p className="text-primary font-black text-sm">${parseFloat(rp.price.toString()).toFixed(2)}</p>
                   </div>
                </Link>
              ))}
           </div>
        </section>
      </main>
    </div>
  );
}

function FeatureItem({ icon, label, sub }: { icon: React.ReactNode, label: string, sub: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-widest text-white">{label}</span>
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{sub}</span>
      </div>
    </div>
  );
}

function ProductAccordion({ title, content }: { title: string, content: string }) {
  return (
    <details className="group border-b border-primary/10 py-5">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <div className="flex items-center gap-3">
          <Info size={16} className="text-primary/40 group-open:text-primary" />
          <span className="font-serif font-bold text-lg text-white group-hover:text-primary transition-colors">{title}</span>
        </div>
        <ChevronRight size={18} className="text-zinc-600 group-open:rotate-90 transition-transform" />
      </summary>
      <div className="pt-6 text-slate-400 text-sm leading-relaxed font-light pl-7">
        {content}
      </div>
    </details>
  );
}
