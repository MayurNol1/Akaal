"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { getRecentNotifications, type AdminNotification } from "./actions";
import Link from "next/link";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    getRecentNotifications().then((data) => {
      setNotifications(data);
      setLoading(false);
    });
  }, []);

  // Simple time ago formatter
  const timeAgo = (dateStr: string) => {
    const diffInSeconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (diffInSeconds < 60) return "Just now";
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center transition-all duration-300 relative ${
          isOpen ? 'text-[#d4a94a] border-[#d4a94a]/40 shadow-[0_0_15px_rgba(212,169,74,0.2)]' : 'border-white/5 text-zinc-600 hover:text-[#d4a94a] hover:border-[#d4a94a]/20'
        }`}
        style={{ width:"44px", height:"44px", borderRadius:"10px", background:"rgba(255,255,255,0.02)" }}
      >
        <Bell size={18} />
        {notifications.length > 0 && !loading && (
          <span style={{ position:"absolute", top:"10px", right:"10px", width:"8px", height:"8px", borderRadius:"50%", background:"#d4a94a", animation:"dot-blink 2s ease-in-out infinite" }} />
        )}
      </button>

      {isOpen && (
        <div style={{ position:"absolute", top:"calc(100% + 12px)", right:0, width:"320px", background:"#0f0e0b", border:"1px solid rgba(212,169,74,0.12)", borderRadius:"16px", boxShadow:"0 20px 60px rgba(0,0,0,0.6)", overflow:"hidden", zIndex:50, animation:"fadeIn 0.2s ease-out" }}>
          <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
            <h3 className="text-sm font-serif font-black italic text-white flex items-center justify-between">
              Notifications
              {!loading && notifications.length > 0 && (
                <span style={{ fontSize:"9px", fontWeight:700, background:"rgba(212,169,74,0.1)", color:"#d4a94a", padding:"2px 8px", borderRadius:"6px", textTransform:"uppercase", letterSpacing:"0.1em" }}>
                  {notifications.length} New
                </span>
              )}
            </h3>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div style={{ padding:"24px", textAlign:"center", fontSize:"11px", color:"rgba(160,155,135,0.45)" }}>
                Sensing energy...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding:"24px", textAlign:"center", fontSize:"11px", color:"rgba(160,155,135,0.45)" }}>
                The sanctuary is quiet.
              </div>
            ) : (
              notifications.map((notif) => (
                <Link 
                  href={notif.type === "DISCIPLE_JOINED" ? "/admin/users" : "/admin/orders"} 
                  key={notif.id} 
style={{ padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.04)", cursor:"pointer", display:"flex", gap:"12px", transition:"background 0.15s" }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.04)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent"}}
                >
                  {notif.type === "DISCIPLE_JOINED" ? (
                    <div style={{ width:"40px", height:"40px", borderRadius:"50%", background:"rgba(212,169,74,0.1)", color:"#d4a94a", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:"1px solid rgba(212,169,74,0.2)", transition:"transform 0.2s" }}>
                      <Bell size={16} />
                    </div>
                  ) : (
                    <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform relative">
                      <span className="text-xl font-serif italic">$</span>
                    </div>
                  )}
                  <div>
                    <p style={{ fontSize:"11px", fontWeight:700, color:"#f0ede6", margin:"0 0 4px" }}>{notif.title}</p>
                    <p style={{ fontSize:"10px", color:"rgba(160,155,135,0.45)", margin:"3px 0 0", lineHeight:1.5 }}>{notif.message}</p>
                    <p style={{ fontSize:"8px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"rgba(212,169,74,0.6)", marginTop:"6px" }}>
                       {timeAgo(notif.createdAt)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
          
          <div style={{ padding:"12px", borderTop:"1px solid rgba(255,255,255,0.05)", background:"rgba(255,255,255,0.02)", textAlign:"center" }}>
            <button style={{ fontSize:"9px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:"#d4a94a", background:"none", border:"none", cursor:"pointer", transition:"color 0.2s" }}>
              Seek All History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
