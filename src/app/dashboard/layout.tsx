"use client"
import { DashboardSidebar } from "@/components/layout/sidebar"
import { Menu } from "lucide-react"
import { Suspense, useState, useEffect } from "react"
import { useAuth } from "@/components/AuthProvider"
import { useRouter, usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isManualLogout = typeof window !== 'undefined' && localStorage.getItem('freebucks_manual_logout') === 'true';
    if ((!loading && !user) || isManualLogout) {
      console.log("[Dashboard Guard] blocked due to manual logout or unauthenticated");
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const isManualLogout = typeof window !== 'undefined' && localStorage.getItem('freebucks_manual_logout') === 'true';

  if (!user || isManualLogout) {
    return null;
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
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
    </Suspense>
  )
}
