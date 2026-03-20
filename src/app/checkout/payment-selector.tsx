"use client";

import { useState } from "react";

const methods = [
  { id: "stripe", icon: "credit_card", label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex" },
  { id: "upi", icon: "smartphone", label: "UPI Payment", sub: "GPay, PhonePe, BHIM" },
  { id: "cod", icon: "local_shipping", label: "Cash on Delivery", sub: "Pay when delivered" },
];

export function PaymentSelector() {
  const [selected, setSelected] = useState("stripe");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {methods.map((method) => (
        <label 
          key={method.id} 
          style={{ 
            display: "flex", alignItems: "center", gap: "12px", padding: "14px", 
            borderRadius: "10px", 
            border: `1px solid ${selected === method.id ? "#d4a94a" : "rgba(212,169,74,0.1)"}`, 
            background: selected === method.id ? "rgba(212,169,74,0.05)" : "transparent", 
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onClick={() => setSelected(method.id)}
        >
          <div style={{
            width: "18px", height: "18px", borderRadius: "50%",
            border: `1.5px solid ${selected === method.id ? "#d4a94a" : "rgba(212,169,74,0.3)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s",
          }}>
            {selected === method.id && (
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#d4a94a" }} />
            )}
          </div>
          <input 
            type="radio" 
            name="payment" 
            value={method.id}
            checked={selected === method.id}
            onChange={() => setSelected(method.id)}
            style={{ display: "none" }} 
          />
          <span className="material-symbols-outlined" style={{ 
            fontSize: "20px", 
            color: selected === method.id ? "#d4a94a" : "rgba(160,155,135,0.45)",
            transition: "color 0.2s"
          }}>
            {method.icon}
          </span>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: selected === method.id ? "#f0ede6" : "rgba(200,195,178,0.7)", margin: 0, transition: "color 0.2s" }}>{method.label}</p>
            <p style={{ fontSize: "10px", color: "rgba(160,155,135,0.45)", margin: 0 }}>{method.sub}</p>
          </div>
        </label>
      ))}
      <input type="hidden" name="paymentOption" value={selected} />
    </div>
  );
}
