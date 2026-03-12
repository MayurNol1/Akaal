import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/api-responses";
import { getCart } from "@/modules/cart/service";

// GET /api/cart - Get cart for logged-in user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    const cart = await getCart(session.user.id);
    return successResponse(cart ?? { items: [] });
  } catch (error) {
    console.error("GET /api/cart error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

