import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/api-responses";
import { AuthService } from "@/modules/auth/service";
import { ChangePasswordSchema } from "@/modules/auth/validation";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    const body = await req.json();
    const parsed = ChangePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid input", 400, parsed.error.flatten().fieldErrors);
    }

    await AuthService.changePassword(session.user.id, parsed.data);
    return successResponse({ changed: true });
  } catch (error) {
    // Wrong/missing current password is a user error, not a server fault
    if (error instanceof Error && error.message.includes("password")) {
      return errorResponse(error.message, 400);
    }
    console.error("POST /api/profile/password error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
