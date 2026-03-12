import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  ExternalLink,
  ChevronRight,
  House
} from "lucide-react";
import { Logo } from "@/components/logo";
import { SidebarLogoutButton } from "@/components/sidebar-logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redundant check in case middleware is bypassed
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col bg-zinc-950 p-6 fixed h-full z-40">
        <div className="mb-10 px-2">
          <Logo />
          <div className="mt-4 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full inline-block">
            <span className="text-[9px] text-purple-400 uppercase font-black tracking-[0.3em]">Management Hub</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <AdminNavItem href="/admin" icon={<BarChart3 size={20} />} label="Overview" />
          <AdminNavItem href="/admin/products" icon={<Package size={20} />} label="Products" />
          <AdminNavItem href="/admin/orders" icon={<ShoppingBag size={20} />} label="Orders" />
          <AdminNavItem href="/admin/users" icon={<Users size={20} />} label="Customers" />
          <AdminNavItem href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
          
          <div className="pt-6 mt-6 border-t border-white/5 space-y-1">
            <AdminNavItem href="/" icon={<House size={20} />} label="View Store" />
            <AdminNavItem href="/dashboard" icon={<ExternalLink size={20} />} label="User Dashboard" />
          </div>
        </nav>

        <div className="mt-auto space-y-4">
          <SidebarLogoutButton />
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-xs text-zinc-500 mb-1">Logged in as</p>
            <p className="text-sm font-medium truncate">{session.user.name || session.user.email}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Subtle top indicator */}
        <div className="h-1 w-full bg-linear-to-r from-purple-500/50 via-blue-500/50 to-purple-500/50 opacity-50" />
        
        <div className="p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function AdminNavItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/5 text-zinc-400 hover:text-white"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight className="opacity-0 group-hover:opacity-40 transition-opacity" size={16} />
    </Link>
  );
}
