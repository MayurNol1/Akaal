"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NotificationBell } from "./notification-bell";

const navItems = [
  { href: "/admin", icon: "grid_view", label: "Overview", exact: true },
  { href: "/admin/products", icon: "inventory_2", label: "Products" },
  { href: "/admin/orders", icon: "receipt_long", label: "Orders" },
  { href: "/admin/users", icon: "group", label: "Users" },
  { href: "/admin/settings", icon: "settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [globalSearch, setGlobalSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated" && session?.user?.role !== "ADMIN") router.push("/");
  }, [status, session, router]);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    router.push(`/admin/products?search=${encodeURIComponent(globalSearch)}`);
    setGlobalSearch("");
  };

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#10100e", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <svg style={{ animation: "spin 1s linear infinite" }} width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="rgba(212,169,74,0.15)" strokeWidth="3" />
            <path d="M20 4 A16 16 0 0 1 36 20" stroke="#d4a94a" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Loading…</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "ADMIN")) return null;

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div style={{ minHeight: "100vh", background: "#10100e", color: "#f0ede6", display: "flex", overflow: "hidden" }}>
      <aside style={{ width: sidebarCollapsed ? "64px" : "240px", flexShrink: 0, background: "#161612", borderRight: "1px solid rgba(212,169,74,0.1)", display: "flex", flexDirection: "column", transition: "width 0.3s cubic-bezier(.4,0,.2,1)", overflow: "hidden", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40 }}>
        <div style={{ height: "64px", display: "flex", alignItems: "center", padding: sidebarCollapsed ? "0 16px" : "0 20px", borderBottom: "1px solid rgba(212,169,74,0.1)", gap: "12px", flexShrink: 0 }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(212,169,74,0.12)", border: "1px solid rgba(212,169,74,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 48 48" fill="#d4a94a"><path d="M8.578 8.578C5.528 11.628 3.451 15.515 2.61 19.745 1.768 23.976 2.2 28.361 3.85 32.346 5.501 36.331 8.297 39.738 11.883 42.134 15.47 44.53 19.686 45.81 24 45.81c4.313 0 8.53-1.28 12.117-3.676 3.586-2.396 6.382-5.803 8.033-9.788 1.65-3.985 2.082-8.37 1.241-12.601-.842-4.23-2.919-8.117-5.969-11.167L24 24 8.578 8.578Z" /></svg>
          </div>
          {!sidebarCollapsed && <div><span style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 700, letterSpacing: "0.1em", color: "#d4a94a" }}>AKAAL</span><span style={{ fontSize: "9px", display: "block", color: "rgba(160,155,135,0.45)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Admin Panel</span></div>}
        </div>
        <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
          {!sidebarCollapsed && <p style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(160,155,135,0.3)", padding: "0 6px 8px", margin: 0 }}>Navigation</p>}
          {navItems.map(item => {
            const active = isActive(item);
            return (
              <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "12px", padding: sidebarCollapsed ? "10px" : "10px 12px", borderRadius: "10px", textDecoration: "none", justifyContent: sidebarCollapsed ? "center" : "flex-start", background: active ? "rgba(212,169,74,0.12)" : "transparent", border: active ? "1px solid rgba(212,169,74,0.2)" : "1px solid transparent", color: active ? "#d4a94a" : "rgba(200,195,178,0.65)", transition: "all 0.18s" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
                {!sidebarCollapsed && <span style={{ fontSize: "12px", fontWeight: active ? 700 : 500, whiteSpace: "nowrap" }}>{item.label}</span>}
                {!sidebarCollapsed && active && <span style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#d4a94a" }} />}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(212,169,74,0.1)" }}>
          {!sidebarCollapsed && <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 6px", marginBottom: "4px" }}><div style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(212,169,74,0.3)", flexShrink: 0, background: "rgba(212,169,74,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#d4a94a" }}>person</span></div><div><p style={{ fontSize: "12px", fontWeight: 700, color: "#f0ede6", margin: 0 }}>{session?.user?.name || "Admin"}</p><p style={{ fontSize: "9px", color: "rgba(160,155,135,0.45)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Administrator</p></div></div>}
          <button onClick={() => signOut({ callbackUrl: "/" })} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", justifyContent: sidebarCollapsed ? "center" : "flex-start", padding: sidebarCollapsed ? "10px" : "9px 12px", borderRadius: "8px", background: "transparent", border: "none", cursor: "pointer", color: "rgba(160,155,135,0.45)", fontSize: "12px", fontWeight: 500, transition: "color 0.18s, background 0.18s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.06)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(160,155,135,0.45)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>logout</span>
            {!sidebarCollapsed && "Sign Out"}
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: sidebarCollapsed ? "64px" : "240px", transition: "margin-left 0.3s cubic-bezier(.4,0,.2,1)", minHeight: "100vh", overflowY: "auto" }}>
        <header style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(16px,3vw,40px)", background: "rgba(16,16,14,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(212,169,74,0.08)", position: "sticky", top: 0, zIndex: 30, gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ width: "36px", height: "36px", borderRadius: "8px", background: "transparent", border: "1px solid rgba(212,169,74,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(160,155,135,0.45)", transition: "all 0.18s" }}><span className="material-symbols-outlined" style={{ fontSize: "16px" }}>menu</span></button>
            <form onSubmit={handleGlobalSearch} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(212,169,74,0.04)", border: "1px solid rgba(212,169,74,0.08)", borderRadius: "8px", padding: "0 12px", height: "36px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "15px", color: "rgba(160,155,135,0.45)" }}>search</span>
              <input type="text" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} placeholder="Search products, orders…" style={{ background: "none", border: "none", outline: "none", fontSize: "12px", color: "#f0ede6", width: "200px", fontFamily: "var(--font-sans)" }} />
            </form>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <NotificationBell />
            <Link href="/" style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", textDecoration: "none", padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(212,169,74,0.08)", transition: "all 0.18s" }}>← Back to Site</Link>
          </div>
        </header>
        <div style={{ flex: 1, padding: "clamp(20px,3vw,40px)", position: "relative" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
