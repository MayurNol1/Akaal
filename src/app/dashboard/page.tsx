import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { 
  User, 
  Settings, 
  ShoppingBag, 
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  CreditCard
} from "lucide-react";
import { Logo } from "@/components/logo";
import { SidebarLogoutButton } from "@/components/sidebar-logout-button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // If Admin, they should generally use the Admin Hub, but we can let them see the user side too.
  // Or redirect them if they came here by mistake.
  // For now, let's just make THIS page specific to the logged-in user's personal data.
  const user = session.user;
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col p-6 space-y-8 max-md:hidden bg-zinc-950">
        <Logo />

        <nav className="flex-1 space-y-2">
          <NavItem icon={<User size={20} />} label="My Profile" active />
          <NavItem icon={<ShoppingBag size={20} />} label="My Orders" />
          <NavItem icon={<Heart size={20} />} label="Wishlist" />
          <NavItem icon={<MapPin size={20} />} label="Addresses" />
          <NavItem icon={<CreditCard size={20} />} label="Payments" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <SidebarLogoutButton />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <h1 className="text-xl font-bold tracking-tight italic">Member Portal</h1>
             {isAdmin && (
               <span className="px-2 py-0.5 bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest rounded-full">Admin View</span>
             )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right max-sm:hidden">
              <p className="text-sm font-bold">{user.name}</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{user.email}</p>
            </div>
            <div className="h-10 w-10 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center overflow-hidden">
              {user.image ? (
                <Image src={user.image} alt={user.name || "User"} width={40} height={40} className="object-cover" />
              ) : (
                <User size={20} className="text-zinc-600" />
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-10 space-y-10 animate-fade-in max-w-5xl">
          <header className="space-y-2">
            <h2 className="text-4xl font-bold text-white tracking-tighter">
              Namaste, <span className="gold-gradient italic">{user.name?.split(' ')[0]}</span>.
            </h2>
            <p className="text-zinc-500 font-medium">Your spiritual journey manifests here. Track your rituals and artifacts.</p>
          </header>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Completed Rituals" value="12" sub="Orders delivered" />
            <StatCard label="Ongoing Journeys" value="02" sub="Active shipments" />
            <StatCard label="Sacred Points" value="1,240" sub="Loyalty rewards" />
          </div>

          {/* Recent Orders Section */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Clock size={22} className="text-gold" />
                Recent Orders
              </h3>
              <button className="text-xs text-zinc-500 hover:text-white flex items-center gap-2 font-bold uppercase tracking-widest transition-colors">
                History <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="space-y-4">
              <ActivityItem id="#ORD-7721" status="Delivered" date="Oct 12, 2025" price="$89.00" />
              <ActivityItem id="#ORD-7645" status="In Transit" date="Oct 08, 2025" price="$145.00" />
              <ActivityItem id="#ORD-7590" status="Processing" date="Oct 05, 2025" price="$32.00" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 cursor-pointer ${
      active 
        ? "bg-white/5 text-gold border border-gold/10" 
        : "text-zinc-500 hover:text-white hover:bg-white/5"
    }`}>
      {icon}
      <span className="font-bold text-xs uppercase tracking-widest">{label}</span>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string, value: string, sub: string }) {
  return (
    <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 hover:border-gold/20 transition-all duration-500 group">
      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-3">{label}</p>
      <h4 className="text-4xl font-bold group-hover:scale-105 transition-transform origin-left">{value}</h4>
      <p className="text-[10px] text-zinc-600 mt-2 font-medium">{sub}</p>
    </div>
  );
}

function ActivityItem({ id, status, date, price }: { id: string, status: string, date: string, price: string }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-3xl bg-black/20 border border-white/5 hover:border-white/10 transition-all group">
      <div className="flex items-center gap-5">
        <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
          <ShoppingBag size={20} className="text-zinc-500" />
        </div>
        <div>
          <p className="font-bold text-sm">{id}</p>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-gold">{price}</p>
        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] mt-1 inline-block px-2 py-0.5 rounded-full ${
          status === "Delivered" ? "text-emerald-500 bg-emerald-500/5" : "text-amber-500 bg-amber-500/5"
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}
