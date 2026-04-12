"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: "10px",
        padding: "11px 14px", borderRadius: "10px",
        background: "transparent", border: "1px solid rgba(248,113,113,0.12)",
        cursor: "pointer", color: "rgba(248,113,113,0.55)",
        fontSize: "12px", fontWeight: 600,
        textTransform: "uppercase" as const, letterSpacing: "0.08em",
        transition: "all 0.18s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.color = "#f87171";
        (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.07)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,113,113,0.25)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.55)";
        (e.currentTarget as HTMLElement).style.background = "transparent";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,113,113,0.12)";
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>logout</span>
      Sign Out
    </button>
  );
}
