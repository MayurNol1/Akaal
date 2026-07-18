"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShippingAddressSchema,
  type ShippingAddressInput,
} from "@/modules/orders/validation";
import type { OrderTotals } from "@/lib/pricing";
import RazorpayButton from "@/components/checkout/razorpay-button";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutClientProps {
  items: CheckoutItem[];
  totals: OrderTotals;
  couponCode?: string | null;
  cartId: string;
  defaults?: Partial<ShippingAddressInput>;
}

const FIELDS: Array<{
  label: string;
  name: keyof ShippingAddressInput;
  type: string;
  placeholder: string;
  full: boolean;
}> = [
  { label: "First Name", name: "firstName", type: "text", placeholder: "Priya", full: false },
  { label: "Last Name", name: "lastName", type: "text", placeholder: "Sharma", full: false },
  { label: "Email Address", name: "email", type: "email", placeholder: "priya@gmail.com", full: true },
  { label: "Phone Number", name: "phone", type: "tel", placeholder: "+91 98765 43210", full: true },
  { label: "Address Line 1", name: "address1", type: "text", placeholder: "House / Flat No.", full: true },
  { label: "City", name: "city", type: "text", placeholder: "Mumbai", full: false },
  { label: "Pincode", name: "pincode", type: "text", placeholder: "400001", full: false },
];

export default function CheckoutClient({ items, totals, couponCode, cartId, defaults }: CheckoutClientProps) {
  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ShippingAddressInput>({
    resolver: zodResolver(ShippingAddressSchema),
    mode: "onBlur",
    defaultValues: defaults,
  });

  // Called by the pay button: validates the form and hands back the address,
  // or null (with field errors shown) to abort payment.
  const getValidatedAddress = async (): Promise<ShippingAddressInput | null> => {
    const valid = await trigger(undefined, { shouldFocus: true });
    return valid ? getValues() : null;
  };

  const { subtotal, discount, shipping, tax, total } = totals;

  return (
    <div className="layout-split">

      {/* ── LEFT: Shipping Form ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Shipping Info */}
        <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "14px", padding: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "#f0ede6", marginBottom: "20px" }}>
            Shipping <em style={{ color: "#d4a94a" }}>Information</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {FIELDS.map(field => {
              const fieldError = errors[field.name]?.message;
              return (
                <div key={field.name} style={{ gridColumn: field.full ? "1 / -1" : "auto", display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label htmlFor={`shipping-${field.name}`} style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "rgba(160,155,135,0.45)" }}>{field.label}</label>
                  <input
                    id={`shipping-${field.name}`}
                    type={field.type}
                    placeholder={field.placeholder}
                    aria-invalid={fieldError ? true : undefined}
                    {...register(field.name)}
                    style={{
                      background: "rgba(212,169,74,0.03)",
                      border: `1px solid ${fieldError ? "rgba(248,113,113,0.55)" : "rgba(212,169,74,0.1)"}`,
                      borderRadius: "8px", padding: "11px 13px",
                      fontSize: "13px", color: "#f0ede6", outline: "none",
                      fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
                    }}
                  />
                  {fieldError && (
                    <span role="alert" style={{ fontSize: "11px", color: "#f87171" }}>{fieldError}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "14px", padding: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, color: "#f0ede6", marginBottom: "16px" }}>
            Payment <em style={{ color: "#d4a94a" }}>Method</em>
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "10px", border: "1px solid #d4a94a", background: "rgba(212,169,74,0.05)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>credit_card</span>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#f0ede6", margin: 0 }}>Razorpay Secure Checkout</p>
              <p style={{ fontSize: "10px", color: "rgba(160,155,135,0.45)", margin: 0 }}>Cards, UPI, Netbanking & Wallets</p>
            </div>
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
            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ color: "rgba(200,195,178,0.65)" }}>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: 600, color: "#f0ede6" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            {[
              { label: "Subtotal", val: `₹${Math.round(subtotal).toLocaleString("en-IN")}` },
              ...(discount > 0 ? [{ label: `Coupon (${couponCode})`, val: `−₹${Math.round(discount).toLocaleString("en-IN")}`, accent: true }] : []),
              { label: "Shipping", val: shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`, accent: shipping === 0 },
              { label: "GST (5%)", val: `₹${Math.round(tax).toLocaleString("en-IN")}` },
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
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "26px", fontWeight: 700, color: "#d4a94a" }}>₹{Math.round(total).toLocaleString("en-IN")}</span>
          </div>

          {/* CTA */}
          <RazorpayButton total={total} cartId={cartId} getShippingAddress={getValidatedAddress} />

          <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(160,155,135,0.45)", marginTop: "10px" }}>
            🔒 Secured by Razorpay
          </p>

          <div style={{ marginTop: "16px", padding: "14px", borderRadius: "10px", background: "rgba(212,169,74,0.03)", border: "1px solid rgba(212,169,74,0.08)", fontSize: "12px", color: "rgba(200,195,178,0.65)", fontStyle: "italic", textAlign: "center", lineHeight: 1.5 }}>
            &ldquo;Your contribution sustains the keepers of ancient sacred crafts.&rdquo;
          </div>
        </div>
      </aside>
    </div>
  );
}
