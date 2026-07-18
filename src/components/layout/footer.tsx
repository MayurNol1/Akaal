"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/logo";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Collections", href: "/products" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings", href: "/settings" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "My Orders", href: "/orders" },
      { label: "Help & Support", href: "/support" },
      { label: "Contact Us", href: "mailto:support@akaal.com" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();

  const hidden =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password");

  if (hidden) return null;

  return (
    <footer style={{ borderTop: "1px solid rgba(212,169,74,0.07)", padding: "clamp(48px,6vw,88px) clamp(16px,4vw,48px) clamp(24px,3vw,40px)", background: "#0a0908" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "clamp(24px,4vw,60px)", marginBottom: "clamp(32px,4vw,60px)" }}>
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Logo />
            <p style={{ fontSize: "13px", fontWeight: 300, lineHeight: 1.7, color: "rgba(160,155,135,0.4)", maxWidth: "260px", margin: 0 }}>
              Dedicated to bringing sacred ancient wisdom into the modern home through ethically sourced spiritual artifacts.
            </p>
            <a
              href="mailto:support@akaal.com"
              aria-label="Email Akaal support"
              style={{ width: "34px", height: "34px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "rgba(200,195,178,0.5)", transition: "all 0.2s" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>mail</span>
            </a>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <h5 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,230,0.8)", margin: 0 }}>{col.title}</h5>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} style={{ fontSize: "13px", fontWeight: 300, color: "rgba(160,155,135,0.4)", textDecoration: "none", transition: "color 0.2s" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.35)", margin: 0 }}>© 2026 Akaal Spiritual Arts. All rights reserved.</p>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/privacy" style={{ fontSize: "11px", color: "rgba(160,155,135,0.35)", textDecoration: "none", transition: "color 0.2s" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize: "11px", color: "rgba(160,155,135,0.35)", textDecoration: "none", transition: "color 0.2s" }}>Terms of Service</Link>
            <Link href="/support" style={{ fontSize: "11px", color: "rgba(160,155,135,0.35)", textDecoration: "none", transition: "color 0.2s" }}>Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
