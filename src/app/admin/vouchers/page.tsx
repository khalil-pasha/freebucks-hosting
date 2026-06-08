"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Ticket, Plus, Trash2, Ban, RefreshCw } from "lucide-react"
import api from "@/lib/api"

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchVouchers = async () => {
    try {
      const res = await api.get('/admin/core/vouchers')
      setVouchers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVouchers()
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Voucher Manager</h1>
        <p className="text-foreground/60 mt-1">Create promotional codes to distribute free credits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-card border-border/50 lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Create New Voucher</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
               <label className="text-sm font-medium">Voucher Code</label>
               <Input placeholder="e.g. SUMMER2026" className="bg-background uppercase" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium">Credits Reward</label>
               <Input type="number" placeholder="50.0" className="bg-background" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium">Max Global Uses</label>
               <Input type="number" placeholder="1000" className="bg-background" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium">Uses Per User</label>
               <Input type="number" defaultValue="1" className="bg-background" disabled />
             </div>
             
             <div className="pt-4">
               <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white"><Plus className="w-4 h-4 mr-2"/> Generate Voucher</Button>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2"><Ticket className="w-5 h-5 text-purple-500" /> Active & Past Vouchers</CardTitle>
            <Button variant="ghost" size="icon" onClick={fetchVouchers}><RefreshCw className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="text-xs text-foreground/50 uppercase bg-background/50 border-b border-border/50">
                   <tr>
                     <th className="px-4 py-3 font-medium">Code</th>
                     <th className="px-4 py-3 font-medium">Reward</th>
                     <th className="px-4 py-3 font-medium">Redemptions</th>
                     <th className="px-4 py-3 font-medium">Status</th>
                     <th className="px-4 py-3 font-medium text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                   {loading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-foreground/50">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                          Loading vouchers...
                        </td>
                      </tr>
                   ) : vouchers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-foreground/50">No vouchers found.</td>
                      </tr>
                   ) : vouchers.map((v) => {
                     const isDepleted = v.currentUses >= v.maxUses;
                     const isExpired = v.expiresAt && new Date(v.expiresAt) < new Date();
                     const status = isDepleted ? 'Depleted' : isExpired ? 'Expired' : 'Active';
                     
                     return (
                       <tr key={v.id} className="hover:bg-foreground/5 transition-colors">
                         <td className="px-4 py-3 font-mono font-bold text-purple-400">{v.code}</td>
                         <td className="px-4 py-3 text-success font-bold">+{v.rewardAmount}</td>
                         <td className="px-4 py-3 font-medium">{v.currentUses} / {v.maxUses}</td>
                         <td className="px-4 py-3">
                           <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                             status === 'Active' ? 'bg-success/20 text-success' : 
                             status === 'Depleted' ? 'bg-orange-500/20 text-orange-500' :
                             'bg-red-500/20 text-red-500'
                           }`}>
                             {status}
                           </span>
                         </td>
                         <td className="px-4 py-3 text-right flex justify-end gap-1">
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10" title="Delete"><Trash2 className="w-4 h-4" /></Button>
                         </td>
                       </tr>
                     )
                   })}
                 </tbody>
               </table>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
