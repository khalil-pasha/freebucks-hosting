"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Ticket, ServerCrash, AlertCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

function formatDistanceToNowHelper(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  time: string;
  link: string;
}

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/admin/core/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRead = async (id: string, link: string) => {
    try {
      await api.post(`/admin/core/notifications/${id}/read`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setIsOpen(false);
      router.push(link);
    } catch (error) {
      console.error("Failed to mark notification read", error);
    }
  };

  const handleReadAll = async () => {
    if (notifications.length === 0) return;
    try {
      const ids = notifications.map(n => n.id);
      await api.post("/admin/core/notifications/read-all", { ids });
      setNotifications([]);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to mark all read", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "ticket": return <Ticket className="w-5 h-5 text-blue-400" />;
      case "order": return <ShoppingCart className="w-5 h-5 text-yellow-400" />;
      case "job": return <ServerCrash className="w-5 h-5 text-red-500" />;
      case "log": return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border/50 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border/50 flex justify-between items-center bg-card-foreground/5">
            <h3 className="font-bold text-sm">Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={handleReadAll}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto flex flex-col">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-foreground/50 text-sm">
                No new notifications
              </div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  onClick={() => handleRead(n.id, n.link)}
                  className="p-3 border-b border-border/20 hover:bg-card-foreground/10 cursor-pointer transition-colors flex gap-3 items-start"
                >
                  <div className="mt-0.5 p-1.5 bg-background rounded-md border border-border/50">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{n.title}</p>
                    <p className="text-xs text-foreground/70 line-clamp-2 mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-foreground/40 mt-1 font-medium uppercase">
                      {formatDistanceToNowHelper(n.time)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
