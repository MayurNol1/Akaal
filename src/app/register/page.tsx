"use client";

import { useForm } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterInput } from "@/modules/auth/validation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const { status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "This email is already registered. Please sign in.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(212,169,74,0.03)",
    border: "1px solid rgba(212,169,74,0.1)", borderRadius: "9px",
    padding: "11px 14px 11px 40px",
    fontSize: "13px", color: "#f0ede6", outline: "none",
    fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
    transition: "border-color 0.18s",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.09em", color: "rgba(160,155,135,0.45)",
  };
  const iconStyle: React.CSSProperties = {
    position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)",
    fontSize: "15px", color: "rgba(160,155,135,0.45)", pointerEvents: "none",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#10100e", color: "#f0ede6" }}>

      {/* LEFT PANEL */}
      <div className="hidden md:flex" style={{
        width: "45%", position: "relative", overflow: "hidden",
        flexDirection: "column", justifyContent: "space-between", padding: "40px",
        background: "#1c1c18",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(16,16,14,0.1) 0%, rgba(16,16,14,0.7) 60%, rgba(16,16,14,0.95) 100%)", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 30% 60%, rgba(212,169,74,0.08) 0%, transparent 70%)" }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <Image src="/images/bg-removed-logo.png" alt="Akaal" width={28} height={28} style={{ objectFit: "contain" }} />
            <span style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, letterSpacing: "0.04em", color: "#d4a94a" }}>Akaal</span>
          </Link>
        </div>

        <div style={{ position: "relative", zIndex: 2, marginTop: "auto" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 500, color: "#f0ede6", lineHeight: 1.35, marginBottom: "12px", fontStyle: "italic" }}>
            &ldquo;The soul is neither born, and nor does it die.&rdquo;
          </p>
          <p style={{ fontSize: "12px", color: "rgba(160,155,135,0.45)", letterSpacing: "0.06em", textTransform: "uppercase" }}>— Bhagavad Gita, 2.20</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "28px" }}>
            {[
              "Free shipping on orders above ₹999",
              "30-day returns, no questions asked",
              "Energised before every dispatch",
              "Authenticity certified on every item",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(200,195,178,0.65)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "rgba(212,169,74,0.6)" }}>check_circle</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 60px", position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 600px 500px at 50% 50%, rgba(212,169,74,0.025) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "rgba(212,169,74,0.1)", border: "1px solid rgba(212,169,74,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "#d4a94a" }}>check_circle</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", fontWeight: 600, color: "#f0ede6", margin: 0 }}>Account Created!</h2>
              <p style={{ fontSize: "14px", color: "rgba(160,155,135,0.45)" }}>Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 600, color: "#f0ede6", marginBottom: "6px" }}>
                Create your account.
              </h1>
              <p style={{ fontSize: "13px", color: "rgba(200,195,178,0.65)", marginBottom: "28px", lineHeight: 1.5 }}>
                Join the Akaal community and begin your spiritual journey.
              </p>

              {error && (
                <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "8px", padding: "12px 14px", fontSize: "12px", color: "#f87171", marginBottom: "16px" }}>
                  {error}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(212,169,74,0.1)" }} />
                <span style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>or continue with</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(212,169,74,0.1)" }} />
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                <button type="button" onClick={() => signIn("google")} style={{
                  flex: 1, padding: "10px", border: "1px solid rgba(212,169,74,0.1)",
                  borderRadius: "9px", background: "rgba(212,169,74,0.025)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "8px", fontSize: "12px", fontWeight: 600, color: "rgba(200,195,178,0.65)",
                  transition: "all .18s",
                }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "3px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#4285f4", fontSize: "10px", fontWeight: 900 }}>G</span>
                  </div>
                  Google
                </button>
                <button type="button" onClick={() => signIn("apple")} style={{
                  flex: 1, padding: "10px", border: "1px solid rgba(212,169,74,0.1)",
                  borderRadius: "9px", background: "rgba(212,169,74,0.025)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "8px", fontSize: "12px", fontWeight: 600, color: "rgba(200,195,178,0.65)",
                  transition: "all .18s",
                }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "3px", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>🍎</div>
                  Apple
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={labelStyle}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <span className="material-symbols-outlined" style={iconStyle}>person</span>
                    <input {...register("name")} placeholder="Priya Sharma" style={inputStyle} autoComplete="name" />
                  </div>
                  {errors.name && <p style={{ fontSize: "10px", color: "#f87171" }}>{errors.name.message}</p>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={labelStyle}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <span className="material-symbols-outlined" style={iconStyle}>mail</span>
                    <input {...register("email")} type="email" placeholder="priya@gmail.com" style={inputStyle} autoComplete="email" />
                  </div>
                  {errors.email && <p style={{ fontSize: "10px", color: "#f87171" }}>{errors.email.message}</p>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: "relative" }}>
                    <span className="material-symbols-outlined" style={iconStyle}>lock</span>
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      style={{ ...inputStyle, paddingRight: "40px" }}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                      position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                      border: "none", background: "none", cursor: "pointer", color: "rgba(160,155,135,0.45)",
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>{showPassword ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                  {errors.password && <p style={{ fontSize: "10px", color: "#f87171" }}>{errors.password.message}</p>}
                </div>

                <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", margin: "4px 0 0" }}>
                  By creating an account you agree to our{" "}
                  <Link href="#" style={{ color: "rgba(212,169,74,0.6)", textDecoration: "none" }}>Terms of Service</Link>
                </p>

                <button type="submit" disabled={isLoading} style={{
                  width: "100%", padding: "13px",
                  background: "#d4a94a", color: "#10100e",
                  fontSize: "13px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                  border: "none", borderRadius: "9px", cursor: "pointer", marginTop: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  opacity: isLoading ? 0.7 : 1, transition: "all .2s",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>person_add</span>
                  {isLoading ? "Creating Account…" : "Create Account"}
                </button>
              </form>

              <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(160,155,135,0.45)", marginTop: "20px" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "rgba(212,169,74,0.7)", textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>

      <footer style={{ position: "fixed", bottom: 0, right: 0, padding: "16px 60px", fontSize: "11px", color: "rgba(160,155,135,0.45)", display: "flex", gap: "16px" }}>
        <Link href="#" style={{ color: "rgba(160,155,135,0.45)", textDecoration: "none" }}>Privacy</Link>
        <Link href="#" style={{ color: "rgba(160,155,135,0.45)", textDecoration: "none" }}>Terms</Link>
        <span>© 2026 Akaal Spiritual Arts</span>
      </footer>
    </div>
  );
}
