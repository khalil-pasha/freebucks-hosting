"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, CreditCard, Sparkles } from "lucide-react"

export default function AdminPremiumPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Premium Orders</h1>
        <p className="text-foreground/60 mt-1">Manage manual premium tier requests via Discord.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <div className="text-sm text-foreground/60 mb-2">Pending Requests</div>
          <div className="text-3xl font-black text-orange-500">12</div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <div className="text-sm text-foreground/60 mb-2">Active Premium Users</div>
          <div className="text-3xl font-black text-[#FFD700]">4,210</div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <div className="text-sm text-foreground/60 mb-2">Manual Revenue (30d)</div>
          <div className="text-3xl font-black text-success">~$14,200</div>
        </div>
      </div>

      <Card className="bg-card border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#FFD700]" /> Recent Upgrade Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-foreground/50 uppercase bg-background/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Discord ID</th>
                  <th className="px-6 py-4 font-medium">Plan Requested</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[
                  { user: "MinecraftPro", discordId: "789123456", plan: "Overkill", date: "Today, 12:45 PM", status: "Pending" },
                  { user: "PvP_Master99", discordId: "987654321", plan: "Pro Premium", date: "Today, 10:30 AM", status: "Pending" },
                  { user: "_NightBlade_", discordId: "123456789", plan: "Supporter", date: "Yesterday, 4:20 PM", status: "Approved" },
                  { user: "Scammer123", discordId: "555555555", plan: "Overkill", date: "Yesterday, 1:15 PM", status: "Rejected" },
                ].map((req, i) => (
                  <tr key={i} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{req.user}</td>
                    <td className="px-6 py-4 font-mono text-xs">{req.discordId}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${
                        req.plan === 'Overkill' ? 'text-purple-400' :
                        req.plan === 'Pro Premium' ? 'text-[#FFD700]' :
                        'text-foreground'
                      }`}>
                        {req.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground/70">{req.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        req.status === 'Pending' ? 'bg-orange-500/20 text-orange-500' :
                        req.status === 'Approved' ? 'bg-success/20 text-success' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      {req.status === 'Pending' ? (
                        <>
                          <Button variant="outline" size="sm" className="h-8 border-success/50 text-success hover:bg-success hover:text-white" title="Approve & Mark Paid"><Check className="w-4 h-4 mr-1"/> Approve</Button>
                          <Button variant="outline" size="sm" className="h-8 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white" title="Reject"><X className="w-4 h-4 mr-1"/> Reject</Button>
                        </>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-8 text-foreground/50" disabled>Processed</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
