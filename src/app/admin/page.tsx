import Link from "next/link";
import { AdminImage } from "./admin-image";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const usersCount = await prisma.user.count();
  const ordersCount = await prisma.order.count();
  const revenueAgg = await prisma.order.aggregate({ _sum: { total: true } });
  const totalRevenue = revenueAgg._sum.total ? Number(revenueAgg._sum.total) : 0;
  const productsCount = await prisma.product.count({ where: { isActive: true } });

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(todayDate);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const recentOrders = await prisma.order.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { total: true, createdAt: true },
  });

  const dailyRevenue = Array(7).fill(0);
  const daysLabels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayDate);
    d.setDate(todayDate.getDate() - i);
    daysLabels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
  }
  recentOrders.forEach((order) => {
    const orderDay = new Date(order.createdAt);
    orderDay.setHours(0, 0, 0, 0);
    const diffDays = Math.round((todayDate.getTime() - orderDay.getTime()) / (1000 * 60 * 60 * 24));
    const index = 6 - diffDays;
    if (index >= 0 && index < 7) dailyRevenue[index] += Number(order.total);
  });

  const maxRevenue = Math.max(...dailyRevenue, 1);
  const points = dailyRevenue.map((val, i) => ({ x: i * (1000 / 6), y: 180 - (val / maxRevenue) * 160 }));
  const linePath = points.length > 0
    ? `M${points[0].x},${points[0].y} ` + points.slice(1).map((p, i) => {
        const pp = points[i];
        return `C${pp.x + (p.x - pp.x) / 2},${pp.y} ${pp.x + (p.x - pp.x) / 2},${p.y} ${p.x},${p.y}`;
      }).join(" ")
    : "";
  const fillPath = linePath ? `${linePath} L1000,200 L0,200 Z` : "";

  const cardStyle = {
    background: "#161612",
    border: "1px solid rgba(212,169,74,0.1)",
    borderRadius: "16px", padding: "24px",
    position: "relative" as const, overflow: "hidden",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "6px" }}>Dashboard</p>
          <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
            Admin <em style={{ color: "#d4a94a" }}>Overview</em>
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            padding: "7px 14px", borderRadius: "8px", fontSize: "11px",
            background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.14)",
            color: "rgba(200,195,178,0.65)", display: "flex", alignItems: "center", gap: "6px",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#d4a94a" }}>calendar_today</span>
            {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", fontSize: "11px", background: "rgba(37,226,244,0.08)", border: "1px solid rgba(37,226,244,0.2)", color: "#25e2f4" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#25e2f4", animation: "dot-blink 2s ease-in-out infinite" }} />
            Live
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {[
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: "payments", color: "#d4a94a", sub: "All time" },
          { label: "Total Orders", value: ordersCount, icon: "receipt_long", color: "#25e2f4", sub: "All time" },
          { label: "Active Products", value: productsCount, icon: "inventory_2", color: "#bb86fc", sub: "Currently listed" },
          { label: "Customers", value: usersCount, icon: "group", color: "#ff9933", sub: "Registered users" },
        ].map(stat => (
          <div key={stat.label} style={cardStyle}>
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: `${stat.color}08`, filter: "blur(20px)" }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: stat.color }}>{stat.icon}</span>
              </div>
              <span style={{ fontSize: "9px", fontWeight: 700, color: stat.color, textTransform: "uppercase", letterSpacing: "0.1em", background: `${stat.color}10`, padding: "3px 8px", borderRadius: "99px" }}>Live</span>
            </div>
            <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", marginBottom: "4px", fontWeight: 500 }}>{stat.label}</p>
            <p style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 700, color: "#f0ede6", margin: "0 0 4px" }}>
              {stat.value}
            </p>
            <p style={{ fontSize: "10px", color: "rgba(160,155,135,0.3)" }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Quick Links */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "16px", alignItems: "start" }}>
        {/* Revenue Chart */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 600, color: "#f0ede6", margin: "0 0 4px" }}>Revenue Flow</p>
              <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)" }}>Last 7 days</p>
            </div>
            <span style={{ fontSize: "22px", fontFamily: "var(--font-serif)", fontWeight: 700, color: "#d4a94a" }}>₹{dailyRevenue.reduce((a,b) => a+b, 0).toLocaleString("en-IN")}</span>
          </div>
          <div style={{ position: "relative", height: "200px" }}>
            <svg style={{ width: "100%", height: "100%" }} preserveAspectRatio="none" viewBox="0 0 1000 200">
              <defs>
                <linearGradient id="chartGrad2" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#d4a94a" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#d4a94a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={fillPath} fill="url(#chartGrad2)" />
              <path d={linePath} fill="none" stroke="#d4a94a" strokeWidth="3" strokeLinecap="round" />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="5" fill="#d4a94a" fillOpacity="0.8" />
              ))}
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", padding: "0 2px" }}>
              {daysLabels.map((d, i) => (
                <span key={i} style={{ fontSize: "10px", color: "rgba(160,155,135,0.45)" }}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { href: "/admin/products/new", icon: "add_circle", label: "Add Product", sub: "List a new artifact" },
            { href: "/admin/orders", icon: "receipt_long", label: "View Orders", sub: `${ordersCount} total orders` },
            { href: "/admin/users", icon: "group", label: "Manage Users", sub: `${usersCount} customers` },
          ].map(action => (
            <Link key={action.href} href={action.href} style={{ textDecoration: "none" }}>
              <div style={{
                ...cardStyle, padding: "16px", display: "flex", alignItems: "center", gap: "12px",
                transition: "border-color 0.18s, transform 0.18s",
                cursor: "pointer",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,169,74,0.2)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,169,74,0.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(212,169,74,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>{action.icon}</span>
                </div>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#f0ede6", margin: "0 0 2px" }}>{action.label}</p>
                  <p style={{ fontSize: "10px", color: "rgba(160,155,135,0.45)", margin: 0 }}>{action.sub}</p>
                </div>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "rgba(160,155,135,0.3)", marginLeft: "auto" }}>chevron_right</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
            Recent <em style={{ color: "#d4a94a" }}>Products</em>
          </h2>
          <Link href="/admin/products" style={{ fontSize: "12px", color: "#d4a94a", textDecoration: "none", fontWeight: 600 }}>
            Manage All
          </Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(212,169,74,0.08)" }}>
                {["Product", "SKU", "Category", "Stock", "Price", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(160,155,135,0.45)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const stockStatus = p.stock === 0 ? "Out of Stock" : p.stock <= 10 ? "Low Stock" : "In Stock";
                const statusColor = p.stock === 0 ? "#f87171" : p.stock <= 10 ? "#ff9933" : "#25e2f4";
                const statusBg = p.stock === 0 ? "rgba(248,113,113,0.08)" : p.stock <= 10 ? "rgba(255,153,51,0.08)" : "rgba(37,226,244,0.08)";

                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid rgba(212,169,74,0.04)", transition: "background 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,169,74,0.03)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden", background: "#1c1c18", flexShrink: 0, position: "relative" }}>
                          <AdminImage src={p.imageUrl || ""} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p style={{ fontFamily: "var(--font-serif)", fontSize: "13px", fontWeight: 600, color: "#f0ede6", margin: "0 0 2px" }}>{p.name}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "11px", color: "#d4a94a" }}>AKL-{p.id.slice(0, 6).toUpperCase()}</td>
                    <td style={{ padding: "12px 16px", color: "rgba(160,155,135,0.45)", fontSize: "11px" }}>{p.category?.name || "—"}</td>
                    <td style={{ padding: "12px 16px", color: "rgba(200,195,178,0.65)" }}>{p.stock} units</td>
                    <td style={{ padding: "12px 16px", fontFamily: "var(--font-serif)", fontSize: "14px", fontWeight: 700, color: "#f0ede6" }}>₹{Number(p.price).toLocaleString("en-IN")}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "99px", fontSize: "10px", fontWeight: 700,
                        background: statusBg, color: statusColor,
                        border: `1px solid ${statusColor}30`,
                      }}>{stockStatus}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
