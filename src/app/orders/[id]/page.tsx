import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getOrderForUser } from "@/modules/orders/service";

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-zinc-400">
            You need to be signed in to view your order details.
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

  const { id } = await params;
  const order = await getOrderForUser(session.user.id, id);

  if (!order) {
    return notFound();
  }

  const totalNumber = Number(order.total);

  return (
    <div className="bg-black min-h-screen pb-24 text-white">
      <div className="h-24" />
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-[0.3em]">
              Order
            </p>
            <h1 className="text-3xl md:text-4xl font-bold italic gold-gradient">
              #{order.id.slice(0, 8)}
            </h1>
          </div>
          <Link
            href="/orders"
            className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors"
          >
            Back to Orders
          </Link>
        </div>

        <div className="glass border border-white/5 rounded-[3rem] p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-[0.3em]">
                Status
              </p>
              <p className="text-sm font-semibold">{order.status}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 uppercase tracking-[0.3em]">
                Placed
              </p>
              <p className="text-sm">
                {order.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-4">
            {order.items.map((item) => {
              const unitPrice = Number(item.price);
              const lineTotal = unitPrice * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-xs text-zinc-500">
                      Qty {item.quantity} · ${unitPrice.toFixed(2)} each
                    </p>
                  </div>
                  <p className="font-semibold text-gold">
                    ${lineTotal.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/10 pt-6 flex items-center justify-between">
            <p className="text-sm text-zinc-400">Total</p>
            <p className="text-2xl font-bold text-gold">
              ${totalNumber.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

