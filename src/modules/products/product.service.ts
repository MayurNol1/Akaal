import prisma from "@/lib/prisma";
import { CreateProductInput, UpdateProductInput } from "./product.validation";
import { Prisma } from "@prisma/client";

export class ProductService {
  static async createProduct(data: CreateProductInput) {
    return prisma.product.create({
      data: {
        ...data,
        price: new Prisma.Decimal(data.price),
      },
    });
  }

  static async getProducts(filters?: { categoryId?: string; isActive?: boolean }) {
    return prisma.product.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    
    if (!product) {
      throw new Error("Product not found");
    }
    
    return product;
  }

  static async updateProduct(id: string, data: UpdateProductInput) {
    const { price, ...rest } = data;
    
    const updateData: Prisma.ProductUpdateInput = { 
      ...rest,
      ...(price !== undefined && { price: new Prisma.Decimal(price) })
    };

    return prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
