"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Server, 
  Coins, 
  Dices, 
  Users, 
  Sparkles, 
  User, 
  LifeBuoy, 
  LogOut,
  Ticket
} from "lucide-react"

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Servers", href: "/dashboard/servers", icon: <Server className="w-5 h-5" /> },
  { name: "Credits", href: "/dashboard/credits", icon: <Coins className="w-5 h-5" /> },
  { name: "Rewards", href: "/dashboard/spin", icon: <Dices className="w-5 h-5" /> },
  { name: "Referrals", href: "/dashboard/referral", icon: <Users className="w-5 h-5" /> },
  { name: "Vouchers", href: "/dashboard/voucher", icon: <Ticket className="w-5 h-5" /> },
  { name: "Profile", href: "/dashboard/profile", icon: <User className="w-5 h-5" /> },
  { name: "Support", href: "/dashboard/support", icon: <LifeBuoy className="w-5 h-5" /> },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 z-40 shadow-xl">
      <div className="p-6 pb-4 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center justify-center w-full group">
          <div className="relative h-14 w-full max-w-[200px] overflow-hidden transition-transform group-hover:scale-105">
            <Image src="/logo2.png" alt="Free Bucks Dashboard" fill className="object-contain" priority />
          </div>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col space-y-1 px-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors font-medium text-sm",
                pathname === link.href 
                  ? "bg-primary text-primary-foreground" 
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
        <div className="bg-background rounded-lg p-4 mb-4 flex items-center justify-between border border-border/50">
          <div className="flex flex-col">
            <span className="text-xs text-foreground/50 font-medium uppercase">Balance</span>
            <span className="text-lg font-bold text-success flex items-center gap-1">
              <Coins className="w-4 h-4" /> {loading ? "..." : (user?.balance ?? 0)}
            </span>
          </div>
        </div>
        <Link 
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors font-medium text-sm text-red-500 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Link>
      </div>
    </aside>
  )
}
