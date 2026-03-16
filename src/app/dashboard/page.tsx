import { auth } from "@/auth";
import Image from "next/image";
import { 
  Sparkles, 
  Bell, 
  Flower2, 
  Award,
  History,
  HeartCrack,
  Settings
} from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { LogoutButton } from "@/app/dashboard/logout-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  // Fetch real data for the sanctuary
  const ordersCount = await prisma.order.count({
    where: { userId: session.user.id }
  });

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: true }
  });
  
  const activeIntentions = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  const recentOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 3
  });


  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-6 max-w-7xl mx-auto animate-fade-in relative z-10">
      <div className="flex flex-col gap-10">
        
        {/* Main Sanctuary Area */}
        <div className="flex-1 space-y-12">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
            <div className="space-y-4">
              <div className="h-px w-12 bg-primary/50" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Personal Sanctuary</p>
              <h1 className="text-5xl font-serif font-black italic text-white tracking-tight">
                Namaste, <span className="text-primary not-italic">{session?.user?.name?.split(' ')[0] || "Seeker"}</span>
              </h1>
              <p className="text-zinc-500 font-medium">Your spiritual journey is flourishing today.</p>
            </div>
            <div className="flex items-center gap-6">
               <LogoutButton />
               <button className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-primary transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-4 right-4 h-2 w-2 bg-primary rounded-full shadow-[0_0_8px_rgba(236,149,19,0.6)]" />
               </button>
            </div>
          </header>

          {/* Glowing Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatusCard 
              label="Dharma Credits" 
              value={(ordersCount * 150).toString()} 
              unit="pts" 
              icon={<Flower2 size={24} />} 
              color="primary"
            />
            <StatusCard 
              label="Manifested Relics" 
              value={ordersCount.toString().padStart(2, '0')} 
              unit="items" 
              icon={<Award size={24} />} 
              color="saffron"
            />
            <StatusCard 
              label="Active Intentions" 
              value={activeIntentions.toString().padStart(2, '0')} 
              unit="rituals" 
              icon={<Sparkles size={24} />} 
              color="cyan"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4">
             <Link href="/orders" className="p-8 rounded-[32px] bg-white/2 border border-white/5 shadow-xl relative overflow-hidden group hover:scale-[1.02] hover:border-primary/20 transition-all duration-700 block">
                 <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="relative z-10 space-y-4">
                    <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:text-background-dark transition-all">
                       <History size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-serif font-black text-white italic">Manifest Logs</h3>
                       <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Review past orders</p>
                    </div>
                 </div>
             </Link>
             <Link href="/wishlist" className="p-8 rounded-[32px] bg-white/2 border border-white/5 shadow-xl relative overflow-hidden group hover:scale-[1.02] hover:border-red-500/20 transition-all duration-700 block">
                 <div className="absolute inset-0 bg-linear-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="relative z-10 space-y-4">
                    <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-red-500 group-hover:text-white transition-all">
                       <HeartCrack size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-serif font-black text-white italic">Silent Intentions</h3>
                       <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Saved artifacts</p>
                    </div>
                 </div>
             </Link>
             <Link href="/settings" className="p-8 rounded-[32px] bg-white/2 border border-white/5 shadow-xl relative overflow-hidden group hover:scale-[1.02] hover:border-zinc-500/40 transition-all duration-700 block">
                 <div className="absolute inset-0 bg-linear-to-br from-zinc-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="relative z-10 space-y-4">
                    <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-zinc-500 group-hover:text-white transition-all">
                       <Settings size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-serif font-black text-white italic">Vessel Control</h3>
                       <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Manage profile</p>
                    </div>
                 </div>
             </Link>
          </div>

          {/* Spiritual Path and Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif font-black text-white italic">Spiritual Path</h3>
                <Link href="/orders" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline underline-offset-4">Chronicles</Link>
              </div>

              <div className="relative space-y-0 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-px before:bg-white/5">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, idx) => (
                    <TimelineStep 
                      key={order.id}
                      title={`Manifestation Realized (${order.status})`}
                      time={order.createdAt.toLocaleDateString()} 
                      description={`"The universe has aligned. Order #${order.id.slice(0, 6)} has been recorded in the cosmos."`}
                      isLatest={idx === 0}
                    />
                  ))
                ) : (
                  <TimelineStep 
                    title="Sanctuary Joined" 
                    time="Recently" 
                    description="The path of Akal opens before you. Your history is waiting to be written."
                    isLatest
                  />
                )}
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-10">
              <div className="p-8 rounded-[32px] bg-white/2 border border-primary/10 relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent" />
                <h4 className="text-xl font-serif font-black text-white italic mb-6 relative z-10">Journey Insight</h4>
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 z-10 border border-white/5 bg-zinc-900">
                   <Image 
                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaCbEmbc1KAmAmxrKT1kS4ZhpG2i6z224ybEjIi0Mlr5I5uKwMY6g5wlhnRAyjhCT104S03SYkdV63WI90MffbLbuKHvOViQcC4QfNE5Mg7Y3o4dw8o0KZSfGlJVIU0PyBh_SzGOMZMZ7DipilzXiXt5adiMe9stXazj5NBPJRwleTjHkwao19jVIwvsVAgWv-aAb9AAfvU5YXnaA7Y6N8AnxZWNcC7qLgY-eolAWX5-HvotVUIV3UaSm5sR1m31PJ7wYjVOd0TZQ" 
                     alt="Meditation Path" 
                     fill 
                     className="object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000"
                   />
                </div>
                <div className="relative z-10 space-y-4">
                  <p className="font-serif font-black text-white italic">Path of Constant Presence</p>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">Expand your vibration and discover new sacred artifacts for your collection.</p>
                  <Link href="/products" className="block w-full py-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-background-dark transition-all duration-500 shadow-xl text-center">
                    Continue Journey
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ label, value, unit, icon, color }: { label: string, value: string, unit: string, icon: React.ReactNode, color: string }) {
  const colors: Record<string, string> = {
    primary: "from-primary/20 to-transparent border-primary/10 text-primary",
    saffron: "from-orange-500/20 to-transparent border-orange-500/10 text-orange-500",
    cyan: "from-cyan-500/20 to-transparent border-cyan-500/10 text-cyan-400"
  };

  return (
    <div className={`p-8 rounded-[32px] bg-white/2 border shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-700 bg-linear-to-br ${colors[color]}`}>
      <div className="flex flex-col gap-6 relative z-10">
        <div className={`size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all`}>
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">{label}</p>
          <p className="text-4xl font-serif font-black text-white italic tracking-tighter">
            {value} <span className="text-sm font-sans not-italic text-zinc-500 ml-1">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({ title, time, description, isLatest }: { title: string, time: string, description: string, isLatest?: boolean }) {
  return (
    <div className="relative flex gap-8 pb-12 group">
      <div className={`relative z-10 size-10 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center transition-all duration-500 ${
        isLatest ? "bg-primary shadow-[0_0_20px_rgba(236,149,19,0.4)]" : "bg-white/5"
      }`}>
        <Sparkles size={16} className={isLatest ? "text-white" : "text-zinc-600"} />
      </div>
      <div className="space-y-2">
        <h4 className={`text-lg font-serif font-black italic transition-colors ${isLatest ? "text-white" : "text-zinc-400 group-hover:text-white"}`}>{title}</h4>
        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{time}</p>
        {description && (
          <div className={`mt-4 p-5 rounded-2xl border transition-all duration-500 ${
            isLatest ? "bg-primary/5 border-primary/20" : "bg-white/2 border-white/5 group-hover:border-white/10"
          }`}>
            <p className="text-[11px] text-zinc-400 italic font-medium leading-relaxed">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
