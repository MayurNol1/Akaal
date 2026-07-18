import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { OrderStatusLabels, type OrderStatusType } from "@/constants/order-status";
import { OrderStatusSelect } from "./status-select";

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<OrderStatusType, { color: string; bg: string; border: string; icon: string }> = {
  PENDING:   { color: "#ff9933",  bg: "rgba(255,153,51,0.08)",  border: "rgba(255,153,51,0.22)",  icon: "schedule" },
  PAID:      { color: "#d4a94a",  bg: "rgba(212,169,74,0.08)",  border: "rgba(212,169,74,0.22)",  icon: "payments" },
  SHIPPED:   { color: "#bb86fc",  bg: "rgba(187,134,252,0.08)", border: "rgba(187,134,252,0.22)", icon: "local_shipping" },
  DELIVERED: { color: "#25e2f4",  bg: "rgba(37,226,244,0.08)",  border: "rgba(37,226,244,0.22)",  icon: "check_circle" },
  CANCELLED: { color: "#f87171",  bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.22)", icon: "cancel" },
};

export default async function AdminOrdersPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return null;

  const ordersDb = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: { include: { product: true } } },
  });

  const orders = ordersDb.map((val) => ({
    id: val.id,
    user: val.user.name || "Unknown",
    email: val.user.email,
    items: val.items.map((i) => i.product.name).join(", "),
    price: `₹${parseFloat(val.total.toString()).toLocaleString("en-IN")}`,
    date: val.createdAt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    status: val.status as OrderStatusType,
  }));

  const pending = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", paddingBottom: "24px", borderBottom: "1px solid rgba(212,169,74,0.08)" }}>
        <div>
          <div style={{ width: "40px", height: "2px", background: "#d4a94a", borderRadius: "99px", marginBottom: "12px" }} />
          <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(160,155,135,0.45)", marginBottom: "6px", margin: "0 0 6px" }}>Order Registry</p>
          <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "clamp(26px,3vw,36px)", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
            Orders <em style={{ color: "#d4a94a" }}>Management</em>
          </h1>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ padding: "10px 16px", borderRadius: "10px", background: "rgba(255,153,51,0.08)", border: "1px solid rgba(255,153,51,0.18)", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#ff9933", fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>schedule</span>
            {pending} Pending
          </div>
          <div style={{ padding: "10px 16px", borderRadius: "10px", background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.18)", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#d4a94a", fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>receipt_long</span>
            {orders.length} Total
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(212,169,74,0.08)", background: "rgba(212,169,74,0.02)" }}>
                {["Order ID", "Customer", "Items", "Amount", "Date", "Status", "Update"].map((h) => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(160,155,135,0.4)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "64px 24px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "rgba(212,169,74,0.12)" }}>receipt_long</span>
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "rgba(200,195,178,0.45)", fontStyle: "italic", margin: 0 }}>No orders yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const st = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
                  return (
                    <tr 
                      key={order.id}
                      className="hover-bg-gold-low"
                      style={{ borderBottom: "1px solid rgba(212,169,74,0.04)" }}
                    >
                      <td style={{ padding: "14px 16px", fontFamily: "monospace", fontSize: "11px", color: "#d4a94a" }}>
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "13px", fontWeight: 600, color: "#f0ede6", margin: "0 0 2px" }}>{order.user}</p>
                        <p style={{ fontSize: "10px", color: "rgba(160,155,135,0.4)", margin: 0 }}>{order.email}</p>
                      </td>
                      <td style={{ padding: "14px 16px", color: "rgba(200,195,178,0.65)", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.items || "—"}</td>
                      <td style={{ padding: "14px 16px", fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 700, color: "#f0ede6", whiteSpace: "nowrap" }}>{order.price}</td>
                      <td style={{ padding: "14px 16px", color: "rgba(160,155,135,0.4)", whiteSpace: "nowrap", fontSize: "11px" }}>{order.date}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "99px", fontSize: "10px", fontWeight: 700, color: st.color, background: st.bg, border: `1px solid ${st.border}`, whiteSpace: "nowrap" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "12px", fontVariationSettings: "'FILL' 1" }}>{st.icon}</span>
                          {OrderStatusLabels[order.status]}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <OrderStatusSelect orderId={order.id} status={order.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
