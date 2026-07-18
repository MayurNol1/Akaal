import Link from "next/link";
import prisma from "@/lib/prisma";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, GST_RATE } from "@/lib/pricing";

export const dynamic = "force-dynamic";

/**
 * Honest system page: everything shown here is real. Integration status is
 * read from the actual environment (presence only — never values), commerce
 * constants come from src/lib/pricing.ts, and counts come from the database.
 */
export default async function AdminSettingsPage() {
  const [activeCoupons, categories, subscribers] = await Promise.all([
    prisma.coupon.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.newsletterSubscriber.count(),
  ]);

  const integrations = [
    {
      icon: "payments",
      label: "Razorpay Payments",
      configured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      hint: "RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET",
    },
    {
      icon: "webhook",
      label: "Razorpay Webhook",
      configured: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET),
      hint: "RAZORPAY_WEBHOOK_SECRET + dashboard endpoint",
    },
    {
      icon: "mail",
      label: "Transactional Email (Resend)",
      configured: Boolean(process.env.RESEND_API_KEY),
      hint: "RESEND_API_KEY — emails log to console until set",
    },
    {
      icon: "login",
      label: "Google Sign-In",
      configured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      hint: "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET",
    },
    {
      icon: "phone_iphone",
      label: "Apple Sign-In",
      configured: Boolean(process.env.APPLE_ID && process.env.APPLE_SECRET),
      hint: "APPLE_ID / APPLE_SECRET",
    },
  ];

  const constants = [
    { label: "GST Rate", value: `${GST_RATE * 100}%` },
    { label: "Shipping Fee", value: `₹${SHIPPING_FEE}` },
    { label: "Free Shipping Above", value: `₹${FREE_SHIPPING_THRESHOLD}` },
  ];

  const tools = [
    { href: "/admin/coupons", icon: "sell", label: "Coupons", sub: `${activeCoupons} active` },
    { href: "/admin/inventory", icon: "inventory_2", label: "Inventory", sub: `${categories} categories` },
    { href: "/admin/users", icon: "group", label: "Users", sub: "Roles & restrictions" },
    { href: "/admin/analytics", icon: "monitoring", label: "Analytics", sub: `${subscribers} newsletter subscribers` },
  ];

  const card: React.CSSProperties = { background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "16px", padding: "24px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ paddingBottom: "24px", borderBottom: "1px solid rgba(212,169,74,0.08)" }}>
        <div style={{ width: "40px", height: "2px", background: "#d4a94a", borderRadius: "99px", marginBottom: "12px" }} />
        <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(160,155,135,0.45)", margin: "0 0 6px" }}>System</p>
        <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "clamp(26px,3vw,36px)", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
          Store <em style={{ color: "#d4a94a" }}>Configuration</em>
        </h1>
      </div>

      <div className="layout-split" style={{ gap: "16px" }}>
        {/* Integration status */}
        <div style={card}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: "#f0ede6", margin: "0 0 6px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ display: "inline-block", width: "3px", height: "16px", background: "#d4a94a", borderRadius: "2px" }} />
            Integration Status
          </h2>
          <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", margin: "0 0 18px" }}>
            Read live from the server environment. Configure via <code style={{ color: "#d4a94a" }}>.env</code> — see <code style={{ color: "#d4a94a" }}>.env.example</code>.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {integrations.map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "13px 16px", borderRadius: "10px", background: "rgba(212,169,74,0.02)", border: "1px solid rgba(212,169,74,0.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "17px", color: "#d4a94a", flexShrink: 0 }}>{item.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(200,195,178,0.8)", margin: 0 }}>{item.label}</p>
                    <p style={{ fontSize: "10px", color: "rgba(160,155,135,0.35)", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.hint}</p>
                  </div>
                </div>
                {item.configured ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "99px", fontSize: "10px", fontWeight: 700, color: "#25e2f4", background: "rgba(37,226,244,0.08)", border: "1px solid rgba(37,226,244,0.22)", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>check_circle</span> Configured
                  </span>
                ) : (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "99px", fontSize: "10px", fontWeight: 700, color: "#ff9933", background: "rgba(255,153,51,0.08)", border: "1px solid rgba(255,153,51,0.22)", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>pending</span> Not set
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Commerce constants */}
          <div style={card}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: "#f0ede6", margin: "0 0 6px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "17px", color: "#d4a94a" }}>currency_rupee</span>
              Commerce Constants
            </h2>
            <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", margin: "0 0 16px" }}>
              Defined in <code style={{ color: "#d4a94a" }}>src/lib/pricing.ts</code> — applied to every charge and total.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {constants.map((c) => (
                <div key={c.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: "9px", background: "rgba(212,169,74,0.02)", border: "1px solid rgba(212,169,74,0.07)" }}>
                  <span style={{ fontSize: "11px", color: "rgba(160,155,135,0.6)" }}>{c.label}</span>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 700, color: "#d4a94a" }}>{c.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick tools */}
          <div style={card}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: "#f0ede6", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "17px", color: "#d4a94a" }}>bolt</span>
              Management Tools
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {tools.map((tool) => (
                <Link key={tool.href} href={tool.href} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", borderRadius: "9px", background: "rgba(212,169,74,0.02)", border: "1px solid rgba(212,169,74,0.07)", textDecoration: "none", transition: "border-color 0.2s" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#d4a94a" }}>{tool.icon}</span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#f0ede6" }}>{tool.label}</span>
                  <span style={{ fontSize: "10px", color: "rgba(160,155,135,0.4)", marginLeft: "auto" }}>{tool.sub}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "rgba(160,155,135,0.3)" }}>chevron_right</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
