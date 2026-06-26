"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, Server, ListOrdered, Coins, Ticket } from "lucide-react"

import { useEffect, useState } from "react"
import api from "@/lib/api"

export default function AdminDashboardPage() {
  const [runningServers, setRunningServers] = useState(0)
  const [queuedServers, setQueuedServers] = useState(0)
  const [creditsBurned, setCreditsBurned] = useState(0)
  const [creditsEarned, setCreditsEarned] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [activeUsers, setActiveUsers] = useState(0)
  const [newUsersHistory, setNewUsersHistory] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serversRes, queueRes, statsRes] = await Promise.all([
          api.get('/admin/billing/running-servers'),
          api.get('/admin/queue/active'),
          api.get('/admin/core/stats')
        ])
        setRunningServers(serversRes.data.length)
        setQueuedServers(queueRes.data.waiting?.length || 0)
        
        const stats = statsRes.data;
        setCreditsBurned(stats.totalCreditsBurned || 0)
        setCreditsEarned(stats.totalCreditsEarned || 0)
        setTotalUsers(stats.totalUsers || 0)
        setActiveUsers(stats.activeUsers || 0)
        if (stats.newUsersHistory) {
          setNewUsersHistory(stats.newUsersHistory)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-foreground/60 mt-1">Live metrics and platform analytics.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/60 flex items-center justify-between">
                Total Users
                <Users className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{loading ? '...' : totalUsers.toLocaleString()}</div>
              <p className="text-xs text-success mt-1">Registered accounts</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/60 flex items-center justify-between">
                Active Users (24h)
                <Users className="w-4 h-4 text-success" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{loading ? '...' : activeUsers.toLocaleString()}</div>
              <p className="text-xs text-foreground/50 mt-1">Logged in recently</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/60 flex items-center justify-between">
                Running Servers
                <Server className="w-4 h-4 text-secondary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{loading ? '...' : runningServers}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border-orange-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/60 flex items-center justify-between">
                Queued Servers
                <ListOrdered className="w-4 h-4 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-orange-500">{loading ? '...' : queuedServers}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/60 flex items-center justify-between">
                Circulation
                <Coins className="w-4 h-4 text-yellow-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{loading ? '...' : creditsBurned.toLocaleString()}</div>
              <p className="text-xs text-foreground/50 mt-1">Total Burned Credits</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Animated Charts Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Chart 1 */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-lg">New Users (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between h-64 pt-6 gap-2">
              {newUsersHistory.map((val, i) => {
                const maxVal = Math.max(...newUsersHistory, 10); // Minimum scale 10
                const percentage = (val / maxVal) * 100;
                return (
                <div key={i} className="w-full flex flex-col items-center gap-2 group">
                  <motion.div 
                    initial={{ height: "0%" }}
                    animate={{ height: `${percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="w-full bg-primary/20 rounded-t-sm group-hover:bg-primary transition-colors relative"
                  >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-background border border-border text-xs py-1 px-2 rounded font-bold transition-opacity">
                       {val}
                     </div>
                  </motion.div>
                  <span className="text-xs text-foreground/50 font-medium">Day {i+1}</span>
                </div>
              )})}
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart 2 */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-lg">Credits Economy (All Time)</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-center h-64 pt-6 gap-12">
                <div className="w-1/3 flex flex-col items-center gap-2 group">
                  <motion.div 
                    initial={{ height: "0%" }}
                    animate={{ height: `${Math.min(100, Math.max(10, (creditsEarned / Math.max(creditsEarned, creditsBurned, 1)) * 100))}%` }}
                    transition={{ duration: 1 }}
                    className="w-full bg-success/60 rounded-t-sm hover:bg-success relative"
                  >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-background border border-border text-xs py-1 px-2 rounded font-bold transition-opacity z-10">
                       {creditsEarned.toLocaleString()}
                     </div>
                  </motion.div>
                  <span className="text-xs text-foreground/50 font-medium">Earned</span>
                </div>
                
                <div className="w-1/3 flex flex-col items-center gap-2 group">
                  <motion.div 
                    initial={{ height: "0%" }}
                    animate={{ height: `${Math.min(100, Math.max(10, (creditsBurned / Math.max(creditsEarned, creditsBurned, 1)) * 100))}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="w-full bg-red-500/60 rounded-t-sm hover:bg-red-500 relative"
                  >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-background border border-border text-xs py-1 px-2 rounded font-bold transition-opacity z-10">
                       {creditsBurned.toLocaleString()}
                     </div>
                  </motion.div>
                  <span className="text-xs text-foreground/50 font-medium">Spent</span>
                </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
