"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Gift, CheckCircle2, History, XCircle } from "lucide-react"

const voucherHistory = [
  { id: 1, code: "WELCOME2026", amount: "+500 Credits", status: "Success", date: "May 15, 2026" },
  { id: 2, code: "DISCORD10K", amount: "+250 Credits", status: "Success", date: "May 01, 2026" },
  { id: 3, code: "EXPIREDCODE", amount: "—", status: "Failed", date: "April 20, 2026" },
]

export default function VoucherPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Redeem Vouchers</h1>
        <p className="text-foreground/60 mt-2 max-w-lg mx-auto">Found a code in our Discord or Twitter? Enter it below to instantly claim massive amounts of free Credits.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="bg-[linear-gradient(110deg,#18181b,45%,#27272a,55%,#18181b)] bg-[length:200%_100%] animate-[shimmer_2s_infinite] border-purple-500/30 shadow-2xl shadow-purple-500/10">
          <CardContent className="p-8 sm:p-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-8 border-4 border-background shadow-lg text-purple-500">
              <Gift className="w-10 h-10" />
            </div>
            
            <div className="w-full max-w-md space-y-4">
              <Input 
                placeholder="Enter your voucher code..." 
                className="h-14 text-center text-lg font-mono tracking-widest bg-background/80 backdrop-blur border-purple-500/50 focus-visible:ring-purple-500 uppercase"
              />
              <Button size="lg" className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02]">
                Claim Reward
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <History className="w-5 h-5 text-foreground/60" /> Redemption History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {voucherHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl hover:border-foreground/20 transition-colors">
                  <div className="flex items-center gap-4">
                    {item.status === "Success" ? (
                      <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-mono font-bold tracking-wider">{item.code}</p>
                      <p className="text-xs text-foreground/50">{item.date}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${item.status === "Success" ? "text-success" : "text-foreground/30"}`}>
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
