"use client"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserCircle, Coins, Ban, Unlock, Server } from "lucide-react"

// Mock detail data based on ID
export default function AdminUserDetailPage({ params }: { params: { id: string } }) {
  // Mocking the user based on ID
  const isBanned = params.id === "1003"
  const username = params.id === "1003" ? "BuilderBob" : "_NightBlade_"
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon" className="border border-border/50 bg-card">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="text-foreground/60 mt-1">Managing user {username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Card */}
        <Card className="bg-card border-border/50 md:col-span-1">
          <CardHeader className="text-center pb-4 pt-8">
            <div className="mx-auto w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <UserCircle className="w-16 h-16 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">{username}</CardTitle>
            <p className="text-sm text-foreground/50 font-mono mt-1">Discord: 123456789</p>
            <div className="mt-4 flex justify-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isBanned ? "bg-red-500/20 text-red-500" : "bg-success/20 text-success"
              }`}>
                {isBanned ? "Banned" : "Active"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Balance</span>
              <span className="font-bold text-success flex items-center gap-1"><Coins className="w-3 h-3"/> 142.5 Credits</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Join Date</span>
              <span className="font-medium">Jan 15, 2026</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Total Servers</span>
              <span className="font-medium">2</span>
            </div>
            
            <div className="pt-6 space-y-2">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white"><Coins className="w-4 h-4 mr-2"/> Add Credits</Button>
              <Button variant="outline" className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10"><Coins className="w-4 h-4 mr-2"/> Remove Credits</Button>
              {isBanned ? (
                 <Button variant="outline" className="w-full border-success/50 text-success hover:bg-success/10"><Unlock className="w-4 h-4 mr-2"/> Unban User</Button>
              ) : (
                 <Button className="w-full bg-red-500 hover:bg-red-600 text-white"><Ban className="w-4 h-4 mr-2"/> Ban User</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User History */}
        <div className="md:col-span-2 space-y-8">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Server className="w-5 h-5 text-primary"/> Servers</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                 {[
                   { name: "Survival SMP", ram: "6GB", status: "Online", location: "Mumbai, India" },
                   { name: "Test Server", ram: "2GB", status: "Offline", location: "Mumbai, India" }
                 ].map((s, i) => (
                   <div key={i} className="flex justify-between items-center p-3 bg-background border border-border/50 rounded-lg">
                     <div>
                       <p className="font-bold">{s.name}</p>
                       <p className="text-xs text-foreground/50">{s.ram} • {s.location}</p>
                     </div>
                     <span className={`text-xs font-bold ${s.status === 'Online' ? 'text-success' : 'text-foreground/50'}`}>{s.status}</span>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Coins className="w-5 h-5 text-secondary"/> Recent Credit History</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-foreground/50 border-b border-border/50">
                  <tr>
                    <th className="pb-3 font-medium">Action</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr>
                    <td className="py-3">Hourly Claim</td>
                    <td className="py-3 text-foreground/60">Today, 10:00 AM</td>
                    <td className="py-3 text-right font-bold text-success">+1.5</td>
                  </tr>
                  <tr>
                    <td className="py-3">Server Burn (Survival SMP)</td>
                    <td className="py-3 text-foreground/60">Today, 09:00 AM</td>
                    <td className="py-3 text-right font-bold text-red-500">-6.0</td>
                  </tr>
                  <tr>
                    <td className="py-3">Admin Grant</td>
                    <td className="py-3 text-foreground/60">Yesterday, 14:30 PM</td>
                    <td className="py-3 text-right font-bold text-success">+50.0</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
