import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/api-responses";
import { updateCartItem } from "@/modules/cart/service";
import { updateCartItemSchema } from "@/modules/cart/validation";

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    const body = await req.json();
    const parsed = updateCartItemSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        "Invalid cart input",
        400,
        parsed.error.flatten().fieldErrors,
      );
    }

    const item = await updateCartItem(session.user.id, parsed.data);
    return successResponse(item);
  } catch (error) {
    console.error("PATCH /api/cart/update error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

