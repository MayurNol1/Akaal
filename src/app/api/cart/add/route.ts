import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/api-responses";
import { addToCart } from "@/modules/cart/service";
import { addToCartSchema } from "@/modules/cart/validation";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    const body = await req.json();
    const parsed = addToCartSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        "Invalid cart input",
        400,
        parsed.error.flatten().fieldErrors,
      );
    }

    const item = await addToCart(session.user.id, parsed.data);
    return successResponse(item, 201);
  } catch (error) {
    console.error("POST /api/cart/add error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

