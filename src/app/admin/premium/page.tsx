"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw } from "lucide-react"
import api from "@/lib/api"

export default function AdminPremiumPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/core/premium')
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const pendingCount = orders.filter(o => o.status === 'PENDING').length;
  const activeCount = orders.filter(o => o.status === 'COMPLETED').length;
  const totalRevenue = orders.filter(o => o.status === 'COMPLETED').reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales & Revenue</h1>
        <p className="text-foreground/60 mt-1">Monitor automated Premium sales and Razorpay transactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <div className="text-sm text-foreground/60 mb-2">Pending Checkouts</div>
          <div className="text-3xl font-black text-orange-500">{loading ? '...' : pendingCount}</div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <div className="text-sm text-foreground/60 mb-2">Successful Purchases</div>
          <div className="text-3xl font-black text-primary">{loading ? '...' : activeCount}</div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <div className="text-sm text-foreground/60 mb-2">Total Revenue (INR)</div>
          <div className="text-3xl font-black text-success">{loading ? '...' : `₹${totalRevenue.toLocaleString()}`}</div>
        </div>
      </div>

      <Card className="bg-card border-border/50 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="w-5 h-5 text-success" /> Recent Transactions</CardTitle>
          <Button variant="ghost" size="icon" onClick={fetchOrders}><RefreshCw className="w-4 h-4" /></Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-foreground/50 uppercase bg-background/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Plan</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Transaction ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                   <tr>
                     <td colSpan={6} className="px-6 py-8 text-center text-foreground/50">
                       <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                       Loading sales...
                     </td>
                   </tr>
                ) : orders.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="px-6 py-8 text-center text-foreground/50">No transactions found.</td>
                   </tr>
                ) : orders.map((req) => (
                  <tr key={req.id} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{req.user?.username}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold text-primary`}>
                        {req.plan || 'Premium'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">
                      ₹{req.amount || 0}
                    </td>
                    <td className="px-6 py-4 font-mono text-foreground/70 text-xs">
                      {req.razorpayOrderId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        req.status === 'PENDING' ? 'bg-orange-500/20 text-orange-500' :
                        req.status === 'COMPLETED' ? 'bg-success/20 text-success' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {req.status}
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
