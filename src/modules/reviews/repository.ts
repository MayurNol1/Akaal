import prisma from "@/lib/prisma";

export class ReviewRepository {
  static async findByProduct(productId: string) {
    return prisma.review.findMany({
      where: { productId },
      // Verified purchases carry more weight — list them first
      orderBy: [{ isVerifiedPurchase: "desc" }, { createdAt: "desc" }],
      include: { user: { select: { name: true } } },
    });
  }

  static async aggregateForProduct(productId: string) {
    const agg = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return {
      average: agg._avg.rating ?? 0,
      count: agg._count.rating,
    };
  }

  static async aggregateForProducts(productIds: string[]) {
    if (productIds.length === 0) return [];
    return prisma.review.groupBy({
      by: ["productId"],
      where: { productId: { in: productIds } },
      _avg: { rating: true },
      _count: { rating: true },
    });
  }

  static async upsert(
    userId: string,
    productId: string,
    data: { rating: number; title?: string; body: string; isVerifiedPurchase: boolean }
  ) {
    return prisma.review.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId, ...data },
      update: { rating: data.rating, title: data.title, body: data.body },
    });
  }

  static async hasPurchased(userId: string, productId: string): Promise<boolean> {
    const item = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
        },
      },
      select: { id: true },
    });
    return !!item;
  }
}
