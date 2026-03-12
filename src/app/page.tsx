import Link from 'next/link';
import { auth } from "@/auth";
import Image from "next/image";
import { 
  Sparkles, 
  Leaf, 
  Wind, 
  Compass, 
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Star
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/spiritual_products_hero_1773122562782.png" 
            alt="Spiritual Essence" 
            fill 
            className="object-cover opacity-60 scale-105 animate-slow-zoom"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-gold/20 text-gold text-xs font-bold uppercase tracking-[0.2em]">
            <Sparkles size={14} />
            Authentic Spiritual Artifacts
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white via-white to-gray-500 pb-2">
            Akaal <span className="gold-gradient italic">Collection</span>
          </h1>
          
          <p className="mt-6 text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Elevate your spiritual journey with hand-selected artifacts from across the mystical lands. 
            Tradition, purity, and vibration in every piece.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/products"
              className="rounded-full bg-gold/90 text-black px-10 py-4 text-sm font-bold shadow-2xl hover:bg-gold transition-all duration-300 hover:scale-105 flex items-center gap-2 group"
            >
              Explore Collection
              <ShoppingBag size={18} className="group-hover:rotate-12 transition-transform" />
            </Link>
            
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-full glass px-8 py-4 text-sm font-bold border-white/10 hover:bg-white/5 transition-all duration-300"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full glass px-10 py-4 text-sm font-bold border-white/10 hover:bg-white/5 transition-all duration-300 flex items-center gap-2 group"
              >
                Join the Circle
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-1 h-12 rounded-full bg-white/10 border-white/10" />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <CategoryCard icon={<Sparkles size={24} />} title="Rudraksha" />
          <CategoryCard icon={<Wind size={24} />} title="Premium Incense" />
          <CategoryCard icon={<Leaf size={24} />} title="Ayurvedic Oils" />
          <CategoryCard icon={<Compass size={24} />} title="Sacred Statues" />
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-white/2 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <TrustCard 
              icon={<ShieldCheck className="text-gold" />}
              title="Purity Guaranteed"
              desc="Authenticity certificates for all our high-vibration products."
            />
            <TrustCard 
              icon={<Wind className="text-saffron" />}
              title="Tradition Conscious"
              desc="Sourced directly from traditional artisans and deep lineages."
            />
            <TrustCard 
              icon={<Leaf className="text-emerald-500" />}
              title="Purely Natural"
              desc="No chemicals, no toxins. Only what mother nature offers."
            />
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-500">
              Featured Selection
            </h2>
            <p className="text-zinc-500 mt-2">Curated items to harmonize your space.</p>
          </div>
          <Link href="/products" className="text-gold text-sm font-bold flex items-center gap-2 hover:underline">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <ProductCard 
             image="/product_rudraksha_mala_1773122587537.png" 
             title="Authentic 5-Mukhi Rudraksha" 
             price="$89" 
             tag="Best Seller"
           />
           <ProductCard 
             image="/product_incense_sticks_1773122608818.png" 
             title="Premium Sandalwood Sticks" 
             price="$24"
             tag="Limited"
           />
           <ProductCard 
             image="/product_rudraksha_mala_1773122587537.png" 
             title="Sacred Meditation Bead Set" 
             price="$145"
             tag="Exclusive"
           />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <h3 className="text-2xl font-bold italic gold-gradient mb-8 leading-none">Akaal</h3>
        <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed">
          The timeless journey back to self begins with the right environment. 
          Follow our path for more spiritual insights.
        </p>
        <div className="mt-10 flex justify-center gap-8 text-xs font-bold text-zinc-600 uppercase tracking-widest">
           <a href="#" className="hover:text-gold transition-colors">Instagram</a>
           <a href="#" className="hover:text-gold transition-colors">Philosophy</a>
           <a href="#" className="hover:text-gold transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}

function CategoryCard({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="group glass border border-white/5 p-8 rounded-[40px] text-center hover:border-white/20 transition-all duration-500 cursor-pointer overflow-hidden relative">
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className={`h-16 w-16 mx-auto bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 text-gold`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold group-hover:tracking-wider transition-all duration-500">{title}</h3>
    </div>
  );
}

function TrustCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="space-y-4">
      <div className="h-12 w-12 mx-auto flex items-center justify-center">
        {icon}
      </div>
      <h4 className="text-lg font-bold">{title}</h4>
      <p className="text-sm text-zinc-500 leading-relaxed max-w-[250px] mx-auto">{desc}</p>
    </div>
  );
}

function ProductCard({ image, title, price, tag }: { image: string, title: string, price: string, tag?: string }) {
  return (
    <div className="group space-y-4 animate-fade-in cursor-pointer">
      <div className="aspect-[4/5] w-full relative overflow-hidden rounded-[3rem] border border-white/10">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        {tag && (
          <div className="absolute top-6 right-6 glass px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
            {tag}
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-105 active:scale-95 leading-none">
            Quick Add
          </button>
        </div>
      </div>
      <div className="px-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold leading-tight group-hover:text-gold transition-colors">{title}</h3>
          <span className="text-gold font-bold">{price}</span>
        </div>
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className="fill-gold text-gold" />
          ))}
          <span className="text-[10px] text-zinc-500 ml-2">(48 reviews)</span>
        </div>
      </div>
    </div>
  );
}
