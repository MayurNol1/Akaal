import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().int().nonnegative("Stock cannot be negative").default(0),
  imageUrl: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable().transform(val => val === '' ? null : val),
  spiritualEssence: z.string().optional().nullable(),
  specifications: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
