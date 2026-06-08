"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserCircle, Coins, Ban, Unlock, Server } from "lucide-react"
import api from "@/lib/api"

export default function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/core/users/${params.id}`)
        setUser(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [params.id])

  if (loading) return <div className="p-8 text-center text-foreground/50">Loading user...</div>
  if (!user) return <div className="p-8 text-center text-foreground/50">User not found</div>

  const isBanned = false // Would need real implementation
  
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
          <p className="text-foreground/60 mt-1">Managing user {user.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Card */}
        <Card className="bg-card border-border/50 md:col-span-1">
          <CardHeader className="text-center pb-4 pt-8">
            <div className="mx-auto w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <UserCircle className="w-16 h-16 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">{user.username}</CardTitle>
            <p className="text-sm text-foreground/50 font-mono mt-1">Discord: {user.discordId}</p>
            <div className="mt-4 flex justify-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-success/20 text-success`}>
                Active
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Balance</span>
              <span className="font-bold text-success flex items-center gap-1"><Coins className="w-3 h-3"/> {user.balance?.toFixed(2)} Credits</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Join Date</span>
              <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Total Servers</span>
              <span className="font-medium">{user.servers?.length || 0}</span>
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
                 {user.servers?.length === 0 ? (
                   <div className="text-foreground/50 text-sm">No servers found.</div>
                 ) : user.servers?.map((s: any, i: number) => (
                   <div key={i} className="flex justify-between items-center p-3 bg-background border border-border/50 rounded-lg">
                     <div>
                       <p className="font-bold">{s.name}</p>
                       <p className="text-xs text-foreground/50">{s.ramGB}GB • {s.nodeLocation}</p>
                     </div>
                     <span className={`text-xs font-bold ${s.status === 'RUNNING' ? 'text-success' : 'text-foreground/50'}`}>{s.status}</span>
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
                  {user.transactions?.length === 0 ? (
                    <tr><td colSpan={3} className="py-3 text-foreground/50 text-center">No transactions found.</td></tr>
                  ) : user.transactions?.map((t: any, i: number) => (
                    <tr key={i}>
                      <td className="py-3">{t.reason || t.type}</td>
                      <td className="py-3 text-foreground/60">{new Date(t.timestamp).toLocaleString()}</td>
                      <td className={`py-3 text-right font-bold ${t.type === 'EARNED' ? 'text-success' : 'text-red-500'}`}>
                        {t.type === 'EARNED' ? '+' : '-'}{Math.abs(t.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
