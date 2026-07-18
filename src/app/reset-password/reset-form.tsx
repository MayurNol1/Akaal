"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "rgba(212,169,74,0.03)",
  border: "1px solid rgba(212,169,74,0.12)", borderRadius: "9px",
  padding: "12px 14px", fontSize: "13px", color: "#f0ede6",
  outline: "none", fontFamily: "var(--font-sans)", boxSizing: "border-box",
};

export function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Reset failed. The link may have expired.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 600, color: "#f0ede6", marginBottom: "10px" }}>Password Restored</h1>
        <p style={{ fontSize: "13px", color: "rgba(160,155,135,0.6)", lineHeight: 1.7, marginBottom: "28px" }}>
          Your password has been updated. Redirecting you to sign in…
        </p>
        <Link href="/login" style={{ fontSize: "12px", color: "#d4a94a", textDecoration: "none", fontWeight: 600 }}>Sign In Now</Link>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 600, color: "#f0ede6", marginBottom: "8px", textAlign: "center" }}>Set New Password</h1>
      <p style={{ fontSize: "13px", color: "rgba(160,155,135,0.6)", lineHeight: 1.6, marginBottom: "28px", textAlign: "center" }}>
        Resetting for <span style={{ color: "#d4a94a" }}>{email}</span>
      </p>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label htmlFor="reset-password" style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>New Password</label>
          <input id="reset-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter new password" autoComplete="new-password" style={inputStyle} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label htmlFor="reset-confirm" style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>Confirm Password</label>
          <input id="reset-confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat new password" autoComplete="new-password" style={inputStyle} />
        </div>
        {error && <p role="alert" style={{ fontSize: "12px", color: "#f87171", margin: 0 }}>{error}</p>}
        <button type="submit" disabled={busy} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#d4a94a", color: "#10100e", padding: "13px", borderRadius: "10px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", border: "none", cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>lock_reset</span>
          {busy ? "Updating..." : "Update Password"}
        </button>
      </form>
    </>
  );
}
