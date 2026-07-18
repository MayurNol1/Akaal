"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div style={{ background: "#10100e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "440px", width: "100%", textAlign: "center", background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "24px", padding: "56px 40px" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#f87171" }}>bolt</span>
        </div>
        <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 600, color: "#f0ede6", marginBottom: "10px" }}>
          A Disturbance in the Energy
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(160,155,135,0.5)", lineHeight: 1.7, marginBottom: "28px" }}>
          Something went wrong on our side. Your data is safe — try again, or return to the sanctuary.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={reset}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#d4a94a", color: "#10100e", borderRadius: "10px", padding: "12px 24px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", border: "none", cursor: "pointer" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>refresh</span>
            Try Again
          </button>
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "transparent", color: "#d4a94a", borderRadius: "10px", padding: "12px 24px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid rgba(212,169,74,0.3)", textDecoration: "none" }}
          >
            Return Home
          </Link>
        </div>
        {error.digest && (
          <p style={{ fontSize: "10px", color: "rgba(160,155,135,0.3)", marginTop: "24px", fontFamily: "monospace" }}>Ref: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
