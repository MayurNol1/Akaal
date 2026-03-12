import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/api-responses";
import { removeCartItem } from "@/modules/cart/service";
import { removeCartItemSchema } from "@/modules/cart/validation";

export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    const body = await req.json();
    const parsed = removeCartItemSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        "Invalid cart input",
        400,
        parsed.error.flatten().fieldErrors,
      );
    }

    await removeCartItem(session.user.id, parsed.data);
    return successResponse({ success: true });
  } catch (error) {
    console.error("DELETE /api/cart/remove error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

