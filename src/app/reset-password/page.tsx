import Link from "next/link";
import { ResetPasswordForm } from "./reset-form";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage(props: {
  searchParams?: Promise<{ token?: string; email?: string }>;
}) {
  const searchParams = await props.searchParams;
  const token = searchParams?.token ?? "";
  const email = searchParams?.email ?? "";
  const linkValid = Boolean(token && email);

  return (
    <div style={{ background: "#10100e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "420px", width: "100%", background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "24px", padding: "48px 40px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#d4a94a" }}>lock_reset</span>
        </div>

        {linkValid ? (
          <ResetPasswordForm token={token} email={email} />
        ) : (
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 600, color: "#f0ede6", marginBottom: "10px" }}>Invalid Link</h1>
            <p style={{ fontSize: "13px", color: "rgba(160,155,135,0.6)", lineHeight: 1.7, marginBottom: "28px" }}>
              This reset link is missing or malformed. Request a new one from the forgot-password page.
            </p>
            <Link href="/forgot-password" style={{ fontSize: "12px", color: "#d4a94a", textDecoration: "none", fontWeight: 600 }}>Request New Link</Link>
          </div>
        )}
      </div>
    </div>
  );
}
