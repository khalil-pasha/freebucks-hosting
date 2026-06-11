"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Users, 
  Server, 
  ListOrdered, 
  Coins, 
  Ticket, 
  UserPlus, 
  Sparkles, 
  LifeBuoy, 
  ScrollText, 
  Settings,
  LogOut
} from "lucide-react"

import { useAdminAuth } from "@/components/AdminAuthProvider"

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Users", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
  { name: "Servers", href: "/admin/servers", icon: <Server className="w-5 h-5" /> },
  { name: "Queue Manager", href: "/admin/queue", icon: <ListOrdered className="w-5 h-5" /> },
  { name: "Credits Manager", href: "/admin/credits", icon: <Coins className="w-5 h-5" /> },
  { name: "Voucher Manager", href: "/admin/vouchers", icon: <Ticket className="w-5 h-5" /> },
  { name: "Referral Tracking", href: "/admin/referrals", icon: <UserPlus className="w-5 h-5" /> },
  { name: "Premium Orders", href: "/admin/premium", icon: <Sparkles className="w-5 h-5" /> },
  { name: "Support Tickets", href: "/admin/support", icon: <LifeBuoy className="w-5 h-5" /> },
  { name: "System Logs", href: "/admin/logs", icon: <ScrollText className="w-5 h-5" /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAdminAuth()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 z-40 shadow-xl">
      <div className="p-6 pb-4 border-b border-border/50">
        <Link href="/admin" className="flex items-center justify-center w-full group">
          <div className="relative h-14 w-full max-w-[200px] overflow-hidden transition-transform group-hover:scale-105">
            <Image src="/logo2.png" alt="Free Bucks Admin" fill className="object-contain" priority />
          </div>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col space-y-1 px-4">
          {adminLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors font-medium text-sm",
                pathname === link.href 
                  ? "bg-red-500 text-white" 
                  : "text-foreground/70 hover:bg-card-foreground/10 hover:text-foreground"
              )}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors font-medium text-sm text-foreground/70 hover:bg-card-foreground/10"
        >
          <LogOut className="w-5 h-5" />
          Logout Admin
        </button>
      </div>
    </aside>
  )
}
