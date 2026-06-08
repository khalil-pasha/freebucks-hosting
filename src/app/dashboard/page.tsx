"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Server, Coins, Activity, Clock, Plus, Zap, ChevronRight, Dices, Gift } from "lucide-react"
import Link from "next/link"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/AuthProvider"
import api from "@/lib/api"

export default function DashboardOverview() {
  const { user, loading: userLoading } = useAuth()
  const [activeServers, setActiveServers] = useState<number | null>(null)
  const [totalServers, setTotalServers] = useState<number | null>(null)
  const [dailyEarned, setDailyEarned] = useState<number | null>(null)
  const [dailyLimit, setDailyLimit] = useState<number | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch balance independently
        api.get('/credits/balance').then(balRes => {
          setDailyEarned(balRes.data.dailyEarnedFree)
          setDailyLimit(balRes.data.dailyLimit)
        }).catch(err => {
          console.error("Failed to fetch balance:", err)
          setDailyEarned(0)
          setDailyLimit(35)
        })

        // Fetch servers independently
        api.get('/servers/my-servers').then(serverRes => {
          const servers = serverRes.data
          setTotalServers(servers.length)
          setActiveServers(servers.filter((s: any) => s.status === 'RUNNING' || s.status === 'STARTING').length)
        }).catch(err => {
          console.error("Failed to fetch servers:", err)
          setTotalServers(0)
          setActiveServers(0)
        })

        // Fetch history independently
        api.get('/credits/history').then(histRes => {
          setHistory(histRes.data.slice(0, 4))
        }).catch(err => {
          console.error("Failed to fetch history:", err)
          setHistory([])
        })

      } finally {
        setLoading(false)
      }
    }
    
    if (!userLoading && user) {
      fetchData()
    } else if (!userLoading && !user) {
      // Safe fallback if user failed to load
      setLoading(false)
      setTotalServers(0)
      setActiveServers(0)
    }
  }, [user, userLoading])
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-foreground/60 mt-1">Welcome back, {user?.username || 'User'}. Here's what's happening with your servers.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/spin">
            <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
              <Dices className="w-4 h-4 mr-2" /> Daily Spin
            </Button>
          </Link>
          <Link href="/dashboard/servers">
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> New Server
            </Button>
          </Link>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {/* Credit Balance */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Coins className="w-4 h-4 text-success" /> Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {userLoading ? '...' : (user?.balance ?? 0)} <span className="text-sm text-foreground/50 font-normal">Credits</span>
              </div>
              <p className="text-xs text-foreground/50 mt-1">Spend wisely on your servers</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Cap Progress */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-secondary" /> Daily Earning Cap
                </div>
                <span className="text-xs font-bold text-secondary">
                  {dailyEarned !== null && dailyLimit !== null ? `${dailyEarned} / ${dailyLimit}` : '...'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-background rounded-full h-2.5 mb-2 mt-2 border border-border/50 overflow-hidden">
                <div 
                  className="bg-secondary h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: dailyEarned !== null && dailyLimit !== null ? `${Math.min(100, (dailyEarned / dailyLimit) * 100)}%` : '0%' }}
                />
              </div>
              <p className="text-xs text-foreground/50">
                {dailyEarned !== null && dailyLimit !== null 
                  ? `You can still earn ${Math.max(0, dailyLimit - dailyEarned)} free credits today.`
                  : 'Loading...'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Servers */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" /> Active Servers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {activeServers !== null ? activeServers : '...'} <span className="text-sm text-foreground/50 font-normal">/ {totalServers !== null ? totalServers : '...'} Total</span>
              </div>
              <p className="text-xs text-foreground/50 mt-1">Servers currently running or starting</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Queue Status */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 relative overflow-hidden h-full">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" /> Global Queue Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">Optimal</div>
              <p className="text-xs text-success font-medium mt-1">Instant server starts available</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/spin" className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50 hover:border-secondary/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center text-secondary">
                    <Dices className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">Play Daily Spin</span>
                </div>
                <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-secondary" />
              </Link>
              
              <Link href="/dashboard/spin" className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50 hover:border-success/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-success/10 flex items-center justify-center text-success">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">Claim Hourly Credits</span>
                    <span className="text-[10px] text-success">Ready to claim!</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-success" />
              </Link>

              <Link href="/dashboard/voucher" className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50 hover:border-purple-500/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Gift className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">Redeem Voucher</span>
                </div>
                <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-purple-500" />
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-foreground/50 hover:text-foreground">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-4">
                {loading ? <p className="text-sm text-foreground/50">Loading activity...</p> : history.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-background/50 transition-colors border border-transparent hover:border-border/50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'EARNED' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                    }`}>
                      {activity.type === 'EARNED' ? <Coins className="w-5 h-5" /> : <Server className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <p className="font-medium text-sm">{activity.source}</p>
                        <p className="text-xs text-foreground/50">{new Date(activity.createdAt).toLocaleString()}</p>
                      </div>
                      <div className={`text-sm font-semibold ${
                        activity.type === 'EARNED' ? 'text-success' : 'text-foreground'
                      }`}>
                        {activity.type === 'EARNED' ? '+' : '-'}{activity.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
