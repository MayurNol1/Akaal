"use client";

import { Users, Search, Filter, Mail, Ban, CheckCircle2, User as UserIcon, Loader2, X } from "lucide-react";
import { useState, useMemo } from "react";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date | string;
};

interface AdminUsersClientProps {
  initialUsers: any[];
}

export function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name?.toLowerCase().includes(query.toLowerCase()) || 
      u.email?.toLowerCase().includes(query.toLowerCase())
    );
  }, [users, query]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleIntervene = (userId: string, action: string) => {
    showToast(`${action} action initiated for user ${userId.slice(0, 6)}...`, 'success');
  };

  return (
    <div className="space-y-12 animate-fade-in relative z-10">
      {toast && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 fade-in duration-500">
           <div className={`backdrop-blur-3xl border px-8 py-4 rounded-2xl flex items-center gap-4 shadow-2xl ${toast.type === 'success' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <X size={20} />}
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Ritual Update</p>
                 <p className="text-xs text-white">{toast.message}</p>
              </div>
           </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
           <div className="h-px w-12 bg-primary/50" />
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">Soul Identification</p>
           <h1 className="text-5xl font-serif italic text-white tracking-tight">Seeker <span className="text-primary not-italic">Registry</span></h1>
        </div>
        <div className="flex gap-4">
           <div className="bg-white/5 px-6 py-4 rounded-xl border border-white/5 flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              <Users size={16} className="text-primary" />
              {users.length} Active Monks
           </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-primary transition-colors duration-500" size={18} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vessels by email or true name..."
            className="w-full bg-white/2 border border-white/5 rounded-[20px] py-4 pl-14 pr-6 focus:outline-none focus:border-primary/30 transition-all text-xs font-medium placeholder:text-zinc-800 text-white"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <div className="bg-white/2 px-6 py-4 rounded-[20px] border border-white/5 flex items-center gap-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest cursor-pointer hover:border-white/10 transition-colors whitespace-nowrap">
              <Filter size={16} />
              Filter Auras
           </div>
        </div>
      </div>

      <div className="bg-white/2 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl transition-all duration-700 hover:border-primary/5">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/1 border-b border-white/5 text-left text-[9px] uppercase tracking-[0.4em] text-zinc-600">
              <th className="px-10 py-6 font-bold">Vessel Identity</th>
              <th className="px-10 py-6 font-bold">Role</th>
              <th className="px-10 py-6 font-bold">Status</th>
              <th className="px-10 py-6 font-bold text-center">Intervene</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-white/3 transition-all duration-500 group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                     <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-zinc-600 group-hover:text-primary group-hover:bg-primary/10 transition-colors overflow-hidden">
                        <UserIcon size={16} />
                     </div>
                     <div>
                        <p className="font-serif italic text-white group-hover:text-primary transition-colors">{u.name || `Seeker #${u.id.slice(0, 4)}`}</p>
                        <p className="text-[9px] uppercase tracking-widest text-zinc-600">{u.email}</p>
                     </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{u.role}</span>
                </td>
                <td className="px-10 py-8">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                     <CheckCircle2 size={12} /> ALIGNED
                  </span>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center justify-center gap-4">
                     <button 
                       onClick={() => handleIntervene(u.id, 'Mail')}
                       className="h-10 w-10 bg-white/5 flex items-center justify-center rounded-xl text-zinc-600 hover:text-primary hover:border-primary/20 border border-transparent transition-all"
                     >
                        <Mail size={14} />
                     </button>
                     <button 
                       onClick={() => handleIntervene(u.id, 'Restriction')}
                       className="h-10 w-10 bg-white/5 flex items-center justify-center rounded-xl text-zinc-600 hover:text-red-400 hover:border-red-400/20 border border-transparent transition-all"
                     >
                        <Ban size={14} />
                     </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="p-32 flex flex-col items-center justify-center text-center space-y-8 bg-black/40">
             <Search size={64} className="text-zinc-800" />
             <p className="font-serif italic text-xl text-zinc-500 tracking-widest">No matching vessels found in this realm.</p>
          </div>
        )}
      </div>
    </div>
  );
}
