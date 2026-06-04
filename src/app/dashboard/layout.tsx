import { DashboardSidebar } from "@/components/layout/sidebar"
import { Menu } from "lucide-react"
import AuthProvider from "@/components/AuthProvider"
import { Suspense } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthProvider>
        <div className="flex min-h-screen bg-background">
          <DashboardSidebar />
          <div className="flex-1 md:ml-64 flex flex-col">
            {/* Mobile Header (optional if you want mobile sidebar toggle, here it's simplified) */}
            <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="font-bold">Free Bucks Dashboard</div>
              <button className="p-2"><Menu /></button>
            </header>
            <main className="flex-1 p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </AuthProvider>
    </Suspense>
  )
}
