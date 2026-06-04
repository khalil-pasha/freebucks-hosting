"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, TrendingUp, TrendingDown, Clock, Download, Dices, Server } from "lucide-react"
import Link from "next/link"

const transactions = [
  { id: "TX-1049", date: "Today, 10:42 AM", desc: "Hourly Reward Claimed", amount: "+1.5", type: "earn" },
  { id: "TX-1048", date: "Today, 09:00 AM", desc: "Server Burn (6GB, 1 Hour)", amount: "-6.0", type: "spend" },
  { id: "TX-1047", date: "Yesterday, 11:30 PM", desc: "Server Burn (6GB, 1 Hour)", amount: "-6.0", type: "spend" },
  { id: "TX-1046", date: "Yesterday, 08:15 PM", desc: "Daily Spin Won", amount: "+15.0", type: "earn" },
  { id: "TX-1045", date: "Yesterday, 08:00 PM", desc: "Server Burn (6GB, 1 Hour)", amount: "-6.0", type: "spend" },
  { id: "TX-1044", date: "Yesterday, 12:00 PM", desc: "Referral Bonus (Notch)", amount: "+25.0", type: "earn" },
]

export default function CreditsPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Credits & Economy</h1>
          <p className="text-foreground/60 mt-1">Track your earnings, burns, and transaction history.</p>
        </div>
        <Link href="/dashboard/spin">
           <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
             <Dices className="w-4 h-4 mr-2" /> Earn More Credits
           </Button>
        </Link>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Current Balance */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-success/20 relative overflow-hidden h-full shadow-lg shadow-success/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Coins className="w-4 h-4 text-success" /> Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-foreground mt-2">12.5 <span className="text-lg text-foreground/50 font-medium">Credits</span></div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Earned Today */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" /> Earned Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary mt-2">+20.0 <span className="text-sm text-foreground/50 font-normal">Credits</span></div>
              
              {/* Daily Cap Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground/60 font-medium">Daily Free Cap</span>
                  <span className="font-bold">20 / 35</span>
                </div>
                <div className="w-full bg-background rounded-full h-1.5 border border-border/50 overflow-hidden">
                  <div className="bg-secondary h-full rounded-full w-[57%]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Spent Today */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-500" /> Spent Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500 mt-2">-18.0 <span className="text-sm text-foreground/50 font-normal">Credits</span></div>
              <p className="text-xs text-foreground/50 mt-4 flex items-center gap-1">
                <Server className="w-3 h-3" /> Server Burn Rate: 6/hr
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl">Transaction History</CardTitle>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-foreground/50 uppercase bg-background/50 border-y border-border/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Transaction ID</th>
                    <th className="px-4 py-3 font-medium">Date & Time</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium text-right">Amount (Credits)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-background/50 transition-colors">
                      <td className="px-4 py-4 font-mono text-xs text-foreground/70">{tx.id}</td>
                      <td className="px-4 py-4 text-foreground/80 flex items-center gap-2">
                        <Clock className="w-3 h-3 text-foreground/40" /> {tx.date}
                      </td>
                      <td className="px-4 py-4 font-medium">{tx.desc}</td>
                      <td className={`px-4 py-4 text-right font-bold ${tx.type === 'earn' ? 'text-success' : 'text-red-500'}`}>
                        {tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
