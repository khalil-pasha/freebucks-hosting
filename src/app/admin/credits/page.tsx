"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Coins, PlusCircle, MinusCircle, History, RotateCcw, RefreshCw } from "lucide-react"
import api from "@/lib/api"

export default function AdminCreditsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [stats, setStats] = useState<any>({ totalCreditsEarned: 0, totalCreditsBurned: 0 })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [transRes, statsRes] = await Promise.all([
        api.get('/admin/core/credits'),
        api.get('/admin/core/stats')
      ])
      setTransactions(transRes.data)
      setStats(statsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credits Manager</h1>
        <p className="text-foreground/60 mt-1">Global economy ledger and user credit adjustments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-success/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground/60">Total Credits Created</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-black text-success">{loading ? '...' : stats.totalCreditsEarned?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground/60">Total Credits Spent</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-black text-red-500">{loading ? '...' : stats.totalCreditsBurned?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground/60">Net Circulation</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-black text-primary">{loading ? '...' : ((stats.totalCreditsEarned || 0) - (stats.totalCreditsBurned || 0)).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-card border-border/50 lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Adjust User Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
               <label className="text-sm font-medium">Discord ID or Username</label>
               <Input placeholder="e.g. 123456789 or username" className="bg-background" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium">Amount</label>
               <Input type="number" placeholder="0.0" className="bg-background" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium">Reason (Optional)</label>
               <Input placeholder="e.g. Bug bounty reward" className="bg-background" />
             </div>
             
             <div className="pt-4 grid grid-cols-2 gap-2">
               <Button className="w-full bg-success hover:bg-success/90 text-white"><PlusCircle className="w-4 h-4 mr-2"/> Give</Button>
               <Button variant="outline" className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10"><MinusCircle className="w-4 h-4 mr-2"/> Remove</Button>
               <Button variant="outline" className="w-full col-span-2 border-orange-500/50 text-orange-500 hover:bg-orange-500/10"><RotateCcw className="w-4 h-4 mr-2"/> Reset to Zero</Button>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2"><History className="w-5 h-5 text-primary" /> Global Transaction Log</CardTitle>
            <Button variant="ghost" size="icon" onClick={fetchData}><RefreshCw className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent>
             <table className="w-full text-sm text-left">
               <thead className="text-xs text-foreground/50 uppercase bg-background/50 border-b border-border/50">
                 <tr>
                   <th className="px-4 py-3 font-medium">Date</th>
                   <th className="px-4 py-3 font-medium">User</th>
                   <th className="px-4 py-3 font-medium">Source / Action</th>
                   <th className="px-4 py-3 font-medium text-right">Amount</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                 {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-foreground/50">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Loading logs...
                      </td>
                    </tr>
                 ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-foreground/50">No logs found.</td>
                    </tr>
                 ) : transactions.map((log) => (
                   <tr key={log.id} className="hover:bg-foreground/5 transition-colors">
                     <td className="px-4 py-3 text-foreground/60">{new Date(log.timestamp).toLocaleString()}</td>
                     <td className="px-4 py-3 font-medium">{log.user?.username}</td>
                     <td className="px-4 py-3 text-foreground/70">{log.source}</td>
                     <td className={`px-4 py-3 text-right font-bold ${log.type === 'EARNED' ? 'text-success' : 'text-red-500'}`}>
                       {log.type === 'EARNED' ? '+' : '-'}{log.amount.toFixed(2)}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
