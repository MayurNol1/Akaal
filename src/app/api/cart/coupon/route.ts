import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/api-responses";
import prisma from "@/lib/prisma";
import { CouponService } from "@/modules/coupons/service";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    const body = await req.json().catch(() => null);
    const code = typeof body?.code === "string" ? body.code : "";

    const result = await CouponService.validateCode(code);
    if (!result.ok) {
      return errorResponse(result.reason, 400);
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });
    if (!cart) {
      return errorResponse("Cart is empty", 400);
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: { couponCode: result.coupon.code },
    });

    return successResponse({ applied: result.coupon });
  } catch (error) {
    console.error("POST /api/cart/coupon error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    await prisma.cart.updateMany({
      where: { userId: session.user.id },
      data: { couponCode: null },
    });

    return successResponse({ removed: true });
  } catch (error) {
    console.error("DELETE /api/cart/coupon error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
