"use client";

import { Users, Search, Filter, Mail, Ban, CheckCircle2, User as UserIcon, X } from "lucide-react";
import { useState, useMemo } from "react";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date | string;
};

interface AdminUsersClientProps {
  initialUsers: User[];
}

export function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const [query, setQuery] = useState("");
  const [users] = useState<User[]>(initialUsers);
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
    <div style={{ display:"flex", flexDirection:"column", gap:"28px" }}>
      {toast && (
        <div style={{ position:"fixed", top:"84px", right:"20px", zIndex:50, animation:"fadeIn 0.3s ease-out" }}>
           <div className={`backdrop-blur-3xl border px-8 py-4 rounded-2xl flex items-center gap-4 shadow-2xl ${toast.type === 'success' ? '' : ''}`} style={{ background: toast?.type==='success' ? 'rgba(212,169,74,0.1)' : 'rgba(248,113,113,0.1)', border: toast?.type==='success' ? '1px solid rgba(212,169,74,0.22)' : '1px solid rgba(248,113,113,0.22)', color: toast?.type==='success' ? '#d4a94a' : '#f87171' }}>
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <X size={20} />}
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Ritual Update</p>
                 <p className="text-xs text-white">{toast.message}</p>
              </div>
           </div>
        </div>
      )}

      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:"16px", paddingBottom:"24px", borderBottom:"1px solid rgba(212,169,74,0.08)" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
           <div style={{ width:"40px", height:"2px", background:"#d4a94a", borderRadius:"99px", marginBottom:"8px" }} />
           <p style={{ fontSize:"10px", fontWeight:600, letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(160,155,135,0.45)", margin:0 }}>User Management</p>
           <h1 className="text-5xl font-serif italic text-white tracking-tight">Seeker <span className="not-italic" style={{ color: "#d4a94a" }}>Registry</span></h1>
        </div>
        <div className="flex gap-4">
           <div style={{ padding:"10px 16px", borderRadius:"10px", background:"rgba(212,169,74,0.08)", border:"1px solid rgba(212,169,74,0.18)", display:"flex", alignItems:"center", gap:"8px", fontSize:"11px", fontWeight:600, color:"#d4a94a" }}>
              <Users size={16} style={{ color:"#d4a94a" }} />
              {users.length} Active Monks
           </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 group w-full">
          <Search style={{ color:"#d4a94a" }} size={18} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vessels by email or true name..."
style={{ width:"100%", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(212,169,74,0.1)", borderRadius:"12px", padding:"10px 10px 10px 44px", outline:"none", fontSize:"12px", color:"#f0ede6", fontFamily:"var(--font-sans)" }}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <div style={{ padding:"10px 16px", borderRadius:"10px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(212,169,74,0.08)", display:"flex", alignItems:"center", gap:"8px", fontSize:"10px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(160,155,135,0.45)", cursor:"pointer", whiteSpace:"nowrap" }}>
              <Filter size={16} />
              Filter Auras
           </div>
        </div>
      </div>

      <div style={{ background:"rgba(22,22,18,0.5)", border:"1px solid rgba(212,169,74,0.1)", borderRadius:"16px", overflow:"hidden" }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.01)", borderBottom:"1px solid rgba(212,169,74,0.07)" }}>
              <th className="px-10 py-6 font-bold">Vessel Identity</th>
              <th className="px-10 py-6 font-bold">Role</th>
              <th className="px-10 py-6 font-bold">Status</th>
              <th className="px-10 py-6 font-bold text-center">Intervene</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} style={{ borderBottom:"1px solid rgba(212,169,74,0.04)", transition:"background 0.15s" }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.02)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent"}}>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                     <div style={{ color:"#d4a94a" }}>
                        <UserIcon size={16} />
                     </div>
                     <div>
                        <p style={{ color:"#d4a94a" }}>{u.name || `Seeker #${u.id.slice(0, 4)}`}</p>
                        <p style={{ fontSize:"9px", textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(160,155,135,0.35)", margin:0 }}>{u.email}</p>
                     </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span style={{ fontSize:"10px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.15em", color:u.role==="ADMIN" ? "#d4a94a" : "rgba(160,155,135,0.45)", padding:"3px 8px", borderRadius:"6px", background:u.role==="ADMIN" ? "rgba(212,169,74,0.1)" : "transparent" }}>{u.role}</span>
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
                       style={{ color:"#d4a94a" }}
                     >
                        <Mail size={14} />
                     </button>
                     <button 
                       onClick={() => handleIntervene(u.id, 'Restriction')}
style={{ width:"34px", height:"34px", background:"rgba(248,113,113,0.04)", border:"1px solid rgba(248,113,113,0.1)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(248,113,113,0.45)", cursor:"pointer" }}
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
          <div style={{ padding:"80px 32px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", gap:"16px", background:"rgba(0,0,0,0.3)" }}>
             <span className="material-symbols-outlined" style={{ fontSize:"56px", color:"rgba(212,169,74,0.1)" }}>manage_accounts</span>
             <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"18px", color:"rgba(200,195,178,0.4)", margin:0 }}>No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
