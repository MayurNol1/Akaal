import prisma from "@/lib/prisma";
import { OrderWithItems } from "./types";
import { OrderStatus } from "@prisma/client";

export class OrderRepository {
  static async findManyByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findByIdAndUserId(orderId: string, userId: string): Promise<OrderWithItems | null> {
    return prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    }) as Promise<OrderWithItems | null>;
  }

  static async findAll() {
    return prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateStatus(orderId: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
