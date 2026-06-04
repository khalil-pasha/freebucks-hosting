"use client"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Zap, Shield, Crown, CheckCircle2, TrendingUp } from "lucide-react"

export default function PremiumPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  }

  return (
    <div className="space-y-12 pb-10">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFD700]/10 text-[#FFD700] mb-6">
          <Crown className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#FFD700] mb-4">Upgrade to Premium</h1>
        <p className="text-lg text-foreground/70">Support the platform and unlock extreme server performance, instant queue bypass, and an entirely ad-free experience.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
      >
        {[
          { title: "Priority Queue", desc: "Skip the line. Your servers start instantly.", icon: Zap },
          { title: "8GB+ Hardware", desc: "Access enterprise-grade CPUs and huge RAM pools.", icon: ServerIcon },
          { title: "Zero Ads", desc: "A perfectly clean, ad-free dashboard experience.", icon: Shield },
          { title: "Higher Caps", desc: "Earn and hold more Credits than standard users.", icon: TrendingUp },
        ].map((benefit, i) => (
          <motion.div key={i} variants={itemVariants}>
            <div className="bg-card/50 backdrop-blur-sm border border-[#FFD700]/20 rounded-xl p-6 text-center h-full hover:bg-[#FFD700]/5 transition-colors">
              <benefit.icon className="w-8 h-8 mx-auto mb-4 text-[#FFD700]" />
              <h3 className="font-bold mb-2">{benefit.title}</h3>
              <p className="text-sm text-foreground/60">{benefit.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-8">
        {/* Tier 1 */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 relative overflow-hidden flex flex-col">
          <CardHeader className="text-center pb-8 pt-8">
            <CardTitle className="text-2xl font-bold mb-2">Supporter</CardTitle>
            <div className="text-xl font-bold text-foreground/70">Purchase via Discord</div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              {['Priority Queue Status', 'Ad-Free Dashboard', 'Special Discord Role', '1.5x Daily Credits Multiplier'].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" /> {feat}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-card-foreground/10 hover:bg-card-foreground/20 text-foreground">Select Supporter</Button>
          </CardFooter>
        </Card>

        {/* Tier 2 */}
        <Card className="bg-card/80 backdrop-blur-sm border-[#FFD700]/50 relative overflow-hidden flex flex-col shadow-2xl shadow-[#FFD700]/10 transform md:-translate-y-4">
          <div className="absolute top-0 left-0 w-full bg-[#FFD700] text-black text-xs font-bold uppercase tracking-widest text-center py-1">
            Most Popular
          </div>
          <CardHeader className="text-center pb-8 pt-10">
            <CardTitle className="text-2xl font-bold mb-2 text-[#FFD700]">Pro Premium</CardTitle>
            <div className="text-xl font-bold text-[#FFD700]/70">Purchase via Discord</div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              {['Instant Queue Bypass', 'Access to 8GB RAM Servers', 'Ad-Free Dashboard', 'Pro Discord Role', '2x Daily Credits Multiplier', 'Premium Support Channel'].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#FFD700] flex-shrink-0" /> {feat}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold shadow-lg shadow-[#FFD700]/20">Select Pro</Button>
          </CardFooter>
        </Card>

        {/* Tier 3 */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 relative overflow-hidden flex flex-col">
          <CardHeader className="text-center pb-8 pt-8">
            <CardTitle className="text-2xl font-bold mb-2 text-purple-400">Overkill</CardTitle>
            <div className="text-xl font-bold text-purple-400/70">Purchase via Discord</div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              {['Instant Queue Bypass', 'Access to 12GB RAM Servers', 'Unlimited Credits Cap', 'Overkill Discord Role', '3x Daily Credits Multiplier', '1-on-1 Admin Support'].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" /> {feat}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">Select Overkill</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function ServerIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  )
}
