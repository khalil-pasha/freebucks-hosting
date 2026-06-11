"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Server, Shield, Zap, Coins, Clock, MapPin, Users, Ticket, CheckCircle2, Gamepad2, ArrowUpCircle, HardDrive, Globe, Target, Check, HelpCircle, ChevronDown, Crown } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center relative bg-[#09090b] text-zinc-50 selection:bg-white/10 selection:text-white">
      
      {/* Subtle SaaS Grid Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] z-0 pointer-events-none fixed" />

      {/* Hero Section */}
      <section className="w-full pt-40 pb-24 md:pt-48 md:pb-32 flex items-center justify-center relative overflow-hidden z-10 border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_50%)] pointer-events-none" />
        
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left: Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-start text-left lg:col-span-6 xl:col-span-5"
            >
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs font-semibold tracking-wide text-zinc-300 mb-8 backdrop-blur-md">
                <span className="flex h-2 w-2 bg-success mr-2 rounded-full shadow-[0_0_8px_rgba(0,170,0,0.5)]"></span>
                Mumbai Nodes Available
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight mb-6 leading-[1.1] text-zinc-50">
                Premium Minecraft <br className="hidden lg:block"/>
                <span className="text-zinc-400">Powered by Credits</span>
              </h1>
              
              <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl font-medium">
                Claim credits daily, deploy enterprise-grade servers, and scale your resources seamlessly. Experience true high-performance hosting without the premium price tag.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="https://api.freebucks.host/auth/discord" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-14 px-8 text-base bg-white text-zinc-950 hover:bg-zinc-200 shadow-lg font-semibold border-0 transition-all">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/pricing" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-14 px-8 text-base border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-zinc-100 font-semibold transition-all">
                    View Pricing <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Sleek Dashboard Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="relative hidden lg:block lg:col-span-6 xl:col-span-7"
            >
              <div className="relative z-10 w-full rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* macOS style header */}
                <div className="h-10 bg-zinc-900/50 flex items-center px-4 border-b border-white/5 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="mx-auto text-[10px] font-medium text-zinc-500 uppercase tracking-widest">dashboard.freebucks.com</div>
                </div>
                
                {/* Mockup Content */}
                <div className="p-8">
                  <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center">
                        <Server className="w-5 h-5 text-zinc-300"/>
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-100 text-sm">Survival SMP</h3>
                        <p className="text-xs text-zinc-500 font-mono mt-1">mumbai-node-03.freebucks.gg</p>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-success bg-success/10 px-3 py-1 rounded-full uppercase tracking-wider border border-success/20">Online</div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl relative overflow-hidden">
                      <div className="text-[10px] text-zinc-500 mb-2 font-semibold uppercase tracking-widest">CPU Usage</div>
                      <div className="text-2xl font-bold text-zinc-100">42%</div>
                      <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-300 rounded-full" style={{ width: '42%' }} />
                      </div>
                    </div>
                    
                    <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl relative overflow-hidden">
                      <div className="text-[10px] text-zinc-500 mb-2 font-semibold uppercase tracking-widest">Memory Usage</div>
                      <div className="text-2xl font-bold text-zinc-100">3.2 <span className="text-sm text-zinc-500">/ 6 GB</span></div>
                      <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-300 rounded-full" style={{ width: '53%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-zinc-500" />
                      <div className="text-sm font-medium text-zinc-300">Active Players</div>
                    </div>
                    <div className="text-lg font-bold text-zinc-100">24<span className="text-zinc-600 text-sm">/50</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 bg-[#0c0c0e] border-b border-white/5 relative z-20">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: "Active Players", value: "85k+" },
              { label: "Deployed Servers", value: "12.4k" },
              { label: "Credits Flow", value: "2.5M+" },
              { label: "Global Uptime", value: "99.9%" }
            ].map((stat, i) => (
              <motion.div 
                key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                <div className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">{stat.value}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How Free Bucks Works */}
      <section className="w-full py-32 relative overflow-hidden bg-[#09090b]">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-100 tracking-tight">Streamlined Hosting Workflow</h2>
            <p className="text-zinc-400 text-lg font-medium leading-relaxed">A seamless, credit-based approach to deploying and managing enterprise-grade Minecraft infrastructure entirely for free.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { icon: <Coins className="w-6 h-6 text-zinc-300"/>, title: "1. Claim Credits", desc: "Access the dashboard daily to instantly claim your free platform credits." },
               { icon: <Server className="w-6 h-6 text-zinc-300"/>, title: "2. Deploy Server", desc: "Spin up a high-performance Minecraft instance in our Mumbai datacenter." },
               { icon: <ArrowUpCircle className="w-6 h-6 text-zinc-300"/>, title: "3. Scale Resources", desc: "Allocate accumulated credits to dynamically upgrade server memory." },
               { icon: <Gamepad2 className="w-6 h-6 text-zinc-300"/>, title: "4. Uninterrupted Play", desc: "Maintain a positive credit balance to keep your server online indefinitely." },
             ].map((step, i) => (
               <motion.div 
                 key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                 className="h-full flex flex-col bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 hover:bg-white/[0.04] transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
               >
                 <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-zinc-900 border border-white/10">
                   {step.icon}
                 </div>
                 <h3 className="text-lg font-semibold mb-3 text-zinc-100">{step.title}</h3>
                 <p className="text-zinc-400 text-sm font-medium leading-relaxed">{step.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Credit Economy Dashboard Section */}
      <section className="w-full py-32 bg-[#0c0c0e] border-y border-white/5 relative">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-100 tracking-tight">The Credit Economy</h2>
              <p className="text-zinc-400 text-lg font-medium leading-relaxed mb-10 max-w-lg">
                We've replaced traditional fiat pricing with a transparent, engagement-based credit economy. Earn credits by participating, and spend them directly on server runtime and hardware upgrades.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "Daily Accrual", desc: "Earn up to 35 credits every 24 hours through platform engagement." },
                  { title: "Hourly Burn Rate", desc: "Credits are strictly deducted on a per-hour basis while your server runs." },
                  { title: "Dynamic Scaling", desc: "Convert saved credits into permanent hardware allocations." }
                ].map((item, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl flex items-start gap-4">
                    <div className="mt-1 bg-white/10 p-1.5 rounded-md"><Check className="w-4 h-4 text-zinc-300" /></div>
                    <div>
                      <h4 className="text-zinc-100 font-semibold text-sm mb-1">{item.title}</h4>
                      <p className="text-zinc-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#09090b] border border-white/10 rounded-2xl p-8 shadow-2xl relative">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">Credit Mastery Tracker</h3>
                  <p className="text-sm text-zinc-500">Daily limit: 35.0</p>
                </div>
                <div className="text-2xl font-bold text-zinc-100">28.5<span className="text-sm text-zinc-500 font-normal"> / 35</span></div>
              </div>
              
              {/* Segmented Tracker */}
              <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden flex gap-0.5 mb-8">
                <div className="h-full bg-zinc-300" style={{ width: '15%' }} />
                <div className="h-full bg-zinc-500" style={{ width: '40%' }} />
                <div className="h-full bg-zinc-700" style={{ width: '25%' }} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="text-xs text-zinc-500 font-medium mb-1">Daily Spin</div>
                  <div className="text-lg font-semibold text-zinc-200">Up to 5.0</div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="text-xs text-zinc-500 font-medium mb-1">Hourly Claim</div>
                  <div className="text-lg font-semibold text-zinc-200">1.5 <span className="text-sm text-zinc-600">/ hr</span></div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="text-xs text-zinc-500 font-medium mb-1">Referrals</div>
                  <div className="text-lg font-semibold text-zinc-200">25.0 <span className="text-sm text-zinc-600">/ invite</span></div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="text-xs text-zinc-500 font-medium mb-1">Vouchers</div>
                  <div className="text-lg font-semibold text-zinc-200">Variable</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-32 bg-[#09090b] border-b border-white/5 relative">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-100 tracking-tight">Transparent Resource Allocation</h2>
            <p className="text-zinc-400 text-lg font-medium leading-relaxed">Clear, hourly credit burn rates for dedicated memory allocations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {[
              { ram: "2GB", name: "Starter", cost: "1.5", desc: "Perfect for vanilla gameplay." },
              { ram: "4GB", name: "Standard", cost: "3.0", desc: "Ideal for light modpacks and plugins." },
              { ram: "6GB", name: "Advanced", cost: "6.0", desc: "Built for heavy modpacks and large worlds." }
            ].map((plan, i) => (
              <div key={i} className="bg-[#0c0c0e] border border-white/[0.05] rounded-2xl p-8 flex flex-col transition-all hover:bg-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                <h3 className="text-sm font-semibold text-zinc-400 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-zinc-100 mb-4">{plan.ram} <span className="text-xl text-zinc-600 font-medium">RAM</span></div>
                <p className="text-sm text-zinc-500 mb-8 pb-8 border-b border-white/5">{plan.desc}</p>
                
                <div className="mt-auto">
                  <div className="text-3xl font-bold text-zinc-100 mb-1">{plan.cost}</div>
                  <div className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Credits / Hour</div>
                </div>
              </div>
            ))}
            
            {/* Premium VIP Card */}
            <div className="bg-zinc-950 rounded-2xl p-[1px] relative flex flex-col group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-yellow-600 to-amber-900 opacity-50" />
              <div className="bg-[#0c0c0e] rounded-[15px] p-8 flex flex-col h-full relative z-10">
                <Crown className="w-6 h-6 text-amber-500 mb-4" />
                <h3 className="text-sm font-semibold text-amber-500 mb-2">VIP Premium</h3>
                <div className="text-4xl font-bold text-zinc-100 mb-4">8GB+ <span className="text-xl text-zinc-600 font-medium">RAM</span></div>
                <p className="text-sm text-zinc-500 mb-8 pb-8 border-b border-white/5">Dedicated resources, instant starts, and zero queue times.</p>
                
                <div className="mt-auto">
                  <Link href="https://discord.com" target="_blank" className="block">
                    <Button className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-semibold rounded-xl">
                      Purchase via Discord
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Map */}
      <section className="w-full py-32 bg-[#0c0c0e] border-b border-white/5 relative">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <div className="inline-flex items-center rounded-full bg-white/[0.02] border border-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-300 mb-8">
                <MapPin className="w-3 h-3 mr-2 text-zinc-400" />
                Mumbai Datacenter
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-100 tracking-tight">
                Localized Infrastructure
              </h2>
              
              <p className="text-lg text-zinc-400 mb-10 leading-relaxed max-w-xl">
                All compute nodes are localized in India. By eliminating cross-continental routing, we ensure sub-40ms latency and superior chunk loading speeds for Indian players.
              </p>
              
              <div className="space-y-4">
                {["Dedicated India Routing", "Enterprise NVMe Storage", "1Tbps+ DDoS Mitigation"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-zinc-500" />
                    <span className="text-zinc-300 font-medium text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative w-full aspect-video bg-[#09090b] border border-white/5 rounded-2xl p-8 flex items-center justify-center shadow-2xl">
              <svg viewBox="0 0 400 200" className="w-full h-full text-zinc-800 absolute inset-0 opacity-50">
                <path d="M100,50 Q150,20 200,80 T300,120" stroke="currentColor" strokeWidth="1" fill="transparent" />
                <path d="M150,150 Q200,100 250,150" stroke="currentColor" strokeWidth="1" fill="transparent" />
                <path d="M50,120 Q100,180 200,80" stroke="currentColor" strokeWidth="1" fill="transparent" />
              </svg>

              {/* Node Indicator */}
              <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-white/10 rounded-full blur-md" />
                  <div className="w-3 h-3 bg-zinc-200 rounded-full border-2 border-zinc-950 relative z-10" />
                </div>
              </div>

              {/* Glass Pills */}
              <div className="absolute top-[20%] left-[10%] bg-white/[0.05] backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg">
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Latency</div>
                <div className="text-sm font-bold text-zinc-100">~20ms Ping</div>
              </div>

              <div className="absolute bottom-[20%] right-[10%] bg-white/[0.05] backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg text-right">
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Reliability</div>
                <div className="text-sm font-bold text-zinc-100">99.9% Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full py-32 bg-[#09090b] border-b border-white/5 relative">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
             {[
               { icon: <Globe className="w-5 h-5"/>, title: "Free Forever", desc: "No hidden trials. Keep your server online by staying active." },
               { icon: <Shield className="w-5 h-5"/>, title: "Enterprise Security", desc: "Automated 1Tbps+ DDoS mitigation standard on all nodes." },
               { icon: <HardDrive className="w-5 h-5"/>, title: "NVMe Storage", desc: "Experience blazing fast world generation and chunk loading." },
               { icon: <Target className="w-5 h-5"/>, title: "Daily Backups", desc: "Automated snapshots ensure your world data is never lost." },
             ].map((feature, i) => (
               <div key={i} className="flex flex-col">
                 <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-300 flex items-center justify-center mb-5">
                   {feature.icon}
                 </div>
                 <h3 className="text-base font-semibold mb-2 text-zinc-100">{feature.title}</h3>
                 <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Community Banner */}
      <section className="w-full py-24 bg-[#0c0c0e] border-b border-white/5">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="w-full rounded-2xl bg-white/[0.02] border border-white/[0.05] p-12 lg:p-20 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-zinc-100 tracking-tight">Join 85,000+ Players</h2>
            <p className="text-zinc-400 text-lg font-medium mb-10 max-w-2xl leading-relaxed">
              Our Discord community is the heart of Free Bucks. Get support, claim exclusive voucher drops, and network with other server owners.
            </p>
            <Link href="https://discord.com" target="_blank">
              <Button size="lg" className="bg-[#5865F2] hover:bg-[#4752C4] text-white h-14 px-8 text-base font-semibold border-0 shadow-lg transition-all">
                Join Discord Server
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Referrals & Vouchers */}
      <section className="w-full py-32 bg-[#09090b] border-b border-white/5">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-10 flex flex-col">
              <Users className="w-8 h-8 text-zinc-400 mb-6" />
              <h3 className="text-2xl font-bold mb-3 text-zinc-100">Refer & Earn</h3>
              <p className="text-zinc-400 mb-8 text-sm leading-relaxed">Invite your friends to the platform. When they join and remain active, both accounts receive a credit bonus.</p>
              <div className="mt-auto flex items-center gap-4">
                <div className="bg-[#0c0c0e] border border-white/5 px-4 py-2 rounded-lg">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5 font-semibold">Reward</div>
                  <div className="text-lg font-bold text-zinc-200">25.0 <span className="text-xs text-zinc-600 font-medium">Credits</span></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-10 flex flex-col">
              <Ticket className="w-8 h-8 text-zinc-400 mb-6" />
              <h3 className="text-2xl font-bold mb-3 text-zinc-100">Promo Vouchers</h3>
              <p className="text-zinc-400 mb-8 text-sm leading-relaxed">We distribute high-value voucher codes during community events and milestones via our Discord announcements.</p>
              <div className="mt-auto">
                <div className="bg-[#0c0c0e] border border-white/5 px-4 py-3 rounded-lg font-mono text-sm text-zinc-300 inline-block">
                  DISCORD10K
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist FAQ */}
      <section className="w-full py-32 bg-[#0c0c0e] border-b border-white/5">
        <div className="max-w-[1440px] w-full mx-auto px-[clamp(24px,4vw,56px)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <h2 className="text-3xl font-bold mb-4 text-zinc-100 tracking-tight">FAQ</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">Have a question? Browse our most frequently asked questions below or ask the community on Discord.</p>
            </div>
            
            <div className="lg:col-span-8 flex flex-col">
              {[
                { q: "What is Free Bucks?", a: "A premium Minecraft hosting platform powered by an internal credit economy. You earn credits for free and spend them to keep your server online." },
                { q: "How do I earn credits?", a: "Earn credits by claiming your daily spin, collecting hourly rewards, referring friends (25 credits per invite), or redeeming promo vouchers." },
                { q: "What is the daily credit limit?", a: "Users can earn a maximum of 35 credits per day. The limit resets daily at midnight UTC." },
                { q: "How long can I keep my server?", a: "Indefinitely. As long as your account maintains a positive credit balance, your server remains online." },
                { q: "Why am I in a queue?", a: "To ensure stable performance across the cluster, server startups are queued during peak demand periods." },
                { q: "Can I bypass the queue?", a: "Yes, VIP Premium users bypass the queue completely and receive instant server starts. Upgrades are available via Discord." }
              ].map((faq, i) => (
                <details key={i} className="group border-b border-white/5 py-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between font-semibold text-zinc-200 cursor-pointer text-sm outline-none">
                    {faq.q}
                    <ChevronDown className="w-4 h-4 text-zinc-600 transition-transform duration-300 group-open:-rotate-180 flex-shrink-0 ml-4" />
                  </summary>
                  <div className="pt-4 text-zinc-500 text-sm font-medium leading-relaxed pr-8">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
