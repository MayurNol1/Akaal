"use client";

import { useState } from "react";
import Link from "next/link";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "rgba(212,169,74,0.03)",
  border: "1px solid rgba(212,169,74,0.12)", borderRadius: "9px",
  padding: "12px 14px", fontSize: "13px", color: "#f0ede6",
  outline: "none", fontFamily: "var(--font-sans)", boxSizing: "border-box",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Something went wrong. Try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ background: "#10100e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "420px", width: "100%", background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "24px", padding: "48px 40px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#d4a94a" }}>key</span>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 600, color: "#f0ede6", marginBottom: "10px" }}>Check Your Email</h1>
            <p style={{ fontSize: "13px", color: "rgba(160,155,135,0.6)", lineHeight: 1.7, marginBottom: "28px" }}>
              If an account exists for <span style={{ color: "#d4a94a" }}>{email}</span>, a reset link is on its way. It is valid for one hour.
            </p>
            <Link href="/login" style={{ fontSize: "12px", color: "#d4a94a", textDecoration: "none", fontWeight: 600 }}>← Back to Sign In</Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 600, color: "#f0ede6", marginBottom: "8px", textAlign: "center" }}>Forgot Password</h1>
            <p style={{ fontSize: "13px", color: "rgba(160,155,135,0.6)", lineHeight: 1.6, marginBottom: "28px", textAlign: "center" }}>
              Enter your email and we&rsquo;ll send you a link to restore your path.
            </p>
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label htmlFor="forgot-email" style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>Email Address</label>
                <input id="forgot-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" style={inputStyle} />
              </div>
              {error && <p role="alert" style={{ fontSize: "12px", color: "#f87171", margin: 0 }}>{error}</p>}
              <button type="submit" disabled={busy} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#d4a94a", color: "#10100e", padding: "13px", borderRadius: "10px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", border: "none", cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>send</span>
                {busy ? "Sending..." : "Send Reset Link"}
              </button>
              <Link href="/login" style={{ fontSize: "12px", color: "rgba(160,155,135,0.5)", textDecoration: "none", textAlign: "center", marginTop: "6px" }}>← Back to Sign In</Link>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
