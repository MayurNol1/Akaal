import Link from "next/link";
import { auth } from "@/auth";
import { getOrdersForUser } from "@/modules/orders/service";

export const dynamic = "force-dynamic";

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  PENDING:   { label: "Pending",    color: "#ff9933",  bg: "rgba(255,153,51,0.08)",   border: "rgba(255,153,51,0.2)" },
  PAID:      { label: "Paid",       color: "#d4a94a",  bg: "rgba(212,169,74,0.08)",   border: "rgba(212,169,74,0.2)" },
  SHIPPED:   { label: "Shipped",    color: "#bb86fc",  bg: "rgba(187,134,252,0.08)",  border: "rgba(187,134,252,0.2)" },
  DELIVERED: { label: "Delivered",  color: "#25e2f4",  bg: "rgba(37,226,244,0.08)",   border: "rgba(37,226,244,0.2)" },
  CANCELLED: { label: "Cancelled",  color: "#f87171",  bg: "rgba(248,113,113,0.08)",  border: "rgba(248,113,113,0.2)" },
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div style={{ background: "#10100e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ maxWidth: "400px", width: "100%", textAlign: "center", background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "24px", padding: "56px 40px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#d4a94a" }}>receipt_long</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", fontWeight: 600, color: "#f0ede6", marginBottom: "10px" }}>Sign In Required</h1>
          <p style={{ fontSize: "13px", color: "rgba(160,155,135,0.45)", lineHeight: 1.6, marginBottom: "28px" }}>Please sign in to view your order history.</p>
          <Link href="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#d4a94a", color: "#10100e", borderRadius: "10px", padding: "13px 28px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>login</span>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const orders = await getOrdersForUser(session.user.id);

  return (
    <div style={{ background: "#10100e", color: "#f0ede6", minHeight: "100vh", paddingTop: "72px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px clamp(16px,4vw,48px) 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "8px" }}>Account</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
              My <em style={{ color: "#d4a94a" }}>Orders</em>
            </h1>
            <span style={{ fontSize: "12px", color: "rgba(160,155,135,0.45)", padding: "6px 14px", background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "8px" }}>
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div style={{ minHeight: "360px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", background: "#161612", border: "1px solid rgba(212,169,74,0.08)", borderRadius: "16px", textAlign: "center", padding: "56px 40px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "72px", color: "rgba(212,169,74,0.12)" }}>inventory_2</span>
            <div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 600, color: "#f0ede6", fontStyle: "italic", marginBottom: "8px" }}>No orders yet</h2>
              <p style={{ fontSize: "13px", color: "rgba(160,155,135,0.45)" }}>Begin your sacred journey and your orders will appear here.</p>
            </div>
            <Link href="/products" style={{ padding: "12px 28px", background: "#d4a94a", color: "#10100e", borderRadius: "10px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
              Browse Collections
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {orders.map((order) => {
              const st = statusConfig[order.status] || { label: order.status, color: "#d4a94a", bg: "rgba(212,169,74,0.08)", border: "rgba(212,169,74,0.2)" };
              return (
                <Link key={order.id} href={`/orders/${order.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "#161612", border: "1px solid rgba(212,169,74,0.08)",
                    borderRadius: "14px", padding: "20px 24px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: "16px", flexWrap: "wrap",
                    transition: "border-color 0.18s, transform 0.18s",
                    cursor: "pointer",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,169,74,0.2)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,169,74,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                  >
                    {/* Left */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#d4a94a" }}>shopping_bag</span>
                      </div>
                      <div>
                        <p style={{ fontSize: "11px", color: "#d4a94a", fontFamily: "monospace", marginBottom: "4px" }}>#AK-{order.id.slice(-8).toUpperCase()}</p>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: "#f0ede6", margin: "0 0 4px" }}>
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </p>
                        <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)" }}>
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", marginBottom: "4px" }}>Total</p>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 700, color: "#f0ede6" }}>₹{Number(order.total).toLocaleString("en-IN")}</p>
                      </div>
                      <span style={{
                        padding: "5px 12px", borderRadius: "99px", fontSize: "10px", fontWeight: 700,
                        color: st.color, background: st.bg, border: `1px solid ${st.border}`,
                        whiteSpace: "nowrap",
                      }}>{st.label}</span>
                      <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "rgba(160,155,135,0.3)" }}>chevron_right</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
