"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  Sparkles,
  Search,
  Menu,
  ChevronRight
} from "lucide-react";

import { NotificationBell } from "./notification-bell";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [globalSearch, setGlobalSearch] = useState("");

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    router.push(`/admin/products?search=${encodeURIComponent(globalSearch)}`);
    setGlobalSearch("");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Sparkles className="text-primary animate-pulse" size={40} />
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex overflow-hidden">
      {/* Sidebar from Stitch UI */}
      <aside className="w-80 border-r border-white/5 flex flex-col p-10 space-y-12 max-lg:hidden bg-[#0f0e0b] relative z-20">
        <Link href="/admin" className="flex items-center gap-4 group px-2">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all duration-500">
             <Sparkles className="text-primary" size={20} />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-black tracking-tighter text-white uppercase group-hover:text-primary transition-colors">AKAAL</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 -mt-1">Control Hub</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-3">
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.5em] mb-6 ml-2">Administrative Path</p>
          <AdminNavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Zen Overview" active={pathname === "/admin"} />
          <AdminNavItem href="/admin/products" icon={<Package size={20} />} label="Artifact Vault" active={pathname.startsWith("/admin/products")} />
          <AdminNavItem href="/admin/orders" icon={<ShoppingBag size={20} />} label="Manifest Logs" active={pathname.startsWith("/admin/orders")} />
          <AdminNavItem href="/admin/users" icon={<Users size={20} />} label="Seeker Registry" active={pathname === "/admin/users"} />
          <AdminNavItem href="/admin/settings" icon={<Settings size={20} />} label="Core Settings" active={pathname === "/admin/settings"} />
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-6">
           <div className="flex items-center gap-4 px-4">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 p-1">
                 <img src={session?.user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} alt="Admin" className="size-full object-cover rounded-lg grayscale" />
              </div>
              <div>
                 <p className="text-[11px] font-black text-white italic">{session?.user?.name}</p>
                 <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Grand Overseer</p>
              </div>
           </div>
           <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-zinc-600 hover:text-red-400 hover:bg-red-400/5 transition-all text-[10px] font-black uppercase tracking-widest"
           >
              <LogOut size={18} />
              Sever Connection
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-y-auto">
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-6 flex-1 max-w-xl">
             <form onSubmit={handleGlobalSearch} className="relative group w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-primary transition-colors" size={16} />
                <input 
                  type="text" 
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Universal Search..." 
                  className="w-full bg-white/2 border border-white/5 rounded-2xl py-3 pl-12 pr-6 focus:outline-none focus:border-primary/20 transition-all text-[11px] font-medium placeholder:text-zinc-800 text-white"
                />
             </form>
          </div>

          <div className="flex items-center gap-6">
             <NotificationBell />
             <button className="lg:hidden h-12 w-12 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-center text-zinc-600">
                <Menu size={20} />
             </button>
          </div>
        </header>

        <div className="p-12 relative">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/2 blur-[150px] rounded-full pointer-events-none -mr-40 -mt-20" />
           {children}
        </div>
      </main>
    </div>
  );
}

function AdminNavItem({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-500 group ${
        active 
          ? "bg-primary text-background-dark shadow-2xl shadow-primary/20 translate-x-1" 
          : "text-zinc-600 hover:text-white hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-4">
        <span className={`${active ? "text-background-dark scale-110" : "group-hover:text-primary transition-colors"} duration-500`}>
          {icon}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      {active && <ChevronRight size={14} className="text-background-dark" />}
    </Link>
  );
}
