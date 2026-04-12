import Link from "next/link";
import { auth } from "@/auth";
import { CartService } from "@/modules/cart/service";
import RazorpayButton from "@/components/checkout/razorpay-button";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div style={{ background: "#10100e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ maxWidth: "400px", width: "100%", textAlign: "center", background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "24px", padding: "56px 40px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#d4a94a" }}>lock</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", fontWeight: 600, color: "#f0ede6", marginBottom: "10px" }}>Sign In to Checkout</h1>
          <p style={{ fontSize: "13px", color: "rgba(160,155,135,0.45)", lineHeight: 1.6, marginBottom: "28px" }}>Please sign in to complete your purchase securely.</p>
          <Link href="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#d4a94a", color: "#10100e", borderRadius: "10px", padding: "13px 28px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>login</span>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const cart = await CartService.getCart(session.user.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = (cart as any)?.items ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subtotal = items.reduce((sum: number, item: any) => sum + Number(item.product.price) * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  return (
    <div style={{ background: "#10100e", color: "#f0ede6", minHeight: "100vh", paddingTop: "72px" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "48px clamp(16px,4vw,48px) 80px" }}>

        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "rgba(160,155,135,0.45)", marginBottom: "32px" }}>
          <Link href="/" style={{ color: "rgba(160,155,135,0.45)", textDecoration: "none" }}>Home</Link>
          <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>chevron_right</span>
          <Link href="/cart" style={{ color: "rgba(160,155,135,0.45)", textDecoration: "none" }}>Cart</Link>
          <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>chevron_right</span>
          <span style={{ color: "#d4a94a" }}>Checkout</span>
        </nav>

        {/* Progress Steps */}
        <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "40px", maxWidth: "480px" }}>
          {[
            { step: 1, label: "Cart", done: true },
            { step: 2, label: "Checkout", active: true },
            { step: 3, label: "Confirmation", done: false },
          ].map((s, i) => (
            <div key={s.step} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 700,
                  background: s.done ? "#d4a94a" : s.active ? "rgba(212,169,74,0.15)" : "rgba(212,169,74,0.05)",
                  border: s.done ? "none" : s.active ? "1px solid #d4a94a" : "1px solid rgba(212,169,74,0.1)",
                  color: s.done ? "#10100e" : s.active ? "#d4a94a" : "rgba(160,155,135,0.3)",
                }}>
                  {s.done ? <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>check</span> : s.step}
                </div>
                <span style={{ fontSize: "11px", fontWeight: 600, color: s.active ? "#f0ede6" : "rgba(160,155,135,0.35)" }}>{s.label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: "1px", background: s.done ? "#d4a94a" : "rgba(212,169,74,0.1)", margin: "0 12px" }} />}
            </div>
          ))}
        </div>

        {items.length === 0 ? (
          <div style={{ minHeight: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", background: "#161612", border: "1px solid rgba(212,169,74,0.08)", borderRadius: "16px", textAlign: "center", padding: "40px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "64px", color: "rgba(212,169,74,0.12)" }}>shopping_bag</span>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "#f0ede6", fontStyle: "italic" }}>Your cart is empty.</p>
            <Link href="/products" style={{ padding: "11px 24px", background: "#d4a94a", color: "#10100e", borderRadius: "9px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", textDecoration: "none" }}>Browse Collections</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "start" }}>

            {/* ── LEFT: Shipping Form ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Shipping Info */}
              <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "14px", padding: "24px" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "#f0ede6", marginBottom: "20px" }}>
                  Shipping <em style={{ color: "#d4a94a" }}>Information</em>
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  {[
                    { label: "First Name", name: "firstName", type: "text", placeholder: "Priya", full: false },
                    { label: "Last Name", name: "lastName", type: "text", placeholder: "Sharma", full: false },
                    { label: "Email Address", name: "email", type: "email", placeholder: "priya@gmail.com", full: true },
                    { label: "Phone Number", name: "phone", type: "tel", placeholder: "+91 98765 43210", full: true },
                    { label: "Address Line 1", name: "address1", type: "text", placeholder: "House / Flat No.", full: true },
                    { label: "City", name: "city", type: "text", placeholder: "Mumbai", full: false },
                    { label: "Pincode", name: "pincode", type: "text", placeholder: "400001", full: false },
                  ].map(field => (
                    <div key={field.name} style={{ gridColumn: field.full ? "1 / -1" : "auto", display: "flex", flexDirection: "column", gap: "5px" }}>
                      <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "rgba(160,155,135,0.45)" }}>{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        style={{
                          background: "rgba(212,169,74,0.03)", border: "1px solid rgba(212,169,74,0.1)",
                          borderRadius: "8px", padding: "11px 13px",
                          fontSize: "13px", color: "#f0ede6", outline: "none",
                          fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "14px", padding: "24px" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "#f0ede6", marginBottom: "16px" }}>
                  Payment <em style={{ color: "#d4a94a" }}>Method</em>
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { id: "stripe", icon: "credit_card", label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex" },
                    { id: "upi", icon: "smartphone", label: "UPI Payment", sub: "GPay, PhonePe, BHIM" },
                    { id: "cod", icon: "local_shipping", label: "Cash on Delivery", sub: "Pay when delivered" },
                  ].map((method, i) => (
                    <label key={method.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "10px", border: `1px solid ${i === 0 ? "#d4a94a" : "rgba(212,169,74,0.1)"}`, background: i === 0 ? "rgba(212,169,74,0.05)" : "transparent", cursor: "pointer" }}>
                      <input type="radio" name="payment" defaultChecked={i === 0} style={{ accentColor: "#d4a94a" }} />
                      <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>{method.icon}</span>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#f0ede6", margin: 0 }}>{method.label}</p>
                        <p style={{ fontSize: "10px", color: "rgba(160,155,135,0.45)", margin: 0 }}>{method.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {[
                  { icon: "lock", label: "Secure Payment", sub: "256-bit SSL" },
                  { icon: "verified_user", label: "Buyer Protection", sub: "30-day guarantee" },
                  { icon: "eco", label: "Ethically Sourced", sub: "Sacred origins" },
                ].map(t => (
                  <div key={t.label} style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.08)", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#d4a94a", display: "block", marginBottom: "6px" }}>{t.icon}</span>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#f0ede6", marginBottom: "2px" }}>{t.label}</p>
                    <p style={{ fontSize: "10px", color: "rgba(160,155,135,0.45)" }}>{t.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <aside style={{ position: "sticky", top: "90px" }}>
              <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "18px", padding: "24px" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "#f0ede6", marginBottom: "20px" }}>Order Summary</h2>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid rgba(212,169,74,0.08)" }}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {items.map((item: any) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                      <span style={{ color: "rgba(200,195,178,0.65)" }}>{item.product.name} × {item.quantity}</span>
                      <span style={{ fontWeight: 600, color: "#f0ede6" }}>₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                  {[
                    { label: "Subtotal", val: `₹${subtotal.toFixed(0)}` },
                    { label: "Shipping", val: shipping === 0 ? "Free" : `₹${shipping}`, accent: shipping === 0 },
                    { label: "GST (5%)", val: `₹${tax.toFixed(0)}` },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span style={{ color: "rgba(160,155,135,0.45)" }}>{row.label}</span>
                      <span style={{ fontWeight: 600, color: row.accent ? "#25e2f4" : "#f0ede6" }}>{row.val}</span>
                    </div>
                  ))}
                </div>

                <div style={{ height: "1px", background: "rgba(212,169,74,0.1)", margin: "0 0 16px" }} />

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#f0ede6" }}>Total</span>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "26px", fontWeight: 700, color: "#d4a94a" }}>₹{total.toFixed(0)}</span>
                </div>

                {/* CTA */}
                <RazorpayButton total={total} cartId={cart?.id || ""} />

                <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(160,155,135,0.45)", marginTop: "10px" }}>
                  🔒 Secured by Razorpay
                </p>

                <div style={{ marginTop: "16px", padding: "14px", borderRadius: "10px", background: "rgba(212,169,74,0.03)", border: "1px solid rgba(212,169,74,0.08)", fontSize: "12px", color: "rgba(200,195,178,0.65)", fontStyle: "italic", textAlign: "center", lineHeight: 1.5 }}>
                  &ldquo;Your contribution sustains the keepers of ancient sacred crafts.&rdquo;
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
