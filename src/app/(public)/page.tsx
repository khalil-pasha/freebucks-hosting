"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Server, Shield, Zap, Coins, Clock, MapPin, Users, Ticket, CheckCircle2, Gamepad2, ArrowUpCircle, PlayCircle, HardDrive, Globe, Star, Target, Check, HelpCircle, ChevronDown, Rocket, Crown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center relative bg-[#050505] selection:bg-primary/30 selection:text-primary-foreground">
      
      {/* Premium Minecraft-inspired ambient grid & voxel background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgzMnYzMkgwem0zMiAzMmgzMnYzMkgzMnoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSIvPjxwYXRoIGQ9Ik0wIDMySDMyVjY0SDB6bTMyLTMySDY0VjMySDMyWiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjAwNSIvPjwvc3ZnPg==')] opacity-[0.15] z-0 pointer-events-none fixed" />

      {/* Hero Section */}
      <section className="w-full pt-40 pb-24 md:pt-56 md:pb-32 flex items-center justify-center relative overflow-hidden z-10 border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(85,85,255,0.15)_0%,transparent_50%)] pointer-events-none" 
        />
        
        {/* Floating Voxel Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`voxel-${i}`}
              animate={{ y: [-20, 20, -20], rotate: [0, 90, 180] }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
              className="absolute w-12 h-12 border border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-sm"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
                opacity: 0.3 + (i % 3) * 0.1
              }}
            />
          ))}
        </div>

        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Left: Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-start text-left lg:col-span-6 xl:col-span-5"
            >
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-10 shadow-[0_0_20px_rgba(85,85,255,0.15)] backdrop-blur-md">
                <span className="flex h-2 w-2 bg-primary mr-2 rounded-full animate-pulse shadow-[0_0_10px_#5555FF]"></span>
                Premium India Nodes Now Available
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter mb-8 leading-[1.05] text-white">
                Free Minecraft Hosting <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-success">Powered By Credits</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/50 mb-12 leading-relaxed font-medium max-w-xl">
                Claim credits daily, create Minecraft servers, upgrade resources, and play without paying. Experience enterprise-grade hosting entirely for free.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
                <Link href="https://api.freebucks.host/auth/discord" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-16 px-10 text-lg bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-[0_0_30px_rgba(88,101,242,0.3)] hover:shadow-[0_0_40px_rgba(88,101,242,0.5)] rounded-xl font-bold border-0 transition-all duration-300 hover:-translate-y-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="mr-3">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                    </svg>
                    Discord Login
                  </Button>
                </Link>
                <Link href="/pricing" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-16 px-10 text-lg border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md rounded-xl font-bold transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
                    View Pricing <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Dashboard Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateX: 10, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative hidden lg:block lg:col-span-6 xl:col-span-7 perspective-[2000px]"
            >
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-full transform-gpu rotate-y-[-5deg] rotate-x-[5deg]"
              >
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 via-secondary/20 to-success/30 rounded-3xl blur-3xl opacity-50 pointer-events-none" />
                <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  {/* Mockup Header */}
                  <div className="h-12 bg-[#111] flex items-center px-6 border-b border-white/5 gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-red-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-yellow-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-success transition-colors" />
                    <div className="mx-auto text-xs font-mono text-white/30 tracking-widest uppercase">panel.freebucks.com</div>
                  </div>
                  {/* Mockup Content */}
                  <div className="p-8 space-y-6">
                     <div className="flex justify-between items-center bg-white/5 p-5 rounded-xl border border-white/5 backdrop-blur-md">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-lg bg-success/20 border border-success/30 flex items-center justify-center">
                           <Server className="w-6 h-6 text-success"/>
                         </div>
                         <div>
                           <h3 className="font-black text-white text-lg tracking-wide">Survival SMP</h3>
                           <p className="text-xs text-white/40 font-mono mt-1">mumbai-node-03.freebucks.gg</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <div className="text-xs font-black text-success bg-success/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-success/20">ONLINE</div>
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                       <div className="bg-white/5 p-6 rounded-xl border border-white/5 relative overflow-hidden group hover:bg-white/10 transition-colors cursor-default">
                         <div className="text-xs text-white/40 mb-3 font-bold uppercase tracking-widest">CPU USAGE</div>
                         <div className="text-3xl font-black text-white group-hover:text-primary transition-colors">42%</div>
                         <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-primary/10 to-transparent flex items-end justify-between px-2 gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                            {[30, 45, 25, 60, 42, 38, 55, 42].map((h, i) => (
                              <motion.div key={i} className="w-full bg-primary/50 rounded-t-sm" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: 0.5 + (i * 0.1) }} />
                            ))}
                         </div>
                       </div>
                       
                       <div className="bg-white/5 p-6 rounded-xl border border-white/5 relative overflow-hidden group hover:bg-white/10 transition-colors cursor-default">
                         <div className="text-xs text-white/40 mb-3 font-bold uppercase tracking-widest">RAM USAGE</div>
                         <div className="text-3xl font-black text-white group-hover:text-secondary transition-colors">3.2 <span className="text-lg text-white/50">/ 6 GB</span></div>
                         <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-secondary/10 to-transparent flex items-end justify-between px-2 gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                            {[50, 52, 48, 55, 60, 58, 55, 52].map((h, i) => (
                              <motion.div key={i} className="w-full bg-secondary/50 rounded-t-sm" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: 0.5 + (i * 0.1) }} />
                            ))}
                         </div>
                       </div>
                     </div>

                     <div className="bg-white/5 p-6 rounded-xl border border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="p-3 bg-white/5 rounded-lg">
                           <Users className="w-6 h-6 text-white/60" />
                         </div>
                         <div className="text-base font-bold text-white uppercase tracking-wide">Players Online</div>
                       </div>
                       <div className="font-mono text-2xl font-black text-white">24 <span className="text-white/30 text-lg">/ 50</span></div>
                     </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-24 bg-[#0A0A0A] border-b border-white/5 relative z-20">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {[
              { label: "Registered Users", value: "85,241", color: "from-primary" },
              { label: "Active Servers", value: "12,405", color: "from-secondary" },
              { label: "Credits Distributed", value: "2.5M+", color: "from-success" },
              { label: "Global Uptime", value: "99.9%", color: "from-purple-500" }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative group bg-[#111] border border-white/5 p-10 rounded-2xl overflow-hidden hover:bg-[#151515] transition-all duration-300"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color} to-transparent opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">{stat.value}</div>
                <div className="text-sm md:text-base text-white/40 uppercase tracking-widest font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How Free Bucks Works */}
      <section className="w-full py-32 relative overflow-hidden bg-[#050505]">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/70 mb-6">Simple Process</div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight">How Free Bucks Works</h2>
            <p className="text-white/50 text-xl font-medium leading-relaxed">Four simple steps to host your own enterprise-grade Minecraft server without spending a single dime.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
             <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-primary via-secondary to-success -translate-y-1/2 z-0 opacity-20" />
             
             {[
               { icon: <Coins className="w-10 h-10 text-primary"/>, title: "1. Claim Credits", desc: "Log in daily and claim your free credits from the dashboard.", border: "border-primary/30", bg: "bg-primary/5", glow: "hover:shadow-[0_0_40px_rgba(85,85,255,0.15)]" },
               { icon: <Server className="w-10 h-10 text-secondary"/>, title: "2. Create Server", desc: "Deploy an enterprise-grade Minecraft server in Mumbai.", border: "border-secondary/30", bg: "bg-secondary/5", glow: "hover:shadow-[0_0_40px_rgba(0,170,170,0.15)]" },
               { icon: <ArrowUpCircle className="w-10 h-10 text-orange-500"/>, title: "3. Upgrade Resources", desc: "Spend credits to increase RAM for heavier modpacks.", border: "border-orange-500/30", bg: "bg-orange-500/5", glow: "hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]" },
               { icon: <Gamepad2 className="w-10 h-10 text-success"/>, title: "4. Keep Playing", desc: "As long as you stay active, your server stays online forever.", border: "border-success/30", bg: "bg-success/5", glow: "hover:shadow-[0_0_40px_rgba(0,170,0,0.15)]" },
             ].map((step, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.15, duration: 0.5 }}
                 className={`h-full flex flex-col bg-[#0A0A0A] border ${step.border} rounded-3xl p-10 relative z-10 transition-all duration-500 hover:-translate-y-2 ${step.glow} group`}
               >
                 <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 border border-white/10 ${step.bg} group-hover:scale-110 transition-transform duration-500`}>
                   {step.icon}
                 </div>
                 <h3 className="text-2xl font-black mb-4 text-white">{step.title}</h3>
                 <p className="text-white/50 text-base font-medium leading-relaxed">{step.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Credit Economy Section */}
      <section className="w-full py-32 bg-[#0A0A0A] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <Coins className="w-16 h-16 text-secondary mx-auto mb-6 drop-shadow-[0_0_20px_rgba(0,170,170,0.4)]" />
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight">The Free Bucks Economy</h2>
            <p className="text-white/50 text-xl font-medium leading-relaxed">We don't do hidden fees. You earn credits by engaging with the platform, and you spend those credits to keep your server online.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-[#111] border border-white/5 rounded-3xl p-10 relative overflow-hidden group hover:border-success/30 transition-colors h-full flex flex-col"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-success/20 transition-colors" />
              <h3 className="text-3xl font-black mb-4 text-white">Claim Daily</h3>
              <p className="text-white/50 text-lg font-medium mb-10 flex-grow relative z-10">Earn up to <strong className="text-white">35 Credits</strong> every single day completely for free. Log in, spin the wheel, and click claim.</p>
              <div className="flex justify-between items-end border-t border-white/10 pt-6 relative z-10">
                <span className="text-sm font-bold text-success uppercase tracking-widest">Daily Cap</span>
                <span className="text-3xl font-black text-success">35 / 35</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-[#161616] border border-secondary/40 rounded-3xl p-10 relative overflow-hidden group hover:border-secondary transition-colors md:-translate-y-6 shadow-[0_20px_50px_rgba(0,170,170,0.1)] h-full flex flex-col z-10"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-secondary/20 transition-colors" />
              <h3 className="text-3xl font-black mb-4 text-secondary">Keep Servers Running</h3>
              <p className="text-white/60 text-lg font-medium mb-10 flex-grow relative z-10">Your credits are automatically deducted every hour your server is active. Stop the server to stop burning credits.</p>
              <div className="flex justify-between items-end border-t border-white/10 pt-6 relative z-10">
                <span className="text-sm font-bold text-secondary uppercase tracking-widest">Average Burn</span>
                <span className="text-3xl font-black text-secondary">-3.0 / hr</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-[#111] border border-white/5 rounded-3xl p-10 relative overflow-hidden group hover:border-primary/30 transition-colors h-full flex flex-col"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors" />
              <h3 className="text-3xl font-black mb-4 text-white">Upgrade Hardware</h3>
              <p className="text-white/50 text-lg font-medium mb-10 flex-grow relative z-10">Playing a heavy modpack? Spend your saved up credits to dynamically allocate more RAM to your node instantly.</p>
              <div className="flex justify-between items-end border-t border-white/10 pt-6 relative z-10">
                <span className="text-sm font-bold text-primary uppercase tracking-widest">RAM Upgrade</span>
                <span className="text-3xl font-black text-primary">+2 GB</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Daily Credit System */}
      <section className="w-full py-32 bg-[#050505] relative overflow-hidden">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight">Master The Economy</h2>
            <p className="text-white/50 text-xl font-medium leading-relaxed">You can earn up to 35 credits every day through various activities on the platform.</p>
          </div>

          <div className="max-w-5xl mx-auto bg-[#0A0A0A] border border-white/10 rounded-3xl p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
               <div>
                 <h3 className="text-3xl font-black text-white mb-2">Daily Earning Limit</h3>
                 <p className="text-white/40 font-medium">Resets at midnight UTC</p>
               </div>
               <div className="text-5xl font-black text-success drop-shadow-[0_0_15px_rgba(0,170,0,0.3)]">35 Credits</div>
             </div>
             
             {/* Dashboard-style Progress Bar */}
             <div className="w-full h-10 bg-[#111] rounded-full border border-white/5 overflow-hidden flex mb-12 shadow-inner">
               <div className="h-full bg-primary hover:brightness-110 transition-all cursor-help" style={{ width: '15%' }} title="Daily Spin (Up to 5.0)" />
               <div className="h-full bg-secondary hover:brightness-110 transition-all cursor-help" style={{ width: '40%' }} title="Hourly Claim (1.5/hr)" />
               <div className="h-full bg-purple-500 hover:brightness-110 transition-all cursor-help" style={{ width: '25%' }} title="Referral Rewards (25/invite)" />
               <div className="h-full bg-orange-500 hover:brightness-110 transition-all cursor-help" style={{ width: '20%' }} title="Vouchers (Varies)" />
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-primary/30 transition-colors text-center">
                 <div className="font-bold text-primary mb-2 uppercase tracking-widest text-sm">Daily Spin</div>
                 <div className="text-2xl font-black text-white">Up to 5.0</div>
               </div>
               <div className="p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-secondary/30 transition-colors text-center">
                 <div className="font-bold text-secondary mb-2 uppercase tracking-widest text-sm">Hourly Claim</div>
                 <div className="text-2xl font-black text-white">1.5 <span className="text-sm text-white/40">/ hr</span></div>
               </div>
               <div className="p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-purple-500/30 transition-colors text-center">
                 <div className="font-bold text-purple-400 mb-2 uppercase tracking-widest text-sm">Referrals</div>
                 <div className="text-2xl font-black text-white">25 <span className="text-sm text-white/40">/ invite</span></div>
               </div>
               <div className="p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-orange-500/30 transition-colors text-center">
                 <div className="font-bold text-orange-500 mb-2 uppercase tracking-widest text-sm">Vouchers</div>
                 <div className="text-2xl font-black text-white">Variable</div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Server Plans Comparison */}
      <section className="w-full py-32 bg-[#0A0A0A] border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,85,255,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight">Transparent Server Pricing</h2>
            <p className="text-white/50 text-xl font-medium leading-relaxed">No hidden dollar fees. Just straightforward hourly credit burn rates for your active servers.</p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {[
              { ram: "2GB", name: "Starter Node", cost: "1.5", color: "border-primary/30", headerBg: "bg-primary/5", glow: "hover:shadow-[0_0_40px_rgba(85,85,255,0.1)]" },
              { ram: "4GB", name: "Standard Node", cost: "3.0", color: "border-secondary/30", headerBg: "bg-secondary/5", glow: "hover:shadow-[0_0_40px_rgba(0,170,170,0.1)]" },
              { ram: "6GB", name: "Advanced Node", cost: "6.0", color: "border-orange-500/30", headerBg: "bg-orange-500/5", glow: "hover:shadow-[0_0_40px_rgba(249,115,22,0.1)]" },
              { ram: "8GB+", name: "Premium Node", cost: "Premium", color: "border-[#FFD700]/50", headerBg: "bg-[#FFD700]/10", isPremium: true, glow: "shadow-[0_0_50px_rgba(255,215,0,0.15)] scale-105 z-10" },
            ].map((plan, i) => (
              <div key={i} className={`bg-[#050505] border ${plan.color} rounded-3xl overflow-hidden flex flex-col relative transition-transform duration-300 ${plan.isPremium ? '' : 'hover:-translate-y-2'} ${plan.glow}`}>
                <div className={`p-10 ${plan.headerBg} text-center border-b ${plan.color} relative`}>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-3">{plan.name}</h3>
                  <div className="text-5xl font-black text-white">{plan.ram} <span className="text-2xl font-bold text-white/30">RAM</span></div>
                </div>
                <div className="p-10 flex-1 flex flex-col items-center justify-center text-center relative bg-gradient-to-b from-[#111] to-[#050505]">
                  {plan.isPremium ? (
                     <div className="flex flex-col h-full justify-center">
                       <Crown className="w-14 h-14 text-[#FFD700] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]" />
                       <div className="text-2xl font-black text-[#FFD700] mb-4">Purchase Via Discord</div>
                       <p className="text-sm text-white/60 font-medium">Unlock dedicated resources and bypass the queue entirely.</p>
                     </div>
                  ) : (
                    <div className="flex flex-col h-full justify-center">
                      <div className="text-6xl font-black text-white mb-4">{plan.cost}</div>
                      <p className="text-sm text-white/40 font-bold uppercase tracking-widest">Credits / Hour</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium India Hosting Visualization */}
      <section className="w-full py-32 bg-[#050505] relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,170,170,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="flex flex-col"
            >
              <div className="inline-flex items-center rounded-full bg-secondary/10 border border-secondary/30 px-4 py-2 text-sm font-bold tracking-wider uppercase text-secondary mb-8 w-fit">
                <MapPin className="w-4 h-4 mr-3" />
                Mumbai Datacenter
              </div>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] text-white tracking-tight">
                Built For Indian <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-success">Minecraft Players</span>
              </h2>
              
              <p className="text-xl text-white/50 mb-12 leading-relaxed max-w-xl font-medium">
                All Free Bucks servers are hosted locally in India to deliver lower latency, faster chunk loading, smoother gameplay, and better multiplayer performance for Indian players. Stop playing on laggy European nodes.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "India Based Infrastructure",
                  "Low Latency Routing",
                  "Enterprise Hardware",
                  "DDoS Protection"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 bg-[#111] border border-white/5 p-5 rounded-2xl">
                    <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                    <span className="font-bold text-white tracking-wide">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
              className="relative w-full aspect-square max-w-2xl mx-auto bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-10 flex items-center justify-center overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_52%,rgba(0,170,170,0.15)_0%,transparent_60%)]" />
              
              <div className="relative w-full h-full">
                <svg viewBox="0 0 400 400" className="w-full h-full text-white/5 absolute inset-0">
                  <path d="M200,20 L230,50 L280,100 L340,120 L300,160 L260,220 L210,380 L150,280 L100,220 L40,180 L90,140 L130,150 L160,80 Z" stroke="rgba(0,170,170,0.2)" strokeWidth="8" strokeLinejoin="round" fill="transparent" />
                  <path d="M200,20 L230,50 L280,100 L340,120 L300,160 L260,220 L210,380 L150,280 L100,220 L40,180 L90,140 L130,150 L160,80 Z" stroke="rgba(0,170,170,0.8)" strokeWidth="2" strokeLinejoin="round" fill="currentColor" className="opacity-20" />
                  
                  <g stroke="rgba(0,170,170,0.5)" strokeWidth="3" strokeDasharray="8 8" fill="transparent">
                    <path d="M112,208 L192,112"><animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" /></path>
                    <path d="M112,208 L168,300"><animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" /></path>
                    <path d="M112,208 L192,248"><animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" /></path>
                    <path d="M112,208 L220,288"><animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" /></path>
                  </g>

                  <g fill="#00FFFF">
                    <circle r="3"><animateMotion dur="2s" repeatCount="indefinite" path="M112,208 L192,112" /></circle>
                    <circle r="3"><animateMotion dur="2s" repeatCount="indefinite" path="M112,208 L168,300" /></circle>
                    <circle r="3"><animateMotion dur="2s" repeatCount="indefinite" path="M112,208 L192,248" /></circle>
                    <circle r="3"><animateMotion dur="2s" repeatCount="indefinite" path="M112,208 L220,288" /></circle>
                  </g>
                </svg>

                <div className="absolute top-[52%] left-[28%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-32 h-32 border-2 border-secondary/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute w-16 h-16 bg-secondary/30 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="w-6 h-6 bg-secondary rounded-full shadow-[0_0_50px_#00AAAA] border-[3px] border-white" />
                  </div>
                </div>

                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[30%] left-[5%] bg-[#050505] border border-secondary/30 px-6 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,170,170,0.2)] z-20">
                  <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">MUMBAI NODE</div>
                  <div className="text-3xl font-black text-white">20ms Ping</div>
                </motion.div>

                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[20%] right-[5%] bg-[#050505] border border-success/30 px-6 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,170,0,0.2)] z-20 text-right">
                  <div className="text-xs font-bold text-success uppercase tracking-widest mb-2">RELIABILITY</div>
                  <div className="text-3xl font-black text-white">99.9% Uptime</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Free Bucks */}
      <section className="w-full py-32 bg-[#0A0A0A] border-b border-white/5 relative overflow-hidden">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight">Why Free Bucks?</h2>
            <p className="text-white/50 text-xl font-medium leading-relaxed">We've built the most transparent and fair free Minecraft hosting platform on the planet.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
             {[
               { icon: <Globe className="w-8 h-8"/>, title: "Free Forever", desc: "No hidden trials." },
               { icon: <Coins className="w-8 h-8"/>, title: "Daily Credits", desc: "Earn up to 35/day." },
               { icon: <CheckCircle2 className="w-8 h-8"/>, title: "Discord Login", desc: "No passwords." },
               { icon: <Ticket className="w-8 h-8"/>, title: "Voucher System", desc: "Promo drops." },
               { icon: <Users className="w-8 h-8"/>, title: "Referral Rewards", desc: "Earn 25 credits." },
               { icon: <Clock className="w-8 h-8"/>, title: "Queue Transparency", desc: "Live wait times." },
               { icon: <MapPin className="w-8 h-8"/>, title: "India Hosting", desc: "Sub 40ms ping." },
               { icon: <Shield className="w-8 h-8"/>, title: "DDoS Protection", desc: "1Tbps+ mitigation." },
               { icon: <HardDrive className="w-8 h-8"/>, title: "NVMe SSD", desc: "Blazing fast I/O." },
               { icon: <Target className="w-8 h-8"/>, title: "Automatic Backups", desc: "Daily snapshots." },
             ].map((feature, i) => (
               <div key={i} className="h-full flex flex-col items-center bg-[#111] border border-white/5 rounded-3xl p-8 text-center hover:bg-white/5 transition-colors group">
                 <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                   {feature.icon}
                 </div>
                 <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                 <p className="text-sm text-white/50 font-medium">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Premium Benefits */}
      <section className="w-full py-40 bg-[#050505] border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32 items-center">
            
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 px-4 py-2 text-sm font-bold tracking-wider uppercase text-[#FFD700] mb-8">
                <Crown className="w-4 h-4 mr-3" /> Exclusive Perks
              </div>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] text-white tracking-tight">
                Skip the line with <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFA500] drop-shadow-xl">Premium Membership</span>
              </h2>
              
              <p className="text-xl text-white/50 mb-12 max-w-xl font-medium leading-relaxed">
                Want to support the project and get exclusive perks? Upgrade your account to bypass all queues and unlock dedicated enterprise hardware.
              </p>
              
              <ul className="space-y-8 mb-10">
                {[
                  { title: "Priority Queue Bypass", desc: "Never wait in line. Start your server instantly." },
                  { title: "No Dashboard Advertisements", desc: "Enjoy a completely ad-free panel experience." },
                  { title: "8GB+ Premium Servers", desc: "Unlock dedicated nodes for heavy modpacks." },
                  { title: "Premium Discord Role", desc: "Get access to exclusive giveaways and support." }
                ].map((perk, i) => (
                  <li key={i} className="flex items-start gap-6 bg-[#111] p-6 rounded-2xl border border-white/5">
                    <div className="bg-success/20 p-2 rounded-xl border border-success/30 flex-shrink-0"><Check className="w-6 h-6 text-success" /></div>
                    <div>
                      <div className="font-bold text-xl text-white mb-2">{perk.title}</div>
                      <div className="text-base text-white/50 font-medium">{perk.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
              className="relative w-full max-w-lg mx-auto aspect-[4/5] bg-[#0A0A0A] border border-[#FFD700]/20 rounded-[3rem] p-12 flex items-center justify-center overflow-hidden shadow-[0_40px_80px_rgba(255,215,0,0.1)] group"
            >
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.1)_0%,transparent_70%)] group-hover:scale-110 transition-transform duration-1000" />
               <div className="absolute inset-0 rounded-[3rem] border-2 border-transparent" style={{ backgroundImage: "linear-gradient(#0A0A0A, #0A0A0A), linear-gradient(to bottom right, #FFD700, #FFA500, transparent, #FFD700)", backgroundOrigin: "border-box", backgroundClip: "content-box, border-box", opacity: 0.5 }} />

               <div className="relative text-center w-full z-10 flex flex-col h-full justify-center">
                 <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-32 h-32 mx-auto bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 border border-[#FFD700]/40 rounded-3xl flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(255,215,0,0.3)]">
                   <Crown className="w-16 h-16 text-[#FFD700]" />
                 </motion.div>

                 <div className="text-6xl font-black text-white mb-4 tracking-tight">VIP STATUS</div>
                 <div className="text-[#FFD700] font-bold tracking-widest uppercase mb-12 text-sm bg-[#FFD700]/10 py-2 px-4 rounded-full inline-block mx-auto border border-[#FFD700]/20">Exclusive Membership</div>
                 
                 <div className="space-y-6 mt-auto">
                   <Link href="https://discord.com" target="_blank" className="block w-full">
                     <Button size="lg" className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-black h-20 text-xl rounded-2xl shadow-[0_20px_40px_rgba(255,215,0,0.3)] transition-transform hover:-translate-y-2 border-0">
                       Upgrade Via Discord
                     </Button>
                   </Link>
                   <p className="text-sm text-white/40 font-medium">Automatic instant activation upon purchase.</p>
                 </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Section CTA Banner */}
      <section className="w-full py-32 bg-[#0A0A0A] border-b border-white/5">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="w-full rounded-[3rem] bg-gradient-to-br from-[#5865F2] to-[#4752C4] relative overflow-hidden p-12 md:p-24 text-center shadow-[0_30px_60px_rgba(88,101,242,0.3)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform -rotate-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#5865F2" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" /></svg>
              </div>

              <h2 className="text-5xl md:text-7xl font-black mb-8 text-white tracking-tight">Join 85,000+ Players</h2>
              
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                 <div className="flex items-center gap-3 px-6 py-3 bg-black/20 rounded-full font-bold backdrop-blur-md border border-white/20 text-white">
                   <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                   12,492 Online Right Now
                 </div>
                 <div className="flex items-center gap-3 px-6 py-3 bg-black/20 rounded-full font-bold backdrop-blur-md border border-white/20 text-white">
                   <Globe className="w-5 h-5 text-blue-300" />
                   Global Community
                 </div>
              </div>

              <p className="text-white/90 text-2xl font-medium mb-12 leading-relaxed">
                Our Discord is the heart of Free Bucks. Get 24/7 support, claim exclusive massive voucher drops, and find new friends to play Minecraft with.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6 w-full">
                <Link href="https://discord.com" target="_blank" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-white text-[#5865F2] hover:bg-white/90 h-20 px-12 text-xl font-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-2 rounded-2xl border-0">
                    Join Discord Server
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-black/30 hover:bg-black/40 text-white h-20 px-12 text-xl font-bold border border-white/20 backdrop-blur-md rounded-2xl transition-transform hover:-translate-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                    Claim Vouchers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referrals & Vouchers */}
      <section className="w-full py-32 bg-[#050505] border-b border-white/5 relative overflow-hidden">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-[#111] border border-secondary/20 rounded-[3rem] p-12 lg:p-16 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
              <Users className="w-20 h-20 mx-auto text-secondary mb-8 relative z-10 drop-shadow-[0_0_20px_rgba(0,170,170,0.4)]" />
              <h2 className="text-4xl lg:text-5xl font-black mb-6 text-white relative z-10 tracking-tight">Refer & Earn</h2>
              <p className="text-white/50 mb-12 max-w-sm mx-auto relative z-10 text-xl font-medium">Invite your friends to Free Bucks and both of you will get rewarded instantly.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                <div className="bg-secondary/10 border border-secondary/30 px-8 py-6 rounded-3xl">
                  <div className="text-sm font-bold uppercase tracking-widest text-secondary mb-2">You Earn</div>
                  <div className="text-4xl font-black text-white">25 <span className="text-xl text-white/50">Credits</span></div>
                </div>
                <ArrowRight className="hidden sm:block w-10 h-10 text-white/20 animate-pulse" />
                <div className="bg-success/10 border border-success/30 px-8 py-6 rounded-3xl">
                  <div className="text-sm font-bold uppercase tracking-widest text-success mb-2">Friend Gets</div>
                  <div className="text-4xl font-black text-white">50 <span className="text-xl text-white/50">Credits</span></div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#111] border border-purple-500/20 rounded-[3rem] p-12 lg:p-16 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-primary to-secondary" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
              <Ticket className="w-20 h-20 mx-auto text-purple-500 mb-8 relative z-10 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
              <h2 className="text-4xl lg:text-5xl font-black mb-6 text-white relative z-10 tracking-tight">Promo Vouchers</h2>
              <p className="text-white/50 mb-12 max-w-sm mx-auto relative z-10 text-xl font-medium">We drop massive voucher codes on our Discord and Twitter. Claim them in the dashboard.</p>
              
              <div className="bg-[#050505] border border-purple-500/30 rounded-3xl p-8 relative z-10 inline-block w-full max-w-md shadow-[0_20px_40px_rgba(168,85,247,0.1)]">
                <div className="text-sm font-bold uppercase tracking-widest text-purple-400 mb-3">Example Code</div>
                <div className="font-mono font-black tracking-widest text-4xl text-white py-4 bg-white/5 rounded-2xl border border-white/10">
                  DISCORD10K
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-32 bg-[#0A0A0A] border-b border-white/5 relative">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <HelpCircle className="w-16 h-16 text-secondary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(0,170,170,0.4)]" />
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-white/50 text-xl font-medium leading-relaxed">Everything you need to know about Free Bucks Minecraft Hosting.</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
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
              <details key={i} className="group bg-[#111] border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/20 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-8 font-bold text-lg md:text-xl text-white cursor-pointer select-none">
                  {faq.q}
                  <ChevronDown className="w-6 h-6 text-white/30 transition-transform duration-300 group-open:-rotate-180 flex-shrink-0 ml-6" />
                </summary>
                <div className="p-8 pt-0 text-white/50 text-lg font-medium leading-relaxed border-t border-white/5 mt-2 bg-[#0A0A0A]">
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
