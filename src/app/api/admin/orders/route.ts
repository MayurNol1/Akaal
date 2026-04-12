import { auth } from "@/auth";
import { errorResponse, successResponse, unauthorizedResponse } from "@/lib/api-responses";
import { updateOrderStatus } from "@/modules/orders/service";
import { OrderStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return unauthorizedResponse();
    }

    const formData = await req.formData();
    const orderId = formData.get("orderId");
    const status = formData.get("status");

    if (typeof orderId !== "string" || typeof status !== "string") {
      return errorResponse("Invalid input", 400);
    }

    const updated = await updateOrderStatus(orderId, status as OrderStatus);
    return successResponse(updated);
  } catch (error) {
    console.error("POST /api/admin/orders error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

