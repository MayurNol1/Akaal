import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-responses";
import { auth } from "@/auth";
import { ProductService } from "@/modules/products/product.service";
import { UpdateProductSchema } from "@/modules/products/product.validation";

// GET /api/products/:id - Get single product (Public)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await ProductService.getProductById(id);
    return successResponse(product);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Product not found") {
      return errorResponse(error.message, 404);
    }
    console.error("GET Product ID Error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

// PATCH /api/products/:id - Update product (Admin only)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const body = await req.json();
    const validatedData = UpdateProductSchema.safeParse(body);

    if (!validatedData.success) {
      return errorResponse("Invalid input data", 400, validatedData.error.flatten().fieldErrors);
    }

    const updatedProduct = await ProductService.updateProduct(id, validatedData.data);
    return successResponse(updatedProduct);
  } catch (error: unknown) {
    console.error("PATCH Product Error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

// DELETE /api/products/:id - Delete product (Admin only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return unauthorizedResponse();
    }

    const { id } = await params;
    await ProductService.deleteProduct(id);
    return successResponse({ message: "Product deleted successfully" });
  } catch (error: unknown) {
    console.error("DELETE Product Error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
