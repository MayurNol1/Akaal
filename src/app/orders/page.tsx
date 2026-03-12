import Link from "next/link";
import { auth } from "@/auth";
import { getOrdersForUser } from "@/modules/orders/service";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold">Your Orders</h1>
          <p className="text-zinc-400">
            You need to be signed in to view your sacred orders.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black text-sm font-bold uppercase tracking-widest"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const orders = await getOrdersForUser(session.user.id);

  return (
    <div className="bg-black min-h-screen pb-24 text-white">
      <div className="h-24" />
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold italic gold-gradient">
            Your Orders
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="glass border border-white/5 rounded-[3rem] py-16 flex flex-col items-center justify-center space-y-6">
            <p className="text-zinc-400">
              No sacred orders yet. Begin your journey in the collection.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const totalNumber = Number(order.total);

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block glass border border-white/5 rounded-3xl p-5 hover:border-gold/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1">
                      <p className="text-xs text-zinc-500 uppercase tracking-[0.3em]">
                        Order
                      </p>
                      <p className="text-sm font-mono text-zinc-300">
                        #{order.id.slice(0, 8)}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs text-zinc-500 uppercase tracking-[0.3em]">
                        Status
                      </p>
                      <p className="text-sm font-semibold">
                        {order.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-zinc-500">
                      {order.items.length} item
                      {order.items.length === 1 ? "" : "s"} ·{" "}
                      {order.createdAt.toLocaleDateString()}
                    </p>
                    <p className="text-lg font-bold text-gold">
                      ${totalNumber.toFixed(2)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

