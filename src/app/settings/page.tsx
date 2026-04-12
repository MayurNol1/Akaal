"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [privacy, setPrivacy] = useState(true);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(212,169,74,0.03)",
    border: "1px solid rgba(212,169,74,0.12)", borderRadius: "9px",
    padding: "11px 14px", fontSize: "13px", color: "#f0ede6",
    outline: "none", fontFamily: "var(--font-sans)", transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div style={{ background: "#10100e", color: "#f0ede6", minHeight: "100vh", paddingTop: "72px", paddingBottom: "80px" }}>

      {isSaved && (
        <div style={{ position: "fixed", top: "84px", right: "20px", zIndex: 50, background: "rgba(16,16,14,0.97)", border: "1px solid rgba(212,169,74,0.28)", borderRadius: "12px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", backdropFilter: "blur(16px)", animation: "fadeIn 0.25s ease-out" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#d4a94a", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#d4a94a", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 2px" }}>Settings Saved</p>
            <p style={{ fontSize: "12px", color: "rgba(200,195,178,0.75)", margin: 0 }}>Your preferences have been updated.</p>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px clamp(16px,4vw,48px) 0" }}>
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "8px" }}>Account</p>
          <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
            Sanctuary <em style={{ color: "#d4a94a" }}>Settings</em>
          </h1>
        </div>

        {/* Profile */}
        <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: "#f0ede6", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>person</span>
            Profile Information
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>Display Name</label>
              <input type="text" defaultValue={session?.user?.name || ""} placeholder="Your name" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "rgba(212,169,74,0.35)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(212,169,74,0.12)"; }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>Email Address</label>
              <input type="email" disabled defaultValue={session?.user?.email || ""} style={{ ...inputStyle, background: "#10100e", borderColor: "rgba(255,255,255,0.05)", color: "rgba(160,155,135,0.4)", cursor: "not-allowed" }} />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: "#f0ede6", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>tune</span>
            Preferences
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "notifications", label: "Email Notifications", desc: "Receive updates about orders, new arrivals, and sacred mantras.", value: notifications, set: setNotifications },
              { icon: "shield", label: "Privacy Mode", desc: "Keep your wishlist and activity history private.", value: privacy, set: setPrivacy },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px", background: "rgba(212,169,74,0.02)", border: "1px solid rgba(212,169,74,0.07)", borderRadius: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(212,169,74,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>{item.icon}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#f0ede6", margin: "0 0 3px" }}>{item.label}</p>
                    <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
                <button onClick={() => item.set(!item.value)} style={{ width: "44px", height: "24px", borderRadius: "99px", flexShrink: 0, background: item.value ? "#d4a94a" : "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.25s", boxShadow: item.value ? "0 0 12px rgba(212,169,74,0.3)" : "none" }}>
                  <span style={{ position: "absolute", top: "3px", left: item.value ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: "#f0ede6", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>lock</span>
            Security
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>New Password</label>
              <input type="password" placeholder="Enter new password" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "rgba(212,169,74,0.35)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(212,169,74,0.12)"; }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>Confirm Password</label>
              <input type="password" placeholder="Repeat new password" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "rgba(212,169,74,0.35)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(212,169,74,0.12)"; }} />
            </div>
          </div>
        </div>

        <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#d4a94a", color: "#10100e", padding: "13px 32px", borderRadius: "10px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", border: "none", cursor: "pointer", transition: "background 0.2s, box-shadow 0.2s", boxShadow: "0 4px 16px rgba(212,169,74,0.2)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#e8c06c"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#d4a94a"; }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>save</span>
          Save Settings
        </button>
      </div>
    </div>
  );
}
