import { 
  Package, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  DollarSign
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-10 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Overview</h1>
          <p className="text-zinc-500 mt-2">Welcome back to the command center.</p>
        </div>
        <Link 
          href="/admin/products/create"
          className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 active:scale-95"
        >
          <Plus size={20} />
          New Product
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Gross Revenue" 
          value="$128,450.00" 
          delta="+14.2%" 
          positive 
          icon={<DollarSign className="text-emerald-500" size={20} />} 
        />
        <StatCard 
          label="Total Orders" 
          value="1,482" 
          delta="+8.1%" 
          positive 
          icon={<ShoppingBag className="text-blue-500" size={20} />} 
        />
        <StatCard 
          label="Total Products" 
          value="156" 
          delta="-2.4%" 
          positive={false} 
          icon={<Package className="text-amber-500" size={20} />} 
        />
        <StatCard 
          label="New Customers" 
          value="428" 
          delta="+12.5%" 
          positive 
          icon={<Users className="text-purple-500" size={20} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Sales / Activity would go here */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6">Recent Performance</h3>
          <div className="h-[300px] flex items-center justify-center border border-dashed border-white/5 rounded-2xl bg-black/20 italic text-zinc-600">
            Analytics visualization placeholder
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 flex flex-col">
          <h3 className="text-xl font-bold mb-6">Inventory Status</h3>
          <div className="space-y-6 flex-1">
            <InventoryRow label="Out of Stock" count={4} color="bg-red-500" />
            <InventoryRow label="Low Stock" count={12} color="bg-amber-500" />
            <InventoryRow label="Healthy" count={140} color="bg-emerald-500" />
          </div>
          <Link href="/admin/products" className="mt-8 text-center text-sm text-zinc-500 hover:text-white transition-colors underline underline-offset-4">
            Manage Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, positive, icon }: { label: string, value: string, delta: string, positive: boolean, icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-3xl hover:border-white/20 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
          {icon}
        </div>
        <div className={`flex items-center text-xs font-bold gap-0.5 ${positive ? "text-emerald-500" : "text-red-500"}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {delta}
        </div>
      </div>
      <div>
        <p className="text-zinc-500 text-sm font-medium">{label}</p>
        <h4 className="text-2xl font-bold mt-1">{value}</h4>
      </div>
    </div>
  );
}

function InventoryRow({ label, count, color }: { label: string, count: number, color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`h-2 w-2 rounded-full ${color}`} />
        <span className="text-sm font-medium text-zinc-400">{label}</span>
      </div>
      <span className="text-sm font-bold">{count}</span>
    </div>
  );
}
