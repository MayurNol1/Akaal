import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { CreateProductInput, UpdateProductInput } from "./validation";

export class ProductRepository {
  static async create(data: CreateProductInput) {
    return prisma.product.create({
      data: {
        ...data,
        price: new Prisma.Decimal(data.price),
      },
    });
  }

  static async findMany(filters?: { categoryId?: string; isActive?: boolean; limit?: number; ids?: string[] }) {
    const { limit, ids, categoryId, isActive } = filters || {};
    
    const where: Prisma.ProductWhereInput = {};
    if (ids) where.id = { in: ids };
    if (categoryId) where.categoryId = categoryId;
    if (isActive !== undefined) where.isActive = isActive;

    return prisma.product.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
  }

  static async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  static async update(id: string, data: UpdateProductInput) {
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

  static async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
