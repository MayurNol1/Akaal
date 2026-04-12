"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [maintenance, setMaintenance] = useState(false);
  const [webhooks, setWebhooks] = useState(true);
  const [caching, setCaching] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ paddingBottom: "24px", borderBottom: "1px solid rgba(212,169,74,0.08)" }}>
        <div style={{ width: "40px", height: "2px", background: "#d4a94a", borderRadius: "99px", marginBottom: "12px" }} />
        <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(160,155,135,0.45)", margin: "0 0 6px" }}>System</p>
        <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "clamp(26px,3vw,36px)", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
          Core <em style={{ color: "#d4a94a" }}>Mechanics</em>
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* System toggles */}
        <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "16px", padding: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 600, color: "#f0ede6", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ display: "inline-block", width: "3px", height: "16px", background: "#d4a94a", borderRadius: "2px" }} />
            System Overrides
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "database", label: "Entity Caching", value: caching, set: setCaching, danger: false },
              { icon: "cloud", label: "Webhooks (Stripe)", value: webhooks, set: setWebhooks, danger: false },
              { icon: "security", label: "Sanctuary Lockdown", value: maintenance, set: setMaintenance, danger: true },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: "10px", background: "rgba(212,169,74,0.02)", border: item.danger ? "1px solid rgba(248,113,113,0.1)" : "1px solid rgba(212,169,74,0.07)", transition: "border-color 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "17px", color: item.danger ? (item.value ? "#f87171" : "rgba(248,113,113,0.4)") : "#d4a94a" }}>{item.icon}</span>
                  <span style={{ fontSize: "12px", fontWeight: item.danger ? 700 : 500, color: item.danger ? "rgba(248,113,113,0.8)" : "rgba(200,195,178,0.7)" }}>{item.label}</span>
                </div>
                <button onClick={() => item.set(!item.value)} style={{ width: "42px", height: "22px", borderRadius: "99px", border: "none", cursor: "pointer", position: "relative", transition: "background 0.25s", background: item.value ? (item.danger ? "#f87171" : "#d4a94a") : "rgba(255,255,255,0.08)", boxShadow: item.value ? `0 0 10px ${item.danger ? "rgba(248,113,113,0.3)" : "rgba(212,169,74,0.3)"}` : "none" }}>
                  <span style={{ position: "absolute", top: "3px", left: item.value ? "21px" : "3px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", transition: "left 0.25s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Constants */}
        <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "16px", padding: "24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "120px", height: "120px", background: "rgba(212,169,74,0.04)", borderRadius: "50%", filter: "blur(30px)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 600, color: "#f0ede6", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px", position: "relative", zIndex: 1 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "17px", color: "#d4a94a" }}>settings</span>
            Universal Constants
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>Global Tax Rate (%)</label>
              <input type="number" defaultValue="18" style={{ background: "rgba(212,169,74,0.03)", border: "1px solid rgba(212,169,74,0.12)", borderRadius: "8px", padding: "10px 12px", color: "#f0ede6", fontSize: "13px", outline: "none", fontFamily: "var(--font-sans)" }}
                onFocus={e => e.target.style.borderColor = "rgba(212,169,74,0.3)"}
                onBlur={e => e.target.style.borderColor = "rgba(212,169,74,0.12)"} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>Support Email</label>
              <input type="email" defaultValue="support@akaal.com" style={{ background: "rgba(212,169,74,0.03)", border: "1px solid rgba(212,169,74,0.12)", borderRadius: "8px", padding: "10px 12px", color: "#f0ede6", fontSize: "13px", outline: "none", fontFamily: "var(--font-sans)" }}
                onFocus={e => e.target.style.borderColor = "rgba(212,169,74,0.3)"}
                onBlur={e => e.target.style.borderColor = "rgba(212,169,74,0.12)"} />
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "#d4a94a", color: "#10100e", padding: "10px 20px", borderRadius: "9px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", border: "none", cursor: "pointer", transition: "background 0.2s", marginTop: "4px", width: "fit-content" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#e8c06c"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#d4a94a"}>
              <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>save</span>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
