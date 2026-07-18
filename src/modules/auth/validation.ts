import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const UpdateProfileSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(80),
  emailNotifications: z.boolean().optional(),
  privacyMode: z.boolean().optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  token: z.string().min(1, { message: "Reset token is missing" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
