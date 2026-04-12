"use client";

import { signOut } from "next-auth/react";

export function SidebarLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: "10px",
        padding: "9px 10px", borderRadius: "8px",
        background: "transparent", border: "none", cursor: "pointer",
        color: "rgba(160,155,135,0.45)", fontSize: "12px",
        fontWeight: 500, transition: "color 0.18s, background 0.18s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.color = "#f87171";
        (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.06)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.color = "rgba(160,155,135,0.45)";
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>logout</span>
      Sign Out
    </button>
  );
}
