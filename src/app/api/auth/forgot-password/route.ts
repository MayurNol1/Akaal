import { errorResponse, successResponse } from "@/lib/api-responses";
import { AuthService } from "@/modules/auth/service";
import { ForgotPasswordSchema } from "@/modules/auth/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ForgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid input", 400, parsed.error.flatten().fieldErrors);
    }

    await AuthService.requestPasswordReset(parsed.data.email);

    // Always succeed — never reveal whether the email is registered
    return successResponse({ sent: true });
  } catch (error) {
    console.error("POST /api/auth/forgot-password error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
