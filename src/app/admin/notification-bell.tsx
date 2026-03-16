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
        className={`h-12 w-12 rounded-2xl bg-white/2 border flex items-center justify-center transition-all relative ${
          isOpen ? 'text-primary border-primary/40 shadow-[0_0_15px_rgba(236,149,19,0.2)]' : 'border-white/5 text-zinc-600 hover:text-primary hover:border-primary/20'
        }`}
      >
        <Bell size={18} />
        {notifications.length > 0 && !loading && (
          <span className="absolute top-3 right-3 size-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(236,149,19,0.8)]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-4 w-80 bg-[#0f0e0b] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-sm font-serif font-black italic text-white flex items-center justify-between">
              Notifications
              {!loading && notifications.length > 0 && (
                <span className="text-[9px] font-sans font-black bg-primary/10 text-primary px-2 py-1 rounded-lg not-italic uppercase tracking-widest">
                  {notifications.length} New
                </span>
              )}
            </h3>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-zinc-500 text-xs animate-pulse">
                Sensing energy...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-xs">
                The sanctuary is quiet.
              </div>
            ) : (
              notifications.map((notif) => (
                <Link 
                  href={notif.type === "DISCIPLE_JOINED" ? "/admin/users" : "/admin/orders"} 
                  key={notif.id} 
                  className="p-5 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group flex gap-4"
                >
                  {notif.type === "DISCIPLE_JOINED" ? (
                    <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform relative">
                      <Bell size={16} />
                    </div>
                  ) : (
                    <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform relative">
                      <span className="text-xl font-serif italic">$</span>
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] font-bold text-white mb-1 group-hover:text-primary transition-colors">{notif.title}</p>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">{notif.message}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-primary/60 mt-2">
                       {timeAgo(notif.createdAt)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-white/5 bg-white/2 text-center">
            <button className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
              Seek All History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
