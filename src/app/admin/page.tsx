import { 
  Package, 
  Activity,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { AdminImage } from "./admin-image";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const usersCount = await prisma.user.count();
  const ordersCount = await prisma.order.count();
  const revenueAgg = await prisma.order.aggregate({ _sum: { total: true } });
  const totalRevenue = revenueAgg._sum.total ? Number(revenueAgg._sum.total) : 0;
  
  const products = await prisma.product.findMany({ 
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 4 
  });

  // Calculate revenue for the last 7 days
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  
  const sevenDaysAgo = new Date(todayDate);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const recentOrders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      total: true,
      createdAt: true,
    },
  });

  const dailyRevenue = Array(7).fill(0);
  const daysLabels: string[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayDate);
    d.setDate(todayDate.getDate() - i);
    daysLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
  }

  recentOrders.forEach(order => {
    const orderDay = new Date(order.createdAt);
    orderDay.setHours(0, 0, 0, 0);
    const diffTime = todayDate.getTime() - orderDay.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const index = 6 - diffDays;
    if (index >= 0 && index < 7) {
      dailyRevenue[index] += Number(order.total);
    }
  });

  const maxRevenue = Math.max(...dailyRevenue, 1);
  const points = dailyRevenue.map((val, index) => {
    const x = index * (1000 / 6);
    const y = 180 - (val / maxRevenue) * 160;
    return { x, y };
  });

  const linePath = points.length > 0 ? `M${points[0].x},${points[0].y} ` + points.slice(1).map((p, i) => {
    const pPrev = points[i]; 
    const cp1x = pPrev.x + (p.x - pPrev.x) / 2;
    const cp1y = pPrev.y;
    const cp2x = pPrev.x + (p.x - pPrev.x) / 2;
    const cp2y = p.y;
    return `C${cp1x},${cp1y} ${cp2x},${cp2y} ${p.x},${p.y}`;
  }).join(' ') : '';

  const fillPath = points.length > 0 ? `${linePath} L1000,200 L0,200 Z` : '';

  return (
    <div className="space-y-10">
      {/* Dashboard Title */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-black tracking-tight text-white italic">Zen <span className="text-primary not-italic">Overview</span></h2>
          <p className="text-zinc-500 mt-1 font-medium">Peaceful management for your spiritual sanctuary.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest border border-white/5 flex items-center gap-2 text-zinc-400">
            <CalendarDays size={14} className="text-primary" />
            Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-[32px] bg-white/2 border border-white/5 shadow-xl group hover:border-primary/20 transition-all duration-700 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4">Total Enlightenment (Revenue)</p>
          <div className="flex items-baseline gap-4 mt-2">
            <h3 className="text-4xl font-serif font-black text-white italic">${totalRevenue.toFixed(2)}</h3>
            <span className="text-primary text-[10px] font-black bg-primary/5 px-2 py-1 rounded-lg">Realtime</span>
          </div>
        </div>
        <div className="p-8 rounded-[32px] bg-white/2 border border-white/5 shadow-xl group hover:border-primary/20 transition-all duration-700 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4">Sacred Orders</p>
          <div className="flex items-baseline gap-4 mt-2">
            <h3 className="text-4xl font-serif font-black text-white italic">{ordersCount}</h3>
            <span className="text-primary text-[10px] font-black bg-primary/5 px-2 py-1 rounded-lg">Realtime</span>
          </div>
        </div>
        <div className="p-8 rounded-[32px] bg-white/2 border border-white/5 shadow-xl group hover:border-primary/20 transition-all duration-700 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4">New Disciples</p>
          <div className="flex items-baseline gap-4 mt-2">
            <h3 className="text-4xl font-serif font-black text-white italic">{usersCount}</h3>
            <span className="text-primary text-[10px] font-black bg-primary/5 px-2 py-1 rounded-lg">Realtime</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-10 rounded-[40px] bg-white/2 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(236,149,19,0.03),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="flex items-center justify-between mb-10 relative z-10">
          <div className="space-y-1">
            <h4 className="text-xl font-serif font-black text-white flex items-center gap-3 italic">
               <Activity size={18} className="text-primary" />
               Revenue Flow
            </h4>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Spiritual prosperity over the last 7 cycles</p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.2em] border border-primary/20 shadow-[0_0_12px_rgba(236,149,19,0.1)]">
              <div className="size-2 rounded-full bg-primary animate-pulse" /> Live Sync
            </span>
          </div>
        </div>
        
        {/* SVG Chart from Stitch */}
        <div className="relative h-64 w-full group/inner px-2">
          <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(236,149,19,0.15)] group-hover/inner:drop-shadow-[0_0_20px_rgba(236,149,19,0.25)] transition-all duration-1000" preserveAspectRatio="none" viewBox="0 0 1000 200">
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ec9513" stopOpacity="0.3"></stop>
                <stop offset="100%" stopColor="#ec9513" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path d={fillPath} fill="url(#chartGradient)"></path>
            <path d={linePath} fill="none" stroke="#ec9513" strokeLinecap="round" strokeWidth="4" className="transition-all duration-1000"></path>
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 pt-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest italic group-hover/inner:text-white transition-colors duration-1000">
            {daysLabels.map((day, i) => (
              <span key={i}>{day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Table from Stitch */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-xl font-serif font-black text-white italic flex items-center gap-3">
             <Package size={18} className="text-primary" />
             Sacred Artifacts
          </h4>
          <Link href="/admin/products" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline underline-offset-4 decoration-primary/40">Manage All Inventory</Link>
        </div>
        <div className="overflow-hidden bg-white/2 border border-white/5 rounded-[32px] shadow-2xl transition-all duration-700 hover:border-primary/5">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/1">
                <th className="px-10 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Product</th>
                <th className="px-10 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">SKU</th>
                <th className="px-10 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Energy Level (Stock)</th>
                <th className="px-10 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 text-right">Value</th>
                <th className="px-10 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p: {
                id: string;
                name: string;
                category: { name: string } | null;
                stock: number;
                price: number | { toString: () => string };
                isActive: boolean;
                imageUrl: string | null;
              }) => (
                <InventoryRow 
                  key={p.id}
                  name={p.name} 
                  category={p.category?.name || "Ancient Relic"} 
                  sku={`AKL-${p.id.slice(0,6).toUpperCase()}`} 
                  stock={`${p.stock} Units`} 
                  price={`$${Number(p.price).toFixed(2)}`} 
                  status={p.isActive ? "In Stock" : "Dormant"}
                  image={p.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuC2twSVAOXjZdzCFiaaztJDcLEzGlPds0YTe_hdPNq4mkQeQZn0P2UHpnlvS9Ar9OpH3rzzcFZap-fiq4A5oVCPHvxZiPyj0MqhR3TruAwl1Y6UKtfly_FpHs2NAzPZUhFK1qHwd0qP_Y9HHCQ54jzA-sLEd2AkjHALpRlndFajV3z18YbaJDQ4w7kjXYIRlqGMwqspYLVozmU79nazaqtSQOT7maA_wt6KK8a3YEGY2ZvuqiBTPvNXUrBoIr2WpdsTnahducj-snk"}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InventoryRow({ name, category, sku, stock, price, status, image }: { 
  name: string, 
  category: string, 
  sku: string, 
  stock: string, 
  price: string, 
  status: string, 
  image: string 
}) {
  return (
    <tr className="hover:bg-white/3 transition-all duration-500 group">
      <td className="px-10 py-6">
        <div className="flex items-center gap-6">
          <div className="size-14 rounded-2xl bg-white/5 overflow-hidden border border-white/5 shrink-0 group-hover:scale-110 group-hover:border-primary/20 transition-all duration-700 relative">
            <AdminImage 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
            />
          </div>
          <div className="space-y-1">
            <p className="font-serif font-black text-white italic group-hover:text-primary transition-colors">{name}</p>
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">{category}</p>
          </div>
        </div>
      </td>
      <td className="px-10 py-6 text-[10px] text-zinc-500 font-mono uppercase tracking-tight italic group-hover:text-zinc-300 transition-colors">{sku}</td>
      <td className="px-10 py-6 text-[11px] font-bold text-zinc-400 font-serif italic">{stock}</td>
      <td className="px-10 py-6 text-right font-serif font-black text-white italic tracking-widest">{price}</td>
      <td className="px-10 py-6">
        <div className="flex justify-center">
          <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
            status === 'In Stock' 
              ? 'bg-primary/5 text-primary border-primary/20 shadow-[0_0_12px_rgba(236,149,19,0.15)]' 
              : 'bg-amber-500/5 text-amber-500 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
          }`}>
            {status}
          </span>
        </div>
      </td>
    </tr>
  );
}
