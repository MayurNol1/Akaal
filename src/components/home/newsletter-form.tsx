"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 5000);
  };

  if (status === "success") {
    return (
      <div style={{
        width: "100%", maxWidth: "480px", margin: "0 auto",
        background: "rgba(212,169,74,0.06)",
        border: "1px solid rgba(212,169,74,0.2)",
        borderRadius: "14px", padding: "24px 28px",
        display: "flex", alignItems: "center", gap: "14px",
        animation: "fadeIn 0.4s ease-out",
      }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "11px", background: "rgba(212,169,74,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "#d4a94a", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: "#f0ede6", margin: "0 0 3px" }}>Welcome to the Path 🙏</p>
          <p style={{ fontSize: "12px", color: "rgba(160,155,135,0.55)", margin: 0 }}>You&apos;ll receive sacred insights and early access to rare collections.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "480px", margin: "0 auto", flexWrap: "wrap" }}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        disabled={status === "loading"}
        placeholder="your@email.com"
        style={{
          flex: 1, minWidth: "200px",
          background: "rgba(212,169,74,0.04)",
          border: "1px solid rgba(212,169,74,0.14)",
          borderRadius: "10px", padding: "13px 16px",
          fontSize: "13px", color: "#f0ede6", outline: "none",
          fontFamily: "var(--font-sans)",
          transition: "border-color 0.2s, background 0.2s",
        }}
        onFocus={e => { e.target.style.borderColor = "rgba(212,169,74,0.3)"; e.target.style.background = "rgba(212,169,74,0.07)"; }}
        onBlur={e => { e.target.style.borderColor = "rgba(212,169,74,0.14)"; e.target.style.background = "rgba(212,169,74,0.04)"; }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          background: "#d4a94a", color: "#10100e",
          padding: "13px 24px", borderRadius: "10px",
          fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const,
          border: "none", cursor: status === "loading" ? "not-allowed" : "pointer",
          opacity: status === "loading" ? 0.7 : 1,
          display: "flex", alignItems: "center", gap: "6px",
          whiteSpace: "nowrap" as const,
          transition: "background 0.2s",
        }}
        onMouseEnter={e => { if (status !== "loading") (e.currentTarget as HTMLElement).style.background = "#e8c06c"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#d4a94a"; }}
      >
        {status === "loading" ? (
          <>
            <span style={{ width: "12px", height: "12px", borderRadius: "50%", border: "2px solid rgba(26,16,6,0.3)", borderTopColor: "#1a1006", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
            Joining…
          </>
        ) : (
          <>
            <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>mail</span>
            Subscribe
          </>
        )}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
