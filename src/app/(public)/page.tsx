"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Server, Shield, Zap, Coins, Clock, MapPin, Users, Ticket, CheckCircle2, Gamepad2, ArrowUpCircle, PlayCircle, HardDrive, Globe, Star, Target, Check, HelpCircle, ChevronDown, Rocket, Crown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center relative">
      {/* Minecraft Block Pattern Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIwVjIweiIgZmlsbD0iIzU1NTVGRiIgZmlsbC1vcGFjaXR5PSIwLjAyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-50 z-0 pointer-events-none" />

      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 flex items-center justify-center relative overflow-hidden z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute top-1/2 right-1/4 translate-x-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" 
        />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
              className="flex flex-col items-start text-left"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center rounded-sm border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm shadow-[4px_4px_0_rgba(85,85,255,0.2)]"
              >
                <span className="flex h-2 w-2 bg-primary mr-2 animate-pulse"></span>
                Premium India Nodes Now Available
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight drop-shadow-xl"
              >
                Free Minecraft Hosting <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-success">Powered By Credits</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl text-foreground/60 max-w-xl mb-10 leading-relaxed font-medium"
              >
                Claim credits daily, create Minecraft servers, upgrade resources, and play without paying. Experience enterprise-grade hosting entirely for free.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <Link href="https://api.freebucks.host/auth/discord">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-[0_0_20px_rgba(88,101,242,0.4)] rounded-sm font-bold border border-[#5865F2] transition-transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="mr-2">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                    </svg>
                    Discord Login
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-border/50 bg-background/80 backdrop-blur rounded-sm font-bold shadow-[4px_4px_0_rgba(255,255,255,0.05)] transition-transform hover:scale-105">
                    View Pricing <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Dashboard Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl blur-2xl transform rotate-3 scale-105" />
                <div className="relative bg-[#1A1A1A]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
                  {/* Mockup Header */}
                  <div className="h-10 bg-black/40 flex items-center px-4 border-b border-white/5 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-success/80" />
                    <div className="ml-4 text-xs font-mono text-white/40">panel.freebucks.com</div>
                  </div>
                  {/* Mockup Content */}
                  <div className="p-6 space-y-4">
                     <div className="flex justify-between items-center bg-black/30 p-4 rounded-lg border border-white/5">
                       <div>
                         <h3 className="font-bold text-white flex items-center gap-2"><Server className="w-4 h-4 text-success"/> Survival SMP</h3>
                         <p className="text-xs text-white/50 font-mono mt-1">mumbai-node-03.freebucks.gg</p>
                       </div>
                       <div className="text-right">
                         <div className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded">ONLINE</div>
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                       {/* CPU Chart Mock */}
                       <div className="bg-black/30 p-4 rounded-lg border border-white/5 relative overflow-hidden group hover:border-primary/50 transition-colors">
                         <div className="text-xs text-white/50 mb-2 font-bold">CPU USAGE</div>
                         <div className="text-xl font-black text-white group-hover:text-primary transition-colors">42%</div>
                         <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-primary/20 to-transparent flex items-end justify-between px-1 gap-1">
                            {[30, 45, 25, 60, 42, 38, 55, 42].map((h, i) => (
                              <motion.div key={i} className="w-full bg-primary/40 rounded-t-sm" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: 0.5 + (i * 0.1) }} />
                            ))}
                         </div>
                       </div>
                       
                       {/* RAM Chart Mock */}
                       <div className="bg-black/30 p-4 rounded-lg border border-white/5 relative overflow-hidden group hover:border-secondary/50 transition-colors">
                         <div className="text-xs text-white/50 mb-2 font-bold">RAM USAGE</div>
                         <div className="text-xl font-black text-white group-hover:text-secondary transition-colors">3.2 / 6 GB</div>
                         <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-secondary/20 to-transparent flex items-end justify-between px-1 gap-1">
                            {[50, 52, 48, 55, 60, 58, 55, 52].map((h, i) => (
                              <motion.div key={i} className="w-full bg-secondary/40 rounded-t-sm" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: 0.5 + (i * 0.1) }} />
                            ))}
                         </div>
                       </div>
                     </div>

                     <div className="bg-black/30 p-4 rounded-lg border border-white/5 flex items-center justify-between hover:bg-black/50 transition-colors">
                       <div className="flex items-center gap-3">
                         <Users className="w-5 h-5 text-white/50" />
                         <div className="text-sm font-bold text-white">Players Online</div>
                       </div>
                       <div className="font-mono font-bold text-white">24 / 50</div>
                     </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated Live Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-24 pt-10 border-t border-border/50 w-full text-center"
          >
             {[
               { label: "Registered Users", value: "85,241" },
               { label: "Active Servers", value: "12,405" },
               { label: "Credits Distributed", value: "2.5M+" },
               { label: "Global Uptime", value: "99.9%" }
             ].map((stat, i) => (
               <motion.div 
                 key={i} 
                 whileHover={{ y: -5, scale: 1.05 }}
                 className="group relative bg-card/20 backdrop-blur-sm border border-border/50 p-6 rounded-xl hover:bg-card/60 transition-colors shadow-[4px_4px_0_rgba(255,255,255,0.02)]"
               >
                 <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50 relative z-10">{stat.value}</div>
                 <div className="text-[11px] text-foreground/50 uppercase tracking-widest font-bold mt-2 relative z-10">{stat.label}</div>
               </motion.div>
             ))}
          </motion.div>
        </div>
      </section>

      {/* How Free Bucks Works */}
      <section className="w-full py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Free Bucks Works</h2>
            <p className="text-foreground/60 text-lg">Four simple steps to host your own Minecraft server without spending a dime.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 relative"
          >
             <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-secondary to-success -translate-y-1/2 z-0 opacity-20" />
             
             {[
               { icon: <Coins className="w-8 h-8 text-primary"/>, title: "1. Claim Credits", desc: "Log in daily and claim your free credits from the dashboard.", border: "border-primary/50", bg: "bg-primary/10", glow: "hover:shadow-primary/20" },
               { icon: <Server className="w-8 h-8 text-secondary"/>, title: "2. Create Server", desc: "Deploy an enterprise-grade Minecraft server in Mumbai.", border: "border-secondary/50", bg: "bg-secondary/10", glow: "hover:shadow-secondary/20" },
               { icon: <ArrowUpCircle className="w-8 h-8 text-orange-500"/>, title: "3. Upgrade Resources", desc: "Spend credits to increase RAM for heavier modpacks.", border: "border-orange-500/50", bg: "bg-orange-500/10", glow: "hover:shadow-orange-500/20" },
               { icon: <Gamepad2 className="w-8 h-8 text-success"/>, title: "4. Keep Playing", desc: "As long as you stay active, your server stays online forever.", border: "border-success/50", bg: "bg-success/10", glow: "hover:shadow-success/20" },
             ].map((step, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 whileHover={{ y: -10, scale: 1.02 }}
                 className={`bg-card/80 backdrop-blur border ${step.border} rounded-2xl p-6 relative z-10 text-center transition-all duration-300 hover:shadow-2xl ${step.glow}`}
               >
                 <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 border ${step.border} ${step.bg}`}>
                   {step.icon}
                 </div>
                 <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                 <p className="text-foreground/60 text-sm">{step.desc}</p>
               </motion.div>
             ))}
          </motion.div>
        </div>
      </section>

      {/* Credit Economy Section */}
      <section className="w-full py-24 bg-card/30 border-y border-border/50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Coins className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Free Bucks Economy</h2>
            <p className="text-foreground/60 text-lg">We don't do hidden fees. You earn credits by engaging with the platform, and you spend those credits to keep your server online.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              className="bg-background/80 backdrop-blur border border-border/50 rounded-2xl p-8 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-success/20 transition-colors" />
              <h3 className="text-2xl font-bold mb-2">Claim Daily</h3>
              <p className="text-foreground/60 mb-6 relative z-10">Earn up to <strong className="text-foreground">35 Credits</strong> every single day completely for free. Log in, spin the wheel, and click claim.</p>
              <div className="flex justify-between items-end border-t border-border/50 pt-4 relative z-10">
                <span className="text-sm font-bold text-success">Daily Cap</span>
                <span className="text-xl font-black text-success">35 / 35</span>
              </div>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute bottom-0 left-0 h-1 bg-success" 
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              className="bg-background/90 backdrop-blur border border-secondary/50 rounded-2xl p-8 relative overflow-hidden z-10 shadow-[0_0_30px_rgba(0,170,170,0.1)] md:-translate-y-4 group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-secondary/30 transition-colors" />
              <h3 className="text-2xl font-bold mb-2 text-secondary">Keep Servers Running</h3>
              <p className="text-foreground/70 mb-6 relative z-10">Your credits are automatically deducted every hour your server is active. Stop the server to stop burning credits.</p>
              <div className="flex justify-between items-end border-t border-secondary/30 pt-4 relative z-10">
                <span className="text-sm font-bold text-secondary">Average Burn</span>
                <span className="text-xl font-black text-secondary">-3.0 / hr</span>
              </div>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.7 }}
                className="absolute bottom-0 left-0 h-1 bg-secondary" 
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              className="bg-background/80 backdrop-blur border border-border/50 rounded-2xl p-8 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors" />
              <h3 className="text-2xl font-bold mb-2">Upgrade Hardware</h3>
              <p className="text-foreground/60 mb-6 relative z-10">Playing a heavy modpack? Spend your saved up credits to dynamically allocate more RAM to your node instantly.</p>
              <div className="flex justify-between items-end border-t border-border/50 pt-4 relative z-10">
                <span className="text-sm font-bold text-primary">RAM Upgrade</span>
                <span className="text-xl font-black text-primary">+2 GB</span>
              </div>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.9 }}
                className="absolute bottom-0 left-0 h-1 bg-primary" 
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Daily Credit System */}
      <section className="w-full py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Master The Economy</h2>
            <p className="text-foreground/60 text-lg">You can earn up to 35 credits every day through various activities on the platform.</p>
          </div>

          <div className="max-w-4xl mx-auto bg-card border border-border/50 rounded-2xl p-8">
             <div className="flex justify-between items-end mb-4">
               <div>
                 <h3 className="text-2xl font-bold">Daily Earning Limit</h3>
                 <p className="text-foreground/60">Resets at midnight UTC</p>
               </div>
               <div className="text-3xl font-black text-success">35 Credits</div>
             </div>
             
             {/* Main Progress Bar */}
             <div className="w-full h-8 bg-background rounded-full border border-border/50 overflow-hidden flex mb-8">
               <div className="h-full bg-primary" style={{ width: '15%' }} title="Daily Spin (Up to 5.0)" />
               <div className="h-full bg-secondary" style={{ width: '40%' }} title="Hourly Claim (1.5/hr)" />
               <div className="h-full bg-purple-500" style={{ width: '25%' }} title="Referral Rewards (25/invite)" />
               <div className="h-full bg-orange-500" style={{ width: '20%' }} title="Vouchers (Varies)" />
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
               <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                 <div className="font-bold text-primary mb-1">Daily Spin</div>
                 <div className="text-sm text-foreground/70">Up to 5.0</div>
               </div>
               <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                 <div className="font-bold text-secondary mb-1">Hourly Claim</div>
                 <div className="text-sm text-foreground/70">1.5 / hr</div>
               </div>
               <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                 <div className="font-bold text-purple-400 mb-1">Referrals</div>
                 <div className="text-sm text-foreground/70">25 / invite</div>
               </div>
               <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                 <div className="font-bold text-orange-500 mb-1">Vouchers</div>
                 <div className="text-sm text-foreground/70">Variable</div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Server Plans Comparison */}
      <section className="w-full py-24 bg-card/10 border-y border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,85,255,0.05)_0%,transparent_70%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparent Server Pricing</h2>
            <p className="text-foreground/60 text-lg">No hidden dollar fees. Just straightforward hourly credit burn rates for your active servers.</p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { ram: "2GB", name: "Starter Node", cost: "1.5", color: "border-primary/50", headerBg: "bg-primary/10", shadow: "shadow-[0_0_30px_rgba(85,85,255,0.1)]" },
              { ram: "4GB", name: "Standard Node", cost: "3.0", color: "border-secondary/50", headerBg: "bg-secondary/10", shadow: "shadow-[0_0_30px_rgba(0,170,170,0.1)]" },
              { ram: "6GB", name: "Advanced Node", cost: "6.0", color: "border-orange-500/50", headerBg: "bg-orange-500/10", shadow: "shadow-[0_0_30px_rgba(249,115,22,0.1)]" },
              { ram: "8GB+", name: "Premium Node", cost: "Premium", color: "border-[#FFD700]/50", headerBg: "bg-[#FFD700]/10", isPremium: true, shadow: "shadow-[0_0_40px_rgba(255,215,0,0.15)]" },
            ].map((plan, i) => (
              <div key={i} className={`bg-background/80 backdrop-blur-md border ${plan.color} rounded-2xl overflow-hidden flex flex-col relative group transition-transform hover:-translate-y-2 ${plan.shadow}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className={`p-8 ${plan.headerBg} text-center border-b ${plan.color} relative`}>
                  <div className="absolute top-0 right-0 p-3 opacity-20"><Server className="w-8 h-8" /></div>
                  <h3 className="text-lg font-bold uppercase tracking-widest text-foreground/80 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-black">{plan.ram} <span className="text-lg font-bold text-foreground/50">RAM</span></div>
                </div>
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center relative z-10">
                  {plan.isPremium ? (
                    <div>
                      <Crown className="w-10 h-10 text-[#FFD700] mx-auto mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                      <div className="text-2xl font-black text-[#FFD700] mb-2 drop-shadow-xl">Purchase Via Discord</div>
                      <p className="text-sm text-foreground/60 font-medium">Unlock dedicated resources and bypass the queue entirely.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-end justify-center mb-2">
                        <div className="text-5xl font-black text-foreground">{plan.cost}</div>
                      </div>
                      <p className="text-sm text-foreground/60 font-black uppercase tracking-widest bg-foreground/5 py-1 px-3 rounded-full inline-block">Credits / Hour</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium India Hosting Visualization */}
      <section className="w-full py-32 bg-[#0A0A0A] relative overflow-hidden border-y border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,170,170,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, staggerChildren: 0.1 }}
              className="flex flex-col"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-flex items-center rounded-full bg-secondary/10 border border-secondary/30 px-3 py-1 text-sm font-bold text-secondary mb-6 w-fit shadow-[0_0_15px_rgba(0,170,170,0.2)]"
              >
                <MapPin className="w-4 h-4 mr-2" />
                MUMBAI DATACENTER
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black mb-6 leading-tight drop-shadow-xl"
              >
                Built For Indian <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-success">Minecraft Players</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-lg text-foreground/70 mb-10 leading-relaxed max-w-xl font-medium"
              >
                All Free Bucks servers are hosted locally in India to deliver lower latency, faster chunk loading, smoother gameplay, and better multiplayer performance for Indian players. Stop playing on laggy European nodes.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {[
                  "India Based Infrastructure",
                  "Low Latency Routing",
                  "Enterprise Hardware",
                  "DDoS Protection"
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 bg-black/40 border border-white/5 p-4 rounded-xl"
                  >
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="font-bold text-foreground/80">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            {/* Right: Premium Glowing India Map */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative w-full aspect-square max-w-lg mx-auto bg-card/10 backdrop-blur-3xl border border-secondary/20 rounded-3xl p-8 flex items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(0,170,170,0.1)] group"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_52%,rgba(0,170,170,0.25)_0%,transparent_60%)] group-hover:scale-110 transition-transform duration-1000" />
              
              <div className="relative w-full h-full">
                {/* Stylized Polygon Map of India */}
                <svg viewBox="0 0 400 400" className="w-full h-full text-foreground/10 absolute inset-0 drop-shadow-[0_0_25px_rgba(0,170,170,0.3)]">
                  {/* Outer Glow Path */}
                  <path 
                    d="M200,20 L230,50 L280,100 L340,120 L300,160 L260,220 L210,380 L150,280 L100,220 L40,180 L90,140 L130,150 L160,80 Z" 
                    stroke="rgba(0,170,170,0.2)" 
                    strokeWidth="8" 
                    strokeLinejoin="round"
                    fill="transparent"
                  />
                  {/* Solid Base */}
                  <path 
                    d="M200,20 L230,50 L280,100 L340,120 L300,160 L260,220 L210,380 L150,280 L100,220 L40,180 L90,140 L130,150 L160,80 Z" 
                    stroke="rgba(0,170,170,0.8)" 
                    strokeWidth="2" 
                    strokeLinejoin="round"
                    fill="currentColor"
                    className="opacity-40"
                  />
                  
                  {/* Animated Network Lines from Mumbai (112, 208) to other cities */}
                  <g stroke="rgba(0,170,170,0.8)" strokeWidth="3" strokeDasharray="8 8" fill="transparent">
                    {/* Mumbai to Delhi */}
                    <path d="M112,208 L192,112"><animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" /></path>
                    {/* Mumbai to Bangalore */}
                    <path d="M112,208 L168,300"><animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" /></path>
                    {/* Mumbai to Hyderabad */}
                    <path d="M112,208 L192,248"><animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" /></path>
                    {/* Mumbai to Chennai */}
                    <path d="M112,208 L220,288"><animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" /></path>
                  </g>

                  {/* Flow Particles */}
                  <g fill="#00FFFF">
                    <circle r="3"><animateMotion dur="2s" repeatCount="indefinite" path="M112,208 L192,112" /></circle>
                    <circle r="3"><animateMotion dur="2s" repeatCount="indefinite" path="M112,208 L168,300" /></circle>
                    <circle r="3"><animateMotion dur="2s" repeatCount="indefinite" path="M112,208 L192,248" /></circle>
                    <circle r="3"><animateMotion dur="2s" repeatCount="indefinite" path="M112,208 L220,288" /></circle>
                  </g>
                </svg>

                {/* Nodes & Badges */}
                {/* Mumbai (Core Node) */}
                <div className="absolute top-[52%] left-[28%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-24 h-24 border-2 border-secondary/50 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="absolute w-12 h-12 bg-secondary/40 rounded-full animate-ping" />
                    <div className="w-5 h-5 bg-secondary rounded-full shadow-[0_0_40px_#00AAAA] z-10 border-2 border-white" />
                  </div>
                </div>

                {/* Floating Badges */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[35%] left-[10%] bg-black/80 backdrop-blur-md border border-secondary/50 px-4 py-2 rounded-xl shadow-[0_10px_20px_rgba(0,170,170,0.2)] z-20"
                >
                  <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">MUMBAI NODE</div>
                  <div className="text-xl font-black text-white">20ms Ping</div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-[20%] right-[10%] bg-black/80 backdrop-blur-md border border-success/50 px-4 py-2 rounded-xl shadow-[0_10px_20px_rgba(0,170,0,0.2)] z-20 text-right"
                >
                  <div className="text-xs font-bold text-success uppercase tracking-wider mb-1">RELIABILITY</div>
                  <div className="text-xl font-black text-white">99.9% Uptime</div>
                </motion.div>

                {/* Minor City Nodes */}
                {[
                  { top: "28%", left: "48%" }, // Delhi
                  { top: "75%", left: "42%" }, // Bangalore
                  { top: "62%", left: "48%" }, // Hyderabad
                  { top: "72%", left: "55%" }, // Chennai
                ].map((pos, i) => (
                  <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ top: pos.top, left: pos.left }}>
                    <div className="w-3 h-3 bg-[#00FFFF] rounded-full shadow-[0_0_15px_#00FFFF] border border-white/50" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Free Bucks */}
      <section className="w-full py-24 bg-background border-t border-border/50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Free Bucks?</h2>
            <p className="text-foreground/60 text-lg">We've built the most transparent and fair free Minecraft hosting platform on the planet.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
             {[
               { icon: <Globe className="w-6 h-6"/>, title: "Free Forever", desc: "No hidden trials." },
               { icon: <Coins className="w-6 h-6"/>, title: "Daily Credits", desc: "Earn up to 35/day." },
               { icon: <CheckCircle2 className="w-6 h-6"/>, title: "Discord Login", desc: "No passwords." },
               { icon: <Ticket className="w-6 h-6"/>, title: "Voucher System", desc: "Promo drops." },
               { icon: <Users className="w-6 h-6"/>, title: "Referral Rewards", desc: "Earn 25 credits." },
               { icon: <Clock className="w-6 h-6"/>, title: "Queue Transparency", desc: "Live wait times." },
               { icon: <MapPin className="w-6 h-6"/>, title: "India Hosting", desc: "Sub 40ms ping." },
               { icon: <Shield className="w-6 h-6"/>, title: "DDoS Protection", desc: "1Tbps+ mitigation." },
               { icon: <HardDrive className="w-6 h-6"/>, title: "NVMe SSD", desc: "Blazing fast I/O." },
               { icon: <Target className="w-6 h-6"/>, title: "Automatic Backups", desc: "Daily snapshots." },
             ].map((feature, i) => (
               <div key={i} className="bg-card border border-border/50 rounded-xl p-6 text-center hover:bg-foreground/5 transition-colors">
                 <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                   {feature.icon}
                 </div>
                 <h3 className="font-bold mb-1">{feature.title}</h3>
                 <p className="text-xs text-foreground/60">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Premium Benefits */}
      <section className="w-full py-32 bg-black border-y border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#FFD700]/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Crown className="w-16 h-16 text-[#FFD700] mb-6 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Skip the line with <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFA500] drop-shadow-lg">Premium Membership</span></h2>
              <p className="text-foreground/70 text-lg mb-10 max-w-lg font-medium leading-relaxed">Want to support the project and get exclusive perks? Upgrade your account to bypass all queues and unlock dedicated enterprise hardware.</p>
              
              <ul className="space-y-6 mb-8">
                {[
                  { title: "Priority Queue Bypass", desc: "Never wait in line. Start your server instantly." },
                  { title: "No Dashboard Advertisements", desc: "Enjoy a completely ad-free panel experience." },
                  { title: "8GB+ Premium Servers", desc: "Unlock dedicated nodes for heavy modpacks." },
                  { title: "Premium Discord Role", desc: "Get access to exclusive giveaways and support." }
                ].map((perk, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 bg-success/20 p-1 rounded-full"><Check className="w-5 h-5 text-success" /></div>
                    <div>
                      <div className="font-bold text-lg">{perk.title}</div>
                      <div className="text-sm text-foreground/60">{perk.desc}</div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-square md:aspect-[4/3] lg:aspect-square bg-black/50 backdrop-blur-3xl border border-[#FFD700]/30 rounded-3xl p-8 flex items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(255,215,0,0.15)] group"
            >
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.15)_0%,transparent_70%)] group-hover:scale-110 transition-transform duration-1000" />
               
               {/* Animated Glowing Border */}
               <div className="absolute inset-0 rounded-3xl border-2 border-transparent" style={{ backgroundImage: "linear-gradient(#000, #000), linear-gradient(to right, #FFD700, #FFA500, #FFD700)", backgroundOrigin: "border-box", backgroundClip: "content-box, border-box", opacity: 0.5 }} />

               <div className="relative text-center w-full max-w-sm z-10">
                 <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 mx-auto bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 border border-[#FFD700]/50 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                 >
                   <Crown className="w-12 h-12 text-[#FFD700]" />
                 </motion.div>

                 <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 mb-2">VIP STATUS</div>
                 <div className="text-[#FFD700] font-bold tracking-widest uppercase mb-10 text-sm">Exclusive Membership</div>
                 
                 <div className="space-y-4">
                   <Link href="https://discord.com" target="_blank" className="block">
                     <Button size="lg" className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-black h-16 text-lg shadow-[0_10px_30px_rgba(255,215,0,0.3)] transition-transform hover:scale-105 border-0">
                       Upgrade Via Discord
                     </Button>
                   </Link>
                   <p className="text-xs text-foreground/50 font-medium">Automatic instant activation upon purchase.</p>
                 </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="w-full py-32 bg-[#5865F2] text-white relative overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <svg className="absolute w-full h-full opacity-20">
              <g fill="#FFFFFF">
                {[...Array(20)].map((_, i) => (
                  <motion.circle 
                    key={i} 
                    r={Math.random() * 3 + 1} 
                    initial={{ 
                      cx: `${Math.random() * 100}%`, 
                      cy: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5 + 0.1
                    }}
                    animate={{ 
                      cy: [`${Math.random() * 100}%`, `-10%`],
                    }}
                    transition={{ 
                      duration: Math.random() * 10 + 10, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                  />
                ))}
              </g>
           </svg>
        </div>
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform -rotate-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#5865F2" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-xl">Join 85,000+ Players</h2>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
               <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full font-bold backdrop-blur-md border border-white/20">
                 <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                 12,492 Online Right Now
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full font-bold backdrop-blur-md border border-white/20">
                 <Globe className="w-4 h-4 text-blue-300" />
                 Global Community
               </div>
            </div>

            <p className="text-white/90 text-xl font-medium mb-12 max-w-2xl leading-relaxed">
              Our Discord is the heart of Free Bucks. Get 24/7 support, claim exclusive massive voucher drops, and find new friends to play Minecraft with.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
              <Link href="https://discord.com" target="_blank" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-white text-[#5865F2] hover:bg-white/90 h-16 px-10 text-xl font-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform hover:scale-105 border-0 rounded-xl">
                  Join Discord Server
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-black/30 hover:bg-black/50 text-white h-16 px-10 text-lg font-bold border border-white/20 backdrop-blur-md rounded-xl transition-all">
                  Claim Vouchers
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Referrals & Vouchers */}
      <section className="w-full py-24 bg-card/10 border-y border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiM1NTU1RkYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 z-0 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-background/80 backdrop-blur-md border border-secondary/30 rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden shadow-[0_0_40px_rgba(0,170,170,0.1)] group">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
              <Users className="w-16 h-16 mx-auto text-secondary mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(0,170,170,0.5)]" />
              <h2 className="text-4xl font-black mb-4 relative z-10">Refer & Earn</h2>
              <p className="text-foreground/70 mb-10 max-w-sm mx-auto relative z-10 text-lg font-medium">Invite your friends to Free Bucks and both of you will get rewarded instantly.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                <div className="bg-secondary/10 border border-secondary/50 px-6 py-4 rounded-2xl">
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">You Earn</div>
                  <div className="text-3xl font-black text-white">25 <span className="text-lg">Credits</span></div>
                </div>
                <ArrowRight className="hidden sm:block w-8 h-8 text-foreground/30 animate-pulse" />
                <div className="bg-success/10 border border-success/50 px-6 py-4 rounded-2xl">
                  <div className="text-xs font-bold uppercase tracking-widest text-success mb-1">Friend Gets</div>
                  <div className="text-3xl font-black text-white">50 <span className="text-lg">Credits</span></div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/80 backdrop-blur-md border border-purple-500/30 rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.1)] group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-primary to-secondary" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
              <Ticket className="w-16 h-16 mx-auto text-purple-500 mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              <h2 className="text-4xl font-black mb-4 relative z-10">Promo Vouchers</h2>
              <p className="text-foreground/70 mb-10 max-w-sm mx-auto relative z-10 text-lg font-medium">We drop massive voucher codes on our Discord and Twitter. Claim them in the dashboard.</p>
              
              <div className="bg-black/50 border border-purple-500/50 rounded-xl p-6 relative z-10 inline-block w-full max-w-xs shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Example Code</div>
                <div className="font-mono font-black tracking-widest text-2xl text-white">
                  DISCORD10K
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="w-full py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Rocket className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Project Roadmap</h2>
            <p className="text-foreground/60 text-lg">See where Free Bucks is heading in the future.</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-border/50 -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { phase: "Phase 1", title: "Free Servers", desc: "Launch core credit economy and Mumbai nodes.", status: "Complete", color: "bg-success", border: "border-success/50" },
                { phase: "Phase 2", title: "Premium Nodes", desc: "Introduce VIP priority queue and 8GB+ servers.", status: "In Progress", color: "bg-primary", border: "border-primary/50" },
                { phase: "Phase 3", title: "More India Locations", desc: "Expand to Delhi and Bangalore for better latency.", status: "Upcoming", color: "bg-card border-border/50", border: "border-border/50" },
                { phase: "Phase 4", title: "Global Expansion", desc: "Deploy free nodes in Europe and North America.", status: "Upcoming", color: "bg-card border-border/50", border: "border-border/50" },
              ].map((step, i) => (
                <div key={i} className={`bg-background border ${step.border} rounded-2xl p-6 text-center relative`}>
                  <div className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2">{step.phase}</div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-foreground/60 mb-6">{step.desc}</p>
                  <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full inline-block ${
                    step.status === 'Complete' ? 'bg-success/20 text-success' :
                    step.status === 'In Progress' ? 'bg-primary/20 text-primary' :
                    'bg-foreground/10 text-foreground/50'
                  }`}>
                    {step.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-24 bg-card/30 border-t border-border/50 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <HelpCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-foreground/60 text-lg">Everything you need to know about Free Bucks Minecraft Hosting.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: "What is Free Bucks?", a: "Free Bucks is a premium Minecraft hosting platform powered by an internal credit economy. You earn credits for free and spend them to keep your server online." },
              { q: "How do I earn credits?", a: "You can earn credits by claiming your daily spin, collecting hourly rewards, referring friends (25 credits per invite), or redeeming promo vouchers from our Discord." },
              { q: "What is the daily credit limit?", a: "Free users can earn a maximum of 35 credits per day. This resets every day at midnight UTC." },
              { q: "How long can I keep my server?", a: "Forever! As long as you maintain a positive credit balance, your server will stay online and your data will remain safe." },
              { q: "Why am I in a queue?", a: "To ensure fair performance for everyone on our free tier, server startups are placed in a queue during peak hours. You can see your exact position and estimated wait time." },
              { q: "How do I skip the queue?", a: "You can purchase a Premium tier via our Discord ticket system. Premium users completely bypass the queue and get instant server starts." },
              { q: "How does the referral system work?", a: "Share your unique referral link. When a friend joins and plays for 24 hours, you receive 25 credits and they receive 50 credits to help them get started." },
              { q: "Where do I claim vouchers?", a: "Voucher codes are dropped randomly on our Discord announcements and Twitter. You can redeem them in the Vouchers tab on your dashboard." },
              { q: "Can I upgrade my server RAM?", a: "Yes! If you have enough credits, you can seamlessly upgrade your server from 2GB up to 6GB RAM. Upgrades take effect upon restarting the server." },
              { q: "Is there a catch?", a: "No catch. The platform is supported by community donations and premium VIP upgrades, which allows us to provide powerful free hardware to everyone else." }
            ].map((faq, i) => (
              <details key={i} className="group bg-background border border-border/50 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 font-bold cursor-pointer hover:bg-foreground/5 transition-colors">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-foreground/50 transition-transform group-open:-rotate-180" />
                </summary>
                <div className="p-6 pt-0 text-foreground/70 border-t border-border/10">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
