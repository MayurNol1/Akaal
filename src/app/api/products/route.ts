import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-responses";
import { auth } from "@/auth";
import { ProductService } from "@/modules/products/service";
import { CreateProductSchema } from "@/modules/products/validation";

// GET /api/products - Get all products (Public)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const ids = searchParams.get("ids")?.split(",") || undefined;
    const isActiveParam = searchParams.get("isActive");
    let isActive: boolean | undefined = undefined;
    if (isActiveParam === "true") isActive = true;
    if (isActiveParam === "false") isActive = false;

    const products = await ProductService.getProducts({ categoryId, isActive, ids });
    return successResponse(products);
  } catch (error: unknown) {
    console.error("GET Products Error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

// POST /api/products - Create a product (Admin only)
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return unauthorizedResponse();
    }

    const body = await req.json();
    const validatedData = CreateProductSchema.safeParse(body);

    if (!validatedData.success) {
      return errorResponse("Invalid input data", 400, validatedData.error.flatten().fieldErrors);
    }

    const product = await ProductService.createProduct(validatedData.data);
    return successResponse(product, 201);
  } catch (error: unknown) {
    console.error("POST Product Error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
