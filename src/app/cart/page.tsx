import Link from "next/link";
import { auth } from "@/auth";
import { CartService } from "@/modules/cart/service";
import type { CartWithItems } from "@/modules/cart/types";
import { CartItems } from "@/components/cart/cart-items";
import { CouponForm } from "@/components/cart/coupon-form";
import { calculateOrderTotals, FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { CouponService } from "@/modules/coupons/service";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div style={{
        background: "#10100e", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}>
        <div style={{
          maxWidth: "420px", width: "100%", textAlign: "center",
          background: "#161612", border: "1px solid rgba(212,169,74,0.1)",
          borderRadius: "24px", padding: "56px 40px",
        }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "20px",
            background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.14)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#d4a94a" }}>shopping_bag</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 600, color: "#f0ede6", marginBottom: "10px" }}>
            Sign in Required
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(160,155,135,0.45)", lineHeight: 1.65, marginBottom: "32px" }}>
            Please sign in to view your cart and proceed to checkout.
          </p>
          <Link href="/login" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            background: "#d4a94a", color: "#10100e", borderRadius: "10px",
            padding: "14px 28px", fontSize: "12px", fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none",
            transition: "background 0.2s",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>login</span>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const cart = (await CartService.getCart(session.user.id)) as CartWithItems | null;
  const items = cart?.items ?? [];
  const coupon = await CouponService.getUsableCoupon(
    (cart as { couponCode?: string | null } | null)?.couponCode
  );
  const { subtotal, discount, shipping, tax, total } = calculateOrderTotals(
    items.map((item) => ({ price: item.product.price, quantity: item.quantity })),
    coupon?.discountPercent ?? 0
  );
  const freeShippingThreshold = FREE_SHIPPING_THRESHOLD;

  return (
    <div style={{ background: "#10100e", color: "#f0ede6", minHeight: "100vh", paddingTop: "72px" }}>

      {/* Promo Bar */}
      <div style={{
        background: "#1c1c15",
        padding: "14px clamp(16px,4vw,60px)",
        textAlign: "center", fontSize: "12px",
        color: "rgba(200,195,178,0.65)",
        borderBottom: "1px solid rgba(212,169,74,0.1)",
      }}>
        <div>
          <span className="material-symbols-outlined" style={{ fontSize: "14px", verticalAlign: "middle", color: "#d4a94a", marginRight: "6px" }}>local_shipping</span>
          Free shipping on orders above ₹{freeShippingThreshold}.{subtotal < freeShippingThreshold
            ? ` Add ₹${(freeShippingThreshold - subtotal).toFixed(0)} more to qualify!`
            : " You qualify for free shipping! 🎉"}
        </div>
      </div>

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px clamp(16px,4vw,60px) 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "rgba(160,155,135,0.45)", marginBottom: "16px" }}>
            <Link href="/" style={{ color: "rgba(160,155,135,0.45)", textDecoration: "none" }}>Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>chevron_right</span>
            <Link href="/products" style={{ color: "rgba(160,155,135,0.45)", textDecoration: "none" }}>Collections</Link>
            <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>chevron_right</span>
            <span style={{ color: "#d4a94a" }}>Cart</span>
          </nav>
          <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "clamp(32px,4vw,42px)", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
            Your <em style={{ color: "#d4a94a", fontStyle: "italic" }}>Cart</em>
            <span style={{ fontSize: "16px", fontFamily: "var(--font-sans)", fontWeight: 400, color: "rgba(160,155,135,0.45)", marginLeft: "12px" }}>({items.length} items)</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <div style={{
            minHeight: "360px", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "20px",
            background: "#161612", border: "1px solid rgba(212,169,74,0.08)",
            borderRadius: "16px", textAlign: "center", padding: "48px",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "80px", color: "rgba(212,169,74,0.12)" }}>shopping_bag</span>
            <div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 600, color: "#f0ede6", fontStyle: "italic", marginBottom: "8px" }}>Your cart is empty</h2>
              <p style={{ fontSize: "14px", color: "rgba(160,155,135,0.45)" }}>Something special awaits in our collections.</p>
            </div>
            <Link href="/products" style={{
              padding: "12px 28px", background: "#d4a94a", color: "#10100e",
              borderRadius: "10px", fontSize: "12px", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none",
            }}>Browse Collections</Link>
          </div>
        ) : (
          <div className="layout-split">

            {/* Cart Items */}
            <div>
              {cart && <CartItems cart={cart} />}

              {/* Continue shopping */}
              <div style={{
                marginTop: "24px", padding: "18px 20px",
                background: "#161612", border: "1px solid rgba(212,169,74,0.08)",
                borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "rgba(200,195,178,0.65)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>verified</span>
                  Each item is energetically cleansed before dispatch.
                </div>
                <Link href="/products" style={{ fontSize: "12px", color: "#d4a94a", textDecoration: "none", fontWeight: 600 }}>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <aside style={{ position: "sticky", top: "96px" }}>
              <div style={{
                background: "#161612", border: "1px solid rgba(212,169,74,0.1)",
                borderRadius: "18px", padding: "28px", overflow: "hidden", position: "relative",
              }}>
                <div style={{ position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,169,74,0.04), transparent 70%)", pointerEvents: "none" }} />

                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 600, color: "#f0ede6", marginBottom: "20px" }}>
                  Order Summary
                </h2>

                {/* Summary rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                  {[
                    { label: "Subtotal", val: `₹${Math.round(subtotal).toLocaleString("en-IN")}` },
                    ...(discount > 0 ? [{ label: `Coupon (${coupon?.code})`, val: `−₹${Math.round(discount).toLocaleString("en-IN")}`, highlight: true }] : []),
                    { label: "Shipping", val: shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`, highlight: shipping === 0 },
                    { label: "GST (5%)", val: `₹${Math.round(tax).toLocaleString("en-IN")}` },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span style={{ color: "rgba(160,155,135,0.45)" }}>{row.label}</span>
                      <span style={{ fontWeight: 600, color: row.highlight ? "#25e2f4" : "#f0ede6" }}>{row.val}</span>
                    </div>
                  ))}
                </div>

                <div style={{ height: "1px", background: "rgba(212,169,74,0.1)", margin: "16px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#f0ede6" }}>Total</span>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "26px", fontWeight: 700, color: "#d4a94a" }}>₹{Math.round(total).toLocaleString("en-IN")}</span>
                </div>

                {/* Coupon */}
                <CouponForm appliedCode={coupon?.code ?? null} discount={discount} />

                {/* CTA */}
                <Link href="/checkout" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  width: "100%", padding: "15px",
                  background: "#d4a94a", color: "#10100e",
                  borderRadius: "10px", fontSize: "13px", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none",
                  transition: "background 0.2s",
                  boxSizing: "border-box",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>lock</span>
                  Proceed to Checkout
                </Link>

                <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(160,155,135,0.45)", marginTop: "12px" }}>
                  🔒 256-bit SSL encrypted
                </p>

                {/* Payment Icons */}
                <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "16px", borderTop: "1px solid rgba(212,169,74,0.08)", paddingTop: "16px" }}>
                  {["Visa", "MC", "UPI", "GPay"].map(pm => (
                    <span key={pm} style={{
                      padding: "4px 8px", background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "4px", fontSize: "9px", fontWeight: 700, color: "rgba(160,155,135,0.45)",
                    }}>{pm}</span>
                  ))}
                </div>

                {/* Delivery info */}
                <div style={{
                  marginTop: "16px", padding: "14px", borderRadius: "10px",
                  background: "rgba(212,169,74,0.03)", border: "1px solid rgba(212,169,74,0.08)",
                  display: "flex", alignItems: "flex-start", gap: "10px",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a", marginTop: "1px" }}>local_shipping</span>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#f0ede6", marginBottom: "3px" }}>Estimated Delivery</p>
                    <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)" }}>4-7 business days. Express available.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
