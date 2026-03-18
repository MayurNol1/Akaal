import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { LogoutButton } from "@/app/dashboard/logout-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const ordersCount = await prisma.order.count({ where: { userId: session.user.id } });
  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: true },
  });

  const activeIntentions = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const recentOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const navItems = [
    { icon: "shopping_bag", label: "My Orders", count: ordersCount, href: "/orders" },
    { icon: "favorite_border", label: "Wishlist", href: "/wishlist" },
    { icon: "person", label: "Profile", href: "/profile" },
    { icon: "shield", label: "Security", href: "/settings" },
    { icon: "location_on", label: "Addresses", href: "/settings" },
  ];

  return (
    <div style={{ background: "#10100e", color: "#f0ede6", minHeight: "100vh", paddingTop: "72px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px clamp(16px,4vw,48px) 80px", display: "flex", gap: "clamp(20px,3vw,40px)", alignItems: "flex-start" }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: "270px", flexShrink: 0,
          background: "#161612", border: "1px solid rgba(212,169,74,0.1)",
          borderRadius: "18px", padding: "28px", position: "sticky", top: "90px",
        }}>
          {/* Profile */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingBottom: "24px", borderBottom: "1px solid rgba(212,169,74,0.1)", gap: "12px" }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              border: "3px solid #d4a94a", overflow: "hidden", position: "relative",
            }}>
              <Image
                src={session.user?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuDb9HxOmlluH2qUdJkJzGw0kBx49GCM0HpWK5hrJJE0zuqXExpKlTBAIgmxzvVgRKw6Ny46fqG9KIj4nLjOjB-ljAg2W6oXuI0cqCnyI1s9AgrsQRY0iHEb5g08VHRGOVW0iXh30dhVPSLnLCcyiOPTdtwdEKkinVMq3kovK6x2Vh18D0OxW5Mmkis_2TtVZpYMUI9fX2O5On1dIcDKT-3nbj64A56WkBYyMkz_dXUaIAvDxPLjRwbrDUqjz6p4febEV8uKJtS0sA4"}
                alt="Profile"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, color: "#f0ede6", margin: "0 0 2px" }}>
                {session.user?.name || "Spiritual Seeker"}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", margin: 0 }}>
                {session.user?.email}
              </p>
            </div>
            <div style={{
              padding: "4px 12px", borderRadius: "99px", fontSize: "10px", fontWeight: 700,
              background: "rgba(212,169,74,0.1)", border: "1px solid rgba(212,169,74,0.2)", color: "#d4a94a",
            }}>
              Sacred Member
            </div>
          </div>

          {/* Nav */}
          <nav style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {navItems.map(item => (
              <Link key={item.label} href={item.href} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: "10px",
                textDecoration: "none", transition: "all 0.18s",
                color: "rgba(200,195,178,0.65)", background: "transparent",
                border: "1px solid transparent",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,169,74,0.06)"; (e.currentTarget as HTMLElement).style.color = "#f0ede6"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(200,195,178,0.65)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{item.icon}</span>
                  <span style={{ fontSize: "12px", fontWeight: 500 }}>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span style={{
                    fontSize: "10px", fontWeight: 700,
                    background: "rgba(212,169,74,0.1)", color: "#d4a94a",
                    padding: "2px 8px", borderRadius: "99px",
                  }}>{item.count}</span>
                )}
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(212,169,74,0.1)" }}>
            <LogoutButton />
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Greeting */}
          <div style={{ marginBottom: "8px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "8px" }}>Welcome back</p>
            <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "clamp(28px,3vw,38px)", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
              Namaste, <em style={{ color: "#d4a94a" }}>{session?.user?.name?.split(" ")[0] || "Seeker"}</em> 🙏
            </h1>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { icon: "shopping_bag", label: "Total Orders", value: ordersCount, unit: "orders" },
              { icon: "favorite_border", label: "Wishlist", value: activeIntentions, unit: "saved" },
              { icon: "stars", label: "Loyalty Points", value: ordersCount * 150, unit: "pts" },
            ].map(stat => (
              <div key={stat.label} style={{
                background: "#161612", border: "1px solid rgba(212,169,74,0.1)",
                borderRadius: "14px", padding: "20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(212,169,74,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>{stat.icon}</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", fontWeight: 500 }}>{stat.label}</span>
                </div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 700, color: "#f0ede6", margin: "0 0 2px" }}>{stat.value}</p>
                <p style={{ fontSize: "10px", color: "rgba(160,155,135,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.unit}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "14px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid rgba(212,169,74,0.08)" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "#f0ede6", margin: 0 }}>Recent Orders</h2>
              <Link href="/orders" style={{ fontSize: "12px", color: "#d4a94a", textDecoration: "none", fontWeight: 600 }}>View All</Link>
            </div>

            {recentOrders.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "rgba(212,169,74,0.12)", display: "block", marginBottom: "12px" }}>inventory_2</span>
                <p style={{ fontSize: "14px", color: "rgba(160,155,135,0.45)", fontStyle: "italic" }}>No orders yet. Begin your sacred journey.</p>
                <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "16px", padding: "10px 20px", background: "rgba(212,169,74,0.08)", color: "#d4a94a", borderRadius: "8px", textDecoration: "none", fontSize: "12px", fontWeight: 700, border: "1px solid rgba(212,169,74,0.14)" }}>
                  Browse Collections
                </Link>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(212,169,74,0.08)" }}>
                    {["Order ID", "Date", "Status", "Total", ""].map(h => (
                      <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(160,155,135,0.45)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid rgba(212,169,74,0.05)", transition: "background 0.15s" }}>
                      <td style={{ padding: "14px 24px", fontFamily: "monospace", fontSize: "11px", color: "#d4a94a" }}>#AK-{order.id.slice(-6).toUpperCase()}</td>
                      <td style={{ padding: "14px 24px", color: "rgba(160,155,135,0.45)" }}>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                      <td style={{ padding: "14px 24px" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: "99px", fontSize: "10px", fontWeight: 700,
                          background: order.status === "DELIVERED" ? "rgba(37,226,244,0.08)" : "rgba(212,169,74,0.08)",
                          border: `1px solid ${order.status === "DELIVERED" ? "rgba(37,226,244,0.2)" : "rgba(212,169,74,0.2)"}`,
                          color: order.status === "DELIVERED" ? "#25e2f4" : "#d4a94a",
                        }}>{order.status}</span>
                      </td>
                      <td style={{ padding: "14px 24px", fontFamily: "var(--font-serif)", fontSize: "14px", fontWeight: 700, color: "#f0ede6" }}>₹{Number(order.total).toFixed(0)}</td>
                      <td style={{ padding: "14px 24px" }}>
                        <Link href={`/orders/${order.id}`} style={{ fontSize: "11px", color: "#d4a94a", textDecoration: "none", fontWeight: 600 }}>View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {[
              { icon: "shopping_bag", label: "Browse Collections", sub: "Discover new artifacts", href: "/products", color: "#d4a94a" },
              { icon: "favorite_border", label: "My Wishlist", sub: "Saved items", href: "/wishlist", color: "#f87171" },
              { icon: "support_agent", label: "Get Support", sub: "We're here to help", href: "mailto:support@akal.com", color: "#25e2f4" },
            ].map(action => (
              <Link key={action.label} href={action.href} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#161612", border: "1px solid rgba(212,169,74,0.08)",
                  borderRadius: "14px", padding: "20px",
                  transition: "transform 0.2s, border-color 0.2s",
                  cursor: "pointer",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,169,74,0.2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,169,74,0.08)"; }}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${action.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px", color: action.color }}>{action.icon}</span>
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#f0ede6", margin: "0 0 4px" }}>{action.label}</p>
                  <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", margin: 0 }}>{action.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
