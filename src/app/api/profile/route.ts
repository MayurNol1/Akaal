import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/api-responses";
import { AuthService } from "@/modules/auth/service";
import { UpdateProfileSchema } from "@/modules/auth/validation";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    const profile = await AuthService.getProfile(session.user.id);
    return successResponse(profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    const body = await req.json();
    const parsed = UpdateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid input", 400, parsed.error.flatten().fieldErrors);
    }

    const updated = await AuthService.updateProfile(session.user.id, parsed.data);
    return successResponse(updated);
  } catch (error) {
    console.error("PATCH /api/profile error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
