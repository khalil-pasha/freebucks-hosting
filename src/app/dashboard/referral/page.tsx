"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Copy, Coins, ArrowRight, UserPlus, TrendingUp } from "lucide-react"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useAuth } from "@/components/AuthProvider"

export default function ReferralPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const link = user ? `https://app.freebucks.host/login?ref=${user.id}` : "";
    if (!link) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error("Failed to copy:", err);
        fallbackCopy(link);
      });
    } else {
      fallbackCopy(link);
    }
  }

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        alert("Failed to copy link. Please select the text and copy manually.");
      }
      document.body.removeChild(textArea);
    } catch (err) {
      alert("Failed to copy link. Please select the text and copy manually.");
    }
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/referrals/stats')
        setStats(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchStats()
  }, [])

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
        <h1 className="text-3xl font-bold tracking-tight">Referral Program</h1>
        <p className="text-foreground/60 mt-1">Invite your friends to Free Bucks and earn rewards together.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Referral Link & Explanation */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary" />
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">Your Unique Invite Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input 
                  readOnly 
                  value={user ? `https://app.freebucks.host/login?ref=${user.id}` : "Loading..."} 
                  className="bg-background font-mono text-sm h-12"
                />
                <Button onClick={handleCopy} className={`h-12 px-6 ${copied ? 'bg-success hover:bg-success/90' : 'bg-secondary hover:bg-secondary/90'} text-white flex-shrink-0 transition-colors`}>
                  {copied ? "Copied!" : <><Copy className="w-4 h-4 mr-2" /> Copy</>}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border/50">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/60 font-medium uppercase tracking-wider">You Receive</p>
                    <p className="text-xl font-black text-primary flex items-center gap-1 mt-0.5"><Coins className="w-4 h-4"/> {stats ? stats.senderReward : '...'} Credits</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border/50">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/60 font-medium uppercase tracking-wider">Friend Receives</p>
                    <p className="text-xl font-black text-secondary flex items-center gap-1 mt-0.5"><Coins className="w-4 h-4"/> {stats ? stats.receiverReward : '...'} Credits</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-500" /> Referral Guidelines
              </h3>
              <ul className="text-sm text-foreground/60 space-y-2 list-disc list-inside">
                <li>Alt accounts are strictly prohibited and will result in a ban.</li>
                <li>Your friend must create their first server for you to receive the reward.</li>
                <li>There is no limit to how many friends you can invite.</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-background border border-border/50 rounded-xl text-center">
                <p className="text-xs text-foreground/60 uppercase tracking-wider font-medium mb-1">Total Invited</p>
                <div className="text-4xl font-black text-foreground">{stats ? stats.totalInvited : '...'}</div>
              </div>
              <div className="p-4 bg-background border border-border/50 rounded-xl text-center">
                <p className="text-xs text-foreground/60 uppercase tracking-wider font-medium mb-1">Total Earned</p>
                <div className="text-4xl font-black text-success flex items-center justify-center gap-2">
                  <Coins className="w-6 h-6" /> {stats ? stats.totalEarned : '...'}
                </div>
              </div>
              <div className="p-4 bg-background border border-border/50 rounded-xl text-center">
                <p className="text-xs text-foreground/60 uppercase tracking-wider font-medium mb-1">Pending Installs</p>
                <div className="text-2xl font-bold text-foreground/70">{stats ? stats.pendingInstalls : '...'}</div>
                <p className="text-[10px] text-foreground/50 mt-1">Users signed up but haven't created a server yet.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

function ShieldAlert(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  )
}
