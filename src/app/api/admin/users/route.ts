import { auth } from "@/auth";
import { errorResponse, successResponse, unauthorizedResponse } from "@/lib/api-responses";
import prisma from "@/lib/prisma";
import { z } from "zod";

const UpdateUserSchema = z
  .object({
    userId: z.string().min(1),
    role: z.enum(["USER", "ADMIN"]).optional(),
    isDisabled: z.boolean().optional(),
  })
  .refine((data) => data.role !== undefined || data.isDisabled !== undefined, {
    message: "Nothing to update",
  });

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return unauthorizedResponse();
    }

    const body = await req.json();
    const parsed = UpdateUserSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid input", 400, parsed.error.flatten().fieldErrors);
    }

    const { userId, role, isDisabled } = parsed.data;

    // Admins cannot demote or restrict themselves — prevents locking out the last admin
    if (userId === session.user.id) {
      return errorResponse("You cannot modify your own account", 400);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role !== undefined ? { role } : {}),
        ...(isDisabled !== undefined ? { isDisabled } : {}),
      },
      select: { id: true, role: true, isDisabled: true },
    });

    return successResponse(updated);
  } catch (error) {
    console.error("PATCH /api/admin/users error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
