"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, LogIn, UserPlus, LogOut, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { CartPlaceholder } from "./cart-placeholder";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Hide global navbar on specialized pages (Auth, Dashboard, Admin)
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");
  const isManagementPage = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  if (isAuthPage || isManagementPage) return null;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl h-16 flex items-center justify-between px-8 animate-fade-in">
      <Link href="/">
        <Logo />
      </Link>

      <div className="flex items-center gap-6">
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">Home</Link>
          <Link href="/products" className="text-sm font-bold text-zinc-400 hover:text-gold transition-colors">Shop</Link>
          <Link href="#" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">About</Link>
          <CartPlaceholder className="ml-4" />
        </div>
        
        {status === "loading" ? (
          <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
        ) : session ? (
          <div className="flex items-center gap-6">
            {session.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-sm font-bold text-gold hover:text-gold/80 transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-full group overflow-hidden relative"
              >
                <LayoutDashboard size={14} className="group-hover:scale-110 transition-transform" />
                Admin Hub
              </Link>
            )}
            <Link
              href="/dashboard"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-red-400 transition-colors group"
            >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-300 hover:text-zinc-100 flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-full transition-all"
            >
              <LogIn size={16} />
              Log In
            </Link>
            <Link
              href="/register"
              className="bg-zinc-100 text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-white transition-all flex items-center gap-2 shadow-lg shadow-white/5"
            >
              <UserPlus size={16} />
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
