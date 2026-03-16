"use client";

import { useSession } from "next-auth/react";
import { Save, Shield, Bell } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background-dark text-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto space-y-12 animate-fade-in text-left">
        {isSaved && (
          <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 fade-in duration-500">
             <div className="bg-primary/10 backdrop-blur-3xl border border-primary/20 px-8 py-4 rounded-2xl flex items-center gap-4 shadow-2xl">
                <Save className="text-primary" size={20} />
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-none mb-1">Ritual Sealed</p>
                   <p className="text-xs text-white">Your cosmic configurations have been locked.</p>
                </div>
             </div>
          </div>
        )}
        <header className="space-y-4 border-b border-white/5 pb-10">
           <div className="h-px w-12 bg-primary/50" />
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">Vessel Configuration</p>
           <h1 className="text-5xl font-serif font-black italic text-white tracking-tight">
             Sanctuary <span className="text-primary not-italic">Settings</span>
           </h1>
        </header>

        <div className="space-y-6">
           <div className="flex flex-col gap-6 md:flex-row p-8 rounded-[32px] bg-white/2 border border-white/5 shadow-2xl">
             <div className="w-full space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">True Name (Display Identity)</label>
                <input type="text" defaultValue={session?.user?.name || ''} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-primary/40 focus:bg-white/10 transition-all font-serif italic text-lg" />
             </div>
             <div className="w-full space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">Celestial Origin (Email)</label>
                <input type="email" disabled defaultValue={session?.user?.email || ''} className="w-full px-6 py-4 bg-background-dark border border-white/5 rounded-2xl text-zinc-400 opacity-60 cursor-not-allowed outline-none font-sans" />
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <SettingRow 
                icon={<Shield size={20} />} 
                title="Spiritual Boundaries" 
                desc="Configure your privacy settings and energy limits." 
                defaultEnabled={true} 
              />
              <SettingRow 
                icon={<Bell size={20} />} 
                title="Cosmic Resonance" 
                desc="Manage notifications about new artifacts and sanctuary updates." 
                defaultEnabled={false} 
              />
           </div>
        </div>

        <div className="pt-10 flex border-t border-white/5">
           <button 
             onClick={handleSave}
             className="flex items-center gap-3 bg-white/5 text-zinc-500 hover:text-primary border border-white/5 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/5 hover:border-primary/20 transition-all duration-500"
           >
             Lock Configuration <Save size={16} />
           </button>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon, title, desc, defaultEnabled }: { icon: React.ReactNode, title: string, desc: string, defaultEnabled: boolean }) {
  const [enabled, setEnabled] = useState(defaultEnabled);

  return (
    <div className="p-8 rounded-[32px] bg-white/2 border border-white/5 space-y-6 group hover:border-primary/10 transition-all">
       <div className="flex items-center justify-between">
          <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
             {icon}
          </div>
          <button 
            onClick={() => setEnabled(!enabled)}
            className={`w-14 h-8 rounded-full transition-all duration-500 relative ${enabled ? 'bg-primary shadow-[0_0_15px_rgba(236,149,19,0.3)]' : 'bg-zinc-800'}`}
          >
             <div className={`absolute top-1 size-6 rounded-full bg-white transition-all duration-500 shadow-xl ${enabled ? 'left-7' : 'left-1'}`} />
          </button>
       </div>
       <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-widest text-white">{title}</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-serif italic">{desc}</p>
       </div>
    </div>
  );
}
