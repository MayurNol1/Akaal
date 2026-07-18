"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ShippingAddressInput } from "@/modules/orders/validation";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface RazorpayButtonProps {
  total: number;
  cartId: string;
  /** Validates the shipping form; resolves null (and shows errors) to abort payment. */
  getShippingAddress: () => Promise<ShippingAddressInput | null>;
}

export default function RazorpayButton({ total, cartId, getShippingAddress }: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Validate shipping details before taking payment
      const shippingAddress = await getShippingAddress();
      if (!shippingAddress) {
        return;
      }

      // 2. Create order on server
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress }),
      });
      const { data: orderData, success, error } = await res.json();

      if (!success) {
        setError(error || "Failed to initiate checkout");
        return;
      }

      // 3. Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "AKAAL",
          description: "Sacred Crafts & Spiritual Essentials",
          order_id: orderData.id,
          handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
            // 4. Verify payment on server
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cartId: cartId,
                shippingAddress,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              router.push("/orders?success=1");
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim() || orderData.user.name,
            email: shippingAddress.email || orderData.user.email,
            contact: shippingAddress.phone,
          },
          theme: {
            color: "#d4a94a",
          },
        };

        const rzp = new window.Razorpay(options as Record<string, unknown>);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {error && (
      <p role="alert" style={{ fontSize: "12px", color: "#f87171", margin: "0 0 10px", textAlign: "center", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "8px", padding: "9px 12px" }}>
        {error}
      </p>
    )}
    <button
      onClick={handleCheckout}
      disabled={loading}
      style={{
        width: "100%",
        padding: "14px",
        background: "#d4a94a",
        color: "#10100e",
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        border: "none",
        borderRadius: "10px",
        cursor: loading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        boxSizing: "border-box",
        opacity: loading ? 0.7 : 1,
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
        {loading ? "sync" : "lock"}
      </span>
      {loading ? "Processing..." : `Place Order — ₹${Math.round(total).toLocaleString("en-IN")}`}
    </button>
    </>
  );
}
