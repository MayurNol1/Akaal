import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-responses";
import { auth } from "@/auth";
import { ProductService } from "@/modules/products/product.service";
import { CreateProductSchema } from "@/modules/products/product.validation";

// GET /api/products - Get all products (Public)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const isActiveParam = searchParams.get("isActive");
    const isActive = isActiveParam === "false" ? false : true; // Default to true if not specified

    const products = await ProductService.getProducts({ categoryId, isActive });
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
