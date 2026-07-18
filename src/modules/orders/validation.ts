import { z } from "zod";

export const ShippingAddressSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{10,15}$/, "Enter a valid phone number"),
  address1: z.string().trim().min(5, "Enter your full address").max(200),
  city: z.string().trim().min(2, "City is required").max(80),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),
});

export type ShippingAddressInput = z.infer<typeof ShippingAddressSchema>;

