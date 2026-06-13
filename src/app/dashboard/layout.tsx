"use client"
import { DashboardSidebar } from "@/components/layout/sidebar"
import { Menu } from "lucide-react"
import AuthProvider from "@/components/AuthProvider"
import { Suspense, useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthProvider>
        <div className="flex min-h-screen bg-background overflow-hidden relative">
          <DashboardSidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
          <div className="flex-1 md:ml-64 flex flex-col w-full max-w-full">
            <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-30">
              <div className="font-bold tracking-tight">Free Bucks</div>
              <button 
                className="p-2 hover:bg-foreground/5 rounded-md transition-colors" 
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </AuthProvider>
    </Suspense>
  )
}
