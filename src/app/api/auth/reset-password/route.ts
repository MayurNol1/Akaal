import { errorResponse, successResponse } from "@/lib/api-responses";
import { AuthService } from "@/modules/auth/service";
import { ResetPasswordSchema } from "@/modules/auth/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ResetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid input", 400, parsed.error.flatten().fieldErrors);
    }

    const { email, token, password } = parsed.data;
    await AuthService.resetPassword(email, token, password);
    return successResponse({ reset: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("reset link")) {
      return errorResponse(error.message, 400);
    }
    console.error("POST /api/auth/reset-password error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
