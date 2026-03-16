"use server";

import prisma from "@/lib/prisma";

export type AdminNotification = {
  id: string;
  type: "DISCIPLE_JOINED" | "ORDER_PLACED";
  title: string;
  message: string;
  createdAt: string;
  meta: string;
};

export async function getRecentNotifications(): Promise<AdminNotification[]> {
  try {
    const users = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, createdAt: true },
    });

    const orders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, total: true, createdAt: true },
    });

    const notifications: AdminNotification[] = [];

    for (const user of users) {
      notifications.push({
        id: `user-${user.id}`,
        type: "DISCIPLE_JOINED",
        title: "New Disciple Joined",
        message: `${user.name || "A new seeker"} has joined your sanctuary. Prepare to welcome them.`,
        createdAt: user.createdAt.toISOString(),
        meta: user.createdAt.getTime().toString(), 
      });
    }

    for (const order of orders) {
      notifications.push({
        id: `order-${order.id}`,
        type: "ORDER_PLACED",
        title: "Manifestation Complete",
        message: `Order #AKL-${order.id.slice(0, 5).toUpperCase()} has been secured. Energy exchange verified.`,
        createdAt: order.createdAt.toISOString(),
        meta: order.createdAt.getTime().toString(),
      });
    }

    // Sort by date descending
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return notifications.slice(0, 5);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}
