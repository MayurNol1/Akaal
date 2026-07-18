import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/api-responses";
import { WishlistService } from "@/modules/wishlist/service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    const ids = await WishlistService.getProductIds(session.user.id);
    return successResponse({ ids });
  } catch (error) {
    console.error("GET /api/wishlist error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    const body = await req.json().catch(() => null);

    // Toggle a single product
    if (typeof body?.productId === "string" && body.productId) {
      const liked = await WishlistService.toggle(session.user.id, body.productId);
      return successResponse({ liked });
    }

    // Merge guest likes carried over from localStorage
    if (Array.isArray(body?.mergeIds)) {
      const ids = await WishlistService.merge(
        session.user.id,
        body.mergeIds.filter((id: unknown): id is string => typeof id === "string").slice(0, 200)
      );
      return successResponse({ ids });
    }

    return errorResponse("Provide productId or mergeIds", 400);
  } catch (error) {
    console.error("POST /api/wishlist error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
