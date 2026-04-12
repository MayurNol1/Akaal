import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getOrderForUser } from "@/modules/orders/service";

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}
export const dynamic = "force-dynamic";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  PENDING:   { label: "Processing",  color: "#ff9933",  bg: "rgba(255,153,51,0.1)",  icon: "schedule" },
  PAID:      { label: "Paid",        color: "#d4a94a",  bg: "rgba(212,169,74,0.1)",  icon: "payments" },
  SHIPPED:   { label: "Shipped",     color: "#bb86fc",  bg: "rgba(187,134,252,0.1)", icon: "local_shipping" },
  DELIVERED: { label: "Delivered",   color: "#25e2f4",  bg: "rgba(37,226,244,0.1)",  icon: "check_circle" },
  CANCELLED: { label: "Cancelled",   color: "#f87171",  bg: "rgba(248,113,113,0.1)", icon: "cancel" },
};

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div style={{ background: "#10100e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", paddingTop: "96px" }}>
        <div style={{ maxWidth: "400px", width: "100%", textAlign: "center", background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "24px", padding: "56px 40px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#d4a94a" }}>lock</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", fontWeight: 600, color: "#f0ede6", marginBottom: "10px" }}>Sign In Required</h1>
          <p style={{ fontSize: "13px", color: "rgba(160,155,135,0.45)", lineHeight: 1.6, marginBottom: "28px" }}>Please sign in to view your order details.</p>
          <Link href="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#d4a94a", color: "#10100e", borderRadius: "10px", padding: "13px 28px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>login</span>Sign In
          </Link>
        </div>
      </div>
    );
  }

  const { id } = await params;
  const order = await getOrderForUser(session.user.id, id);
  if (!order) return notFound();

  const totalNumber = Number(order.total);
  const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;

  return (
    <div style={{ background: "#10100e", color: "#f0ede6", minHeight: "100vh", paddingTop: "72px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px clamp(16px,4vw,48px) 0" }}>

        {/* Back nav */}
        <Link href="/orders" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "rgba(160,155,135,0.45)", textDecoration: "none", marginBottom: "32px", transition: "color 0.2s" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span>
          Back to Orders
        </Link>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "40px" }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "6px" }}>Order Details</p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(24px,3vw,34px)", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
              #AK-{order.id.slice(-10).toUpperCase()}
            </h1>
            <p style={{ fontSize: "12px", color: "rgba(160,155,135,0.45)", marginTop: "6px" }}>
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "99px", fontSize: "12px", fontWeight: 700, color: st.color, background: st.bg, border: `1px solid ${st.color}30` }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>{st.icon}</span>
            {st.label}
          </span>
        </div>

        {/* Meta cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "32px" }}>
          {[
            { icon: "receipt_long", label: "Order ID", value: `#AK-${order.id.slice(-8).toUpperCase()}` },
            { icon: "calendar_today", label: "Order Date", value: new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
            { icon: "payments", label: "Total Amount", value: `₹${totalNumber.toLocaleString("en-IN")}` },
          ].map(m => (
            <div key={m.label} style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.08)", borderRadius: "12px", padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#d4a94a" }}>{m.icon}</span>
                <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>{m.label}</span>
              </div>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 600, color: "#f0ede6", margin: 0 }}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Order items */}
        <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.08)", borderRadius: "16px", overflow: "hidden", marginBottom: "24px" }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(212,169,74,0.07)" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
              Order <em style={{ color: "#d4a94a" }}>Items</em>
            </h2>
          </div>
          <div style={{ padding: "8px 0" }}>
            {order.items.map((item, idx) => {
              const unitPrice = Number(item.price);
              const lineTotal = unitPrice * item.quantity;
              const imgSrc = item.product.imageUrl || "";
              return (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "14px 22px",
                  borderBottom: idx < order.items.length - 1 ? "1px solid rgba(212,169,74,0.05)" : "none",
                }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "9px", overflow: "hidden", background: "#1c1c18", flexShrink: 0, position: "relative", border: "1px solid rgba(212,169,74,0.08)" }}>
                    {imgSrc ? (
                      <Image src={imgSrc} alt={item.product.name} fill style={{ objectFit: "cover" }} unoptimized={imgSrc.startsWith("/")} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "rgba(212,169,74,0.2)" }}>inventory_2</span>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 600, color: "#f0ede6", margin: "0 0 4px" }}>{item.product.name}</p>
                    <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", margin: 0 }}>
                      ₹{unitPrice.toLocaleString("en-IN")} × {item.quantity}
                    </p>
                  </div>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 700, color: "#f0ede6" }}>
                    ₹{lineTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total summary */}
        <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.08)", borderRadius: "16px", padding: "22px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "16px", borderBottom: "1px solid rgba(212,169,74,0.07)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "rgba(160,155,135,0.45)" }}>Subtotal ({order.items.length} item{order.items.length !== 1 ? "s" : ""})</span>
              <span style={{ color: "#f0ede6", fontWeight: 600 }}>₹{totalNumber.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "rgba(160,155,135,0.45)" }}>Shipping</span>
              <span style={{ color: "#25e2f4", fontWeight: 600 }}>{totalNumber >= 999 ? "Free" : "₹99"}</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "16px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#f0ede6" }}>Total Paid</span>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "26px", fontWeight: 700, color: "#d4a94a" }}>
              ₹{totalNumber.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Spiritual quote */}
        <div style={{ marginTop: "24px", padding: "20px 24px", borderRadius: "12px", background: "rgba(212,169,74,0.03)", border: "1px solid rgba(212,169,74,0.07)", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "14px", fontStyle: "italic", color: "rgba(200,195,178,0.5)", margin: "0 0 6px" }}>
            &ldquo;May these artifacts serve as a beacon on your path toward timeless clarity.&rdquo;
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", opacity: 0.3 }}>
            <Image src="/images/bg-removed-logo.png" alt="" width={32} height={40} style={{ objectFit: "contain" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
