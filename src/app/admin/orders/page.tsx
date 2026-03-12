import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
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

  return (
    <div className="bg-black min-h-screen pb-24 text-white">
      <div className="h-24" />
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold italic gold-gradient">
          Admin · Orders
        </h1>

        <div className="space-y-4">
          {orders.map((order) => {
            const totalNumber = Number(order.total);

            return (
              <div
                key={order.id}
                className="glass border border-white/5 rounded-3xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500 uppercase tracking-[0.3em]">
                      Order
                    </p>
                    <p className="text-sm font-mono text-zinc-300">
                      #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {order.user.email}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-xs text-zinc-500 uppercase tracking-[0.3em]">
                      Status
                    </p>
                    <form
                      action={`/api/admin/orders`}
                      method="POST"
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="orderId" value={order.id} />
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="bg-black border border-white/20 text-xs rounded-full px-3 py-1"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <button
                        type="submit"
                        className="text-xs font-semibold uppercase tracking-[0.25em] bg-white text-black px-3 py-1 rounded-full"
                      >
                        Save
                      </button>
                    </form>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 space-y-1 text-sm">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-zinc-300">
                      {item.product.name} · Qty {item.quantity}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <p className="text-xs text-zinc-500">
                    {order.createdAt.toLocaleString()}
                  </p>
                  <p className="text-lg font-bold text-gold">
                    ${totalNumber.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

