import { z } from "zod";

export const SubmitReviewSchema = z.object({
  rating: z.number().int().min(1, "Choose a rating").max(5),
  title: z.string().trim().max(100).optional(),
  body: z
    .string()
    .trim()
    .min(10, "Share at least a few words (10+ characters)")
    .max(1000),
});

export type SubmitReviewInput = z.infer<typeof SubmitReviewSchema>;
