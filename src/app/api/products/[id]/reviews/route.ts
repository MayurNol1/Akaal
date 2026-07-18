import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/api-responses";
import { ReviewService } from "@/modules/reviews/service";
import { SubmitReviewSchema } from "@/modules/reviews/validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await ReviewService.getProductReviews(id);
    return successResponse(data);
  } catch (error) {
    console.error("GET /api/products/[id]/reviews error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

export async function POST(req: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("Please sign in to write a review", 401);
    }

    const { id } = await context.params;
    const body = await req.json();
    const parsed = SubmitReviewSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid input", 400, parsed.error.flatten().fieldErrors);
    }

    const review = await ReviewService.submitReview(session.user.id, id, parsed.data);
    return successResponse(review, 201);
  } catch (error) {
    console.error("POST /api/products/[id]/reviews error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
