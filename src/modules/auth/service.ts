import crypto from "crypto";
import { AuthRepository } from "./repository";
import { RegisterInput, UpdateProfileInput, ChangePasswordInput } from "./validation";
import { comparePassword, hashPassword } from "@/lib/auth-utils";
import { sendMail, emailLayout } from "@/lib/mail";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export class AuthService {
  static async register(input: RegisterInput) {
    const existingUser = await AuthRepository.findUserByEmail(input.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await AuthRepository.createUser({
      ...input,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  static async findUserByEmail(email: string) {
    return AuthRepository.findUserByEmail(email);
  }

  static async getProfile(userId: string) {
    const user = await AuthRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailNotifications: user.emailNotifications,
      privacyMode: user.privacyMode,
      hasPassword: !!user.password,
    };
  }

  static async updateProfile(userId: string, input: UpdateProfileInput) {
    return AuthRepository.updateProfile(userId, input);
  }

  static async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await AuthRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Credentials accounts must confirm their current password;
    // OAuth-only accounts (no password yet) may set one directly.
    if (user.password) {
      if (!input.currentPassword) {
        throw new Error("Current password is required");
      }
      const valid = await comparePassword(input.currentPassword, user.password);
      if (!valid) {
        throw new Error("Current password is incorrect");
      }
    }

    const hashed = await hashPassword(input.newPassword);
    await AuthRepository.updatePassword(userId, hashed);
    return { success: true };
  }

  /**
   * Always resolves successfully so the endpoint can't be used to probe
   * which emails are registered.
   */
  static async requestPasswordReset(email: string) {
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) return;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await AuthRepository.replacePasswordResetToken(email, hashToken(rawToken), expires);

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

    await sendMail({
      to: email,
      subject: "Restore your path — Akaal password reset",
      html: emailLayout(
        "Reset Your Password",
        `<p style="font-size:14px;line-height:1.7;color:#c8c3b2;">A request was made to reset the password for your Akaal sanctuary. This link is valid for one hour.</p>
         <p style="text-align:center;margin:24px 0;">
           <a href="${resetUrl}" style="background:#d4a94a;color:#10100e;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:13px;font-weight:bold;letter-spacing:0.08em;">RESET PASSWORD</a>
         </p>
         <p style="font-size:12px;color:#6b6857;">If you did not request this, you can safely ignore this email — your password remains unchanged.</p>`
      ),
    });
  }

  static async resetPassword(email: string, token: string, newPassword: string) {
    const record = await AuthRepository.findPasswordResetToken(email, hashToken(token));
    if (!record || record.expires < new Date()) {
      throw new Error("This reset link is invalid or has expired");
    }

    const user = await AuthRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("This reset link is invalid or has expired");
    }

    const hashed = await hashPassword(newPassword);
    await AuthRepository.updatePassword(user.id, hashed);
    await AuthRepository.deletePasswordResetTokens(email);
    return { success: true };
  }
}
