"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, Server, ListOrdered, Coins, Ticket } from "lucide-react"

export default function AdminDashboardPage() {
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
              <div className="text-3xl font-black">85,241</div>
              <p className="text-xs text-success mt-1">+1,240 this week</p>
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
              <div className="text-3xl font-black">12,405</div>
              <p className="text-xs text-foreground/50 mt-1">15% of total</p>
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
              <div className="text-3xl font-black">4,120</div>
              <p className="text-xs text-foreground/50 mt-1">Capacity: 75%</p>
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
              <div className="text-3xl font-black text-orange-500">142</div>
              <p className="text-xs text-orange-500/70 mt-1">Avg Wait: 4m 30s</p>
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
              <div className="text-3xl font-black">2.5M</div>
              <p className="text-xs text-foreground/50 mt-1">Credits in wallets</p>
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
              {[40, 60, 45, 80, 55, 90, 75].map((val, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-2 group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="w-full bg-primary/20 rounded-t-sm group-hover:bg-primary transition-colors relative"
                  >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-background border border-border text-xs py-1 px-2 rounded font-bold transition-opacity">
                       {val * 10}
                     </div>
                  </motion.div>
                  <span className="text-xs text-foreground/50 font-medium">Day {i+1}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart 2 */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-lg">Credits Economy (Earned vs Spent)</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between h-64 pt-6 gap-4">
              {[
                { e: 60, s: 50 },
                { e: 80, s: 70 },
                { e: 40, s: 90 },
                { e: 100, s: 85 },
                { e: 70, s: 60 },
              ].map((data, i) => (
                <div key={i} className="w-full flex justify-center items-end gap-1">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${data.e}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="w-1/2 bg-success/60 rounded-t-sm hover:bg-success cursor-pointer"
                    title={`Earned: ${data.e}k`}
                  />
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${data.s}%` }}
                    transition={{ duration: 1, delay: i * 0.1 + 0.2 }}
                    className="w-1/2 bg-red-500/60 rounded-t-sm hover:bg-red-500 cursor-pointer"
                    title={`Spent: ${data.s}k`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
