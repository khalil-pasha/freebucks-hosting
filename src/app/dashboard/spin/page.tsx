"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, Timer, History, CheckCircle2 } from "lucide-react"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useAuth } from "@/components/AuthProvider"

export default function RewardsPage() {
  const { user, refetchUser } = useAuth()
  const [balanceData, setBalanceData] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [rewardStatus, setRewardStatus] = useState<any>(null)
  const [now, setNow] = useState<number>(Date.now())
  const [loading, setLoading] = useState(false)
  const [isAdFlow, setIsAdFlow] = useState(false)
  const [adCountdown, setAdCountdown] = useState(10)
  
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

  useEffect(() => {
    if (isAdFlow && adCountdown > 0) {
      const timer = setTimeout(() => {
        setAdCountdown(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isAdFlow, adCountdown])

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

  const hourlyCooldown = rewardStatus ? formatCooldown(rewardStatus.nextHourlyClaimAt) : null;
  const rewardAmount = rewardStatus?.hourlyClaimReward || 1.5;

  const handleInitialClaim = () => {
    setIsAdFlow(true)
    setAdCountdown(10)
    window.open("https://omg10.com/4/11133998", "_blank")
  }

  const handleHourly = async () => {
    setLoading(true)
    try {
      const res = await api.post('/credits/hourly-claim')
      await refetchUser()
      alert(`Claimed ${res.data.amount} credits!`)
      fetchRewardsData()
      setIsAdFlow(false)
    } catch (err: any) {
      alert(err.response?.data?.error || err.message)
      setIsAdFlow(false)
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
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rewards</h1>
        <p className="text-foreground/60 mt-1">Claim your free credits to keep your servers running.</p>
      </div>

      {/* Remaining Daily Credits Alert */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary/10 border border-secondary/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-secondary">Remaining Daily Allowance</h3>
            <p className="text-sm text-foreground/70">Keep earning credits today before hitting your daily cap.</p>
          </div>
        </div>
        <div className="hidden sm:block text-2xl font-black text-secondary">{balanceData ? balanceData.dailyEarned : '--'} / {balanceData ? balanceData.dailyLimit : '--'}</div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-8"
      >
        {/* Hourly Claim */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-success/20 relative overflow-hidden flex-1 shadow-lg shadow-success/5">
            <div className="absolute top-0 left-0 w-48 h-48 bg-success/10 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
            <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-border/50 bg-background/50">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Timer className="w-6 h-6 text-success" /> Hourly Claim
                </CardTitle>
              </div>
              <div className={`px-4 py-1.5 ${hourlyCooldown ? 'bg-background text-foreground/50 border-border' : 'bg-success/10 text-success border-success/20 animate-pulse'} rounded-full text-sm font-bold uppercase border`}>
                {hourlyCooldown ? hourlyCooldown : 'Ready'}
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <p className="text-foreground/60 mb-8 text-center text-lg max-w-lg mx-auto">Claim a quick burst of Credits every hour to keep your server fueled and running smoothly.</p>
              
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="bg-background border-2 border-border rounded-2xl p-6 flex flex-col items-center gap-2 shadow-inner w-full max-w-sm">
                  <span className="font-semibold text-foreground/60 uppercase tracking-wider text-sm">Reward Amount</span>
                  <span className="text-4xl font-black text-success flex items-center gap-2"><Coins className="w-8 h-8" /> {rewardAmount}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                {isAdFlow ? (
                  <>
                    <p className="text-sm text-foreground/70 mb-2 font-medium">Ad opened in a new tab. Please view it, then return here.</p>
                    <Button disabled={adCountdown > 0 || loading || !!hourlyCooldown} onClick={handleHourly} size="lg" className="w-full max-w-sm bg-success hover:bg-success/90 text-white font-bold h-14 text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                      {adCountdown > 0 ? `Wait ${adCountdown}s...` : (loading ? "Claiming..." : "Continue Claim")}
                    </Button>
                    {adCountdown > 0 && (
                      <a href="https://omg10.com/4/11133998" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-2">
                        Open Ad Manually (If popup blocked)
                      </a>
                    )}
                  </>
                ) : (
                  <Button disabled={loading || !!hourlyCooldown} onClick={handleInitialClaim} size="lg" className="w-full max-w-sm bg-success hover:bg-success/90 text-white font-bold h-14 text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    {hourlyCooldown ? "Cooldown Active" : "Claim Reward"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Claim History */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="border-b border-border/50 bg-background/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-foreground/60" /> Recent Claims
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {history.length === 0 ? <p className="text-sm text-foreground/50 text-center py-4">No recent claims</p> : history.map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border text-success">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-wide">{claim.source}</p>
                        <p className="text-xs text-foreground/50 font-medium">{new Date(claim.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="font-black text-success text-base">+{claim.amount}</span>
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
