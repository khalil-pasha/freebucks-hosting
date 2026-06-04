"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, Coins, TrendingUp } from "lucide-react"

export default function AdminReferralsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Referral Tracking</h1>
        <p className="text-foreground/60 mt-1">Monitor the referral program performance and conversions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground/60 flex items-center justify-between">
              Total Referrals <Users className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-black">12,450</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground/60 flex items-center justify-between">
              Credits Awarded <Coins className="w-4 h-4 text-success" />
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-black text-success">933,750</div>
             <p className="text-xs text-foreground/50 mt-1">25 Sender + 50 Receiver</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground/60 flex items-center justify-between">
              Conversion Rate <TrendingUp className="w-4 h-4 text-secondary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-black text-secondary">68.4%</div>
             <p className="text-xs text-foreground/50 mt-1">Invites that reached 24h playtime</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Recent Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-foreground/50 uppercase bg-background/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Referrer (Sender)</th>
                  <th className="px-6 py-4 font-medium">Invited User (Receiver)</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Total Reward Given</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[
                  { sender: "_NightBlade_", receiver: "NewGuy123", date: "May 25, 2026", reward: "75 Credits", status: "Successful" },
                  { sender: "MinecraftPro", receiver: "BobBuilder", date: "May 25, 2026", reward: "75 Credits", status: "Successful" },
                  { sender: "SteveNew", receiver: "Alex12", date: "May 24, 2026", reward: "0 Credits", status: "Pending Verification" },
                  { sender: "PvP_Master99", receiver: "NoobMaster", date: "May 24, 2026", reward: "75 Credits", status: "Successful" },
                ].map((ref, i) => (
                  <tr key={i} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary">{ref.sender}</td>
                    <td className="px-6 py-4 font-medium">{ref.receiver}</td>
                    <td className="px-6 py-4 text-foreground/70">{ref.date}</td>
                    <td className="px-6 py-4 font-bold text-success flex items-center gap-1 mt-0.5"><Coins className="w-3 h-3"/> {ref.reward}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ref.status === 'Successful' ? 'bg-success/20 text-success' : 'bg-orange-500/20 text-orange-500'
                      }`}>
                        {ref.status}
                      </span>
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
