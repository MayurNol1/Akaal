import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { 
  User, 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  ShoppingBag, 
  Users, 
  ChevronRight,
  Package,
  Clock
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col p-6 space-y-8 max-md:hidden">
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 bg-linear-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Akaal</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active />
          <NavItem icon={<ShoppingBag size={20} />} label="Orders" />
          <NavItem icon={<Package size={20} />} label="Products" />
          <NavItem icon={<Users size={20} />} label="Customers" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <div className="text-right max-sm:hidden">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <div className="h-10 w-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
              {user.image ? (
                <Image src={user.image} alt={user.name || "User"} fill className="rounded-full object-cover" />
              ) : (
                <User size={20} className="text-gray-400" />
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 space-y-8 animate-fade-in">
          <header>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Welcome back, <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">{user.name}</span>!
            </h2>
            <p className="text-gray-400 mt-1">Here is what&apos;s happening with your platform today.</p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard label="Total Revenue" value="$24,560" delta="+12%" />
            <StatCard label="Active Orders" value="48" delta="+5%" />
            <StatCard label="Avg. Order Value" value="$512" delta="-2%" />
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock size={20} className="text-blue-500" />
                Recent Orders
              </h3>
              <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium ring-offset-black rounded-lg transition-colors">
                View all <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <ActivityItem id="#ORD-4829" customer="Emily Chen" price="$1,200" status="Paid" />
              <ActivityItem id="#ORD-4828" customer="Mark Wilson" price="$840" status="Pending" />
              <ActivityItem id="#ORD-4827" customer="Sarah Knight" price="$250" status="Shipped" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
      active 
        ? "bg-white/10 text-white font-semibold" 
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

function StatCard({ label, value, delta }: { label: string, value: string, delta: string }) {
  const isPositive = delta.startsWith("+");
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-300 group">
      <p className="text-sm text-gray-500 font-medium mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-3xl font-bold group-hover:scale-105 transition-transform origin-left">{value}</h4>
        <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
          isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        }`}>
          {delta}
        </span>
      </div>
    </div>
  );
}

function ActivityItem({ id, customer, price, status }: { id: string, customer: string, price: string, status: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 grayscale hover:grayscale-0">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
          <ShoppingBag size={18} className="text-blue-400" />
        </div>
        <div>
          <p className="font-semibold">{id}</p>
          <p className="text-xs text-gray-500">{customer}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold">{price}</p>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${
          status === "Paid" ? "text-green-500" : status === "Pending" ? "text-yellow-500" : "text-blue-400"
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}
