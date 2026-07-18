import prisma from "@/lib/prisma";
import { CustomersClient, type CustomerRecord } from "./customers-client";

export const dynamic = "force-dynamic";

function getSegment(customer: CustomerRecord): "VIP" | "Active" | "New" | "At Risk" {
  if (customer.lifetimeValue >= 20000) return "VIP";
  if (!customer.lastOrderAt) return "New";

  const now = new Date();
  const createdAt = new Date(customer.createdAt);
  const lastOrder = new Date(customer.lastOrderAt);
  const daysSinceLastOrder = Math.floor((now.getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24));
  const daysSinceSignup = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceSignup <= 30 && customer.ordersCount <= 1) return "New";
  if (daysSinceLastOrder <= 45) return "Active";
  return "At Risk";
}

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const customers: CustomerRecord[] = users.map((user) => {
    const lifetimeValue = user.orders.reduce((sum, order) => sum + Number(order.total), 0);
    const lastOrderAt = user.orders[0]?.createdAt ?? null;

    return {
      id: user.id,
      name: user.name || "Unnamed Seeker",
      email: user.email ?? "—",
      createdAt: user.createdAt.toISOString(),
      ordersCount: user.orders.length,
      lifetimeValue,
      lastOrderAt: lastOrderAt ? lastOrderAt.toISOString() : null,
      latestStatus: user.orders[0]?.status ?? "No orders yet",
      segment: "New",
    };
  });

  const withSegments = customers.map((customer) => ({
    ...customer,
    segment: getSegment(customer),
  }));

  return <CustomersClient initialCustomers={withSegments} />;
}
