import { auth } from "@/auth";
import { errorResponse, successResponse, unauthorizedResponse } from "@/lib/api-responses";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return unauthorizedResponse();
    }

    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return errorResponse("Category name is required", 400);
    }

    const category = await prisma.category.create({
      data: { name },
    });

    return successResponse(category, 201);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2002') {
         return errorResponse("Category with this name already exists", 400);
    }
    console.error("POST /api/categories error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return successResponse(categories);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
