import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  /** Icon square size in px. Text scales with it. */
  size?: number;
  /** Hide the "AKAAL" wordmark and show the mark alone. */
  iconOnly?: boolean;
  /** Where the logo links to; pass null to render without a link. */
  href?: string | null;
}

/**
 * The single source of brand truth. Every surface (navbar, footer, admin,
 * auth pages, emails-adjacent UI) should render this rather than inlining
 * its own SVG or <Image>.
 */
export function Logo({ size = 36, iconOnly = false, href = "/" }: LogoProps) {
  const content = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
      <span
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: "rgba(212,169,74,0.12)",
          border: "1px solid rgba(212,169,74,0.12)",
          borderRadius: `${Math.round(size * 0.28)}px`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <Image
          src="/images/bg-removed-logo.png"
          alt=""
          width={Math.round(size * 0.62)}
          height={Math.round(size * 0.78)}
          style={{ objectFit: "contain" }}
        />
      </span>
      {!iconOnly && (
        <span
          style={{
            fontFamily: "var(--font-serif), 'Cormorant Garamond', serif",
            fontSize: `${Math.max(14, Math.round(size * 0.5))}px`,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#f0ede6",
          }}
        >
          AKAAL
        </span>
      )}
    </span>
  );

  if (href === null) return content;

  return (
    <Link href={href} aria-label="Akaal — home" style={{ textDecoration: "none", display: "inline-flex" }}>
      {content}
    </Link>
  );
}
