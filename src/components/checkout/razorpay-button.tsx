"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface RazorpayButtonProps {
  total: number;
  cartId: string;
}

export default function RazorpayButton({ total, cartId }: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // 1. Create order on server
      const res = await fetch("/api/checkout", { method: "POST" });
      const { data: orderData, success, error } = await res.json();

      if (!success) {
        alert(error || "Failed to initiate checkout");
        return;
      }

      // 2. Load Razorpay script
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
            // 3. Verify payment on server
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cartId: cartId
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              router.push("/orders?success=1");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: orderData.user.name,
            email: orderData.user.email,
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
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
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
      {loading ? "Processing..." : `Place Order — ₹${total.toFixed(0)}`}
    </button>
  );
}
