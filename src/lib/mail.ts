/**
 * Minimal email sender. Uses the Resend REST API (https://resend.com) when
 * RESEND_API_KEY is set — no SDK dependency, plain fetch. When unset (local
 * dev), the email is logged to the console instead so flows stay testable.
 *
 * Env: RESEND_API_KEY, EMAIL_FROM (e.g. "Akaal <noreply@yourdomain.com>").
 */

interface SendMailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Akaal <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(
      `[mail:dev-fallback] To: ${to}\nSubject: ${subject}\n${html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}`
    );
    return true;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!res.ok) {
      console.error("sendMail failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("sendMail error:", error);
    return false;
  }
}

/** Shared shell so all transactional emails look consistent. */
export function emailLayout(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#10100e;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
      <p style="text-align:center;font-size:22px;letter-spacing:0.3em;color:#d4a94a;margin:0 0 28px;">AKAAL</p>
      <div style="background:#161612;border:1px solid rgba(212,169,74,0.2);border-radius:14px;padding:32px;color:#f0ede6;">
        <h1 style="font-size:20px;color:#d4a94a;margin:0 0 16px;">${title}</h1>
        ${bodyHtml}
      </div>
      <p style="text-align:center;font-size:11px;color:#6b6857;margin-top:24px;">
        Akaal — Sacred Crafts &amp; Spiritual Essentials
      </p>
    </div>
  </body>
</html>`;
}
