"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Server, Shield, Coins, MapPin, Users, Ticket, CheckCircle2, Gamepad2, ArrowUpCircle, HardDrive, Globe, Target, Check, ChevronDown, Crown } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

// Animation variants for reusability
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center relative bg-[#0a0f14] text-gray-100 selection:bg-[#55FF55]/30 selection:text-[#55FF55] overflow-hidden">
      
      {/* Minecraft Block Grid Background with Parallax */}
      <motion.div 
        animate={{ y: ["0%", "5%"] }} 
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxZjI5MzciIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] z-0 pointer-events-none fixed h-[110vh] -top-[5vh]" 
      />

      {/* Hero Section (Cave / Night Atmosphere) */}
      <section className="w-full pt-24 pb-24 md:pt-28 md:pb-32 flex items-center justify-center relative z-10 border-b-4 border-[#1f2937] bg-[#0d131a]">
        {/* Diamond Cyan Ambient Glow with subtle shimmer */}
        <motion.div 
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(85,255,255,0.08)_0%,transparent_60%)] pointer-events-none" 
        />
        
        {/* Floating Voxel Blocks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`block-${i}`}
              animate={{ y: [-20, 20, -20], rotate: [-5, 5, -5] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              className="absolute w-16 h-16 bg-[#111827] border-2 border-[#1f2937] rounded-sm shadow-[inset_2px_2px_0_rgba(255,255,255,0.05),4px_4px_0_rgba(0,0,0,0.4)]"
              style={{
                left: `${15 + i * 15}%`,
                top: `${15 + (i % 3) * 25}%`,
                opacity: 0.5
              }}
            >
              <div className="absolute inset-1 border border-[#374151]/50 rounded-sm" />
            </motion.div>
          ))}
        </div>
        
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left: Text Content */}
            <motion.div 
              initial="hidden" animate="visible" variants={fadeInUp}
              className="flex flex-col items-start text-left lg:col-span-6 xl:col-span-5"
            >
              <div className="inline-flex items-center rounded-sm border-2 border-[#55FFFF]/30 bg-[#55FFFF]/10 px-3 py-1.5 text-xs font-bold tracking-widest text-[#55FFFF] uppercase mb-8 shadow-[inset_1px_1px_0_rgba(85,255,255,0.2)]">
                <span className="flex h-2.5 w-2.5 bg-[#55FFFF] mr-2 rounded-sm animate-pulse shadow-[0_0_8px_rgba(85,255,255,0.6)]"></span>
                Mumbai Nodes Available
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight mb-6 leading-[1.1] text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">
                Premium Minecraft <br className="hidden lg:block"/>
                <span className="text-[#55FF55] drop-shadow-[0_4px_0_rgba(0,80,0,0.8)]">Powered by Credits</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-xl font-medium drop-shadow-md">
                Claim credits daily, deploy enterprise-grade servers, and scale your resources seamlessly. Experience true high-performance hosting without the premium price tag.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/login?redirect=/dashboard/servers" className="w-full sm:w-auto">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                    <Button size="lg" className="relative overflow-hidden w-full h-14 px-8 text-base bg-[#55FF55] text-[#0a0f14] hover:bg-[#45E545] font-black border-2 border-[#339933] shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),4px_4px_0_rgba(0,0,0,0.6)] hover:shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),0_0_20px_rgba(85,255,85,0.4),4px_4px_0_rgba(0,0,0,0.6)] transition-all rounded-sm uppercase tracking-wider group">
                      <motion.span animate={{ opacity: [0, 0.5, 0], x: [-50, 150] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12" />
                      Get Started Free
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/pricing" className="w-full sm:w-auto">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                    <Button size="lg" variant="outline" className="w-full h-14 px-8 text-base bg-[#111827] border-2 border-[#1f2937] text-white hover:bg-[#1f2937] font-black shadow-[inset_2px_2px_0_rgba(255,255,255,0.05),4px_4px_0_rgba(0,0,0,0.5)] hover:shadow-[inset_2px_2px_0_rgba(255,255,255,0.05),0_0_15px_rgba(255,255,255,0.1),4px_4px_0_rgba(0,0,0,0.5)] transition-all rounded-sm uppercase tracking-wider group">
                      View Pricing <ArrowRight className="ml-2 w-5 h-5 text-[#55FFFF] transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>

            {/* Right: Inventory Style Dashboard Mockup */}
            <motion.div 
              initial="hidden" animate="visible" variants={slideInRight}
              className="relative hidden lg:block lg:col-span-6 xl:col-span-7"
            >
              <div className="relative z-10 w-full rounded-sm border-4 border-[#1f2937] bg-[#111827] shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),inset_-4px_-4px_0_rgba(0,0,0,0.4),10px_10px_0_rgba(0,0,0,0.3)] overflow-hidden">
                {/* Blocky header */}
                <div className="h-12 bg-[#0a0f14] flex items-center px-4 border-b-4 border-[#1f2937]">
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-sm bg-red-500 shadow-[inset_1px_1px_0_rgba(255,255,255,0.3),2px_2px_0_rgba(0,0,0,0.5)]" />
                    <div className="w-4 h-4 rounded-sm bg-yellow-500 shadow-[inset_1px_1px_0_rgba(255,255,255,0.3),2px_2px_0_rgba(0,0,0,0.5)]" />
                    <div className="w-4 h-4 rounded-sm bg-[#55FF55] shadow-[inset_1px_1px_0_rgba(255,255,255,0.3),2px_2px_0_rgba(0,0,0,0.5)]" />
                  </div>
                  <div className="mx-auto text-xs font-bold text-gray-500 uppercase tracking-widest bg-[#111827] px-4 py-1 rounded-sm border-2 border-[#1f2937] shadow-inner">dashboard.freebucks.com</div>
                </div>
                
                {/* Mockup Content */}
                <div className="p-6">
                  <div className="flex justify-between items-center bg-[#0a0f14] border-2 border-[#1f2937] p-4 rounded-sm shadow-[inset_2px_2px_0_rgba(0,0,0,0.5)] mb-6 hover:border-[#374151] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#1f2937] border-2 border-[#374151] rounded-sm flex items-center justify-center shadow-[inset_1px_1px_0_rgba(255,255,255,0.1),2px_2px_0_rgba(0,0,0,0.3)]">
                        <Server className="w-6 h-6 text-[#55FFFF] animate-pulse"/>
                      </div>
                      <div>
                        <h3 className="font-black text-white text-base uppercase tracking-wide drop-shadow-md">Survival SMP</h3>
                        <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-1">mumbai-node-03</p>
                      </div>
                    </div>
                    <div className="text-xs font-black text-[#55FF55] bg-[#0a0f14] px-4 py-2 border-2 border-[#55FF55]/30 rounded-sm uppercase tracking-widest shadow-[inset_2px_2px_0_rgba(85,255,85,0.1)]">Online</div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#1f2937] border-2 border-[#374151] p-5 rounded-sm relative overflow-hidden shadow-[inset_2px_2px_0_rgba(255,255,255,0.05),4px_4px_0_rgba(0,0,0,0.2)]">
                      <div className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-widest drop-shadow-sm">CPU Usage</div>
                      <div className="text-3xl font-black text-white drop-shadow-md">42%</div>
                      <div className="mt-4 h-4 w-full bg-[#0a0f14] rounded-sm border-2 border-[#111827] shadow-[inset_2px_2px_0_rgba(0,0,0,0.5)] p-0.5">
                        <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} transition={{ duration: 1, delay: 0.8 }} className="h-full bg-[#55FFFF] rounded-sm shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)]" />
                      </div>
                    </div>
                    
                    <div className="bg-[#1f2937] border-2 border-[#374151] p-5 rounded-sm relative overflow-hidden shadow-[inset_2px_2px_0_rgba(255,255,255,0.05),4px_4px_0_rgba(0,0,0,0.2)]">
                      <div className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-widest drop-shadow-sm">Memory Usage</div>
                      <div className="text-3xl font-black text-white drop-shadow-md">3.2 <span className="text-lg text-gray-500">/ 6 GB</span></div>
                      <div className="mt-4 h-4 w-full bg-[#0a0f14] rounded-sm border-2 border-[#111827] shadow-[inset_2px_2px_0_rgba(0,0,0,0.5)] p-0.5">
                        <motion.div initial={{ width: 0 }} animate={{ width: '53%' }} transition={{ duration: 1, delay: 1 }} className="h-full bg-[#55FF55] rounded-sm shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)]" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0a0f14] border-2 border-[#1f2937] p-5 rounded-sm flex items-center justify-between shadow-[inset_2px_2px_0_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <div className="text-sm font-bold uppercase tracking-widest text-gray-300">Active Players</div>
                    </div>
                    <div className="text-xl font-black text-white">24<span className="text-gray-600">/50</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 bg-[#0a0f14] border-b-4 border-[#1f2937] relative z-20">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              { label: "Active Players", value: "85k+" },
              { label: "Deployed Servers", value: "12.4k" },
              { label: "Credits Flow", value: "2.5M+" },
              { label: "Global Uptime", value: "99.9%" }
            ].map((stat, i) => (
              <motion.div 
                key={i} variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }}
                className="bg-[#111827] border-4 border-[#1f2937] p-6 rounded-sm flex flex-col items-center justify-center text-center shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),inset_-4px_-4px_0_rgba(0,0,0,0.3),6px_6px_0_rgba(0,0,0,0.2)] hover:border-[#374151] hover:shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),inset_-4px_-4px_0_rgba(0,0,0,0.3),0_0_15px_rgba(85,255,255,0.1),6px_6px_0_rgba(0,0,0,0.2)] transition-all cursor-default"
              >
                <div className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-md">{stat.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How Free Bucks Works */}
      <section className="w-full py-32 relative overflow-hidden bg-[#0d131a]">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight uppercase drop-shadow-md">Streamlined Hosting Workflow</h2>
            <p className="text-gray-400 text-lg font-semibold leading-relaxed">A seamless, credit-based approach to deploying and managing enterprise-grade Minecraft infrastructure entirely for free.</p>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
             {[
               { icon: <Coins className="w-8 h-8 text-[#FFAA00] drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]"/>, title: "1. Claim Credits", desc: "Access the dashboard daily to instantly claim your free platform credits." },
               { icon: <Server className="w-8 h-8 text-[#55FFFF] drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]"/>, title: "2. Deploy Server", desc: "Spin up a high-performance Minecraft instance in our Mumbai datacenter." },
               { icon: <ArrowUpCircle className="w-8 h-8 text-[#FF5555] drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]"/>, title: "3. Scale Resources", desc: "Allocate accumulated credits to dynamically upgrade server memory." },
               { icon: <Gamepad2 className="w-8 h-8 text-[#55FF55] drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]"/>, title: "4. Uninterrupted Play", desc: "Maintain a positive credit balance to keep your server online indefinitely." },
             ].map((step, i) => (
               <motion.div 
                 key={i} variants={fadeInUp} whileHover={{ y: -8, scale: 1.02, borderColor: "#374151" }}
                 className="h-full flex flex-col bg-[#111827] border-4 border-[#1f2937] rounded-sm p-8 transition-all shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),inset_-4px_-4px_0_rgba(0,0,0,0.3),6px_6px_0_rgba(0,0,0,0.4)]"
               >
                 <div className="w-16 h-16 rounded-sm flex items-center justify-center mb-6 bg-[#1f2937] border-4 border-[#374151] shadow-[inset_2px_2px_0_rgba(255,255,255,0.1),inset_-2px_-2px_0_rgba(0,0,0,0.3)]">
                   {step.icon}
                 </div>
                 <h3 className="text-xl font-black mb-3 text-white uppercase tracking-wide">{step.title}</h3>
                 <p className="text-gray-400 text-sm font-semibold leading-relaxed">{step.desc}</p>
               </motion.div>
             ))}
          </motion.div>
        </div>
      </section>

      {/* Credit Economy Dashboard Section */}
      <section className="w-full py-32 bg-[#0a0f14] border-y-4 border-[#1f2937] relative overflow-hidden">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight uppercase drop-shadow-md">The Credit Economy</h2>
              <p className="text-gray-400 text-lg font-semibold leading-relaxed mb-10 max-w-lg">
                We've replaced traditional fiat pricing with a transparent, engagement-based credit economy. Earn credits by participating, and spend them directly on server runtime and hardware upgrades.
              </p>
              
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
                {[
                  { title: "Daily Accrual", desc: "Earn up to 35 credits every 24 hours through platform engagement." },
                  { title: "Hourly Burn Rate", desc: "Credits are strictly deducted on a per-hour basis while your server runs." },
                  { title: "Dynamic Scaling", desc: "Convert saved credits into permanent hardware allocations." }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} whileHover={{ x: 5 }} className="bg-[#111827] border-2 border-[#1f2937] p-5 rounded-sm flex items-start gap-4 shadow-[inset_2px_2px_0_rgba(255,255,255,0.02)] transition-transform">
                    <div className="mt-1 bg-[#1f2937] border-2 border-[#374151] p-1.5 rounded-sm shadow-inner"><Check className="w-4 h-4 text-[#55FF55]" /></div>
                    <div>
                      <h4 className="text-white font-bold uppercase tracking-wide text-sm mb-1">{item.title}</h4>
                      <p className="text-gray-500 font-semibold text-xs">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideInRight}
              className="bg-[#111827] border-4 border-[#1f2937] rounded-sm p-8 shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),inset_-4px_-4px_0_rgba(0,0,0,0.3),8px_8px_0_rgba(0,0,0,0.4)] relative"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wide">Credit Mastery Tracker</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Daily limit: 35.0</p>
                </div>
                <div className="text-3xl font-black text-[#55FF55] drop-shadow-md">28.5<span className="text-sm text-gray-600 font-bold ml-1">/ 35</span></div>
              </div>
              
              <div className="w-full h-8 bg-[#0a0f14] rounded-sm border-2 border-[#1f2937] flex p-1 mb-8 shadow-[inset_2px_2px_0_rgba(0,0,0,0.8)] gap-1">
                {[...Array(12)].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scaleY: 0 }}
                    whileInView={{ opacity: 1, scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
                    className={`flex-1 rounded-sm border ${i < 9 ? 'bg-[#55FF55] border-[#aaffaa]' : 'bg-[#1f2937] border-[#374151]'}`} 
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Daily Spin", val: "Up to 5.0", color: "text-[#55FFFF]" },
                  { label: "Hourly Claim", val: "1.5", sub: "/ hr", color: "text-[#FFAA00]" },
                  { label: "Referrals", val: "25.0", sub: "/ invite", color: "text-[#FF55FF]" },
                  { label: "Vouchers", val: "Variable", color: "text-white" },
                ].map((stat, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.05 }} className="p-4 rounded-sm border-2 border-[#1f2937] bg-[#0a0f14] shadow-[inset_2px_2px_0_rgba(0,0,0,0.4)] transition-transform">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className={`text-lg font-black ${stat.color}`}>{stat.val} {stat.sub && <span className="text-xs text-gray-600">{stat.sub}</span>}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-32 bg-[#0d131a] border-b-4 border-[#1f2937] relative">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight uppercase drop-shadow-md">Transparent Resource Allocation</h2>
            <p className="text-gray-400 text-lg font-semibold leading-relaxed">Clear, hourly credit burn rates for dedicated memory allocations.</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch"
          >
            {[
              { ram: "2GB", name: "Starter", cost: "1.5", desc: "Perfect for vanilla gameplay.", color: "border-gray-500", iconColor: "text-gray-300" },
              { ram: "4GB", name: "Standard", cost: "3.0", desc: "Ideal for light modpacks.", color: "border-[#FFAA00]", iconColor: "text-[#FFAA00]" },
              { ram: "6GB", name: "Advanced", cost: "6.0", desc: "Built for heavy modpacks.", color: "border-[#55FFFF]", iconColor: "text-[#55FFFF]" }
            ].map((plan, i) => (
              <motion.div 
                key={i} variants={fadeInUp} whileHover={{ y: -8, scale: 1.02 }}
                className={`bg-[#111827] border-4 ${plan.color} rounded-sm p-8 flex flex-col transition-all shadow-[inset_4px_4px_0_rgba(255,255,255,0.05),inset_-4px_-4px_0_rgba(0,0,0,0.3),6px_6px_0_rgba(0,0,0,0.4)]`}
              >
                <h3 className={`text-sm font-black uppercase tracking-widest ${plan.iconColor} mb-2`}>{plan.name} Node</h3>
                <div className="text-5xl font-black text-white mb-4 drop-shadow-md">{plan.ram} <span className="text-xl text-gray-600 font-bold">RAM</span></div>
                <p className="text-sm text-gray-400 font-semibold mb-8 pb-8 border-b-4 border-[#1f2937]">{plan.desc}</p>
                
                <div className="mt-auto bg-[#0a0f14] border-2 border-[#1f2937] p-4 rounded-sm text-center shadow-[inset_2px_2px_0_rgba(0,0,0,0.5)]">
                  <div className="text-3xl font-black text-white mb-1">{plan.cost}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Credits / Hour</div>
                </div>
              </motion.div>
            ))}
            
            {/* Premium VIP Card */}
            <motion.div 
              variants={fadeInUp} whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[#1f1a24] border-4 border-[#aa00aa] rounded-sm p-8 flex flex-col relative transition-all shadow-[inset_4px_4px_0_rgba(255,255,255,0.1),inset_-4px_-4px_0_rgba(0,0,0,0.4),0_0_30px_rgba(170,0,170,0.3)] hover:shadow-[inset_4px_4px_0_rgba(255,255,255,0.1),inset_-4px_-4px_0_rgba(0,0,0,0.4),0_0_50px_rgba(255,170,0,0.3)]"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNhYTAwYWEiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] z-0 pointer-events-none mix-blend-screen opacity-50" />
              <div className="relative z-10 flex flex-col h-full">
                <Crown className="w-8 h-8 text-[#FFAA00] mb-4 drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]" />
                <h3 className="text-sm font-black uppercase tracking-widest text-[#FFAA00] mb-2 drop-shadow-md">VIP Premium</h3>
                <div className="text-5xl font-black text-white mb-4 drop-shadow-md">8GB+ <span className="text-xl text-gray-500 font-bold">RAM</span></div>
                <p className="text-sm text-gray-300 font-semibold mb-8 pb-8 border-b-4 border-[#aa00aa]/30">Dedicated resources, instant starts, and zero queue times.</p>
                
                <div className="mt-auto">
                  <Link href="/login?redirect=/dashboard/servers" className="block">
                    <Button className="w-full bg-[#FFAA00] hover:bg-[#FFD500] text-[#0a0f14] border-2 border-[#CC8800] font-black rounded-sm shadow-[inset_2px_2px_0_rgba(255,255,255,0.5),4px_4px_0_rgba(0,0,0,0.6)] active:translate-y-[4px] active:shadow-[inset_2px_2px_0_rgba(255,255,255,0.5),0_0_0_rgba(0,0,0,0.6)] h-14 uppercase tracking-wider text-base relative overflow-hidden group">
                      <motion.span animate={{ opacity: [0, 0.4, 0], x: [-50, 150] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }} className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12" />
                      Buy Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Infrastructure Map */}
      <section className="w-full py-32 bg-[#0a0f14] border-b-4 border-[#1f2937] relative">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
              <div className="inline-flex items-center rounded-sm bg-[#111827] border-2 border-[#1f2937] px-3 py-1.5 text-xs font-black uppercase tracking-widest text-gray-300 mb-8 shadow-sm">
                <MapPin className="w-4 h-4 mr-2 text-[#FF5555]" />
                Mumbai Datacenter
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight uppercase drop-shadow-md">Localized Infrastructure</h2>
              <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-xl font-semibold">
                All compute nodes are localized in India. By eliminating cross-continental routing, we ensure sub-40ms latency and superior chunk loading speeds for Indian players.
              </p>
              
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
                {["Dedicated India Routing", "Enterprise NVMe Storage", "1Tbps+ DDoS Mitigation"].map((feature, i) => (
                  <motion.div key={i} variants={fadeInUp} className="flex items-center gap-4">
                    <div className="bg-[#111827] p-1 border-2 border-[#1f2937] rounded-sm shadow-inner"><CheckCircle2 className="w-4 h-4 text-[#55FF55]" /></div>
                    <span className="text-gray-200 font-bold uppercase tracking-wide text-sm">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideInRight}
              className="relative w-full aspect-video bg-[#111827] border-4 border-[#1f2937] rounded-sm p-8 flex items-center justify-center shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),inset_-4px_-4px_0_rgba(0,0,0,0.3),8px_8px_0_rgba(0,0,0,0.4)] hover:border-[#374151] transition-colors"
            >
              <div className="grid grid-cols-12 grid-rows-8 gap-1 w-full h-full opacity-30">
                {[...Array(96)].map((_, i) => <div key={i} className={`bg-[#1f2937] rounded-sm ${(i % 7 === 0 || i % 11 === 0) ? 'bg-[#374151]' : ''}`} />)}
              </div>
              <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="absolute w-12 h-12 bg-[#55FFFF]/20 border-4 border-[#55FFFF]/40 rounded-sm animate-ping" />
                <div className="w-6 h-6 bg-[#55FFFF] rounded-sm border-2 border-[#0a0f14] relative z-10 shadow-[0_0_20px_#55FFFF]" />
              </div>
              <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-[20%] left-[10%] bg-[#0a0f14] border-2 border-[#1f2937] px-4 py-2 rounded-sm shadow-[inset_2px_2px_0_rgba(255,255,255,0.1),4px_4px_0_rgba(0,0,0,0.5)]">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Latency</div>
                <div className="text-sm font-black text-[#55FFFF]">~20ms Ping</div>
              </motion.div>
              <motion.div animate={{ y: [3, -3, 3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-[20%] right-[10%] bg-[#0a0f14] border-2 border-[#1f2937] px-4 py-2 rounded-sm shadow-[inset_2px_2px_0_rgba(255,255,255,0.1),4px_4px_0_rgba(0,0,0,0.5)] text-right">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Reliability</div>
                <div className="text-sm font-black text-[#55FF55]">99.9% Uptime</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full py-32 bg-[#0d131a] border-b-4 border-[#1f2937] relative">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
             {[
               { icon: <Globe className="w-6 h-6 text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]"/>, title: "Free Forever", desc: "No hidden trials. Keep your server online by staying active." },
               { icon: <Shield className="w-6 h-6 text-[#FFAA00] drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]"/>, title: "Enterprise Security", desc: "Automated 1Tbps+ DDoS mitigation standard on all nodes." },
               { icon: <HardDrive className="w-6 h-6 text-gray-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]"/>, title: "NVMe Storage", desc: "Experience blazing fast world generation and chunk loading." },
               { icon: <Target className="w-6 h-6 text-[#FF5555] drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]"/>, title: "Daily Backups", desc: "Automated snapshots ensure your world data is never lost." },
             ].map((feature, i) => (
               <motion.div key={i} variants={fadeInUp} whileHover={{ y: -8, scale: 1.02, borderColor: "#374151" }} className="flex flex-col bg-[#111827] border-4 border-[#1f2937] p-6 rounded-sm shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),inset_-4px_-4px_0_rgba(0,0,0,0.3),6px_6px_0_rgba(0,0,0,0.2)] transition-all">
                 <div className="w-14 h-14 rounded-sm bg-[#1f2937] border-4 border-[#374151] flex items-center justify-center mb-5 shadow-inner">
                   {feature.icon}
                 </div>
                 <h3 className="text-lg font-black mb-2 text-white uppercase tracking-wide drop-shadow-sm">{feature.title}</h3>
                 <p className="text-sm text-gray-400 font-semibold leading-relaxed">{feature.desc}</p>
               </motion.div>
             ))}
          </motion.div>
        </div>
      </section>

      {/* Community Banner */}
      <section className="w-full py-24 bg-[#0a0f14] border-b-4 border-[#1f2937]">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="w-full rounded-sm bg-[#111827] border-4 border-[#5865F2] p-12 lg:p-20 text-center shadow-[inset_4px_4px_0_rgba(255,255,255,0.1),inset_-4px_-4px_0_rgba(0,0,0,0.5),8px_8px_0_rgba(0,0,0,0.4)] flex flex-col items-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjNTg2NUYyIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjxwb2x5Z29uIHBvaW50cz0iMCwwIDEwLDAgMCwxMCIgZmlsbD0iIzU4NjVGMiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] z-0 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="mb-6 relative">
                <div className="absolute inset-0 bg-[#5865F2] blur-xl opacity-60 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="#5865F2" viewBox="0 0 24 24" className="relative z-10 drop-shadow-[0_4px_0_rgba(0,0,0,0.6)]">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight uppercase drop-shadow-[0_4px_0_rgba(0,0,0,0.6)]">Join 85,000+ Players</h2>
              <p className="text-gray-300 text-xl font-bold mb-10 max-w-2xl leading-relaxed drop-shadow-md">
                Our Discord community is the heart of Free Bucks. Get support, claim exclusive voucher drops, and network with other server owners.
              </p>
              <Link href="https://discord.gg/XY25Xgr5fV" target="_blank">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="bg-[#5865F2] hover:bg-[#4752C4] text-white h-16 px-10 text-xl font-black border-4 border-[#3c45a5] shadow-[inset_2px_2px_0_rgba(255,255,255,0.3),6px_6px_0_rgba(0,0,0,0.6)] hover:shadow-[inset_2px_2px_0_rgba(255,255,255,0.3),0_0_20px_rgba(88,101,242,0.6),6px_6px_0_rgba(0,0,0,0.6)] transition-all rounded-sm uppercase tracking-wider relative overflow-hidden group">
                    <motion.span animate={{ opacity: [0, 0.3, 0], x: [-50, 200] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }} className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12" />
                    Join Discord Server
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Referrals & Vouchers */}
      <section className="w-full py-32 bg-[#0d131a] border-b-4 border-[#1f2937]">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          >
            <motion.div variants={fadeInUp} whileHover={{ y: -8, scale: 1.02, borderColor: "#374151" }} className="bg-[#111827] border-4 border-[#1f2937] rounded-sm p-12 flex flex-col shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),inset_-4px_-4px_0_rgba(0,0,0,0.3),8px_8px_0_rgba(0,0,0,0.3)] transition-all">
              <div className="w-16 h-16 bg-[#1f2937] border-4 border-[#374151] flex items-center justify-center rounded-sm mb-6 shadow-inner"><Users className="w-8 h-8 text-[#55FFFF] drop-shadow-sm" /></div>
              <h3 className="text-3xl font-black mb-4 text-white uppercase tracking-wide drop-shadow-sm">Refer & Earn</h3>
              <p className="text-gray-400 mb-8 text-base font-semibold leading-relaxed">Invite your friends to the platform. When they join and remain active, both accounts receive a credit bonus.</p>
              <div className="mt-auto flex items-center gap-4">
                <div className="bg-[#0a0f14] border-2 border-[#1f2937] px-6 py-4 rounded-sm shadow-[inset_2px_2px_0_rgba(0,0,0,0.5)]">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Reward</div>
                  <div className="text-3xl font-black text-[#55FF55]">25.0 <span className="text-sm text-gray-600 font-bold">Credits</span></div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} whileHover={{ y: -8, scale: 1.02, borderColor: "#374151" }} className="bg-[#111827] border-4 border-[#1f2937] rounded-sm p-12 flex flex-col shadow-[inset_4px_4px_0_rgba(255,255,255,0.02),inset_-4px_-4px_0_rgba(0,0,0,0.3),8px_8px_0_rgba(0,0,0,0.3)] transition-all">
              <div className="w-16 h-16 bg-[#1f2937] border-4 border-[#374151] flex items-center justify-center rounded-sm mb-6 shadow-inner"><Ticket className="w-8 h-8 text-[#FF55FF] drop-shadow-sm" /></div>
              <h3 className="text-3xl font-black mb-4 text-white uppercase tracking-wide drop-shadow-sm">Promo Vouchers</h3>
              <p className="text-gray-400 mb-8 text-base font-semibold leading-relaxed">We distribute high-value voucher codes during community events and milestones via our Discord announcements.</p>
              <div className="mt-auto">
                <div className="bg-[#0a0f14] border-2 border-[#1f2937] px-6 py-4 rounded-sm shadow-[inset_2px_2px_0_rgba(0,0,0,0.5)] inline-block">
                  <div className="font-mono text-2xl font-black text-white tracking-widest">DISCORD10K</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stacked Plank FAQ */}
      <section className="w-full py-32 bg-[#0a0f14] border-b-4 border-[#1f2937]">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="lg:col-span-4">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight uppercase drop-shadow-md">FAQ</h2>
              <p className="text-gray-400 text-lg font-semibold leading-relaxed">Have a question? Browse our most frequently asked questions below or ask the community on Discord.</p>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className="lg:col-span-8 flex flex-col gap-4"
            >
              {[
                { q: "What is Free Bucks?", a: "A premium Minecraft hosting platform powered by an internal credit economy. You earn credits for free and spend them to keep your server online." },
                { q: "How do I earn credits?", a: "Earn credits by claiming your daily spin, collecting hourly rewards, referring friends (25 credits per invite), or redeeming promo vouchers." },
                { q: "What is the daily credit limit?", a: "Users can earn a maximum of 35 credits per day. The limit resets daily at midnight UTC." },
                { q: "How long can I keep my server?", a: "Indefinitely. As long as your account maintains a positive credit balance, your server remains online." },
                { q: "Why am I in a queue?", a: "To ensure stable performance across the cluster, server startups are queued during peak demand periods." },
                { q: "Can I bypass the queue?", a: "Yes, VIP Premium users bypass the queue completely and receive instant server starts. Upgrades are available via Discord." }
              ].map((faq, i) => (
                <motion.details 
                  key={i} variants={fadeInUp} 
                  className="group bg-[#111827] border-4 border-[#1f2937] rounded-sm [&_summary::-webkit-details-marker]:hidden shadow-[inset_2px_2px_0_rgba(255,255,255,0.02),4px_4px_0_rgba(0,0,0,0.3)] hover:border-[#374151] transition-colors"
                >
                  <summary className="flex items-center justify-between font-black text-white uppercase tracking-wide cursor-pointer text-base md:text-lg p-6 outline-none">
                    {faq.q}
                    <ChevronDown className="w-6 h-6 text-gray-500 transition-transform duration-300 group-open:-rotate-180 flex-shrink-0 ml-4" />
                  </summary>
                  <div className="p-6 pt-0 text-gray-400 text-base font-semibold leading-relaxed bg-[#0a0f14] border-t-4 border-[#1f2937] shadow-inner">
                    <div className="pt-6">{faq.a}</div>
                  </div>
                </motion.details>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

    </main>
  )
}
