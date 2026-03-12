"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SidebarLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 group"
    >
      <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
      <span className="font-bold text-xs uppercase tracking-widest">Logout</span>
    </button>
  );
}
