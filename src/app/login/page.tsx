"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginInput } from "@/modules/auth/validation";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Connection interrupted. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    bg: {
      minHeight: "100vh", display: "flex",
      background: "#10100e", color: "#f0ede6",
    } as React.CSSProperties,
    leftPanel: {
      width: "45%", flexShrink: 0 as const, position: "relative" as const,
      overflow: "hidden", display: "flex", flexDirection: "column" as const,
      justifyContent: "space-between", padding: "40px",
    } as React.CSSProperties,
    rightPanel: {
      flex: 1, display: "flex", flexDirection: "column" as const,
      alignItems: "center", justifyContent: "center",
      padding: "40px 60px", position: "relative" as const, overflow: "hidden",
    } as React.CSSProperties,
    authBox: { width: "100%", maxWidth: "420px", position: "relative" as const, zIndex: 1 },
    tabContainer: {
      display: "flex", gap: 0, marginBottom: "32px",
      border: "1px solid rgba(212,169,74,0.1)", borderRadius: "10px",
      padding: "4px", background: "rgba(212,169,74,0.025)",
    } as React.CSSProperties,
    tabActive: {
      flex: 1, padding: "9px", textAlign: "center" as const, borderRadius: "7px",
      fontSize: "13px", fontWeight: 600, cursor: "pointer",
      background: "rgba(212,169,74,0.1)", color: "#d4a94a",
      border: "none", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    } as React.CSSProperties,
    tabInactive: {
      flex: 1, padding: "9px", textAlign: "center" as const, borderRadius: "7px",
      fontSize: "13px", fontWeight: 600, cursor: "pointer",
      background: "none", color: "rgba(160,155,135,0.45)", border: "none",
    } as React.CSSProperties,
    inputWrap: { position: "relative" as const },
    input: {
      width: "100%", background: "rgba(212,169,74,0.03)",
      border: "1px solid rgba(212,169,74,0.1)", borderRadius: "9px",
      padding: "11px 14px 11px 40px",
      fontSize: "13px", color: "#f0ede6", outline: "none",
      fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
      transition: "border-color 0.18s",
      boxSizing: "border-box" as const,
    } as React.CSSProperties,
    inputIcon: {
      position: "absolute" as const, left: "13px", top: "50%", transform: "translateY(-50%)",
      fontSize: "15px", color: "rgba(160,155,135,0.45)", pointerEvents: "none" as const,
    } as React.CSSProperties,
    label: {
      fontSize: "10px", fontWeight: 700, textTransform: "uppercase" as const,
      letterSpacing: "0.09em", color: "rgba(160,155,135,0.45)",
    } as React.CSSProperties,
    btn: {
      width: "100%", padding: "13px", background: "#d4a94a", color: "#10100e",
      fontSize: "13px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const,
      border: "none", borderRadius: "9px", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
      transition: "all .2s", marginTop: "4px",
    } as React.CSSProperties,
    divider: {
      display: "flex", alignItems: "center", gap: "12px", margin: "20px 0",
    } as React.CSSProperties,
    dividerLine: { flex: 1, height: "1px", background: "rgba(212,169,74,0.1)" } as React.CSSProperties,
    dividerText: { fontSize: "11px", color: "rgba(160,155,135,0.45)", textTransform: "uppercase" as const, letterSpacing: "0.08em", whiteSpace: "nowrap" as const } as React.CSSProperties,
    socialBtn: {
      flex: 1, padding: "10px", border: "1px solid rgba(212,169,74,0.1)",
      borderRadius: "9px", background: "rgba(212,169,74,0.025)",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      gap: "8px", fontSize: "12px", fontWeight: 600, color: "rgba(200,195,178,0.65)",
      transition: "all .18s",
    } as React.CSSProperties,
    switchPrompt: { textAlign: "center" as const, fontSize: "12px", color: "rgba(160,155,135,0.45)", marginTop: "20px" } as React.CSSProperties,
    switchLink: { color: "rgba(212,169,74,0.7)", textDecoration: "none", fontWeight: 600, cursor: "pointer", transition: "color .15s" } as React.CSSProperties,
  };

  return (
    <div style={styles.bg}>
      {/* ── LEFT PANEL ── */}
      <div style={styles.leftPanel} className="hidden md:flex">
        {/* BG */}
        <div style={{ position: "absolute", inset: 0, background: "#1c1c18", overflow: "hidden" }}>
          {/* Gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(16,16,14,0.1) 0%, rgba(16,16,14,0.7) 60%, rgba(16,16,14,0.95) 100%)", zIndex: 1 }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 40% 40%, rgba(212,169,74,0.08) 0%, transparent 70%)" }} />
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "auto" }}>
            <svg width="28" height="28" viewBox="0 0 48 48" fill="#d4a94a">
              <path d="M8.578 8.578C5.528 11.628 3.451 15.515 2.61 19.745 1.768 23.976 2.2 28.361 3.85 32.346 5.501 36.331 8.297 39.738 11.883 42.134 15.47 44.53 19.686 45.81 24 45.81c4.313 0 8.53-1.28 12.117-3.676 3.586-2.396 6.382-5.803 8.033-9.788 1.65-3.985 2.082-8.37 1.241-12.601-.842-4.23-2.919-8.117-5.969-11.167L24 24 8.578 8.578Z"/>
            </svg>
            <Link href="/" style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, letterSpacing: "0.04em", color: "#d4a94a", textDecoration: "none" }}>
              Akaal
            </Link>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 2, marginTop: "auto" }}>
          <p style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 500, color: "#f0ede6", lineHeight: 1.3, marginBottom: "12px", fontStyle: "italic" }}>
            &ldquo;You have the right to perform your actions, but never to the fruits of your actions.&rdquo;
          </p>
          <p style={{ fontSize: "12px", color: "rgba(160,155,135,0.45)", letterSpacing: "0.06em", textTransform: "uppercase" }}>— Bhagavad Gita, 2.47</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "32px" }}>
            {[
              { icon: "verified", text: "Authenticity certified on every item" },
              { icon: "autorenew", text: "Easy 30-day returns, no questions asked" },
              { icon: "local_shipping", text: "Free shipping on orders above ₹999" },
              { icon: "spa", text: "Energised before every shipment" },
            ].map(item => (
              <div key={item.icon} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "rgba(200,195,178,0.65)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "rgba(212,169,74,0.6)" }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={styles.rightPanel}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 600px 500px at 50% 50%, rgba(212,169,74,0.025) 0%, transparent 70%)", pointerEvents: "none" }} />
        
        <div style={styles.authBox}>
          {/* Tabs */}
          <div style={styles.tabContainer}>
            <button onClick={() => setActiveTab("login")} style={activeTab === "login" ? styles.tabActive : styles.tabInactive}>Sign In</button>
            <button onClick={() => setActiveTab("register")} style={activeTab === "register" ? styles.tabActive : styles.tabInactive}>Create Account</button>
          </div>

          {activeTab === "login" ? (
            <div>
              <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 600, color: "#f0ede6", marginBottom: "6px" }}>
                Welcome back.
              </h1>
              <p style={{ fontSize: "13px", color: "rgba(200,195,178,0.65)", marginBottom: "28px", lineHeight: 1.5 }}>
                Sign in to view your orders, wishlist, and saved addresses.
              </p>

              {error && (
                <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "8px", padding: "12px 14px", fontSize: "12px", color: "#f87171", marginBottom: "16px" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={styles.label}>Email Address</label>
                  <div style={styles.inputWrap}>
                    <span className="material-symbols-outlined" style={styles.inputIcon}>mail</span>
                    <input {...register("email")} type="email" placeholder="priya@gmail.com" style={styles.input}
                      onFocus={e => { e.target.style.borderColor = "rgba(212,169,74,0.3)"; e.target.style.background = "rgba(212,169,74,0.04)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(212,169,74,0.1)"; e.target.style.background = "rgba(212,169,74,0.03)"; }}
                    />
                  </div>
                  {errors.email && <p style={{ fontSize: "10px", color: "#f87171", marginTop: "3px" }}>{errors.email.message}</p>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={styles.label}>Password</label>
                  <div style={{ ...styles.inputWrap }}>
                    <span className="material-symbols-outlined" style={styles.inputIcon}>lock</span>
                    <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="Your password"
                      style={{ ...styles.input, paddingRight: "40px" }}
                      onFocus={e => { e.target.style.borderColor = "rgba(212,169,74,0.3)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(212,169,74,0.1)"; }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", color: "rgba(160,155,135,0.45)" }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>{showPassword ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                  {errors.password && <p style={{ fontSize: "10px", color: "#f87171", marginTop: "3px" }}>{errors.password.message}</p>}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-4px" }}>
                  <Link href="#" style={{ fontSize: "11px", color: "rgba(212,169,74,0.5)", textDecoration: "none" }}>Forgot password?</Link>
                </div>

                <div style={styles.divider}>
                  <div style={styles.dividerLine} />
                  <span style={styles.dividerText}>or continue with</span>
                  <div style={styles.dividerLine} />
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="button" style={styles.socialBtn}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "3px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#4285f4", fontSize: "10px", fontWeight: 900 }}>G</span>
                    </div>
                    Google
                  </button>
                  <button type="button" style={styles.socialBtn}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "3px", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>🍎</div>
                    Apple
                  </button>
                </div>

                <button type="submit" disabled={isLoading} style={{ ...styles.btn, marginTop: "20px", opacity: isLoading ? 0.7 : 1 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>login</span>
                  {isLoading ? "Signing in…" : "Sign In"}
                </button>
              </form>

              <p style={styles.switchPrompt}>
                Don&apos;t have an account?{" "}
                <span style={styles.switchLink} onClick={() => setActiveTab("register")}>Create one — it&apos;s free</span>
              </p>
            </div>
          ) : (
            <div>
              <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 600, color: "#f0ede6", marginBottom: "6px" }}>
                Begin your journey.
              </h1>
              <p style={{ fontSize: "13px", color: "rgba(200,195,178,0.65)", marginBottom: "28px", lineHeight: 1.5 }}>
                Create your account to track orders, save favourites, and access member discounts.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={styles.label}>First Name</label>
                  <input type="text" placeholder="Priya" style={{ ...styles.input, paddingLeft: "14px" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={styles.label}>Last Name</label>
                  <input type="text" placeholder="Sharma" style={{ ...styles.input, paddingLeft: "14px" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={styles.label}>Email Address</label>
                  <div style={styles.inputWrap}>
                    <span className="material-symbols-outlined" style={styles.inputIcon}>mail</span>
                    <input type="email" placeholder="priya@gmail.com" style={styles.input} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={styles.label}>Phone Number</label>
                  <div style={styles.inputWrap}>
                    <span className="material-symbols-outlined" style={styles.inputIcon}>phone</span>
                    <input type="tel" placeholder="+91 98765 43210" style={styles.input} />
                  </div>
                </div>
              </div>

              <div style={styles.divider}>
                <div style={styles.dividerLine} />
                <span style={styles.dividerText}>or sign up with</span>
                <div style={styles.dividerLine} />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" style={styles.socialBtn}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "3px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#4285f4", fontSize: "10px", fontWeight: 900 }}>G</span>
                  </div>
                  Google
                </button>
              </div>
              <Link href="/register" style={{ ...styles.btn, marginTop: "16px", display: "flex", textDecoration: "none" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>person_add</span>
                Create Account
              </Link>
              <p style={styles.switchPrompt}>
                Already have an account?{" "}
                <span style={styles.switchLink} onClick={() => setActiveTab("login")}>Sign in</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ position: "fixed", bottom: 0, right: 0, padding: "16px 60px", fontSize: "11px", color: "rgba(160,155,135,0.45)", display: "flex", gap: "16px" }}>
        <Link href="#" style={{ color: "rgba(160,155,135,0.45)", textDecoration: "none" }}>Privacy</Link>
        <Link href="#" style={{ color: "rgba(160,155,135,0.45)", textDecoration: "none" }}>Terms</Link>
        <span>© 2026 Akaal Spiritual Arts</span>
      </footer>
    </div>
  );
}
