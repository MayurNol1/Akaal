import Link from 'next/link';
import Image from "next/image";
import { 
  Sparkles, 
  ArrowRight,
  Mail,
  Share2,
  Globe
} from "lucide-react";

import { ProductService } from "@/modules/products/service";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";
import { NewsletterForm } from "@/components/home/newsletter-form";

export const dynamic = "force-dynamic";

// Define a safe local type for featured products mapping
type FeaturedProduct = {
  id: string;
  name: string;
  price: number | { toString: () => string };
  description: string | null;
  imageUrl: string | null;
};

export default async function HomePage() {
  const featuredProducts = await ProductService.getProducts({ isActive: true, limit: 3 });
  const categories = await prisma.category.findMany({
    take: 4,
    orderBy: { name: 'asc' }
  });


  return (
    <div className="bg-background-dark text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1510250669225-3b91fa04db14?q=80&w=2070&auto=format&fit=crop" 
            alt="Mystical Himalayan Mountains" 
            fill 
            className="object-cover opacity-40 scale-100 animate-slow-zoom"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-background-dark/40 via-background-dark/60 to-background-dark" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0907_100%)] opacity-60" />
        </div>

        {/* Trishul Aura Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none z-0">
          <span className="material-symbols-outlined text-[600px] text-primary">architecture</span>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Ethereal Collections</span>
          
          <div className="space-y-6">
            <h1 className="font-serif text-6xl md:text-8xl font-black text-white leading-tight mb-6 drop-shadow-2xl">
              The Eternal <br /> 
              <span className="text-white">Path</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto leading-relaxed tracking-wide">
              Experience the divine essence of Lord Mahadev through our curated selection of premium spiritual artifacts and sacred instruments.
            </p>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/products"
              className="bg-primary text-background-dark font-bold px-10 py-5 rounded-xl hover:shadow-[0_0_20px_rgba(236,149,19,0.4)] transition-all transform hover:-translate-y-1 flex items-center gap-3 group text-xs uppercase tracking-widest text-center"
            >
              Shop Collections
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/about"
              className="bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold px-10 py-5 rounded-xl hover:bg-white/10 transition-all text-xs uppercase tracking-widest text-center"
            >
              Our Story
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="material-symbols-outlined text-slate-500 text-3xl">expand_more</span>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <h3 className="font-serif text-4xl font-bold text-white mb-4">Featured Sacred Collections</h3>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
          </div>
          <Link href="/products" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all uppercase text-[10px] tracking-widest">
            View All Artifacts <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {featuredProducts.slice(0, 3).map((product: FeaturedProduct) => (
             <ProductCard 
               key={product.id}
               id={product.id}
               image={product.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBboiZGWGY25VY5ghi5zCQu-8-LW2SGbonewIxYNqbmWpZ8MMAREwVSOkOyLGpLs9MNzGtbM78ylOLxhGGlZ-nrGmmg2Lk7vLuG4z_NXgo-eQLeFEY0pkkTIzFmuSYG0b6054n2JA8HYW19DztyzSCHonr8UO1rNFCewnnfTi7qPJYvuLCKJEXdVYN5PSqApQnLKqrZwWU8AlvOGBJUzp_ECWYm0rHla7c4Ty_ue7lzKyBVy-urYbFz11wt47ZIqhWjSi3N58o_z0E"} 
               title={product.name} 
               price={`$${parseFloat(product.price.toString()).toFixed(2)}`} 
               desc={product.description || "Authentic sacred item."}
             />
           ))}
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-24 bg-primary/5 border-y border-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,149,19,0.05),transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <Sparkles className="mx-auto text-primary" size={48} />
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Join the Eternal Path</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Subscribe to receive spiritual insights, exclusive mantras, and early access to our most rare handcrafted collections.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-dark pt-24 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-1 space-y-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-4xl">flare</span>
                <h1 className="font-serif text-2xl font-black tracking-tighter text-white uppercase">AKAAL</h1>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                Dedicated to bringing the essence of spiritual ancient wisdom into the modern home through ethically sourced sacred artifacts.
              </p>
              <div className="flex gap-4">
                <SocialIcon icon={<Globe size={18} />} href="https://akal.com" />
                <SocialIcon icon={<Mail size={18} />} href="mailto:sanctuary@akal.com" />
                <SocialIcon icon={<Share2 size={18} />} href="#" />
              </div>
            </div>
            
            <FooterColumn 
              title="Shop" 
              links={categories.map((c: Category) => ({ label: c.name, href: `/products?category=${c.id}` }))} 
            />
            <FooterColumn 
              title="Wisdom Center" 
              links={[
                { label: "Our Story", href: "/about" },
                { label: "Spiritual Path", href: "/dashboard" },
                { label: "Sacred Wishes", href: "/wishlist" }
              ]} 
            />
            <FooterColumn 
              title="Support" 
              links={[
                { label: "My Orders", href: "/orders" },
                { label: "Privacy Sanctuary", href: "/settings" },
                { label: "Contact Us", href: "mailto:support@akal.com" }
              ]} 
            />
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
              <span>© 2026 Akaal Spiritual Collections. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 opacity-30">
              <span className="material-symbols-outlined text-4xl text-white">architecture</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ id, image, title, price, desc }: { id: string, image: string, title: string, price: string, desc: string }) {
  return (
    <div className="group relative bg-white/5 border border-primary/10 rounded-2xl p-5 transition-all hover:border-primary/40 hover:bg-white/10 flex flex-col items-center text-center">
      <Link href={`/products/${id}`} className="aspect-square w-full rounded-xl overflow-hidden mb-6 bg-background-dark border border-white/5 relative block">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      </Link>
      <div className="w-full space-y-3">
        <div className="flex justify-between items-center px-1">
          <Link href={`/products/${id}`}>
            <h4 className="text-xl font-serif font-bold text-white group-hover:text-primary transition-colors">{title}</h4>
          </Link>
          <span className="text-primary font-black text-lg">{price}</span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed font-light px-1 line-clamp-2">{desc}</p>
        <div className="mt-4">
           <AddToCartButton productId={id} />
        </div>
      </div>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string, links: { label: string, href: string }[] }) {
  return (
    <div className="space-y-8">
      <h5 className="text-white font-bold uppercase text-xs tracking-widest">{title}</h5>
      <ul className="space-y-4 text-sm text-slate-500 font-light">
        {links.map(link => (
          <li key={link.label}><Link href={link.href} className="hover:text-primary transition-colors">{link.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <Link href={href} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-colors border border-white/5 group">
      {icon}
    </Link>
  );
}
