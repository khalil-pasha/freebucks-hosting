"use client";

import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { Bell, Search, UserCircle, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import AdminAuthProvider from "@/components/AdminAuthProvider"
import { Suspense } from "react"
import { AdminName } from "@/components/admin/admin-name"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <AdminAuthProvider>
          {children}
        </AdminAuthProvider>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AdminAuthProvider>
        <div className="min-h-screen bg-background flex">
          <AdminSidebar />
          <div className="flex-1 flex flex-col md:ml-64">
            {/* Admin Topbar */}
            <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <button className="md:hidden p-2 -ml-2 text-foreground/70 hover:text-foreground">
                  <Menu className="w-6 h-6" />
                </button>
                <div className="hidden sm:flex items-center gap-2 bg-background border border-border/50 rounded-full px-4 py-2 w-full max-w-sm">
                  <Search className="w-4 h-4 text-foreground/50" />
                  <input 
                    type="text" 
                    placeholder="Search users, servers, logs..." 
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-foreground/50"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </Button>
                <div className="flex items-center gap-2 border-l border-border/50 pl-4">
                  <UserCircle className="w-8 h-8 text-red-500" />
                  <div className="hidden sm:flex flex-col">
                    <AdminName />
                  </div>
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </AdminAuthProvider>
    </Suspense>
  )
}
