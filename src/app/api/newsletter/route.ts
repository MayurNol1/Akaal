import { errorResponse, successResponse } from "@/lib/api-responses";
import prisma from "@/lib/prisma";
import { z } from "zod";

const SubscribeSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = SubscribeSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Enter a valid email address", 400);
    }

    const email = parsed.data.email.toLowerCase();
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    });

    return successResponse({ subscribed: true });
  } catch (error) {
    console.error("POST /api/newsletter error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
