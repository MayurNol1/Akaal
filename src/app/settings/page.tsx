"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ProfileData {
  name: string | null;
  email: string | null;
  emailNotifications: boolean;
  privacyMode: boolean;
  hasPassword: boolean;
}

export default function SettingsPage() {
  const { data: session, update } = useSession();

  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [toast, setToast] = useState<{ kind: "success" | "error"; title: string; message: string } | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/profile")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled || !json.success) return;
        const p: ProfileData = json.data;
        setName(p.name ?? "");
        setEmail(p.email ?? "");
        setNotifications(p.emailNotifications);
        setPrivacy(p.privacyMode);
        setHasPassword(p.hasPassword);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
    return () => { cancelled = true; };
  }, []);

  const showToast = (kind: "success" | "error", title: string, message: string) => {
    setToast({ kind, title, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    if (name.trim().length < 2) {
      showToast("error", "Invalid Name", "Name must be at least 2 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), emailNotifications: notifications, privacyMode: privacy }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      await update({ name: name.trim() });
      showToast("success", "Settings Saved", "Your preferences have been updated.");
    } catch {
      showToast("error", "Save Failed", "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    if (hasPassword && !currentPassword) {
      setPasswordError("Enter your current password.");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPassword || undefined, newPassword }),
      });
      const json = await res.json();
      if (!json.success) {
        setPasswordError(json.error || "Password change failed.");
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setHasPassword(true);
      showToast("success", "Password Updated", "Your password has been changed.");
    } catch {
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setChangingPassword(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(212,169,74,0.03)",
    border: "1px solid rgba(212,169,74,0.12)", borderRadius: "9px",
    padding: "11px 14px", fontSize: "13px", color: "#f0ede6",
    outline: "none", fontFamily: "var(--font-sans)", transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div style={{ background: "#10100e", color: "#f0ede6", minHeight: "100vh", paddingTop: "72px", paddingBottom: "80px" }}>

      {toast && (
        <div style={{ position: "fixed", top: "84px", right: "20px", zIndex: 50, background: "rgba(16,16,14,0.97)", border: `1px solid ${toast.kind === "success" ? "rgba(212,169,74,0.28)" : "rgba(248,113,113,0.35)"}`, borderRadius: "12px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", backdropFilter: "blur(16px)", animation: "fadeIn 0.25s ease-out" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px", color: toast.kind === "success" ? "#d4a94a" : "#f87171", fontVariationSettings: "'FILL' 1" }}>
            {toast.kind === "success" ? "check_circle" : "error"}
          </span>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: toast.kind === "success" ? "#d4a94a" : "#f87171", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 2px" }}>{toast.title}</p>
            <p style={{ fontSize: "12px", color: "rgba(200,195,178,0.75)", margin: 0 }}>{toast.message}</p>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px clamp(16px,4vw,48px) 0" }}>
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "8px" }}>Account</p>
          <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
            Sanctuary <em style={{ color: "#d4a94a" }}>Settings</em>
          </h1>
        </div>

        {/* Profile */}
        <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "16px", padding: "24px", marginBottom: "16px", opacity: loaded ? 1 : 0.6 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: "#f0ede6", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>person</span>
            Profile Information
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label htmlFor="settings-name" style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>Display Name</label>
              <input id="settings-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" disabled={!loaded} style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "rgba(212,169,74,0.35)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(212,169,74,0.12)"; }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label htmlFor="settings-email" style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>Email Address</label>
              <input id="settings-email" type="email" disabled value={email || session?.user?.email || ""} style={{ ...inputStyle, background: "#10100e", borderColor: "rgba(255,255,255,0.05)", color: "rgba(160,155,135,0.4)", cursor: "not-allowed" }} />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "16px", padding: "24px", marginBottom: "16px", opacity: loaded ? 1 : 0.6 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: "#f0ede6", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>tune</span>
            Preferences
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "notifications", label: "Email Notifications", desc: "Receive updates about orders, new arrivals, and sacred mantras.", value: notifications, set: setNotifications },
              { icon: "shield", label: "Privacy Mode", desc: "Keep your wishlist and activity history private.", value: privacy, set: setPrivacy },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px", background: "rgba(212,169,74,0.02)", border: "1px solid rgba(212,169,74,0.07)", borderRadius: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(212,169,74,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>{item.icon}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#f0ede6", margin: "0 0 3px" }}>{item.label}</p>
                    <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => item.set(!item.value)}
                  disabled={!loaded}
                  role="switch"
                  aria-checked={item.value}
                  aria-label={item.label}
                  style={{ width: "44px", height: "24px", borderRadius: "99px", flexShrink: 0, background: item.value ? "#d4a94a" : "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.25s", boxShadow: item.value ? "0 0 12px rgba(212,169,74,0.3)" : "none" }}>
                  <span style={{ position: "absolute", top: "3px", left: item.value ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 600, color: "#f0ede6", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>lock</span>
            Security
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {hasPassword && (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label htmlFor="settings-current-password" style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>Current Password</label>
                <input id="settings-current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password" autoComplete="current-password" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "rgba(212,169,74,0.35)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(212,169,74,0.12)"; }} />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label htmlFor="settings-new-password" style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>New Password</label>
              <input id="settings-new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" autoComplete="new-password" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "rgba(212,169,74,0.35)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(212,169,74,0.12)"; }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label htmlFor="settings-confirm-password" style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.45)" }}>Confirm Password</label>
              <input id="settings-confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" autoComplete="new-password" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "rgba(212,169,74,0.35)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(212,169,74,0.12)"; }} />
            </div>
            {passwordError && (
              <p role="alert" style={{ fontSize: "12px", color: "#f87171", margin: 0 }}>{passwordError}</p>
            )}
            <button onClick={handleChangePassword} disabled={changingPassword} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", background: "transparent", color: "#d4a94a", padding: "11px 20px", borderRadius: "10px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid rgba(212,169,74,0.35)", cursor: changingPassword ? "wait" : "pointer", opacity: changingPassword ? 0.6 : 1 }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>key</span>
              {changingPassword ? "Updating..." : hasPassword ? "Change Password" : "Set Password"}
            </button>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving || !loaded} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#d4a94a", color: "#10100e", padding: "13px 32px", borderRadius: "10px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", border: "none", cursor: saving ? "wait" : "pointer", transition: "background 0.2s, box-shadow 0.2s", boxShadow: "0 4px 16px rgba(212,169,74,0.2)", opacity: saving || !loaded ? 0.7 : 1 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#e8c06c"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#d4a94a"; }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>save</span>
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
