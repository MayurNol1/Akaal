"use client";

import { useState } from "react";

interface ShopLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Products page shell: filter rail + grid with a desktop collapse handle.
 * On phones the rail always renders (its own "Filters" toggle handles
 * collapsing there); the < handle only exists on md+.
 */
export function ShopLayout({ sidebar, children }: ShopLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout-sidebar" style={{ gap: 0 }}>
      <aside
        className={`sidebar-rail ${collapsed ? "md:hidden" : ""}`}
        style={{
          width: "240px", flexShrink: 0,
          padding: "28px 24px",
          borderRight: "1px solid rgba(212,169,74,0.1)",
          position: "sticky", top: "72px", maxHeight: "calc(100vh - 72px)", overflowY: "auto",
        }}
      >
        {sidebar}
      </aside>

      {/* Desktop-only collapse handle */}
      <div className="hidden md:flex" style={{ flexDirection: "column", flexShrink: 0, position: "sticky", top: "72px", height: "calc(100vh - 72px)", justifyContent: "flex-start", paddingTop: "32px" }}>
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Show filters" : "Hide filters"}
          title={collapsed ? "Show filters" : "Hide filters"}
          style={{
            width: "22px", height: "52px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(212,169,74,0.06)",
            border: "1px solid rgba(212,169,74,0.16)",
            borderLeft: "none",
            borderRadius: "0 10px 10px 0",
            color: "#d4a94a", cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
            {collapsed ? "chevron_right" : "chevron_left"}
          </span>
        </button>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}
