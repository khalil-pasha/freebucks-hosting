"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, Coins, TrendingUp, RefreshCw } from "lucide-react"
import api from "@/lib/api"

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReferrals = async () => {
    try {
      const res = await api.get('/admin/core/referrals')
      setReferrals(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReferrals()
  }, [])

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
             <div className="text-3xl font-black">{loading ? '...' : referrals.length.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground/60 flex items-center justify-between">
              Credits Awarded <Coins className="w-4 h-4 text-success" />
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-black text-success">{loading ? '...' : referrals.reduce((sum, r) => sum + (r.rewardAmount || 0), 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground/60 flex items-center justify-between">
              Conversion Rate <TrendingUp className="w-4 h-4 text-secondary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-black text-secondary">{loading ? '...' : (referrals.length > 0 ? ((referrals.filter(r => r.status === 'COMPLETED').length / referrals.length) * 100).toFixed(1) : 0)}%</div>
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
                {loading ? (
                   <tr>
                     <td colSpan={5} className="px-6 py-8 text-center text-foreground/50">
                       <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                       Loading referrals...
                     </td>
                   </tr>
                ) : referrals.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="px-6 py-8 text-center text-foreground/50">No referrals found.</td>
                   </tr>
                ) : referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary">{ref.referrer?.username}</td>
                    <td className="px-6 py-4 font-medium">{ref.referred?.username}</td>
                    <td className="px-6 py-4 text-foreground/70">{new Date(ref.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-success flex items-center gap-1 mt-0.5"><Coins className="w-3 h-3"/> {ref.rewardAmount} Credits</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ref.status === 'COMPLETED' ? 'bg-success/20 text-success' : 'bg-orange-500/20 text-orange-500'
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
