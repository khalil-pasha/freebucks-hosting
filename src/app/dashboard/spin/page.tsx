"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, Dices, Timer, History, CheckCircle2 } from "lucide-react"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useAuth } from "@/components/AuthProvider"

export default function RewardsPage() {
  const { user } = useAuth()
  const [balanceData, setBalanceData] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [rewardStatus, setRewardStatus] = useState<any>(null)
  const [now, setNow] = useState<number>(Date.now())
  const [loading, setLoading] = useState(false)
  
  const fetchRewardsData = async () => {
    try {
      const [balRes, histRes, statusRes] = await Promise.all([
        api.get('/credits/balance'),
        api.get('/credits/history'),
        api.get('/credits/rewards/status')
      ])
      setBalanceData(balRes.data)
      setHistory(histRes.data.filter((tx: any) => tx.source === 'HOURLY_CLAIM' || tx.source === 'DAILY_SPIN').slice(0, 10))
      setRewardStatus(statusRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchRewardsData()
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatCooldown = (nextTimeStr: string | null) => {
    if (!nextTimeStr) return null;
    const nextTime = new Date(nextTimeStr).getTime();
    const diff = nextTime - now;
    if (diff <= 0) return null;

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  const dailyCooldown = rewardStatus ? formatCooldown(rewardStatus.nextDailySpinAt) : null;
  const hourlyCooldown = rewardStatus ? formatCooldown(rewardStatus.nextHourlyClaimAt) : null;

  const handleSpin = async () => {
    setLoading(true)
    try {
      const rolledAmount = Math.floor(Math.random() * (50 - 5 + 1) + 5)
      const res = await api.post('/credits/daily-spin', { rolledAmount })
      alert(`You spun and won ${res.data.actualReward} credits!`)
      fetchRewardsData()
    } catch (err: any) {
      alert(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleHourly = async () => {
    setLoading(true)
    try {
      const res = await api.post('/credits/hourly-claim')
      alert(`You claimed ${res.data.amount} hourly credits!`)
      fetchRewardsData()
    } catch (err: any) {
      alert(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rewards</h1>
        <p className="text-foreground/60 mt-1">Claim your daily free credits to keep your servers running.</p>
      </div>

      {/* Remaining Daily Credits Alert */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary/10 border border-secondary/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-secondary">Remaining Daily Allowance</h3>
            <p className="text-sm text-foreground/70">You can still earn 15 more free credits today before hitting the 35 cap.</p>
          </div>
        </div>
        <div className="hidden sm:block text-2xl font-black text-secondary">{balanceData ? balanceData.dailyEarned : '--'} / {balanceData ? balanceData.dailyLimit : '--'}</div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Daily Spin Wheel */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden h-full shadow-lg shadow-primary/5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Dices className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold">Daily Spin</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex flex-col items-center">
              <p className="text-foreground/60 mb-8 max-w-sm">Test your luck once every 24 hours. Win up to 50 Credits instantly.</p>
              
              {/* Mock Wheel Graphic */}
              <div className="relative w-48 h-48 mb-8 border-4 border-primary/20 rounded-full flex items-center justify-center bg-background shadow-[0_0_30px_rgba(85,85,255,0.1)]">
                <div className="absolute inset-2 border-2 border-dashed border-primary/30 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="w-4 h-4 bg-primary rounded-full absolute -top-2" />
                <div className="text-3xl font-black text-primary">SPIN</div>
              </div>

              <Button disabled={loading || !!dailyCooldown} onClick={handleSpin} size="lg" className="w-full sm:w-auto px-12 bg-primary hover:bg-primary/90 text-white font-bold h-14">
                Spin The Wheel
              </Button>
              <p className="text-xs text-foreground/40 mt-4 font-mono">
                {dailyCooldown ? `Next spin available in ${dailyCooldown}` : 'Ready to spin!'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hourly Claim */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-success/20 relative overflow-hidden flex-1 shadow-lg shadow-success/5">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Timer className="w-5 h-5 text-success" /> Hourly Claim
                </CardTitle>
              </div>
              <div className={`px-3 py-1 ${hourlyCooldown ? 'bg-background text-foreground/50 border-border' : 'bg-success/10 text-success border-success/20 animate-pulse'} rounded-full text-xs font-bold uppercase border`}>
                {hourlyCooldown ? hourlyCooldown : 'Ready'}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-foreground/60 mb-6">Claim a quick burst of Credits every hour to keep your server fueled.</p>
              <div className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl mb-6">
                <span className="font-semibold text-foreground/80">Reward Amount</span>
                <span className="text-xl font-black text-success flex items-center gap-1"><Coins className="w-5 h-5" /> 1.5</span>
              </div>
              <Button disabled={loading || !!hourlyCooldown} onClick={handleHourly} size="lg" className="w-full bg-success hover:bg-success/90 text-white font-bold shadow-lg shadow-success/20">
                {hourlyCooldown ? "Cooldown Active" : "Claim Reward"}
              </Button>
            </CardContent>
          </Card>

          {/* Claim History */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-foreground/60" /> Recent Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                {history.length === 0 ? <p className="text-sm text-foreground/50 text-center">No recent claims</p> : history.map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border/50 text-success">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{claim.source}</p>
                        <p className="text-xs text-foreground/50">{new Date(claim.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="font-bold text-success text-sm">+{claim.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
