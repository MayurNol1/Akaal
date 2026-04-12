import prisma from "@/lib/prisma";

export class CartRepository {
  static async findByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  static async createCart(userId: string) {
    return prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  static async findItem(cartId: string, productId: string) {
    return prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  }

  static async createItem(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });
  }

  static async updateItem(id: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  static async deleteItem(id: string) {
    return prisma.cartItem.delete({
      where: { id },
    });
  }
}
