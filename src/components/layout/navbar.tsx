"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { CartPlaceholder } from "@/components/cart/cart-placeholder";
import { WishlistCount } from "@/components/products/wishlist-count";
import { useState, useEffect } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");
  const isManagementPage = pathname?.startsWith("/admin");

  if (isAuthPage || isManagementPage) return null;

  const navLinks = [
    { href: "/products", label: "Collections" },
    { href: "/about", label: "About" },
    ...(session ? [
      { href: "/orders", label: "Orders" },
      { href: "/dashboard", label: "Profile" },
    ] : []),
  ];

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          height: "72px",
          display: "flex", alignItems: "center",
          padding: "0 clamp(16px, 4vw, 48px)",
          background: scrolled ? "rgba(16,16,14,0.95)" : "rgba(16,16,14,0.75)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          transition: "background 0.3s",
        }}
      >
        {/* Gold line accent */}
        <span style={{
          position: "absolute", bottom: 0, left: "5%", right: "5%", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(212,169,74,0.2), transparent)",
          pointerEvents: "none",
        }} />

        <div style={{
          width: "100%", maxWidth: "1280px", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px",
        }}>
          {/* Logo */}
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: "10px", textDecoration: "none",
            transition: "opacity 0.2s",
          }}>
            <div style={{
              width: "36px", height: "36px",
              background: "rgba(212,169,74,0.12)",
              border: "1px solid rgba(212,169,74,0.12)",
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px",
            }}>
              <svg width="20" height="20" viewBox="0 0 48 48" fill="#d4a94a">
                <path d="M8.578 8.578C5.528 11.628 3.451 15.515 2.61 19.745 1.768 23.976 2.2 28.361 3.85 32.346 5.501 36.331 8.297 39.738 11.883 42.134 15.47 44.53 19.686 45.81 24 45.81c4.313 0 8.53-1.28 12.117-3.676 3.586-2.396 6.382-5.803 8.033-9.788 1.65-3.985 2.082-8.37 1.241-12.601-.842-4.23-2.919-8.117-5.969-11.167L24 24 8.578 8.578Z"/>
              </svg>
            </div>
            <span style={{
              fontFamily: "var(--font-serif), 'Cormorant Garamond', serif",
              fontSize: "18px", fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#f0ede6",
            }}>AKAAL</span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }} className="hidden md:flex">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} style={{
                fontSize: "11px", fontWeight: 500,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: pathname === href ? "#d4a94a" : "rgba(200,195,178,0.65)",
                textDecoration: "none",
                transition: "color 0.2s",
                paddingBottom: "2px",
                borderBottom: pathname === href ? "1px solid #d4a94a" : "1px solid transparent",
              }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* Search */}
            <form action="/products" className="hidden xl:flex" style={{
              alignItems: "center",
              background: "rgba(212,169,74,0.04)",
              border: "1px solid rgba(212,169,74,0.1)",
              borderRadius: "8px", padding: "0 12px", height: "34px", gap: "6px",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "rgba(160,155,135,0.45)" }}>search</span>
              <input
                name="query"
                style={{
                  background: "none", border: "none", outline: "none",
                  fontSize: "12px", color: "#f0ede6", width: "130px",
                  fontFamily: "var(--font-sans)",
                }}
                placeholder="Search…"
                type="text"
              />
            </form>

            {/* Divider */}
            <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.05)", margin: "0 4px" }} />

            {/* Wishlist */}
            <Link href="/wishlist" style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "transparent", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(200,195,178,0.65)", fontSize: "20px",
              transition: "color 0.2s, background 0.2s",
              textDecoration: "none", position: "relative",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#d4a94a"; (e.currentTarget as HTMLElement).style.background = "rgba(212,169,74,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(200,195,178,0.65)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>favorite_border</span>
              <WishlistCount />
            </Link>

            {/* Cart */}
            <Link href="/cart" style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "transparent", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(200,195,178,0.65)", fontSize: "20px",
              transition: "color 0.2s, background 0.2s",
              textDecoration: "none", position: "relative",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#d4a94a"; (e.currentTarget as HTMLElement).style.background = "rgba(212,169,74,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(200,195,178,0.65)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>shopping_bag</span>
              <CartPlaceholder />
            </Link>

            {/* Auth CTA */}
            {status !== "loading" && !session ? (
              <Link href="/login" style={{
                background: "#d4a94a", color: "#1a1006",
                border: "none", cursor: "pointer",
                fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "9px 20px", borderRadius: "8px",
                textDecoration: "none",
                transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                display: "inline-flex", alignItems: "center",
                marginLeft: "4px",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#e8c06c"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#d4a94a"; }}
              >
                Sign In
              </Link>
            ) : session ? (
              <div className="hidden md:flex items-center gap-2">
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin" style={{
                    fontSize: "10px", fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "#d4a94a", textDecoration: "none",
                    padding: "6px 12px", borderRadius: "8px",
                    background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.2)",
                  }}>Admin</Link>
                )}
                <Link href="/dashboard" style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  border: "2px solid rgba(212,169,74,0.3)",
                  overflow: "hidden", cursor: "pointer", position: "relative",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "border-color 0.2s",
                  background: "rgba(212,169,74,0.05)",
                }}>
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile" fill className="object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>person</span>
                  )}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  style={{
                    width: "34px", height: "34px", borderRadius: "8px",
                    background: "transparent", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(160,155,135,0.45)", transition: "color 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(160,155,135,0.45)"; }}
                  title="Sign out"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>logout</span>
                </button>
              </div>
            ) : null}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(200,195,178,0.65)",
              }}
              className="md:hidden"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 90,
          background: "rgba(16,16,14,0.97)", backdropFilter: "blur(20px)",
          paddingTop: "80px", paddingLeft: "24px", paddingRight: "24px",
        }} className="md:hidden">
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingTop: "32px" }}>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)} style={{
                fontFamily: "var(--font-serif), 'Cormorant Garamond', serif",
                fontSize: "28px", fontWeight: 600, color: "#f0ede6",
                textDecoration: "none", transition: "color 0.2s",
              }}>
                {label}
              </Link>
            ))}
            <div style={{ height: "1px", background: "rgba(212,169,74,0.1)", margin: "8px 0" }} />
            {session ? (
              <button onClick={() => signOut()} style={{
                padding: "14px", background: "rgba(255,255,255,0.03)",
                color: "#f87171", borderRadius: "10px",
                border: "1px solid rgba(248,113,113,0.15)",
                fontSize: "12px", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.1em", cursor: "pointer",
              }}>
                Sign Out
              </button>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} style={{
                padding: "14px", background: "#d4a94a",
                color: "#1a1006", borderRadius: "10px",
                fontSize: "12px", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.1em", textAlign: "center", textDecoration: "none",
                display: "block",
              }}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
