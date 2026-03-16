"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Loader2, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { CartPlaceholder } from "@/components/cart/cart-placeholder";
import { WishlistCount } from "@/components/products/wishlist-count";
import { useState, useEffect } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname, isMobileMenuOpen]);

  // Hide global navbar on specialized pages (Auth, Dashboard, Admin)
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");
  const isManagementPage = pathname?.startsWith("/admin");

  if (isAuthPage || isManagementPage) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background-dark/70 backdrop-blur-xl border-b border-primary/10 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="material-symbols-outlined text-primary text-3xl group-hover:rotate-90 transition-transform duration-500">flare</span>
              <h1 className="font-serif text-2xl font-black tracking-tighter text-white">AKAAL</h1>
            </Link>
            <div className="hidden md:flex items-center gap-8 border-l border-white/5 pl-8">
              <Link className="text-sm font-medium text-slate-400 hover:text-primary transition-colors uppercase tracking-widest text-[10px]" href="/products">Products</Link>
              <Link className="text-sm font-medium text-slate-400 hover:text-primary transition-colors uppercase tracking-widest text-[10px]" href="/about">About</Link>
              {session && (
                <>
                  <Link className="text-sm font-medium text-slate-400 hover:text-primary transition-colors uppercase tracking-widest text-[10px]" href="/orders">Orders</Link>
                  <Link className="text-sm font-medium text-slate-400 hover:text-primary transition-colors uppercase tracking-widest text-[10px]" href="/dashboard">Profile</Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <form action="/products" className="relative hidden xl:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
              <input 
                name="query"
                className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary focus:border-primary w-48 text-white placeholder-slate-600 outline-none transition-all focus:w-64" 
                placeholder="Search resonance..." 
                type="text"
              />
            </form>

            <div className="flex items-center gap-1 md:gap-4">
              <Link href="/wishlist" className="relative p-2 text-primary hover:scale-110 transition-transform flex items-center group">
                <span className="material-symbols-outlined text-2xl group-hover:fill-current" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
                <WishlistCount />
              </Link>

              <Link href="/cart" className="relative p-2 text-primary hover:scale-110 transition-transform flex items-center">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
                <CartPlaceholder />
              </Link>

              <div className="h-4 w-px bg-white/10 mx-2 hidden md:block" />

              {status === "loading" ? (
                <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
              ) : session ? (
                <div className="hidden md:flex items-center gap-4">
                  {session.user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary border border-primary/20 px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/10 transition-all animate-pulse"
                      >
                        Admin
                      </Link>
                    )}
                    <Link href="/dashboard" title="Profile Dashboard" className="h-9 w-9 rounded-full border border-primary/30 overflow-hidden cursor-pointer hover:border-primary transition-colors relative shadow-2xl">
                      <Image 
                        className="object-cover" 
                        src={session.user?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuDb9HxOmlluH2qUdJkJzGw0kBx49GCM0HpWK5hrJJE0zuqXExpKlTBAIgmxzvVgRKw6Ny46fqG9KIj4nLjOjB-ljAg2W6oXuI0cqCnyI1s9AgrsQRY0iHEb5g08VHRGOVW0iXh30dhVPSLnLCcyiOPTdtwdEKkinVMq3kovK6x2Vh18D0OxW5Mmkis_2TtVZpYMUI9fX2O5On1dIcDKT-3nbj64A56WkBYyMkz_dXUaIAvDxPLjRwbrDUqjz6p4febEV8uKJtS0sA4"} 
                        alt="User profile"
                        fill
                      />
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      title="Sever Connection"
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors rounded-full hover:bg-red-400/5 group"
                    >
                      <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:block bg-primary text-background-dark px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl shadow-primary/5 active:scale-95"
                >
                  Enter
                </Link>
              )}

              {/* Mobile Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                <span className="material-symbols-outlined text-3xl">
                  {isMobileMenuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-700 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-background-dark/95 backdrop-blur-3xl" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute left-0 right-0 top-20 bg-background-dark border-b border-primary/10 p-10 space-y-8 transition-transform duration-700 ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"}`}>
          <div className="flex flex-col gap-8">
            <Link className="text-2xl font-serif font-black text-white hover:text-primary transition-colors" href="/products">Products</Link>
            <Link className="text-2xl font-serif font-black text-white hover:text-primary transition-colors" href="/about">About Story</Link>
            {session && (
              <>
                <Link className="text-2xl font-serif font-black text-white hover:text-primary transition-colors" href="/orders">Manifest Logs</Link>
                <Link className="text-2xl font-serif font-black text-white hover:text-primary transition-colors" href="/dashboard">Spiritual Desk</Link>
              </>
            )}
            
            <div className="h-px w-full bg-white/5" />
            
            {session ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl border border-primary/30 overflow-hidden relative">
                    <Image src={session.user?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuDb9HxOmlluH2qUdJkJzGw0kBx49GCM0HpWK5hrJJE0zuqXExpKlTBAIgmxzvVgRKw6Ny46fqG9KIj4nLjOjB-ljAg2W6oXuI0cqCnyI1s9AgrsQRY0iHEb5g08VHRGOVW0iXh30dhVPSLnLCcyiOPTdtwdEKkinVMq3kovK6x2Vh18D0OxW5Mmkis_2TtVZpYMUI9fX2O5On1dIcDKT-3nbj64A56WkBYyMkz_dXUaIAvDxPLjRwbrDUqjz6p4febEV8uKJtS0sA4"} alt="User" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-white">{session.user?.name}</p>
                    <p className="text-[10px] text-zinc-500">{session.user?.email}</p>
                  </div>
                </div>
                <button onClick={() => signOut()} className="w-full py-5 bg-white/5 text-red-400 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-400/10">Disconnect Sanctuary</button>
              </div>
            ) : (
              <Link href="/login" className="w-full py-5 bg-primary text-background-dark text-center rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl">Enter Sanctuary</Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
