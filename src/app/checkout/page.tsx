import Link from "next/link";
import { auth } from "@/auth";
import { CartService } from "@/modules/cart/service";
import CheckoutClient from "./checkout-client";
import { calculateOrderTotals } from "@/lib/pricing";
import { CouponService } from "@/modules/coupons/service";

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
  const rawItems = (cart as any)?.items ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = rawItems.map((item: any) => ({
    id: item.id as string,
    name: item.product.name as string,
    price: Number(item.product.price),
    quantity: item.quantity as number,
  }));
  const coupon = await CouponService.getUsableCoupon(
    (cart as { couponCode?: string | null } | null)?.couponCode
  );
  const totals = calculateOrderTotals(items, coupon?.discountPercent ?? 0);

  const [firstName, ...restName] = (session.user.name ?? "").split(" ");
  const defaults = {
    firstName: firstName || undefined,
    lastName: restName.join(" ") || undefined,
    email: session.user.email ?? undefined,
  };

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
          <CheckoutClient
            items={items}
            totals={totals}
            couponCode={coupon?.code ?? null}
            cartId={cart?.id || ""}
            defaults={defaults}
          />
        )}
      </div>
    </div>
  );
}
