import prisma from "@/lib/prisma";

export class WishlistRepository {
  static async findProductIdsByUser(userId: string): Promise<string[]> {
    const rows = await prisma.wishlistItem.findMany({
      where: { userId },
      select: { productId: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => r.productId);
  }

  static async exists(userId: string, productId: string): Promise<boolean> {
    const row = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
      select: { id: true },
    });
    return !!row;
  }

  static async add(userId: string, productId: string) {
    return prisma.wishlistItem.create({ data: { userId, productId } });
  }

  static async remove(userId: string, productId: string) {
    return prisma.wishlistItem.deleteMany({ where: { userId, productId } });
  }

  static async addMany(userId: string, productIds: string[]) {
    if (productIds.length === 0) return { count: 0 };
    // Only merge ids that are real products, so a stale localStorage
    // entry can't violate the FK
    const valid = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });
    return prisma.wishlistItem.createMany({
      data: valid.map((p) => ({ userId, productId: p.id })),
      skipDuplicates: true,
    });
  }

  static async count(userId: string): Promise<number> {
    return prisma.wishlistItem.count({ where: { userId } });
  }
}
